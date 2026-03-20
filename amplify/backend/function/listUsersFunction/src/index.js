/* Amplify Params - DO NOT EDIT
	API_HIKINGPATCHESAPP_GRAPHQLAPIENDPOINTOUTPUT
	API_HIKINGPATCHESAPP_GRAPHQLAPIIDOUTPUT
	API_HIKINGPATCHESAPP_GRAPHQLAPIKEYOUTPUT
	AUTH_HIKINGPATCHESAPP368A1661_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

'use strict';

const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

const https = require('https');
const { SignatureV4 } = require('@aws-sdk/signature-v4');
const { Sha256 } = require('@aws-crypto/sha256-js');
const { HttpRequest } = require('@aws-sdk/protocol-http');
const { defaultProvider } = require('@aws-sdk/credential-provider-node');

/** -------------------------
 *  AppSync helpers (same style as your resolver Lambda)
 *  ------------------------- */

function findEnvKey(suffix) {
  const hit = Object.entries(process.env).find(([k]) => k.endsWith(suffix));
  return hit?.[1];
}

function getAppSyncEndpoint() {
  const url = findEnvKey('GRAPHQLAPIENDPOINTOUTPUT');
  if (!url) throw new Error('AppSync endpoint env var not found (…GRAPHQLAPIENDPOINTOUTPUT).');
  return url;
}

function getAppSyncApiKey() {
  return findEnvKey('GRAPHQLAPIKEYOUTPUT') || null;
}

async function graphQL(query, variables, { forceIAM = false } = {}) {
  const endpoint = getAppSyncEndpoint();
  const url = new URL(endpoint);
  const region = process.env.AWS_REGION || process.env.REGION || 'us-east-1';
  const body = JSON.stringify({ query, variables });

  const apiKey = getAppSyncApiKey();
  if (apiKey && !forceIAM) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': apiKey },
      body,
    });
    const json = await res.json();
    if (!res.ok || json.errors) throw new Error(`AppSync(APIKEY) error: ${JSON.stringify(json.errors || json)}`);
    return json.data;
  }

  const request = new HttpRequest({
    protocol: 'https:',
    hostname: url.hostname,
    method: 'POST',
    path: url.pathname || '/graphql',
    headers: { host: url.hostname, 'content-type': 'application/json' },
    body,
  });

  const signer = new SignatureV4({
    credentials: defaultProvider(),
    service: 'appsync',
    region,
    sha256: Sha256,
  });

  const signed = await signer.sign(request);

  const resBody = await new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: url.hostname,
        method: 'POST',
        path: request.path,
        headers: signed.headers,
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) resolve(data);
          else reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });

  const json = JSON.parse(resBody);
  if (json.errors) throw new Error(`AppSync(IAM) error: ${JSON.stringify(json.errors)}`);
  return json.data;
}

/** -------------------------
 *  GraphQL queries for popular patches
 *  ------------------------- */

const GQL_listUserPatchesTracking = `
  query ListUserPatches($filter: ModelUserPatchFilterInput, $limit: Int, $nextToken: String) {
    listUserPatches(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items { patchID inProgress wishlisted }
      nextToken
    }
  }
`;

const GQL_getPatchPublic = `
  query GetPatch($id: ID!) {
    getPatch(id: $id) {
      id name description imageUrl regions difficulty status
    }
  }
`;

/** -------------------------
 *  Popular patches handler
 *  ------------------------- */

async function handlePopularPatches() {
  console.log('[popular-patches] handler started');
  console.log('[popular-patches] AppSync endpoint:', getAppSyncEndpoint());
  console.log('[popular-patches] API key present:', !!getAppSyncApiKey());

  // Fetch all UserPatch records where inProgress or wishlisted, using IAM
  const counts = new Map();
  let nextToken = null;
  let pageCount = 0;
  let totalItems = 0;

  do {
    console.log(`[popular-patches] fetching page ${pageCount + 1}, nextToken: ${nextToken}`);
    const data = await graphQL(
      GQL_listUserPatchesTracking,
      {
        filter: { or: [{ inProgress: { eq: true } }, { wishlisted: { eq: true } }] },
        limit: 1000,
        nextToken,
      },
      { forceIAM: true }
    );

    console.log(`[popular-patches] raw page data:`, JSON.stringify(data).slice(0, 500));
    const items = data?.listUserPatches?.items ?? [];
    totalItems += items.length;
    console.log(`[popular-patches] page ${pageCount + 1} returned ${items.length} items`);

    for (const item of items) {
      if (!item?.patchID) continue;
      const existing = counts.get(item.patchID) ?? { inProgress: 0, wishlisted: 0, total: 0 };
      if (item.inProgress) existing.inProgress += 1;
      if (item.wishlisted) existing.wishlisted += 1;
      existing.total = existing.inProgress + existing.wishlisted;
      counts.set(item.patchID, existing);
    }

    nextToken = data?.listUserPatches?.nextToken ?? null;
    pageCount++;
  } while (nextToken);

  console.log(`[popular-patches] total items across all pages: ${totalItems}`);
  console.log(`[popular-patches] unique patches with tracking: ${counts.size}`);

  // Take top 10 by total
  const top10 = [...counts.entries()]
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 10);

  console.log('[popular-patches] top10 patchIDs:', top10.map(([id, c]) => `${id}(${c.total})`));

  // Fetch patch details for each concurrently
  const results = await Promise.all(
    top10.map(async ([patchID, patchCounts]) => {
      const data = await graphQL(GQL_getPatchPublic, { id: patchID }, { forceIAM: true });
      const patch = data?.getPatch;
      console.log(`[popular-patches] getPatch ${patchID}:`, patch ? `status=${patch.status}` : 'null');
      if (!patch || (patch.status !== 'PUBLISHED' && patch.status !== null)) return null;
      return { patch, counts: patchCounts };
    })
  );

  const filtered = results.filter(Boolean);
  console.log(`[popular-patches] returning ${filtered.length} results`);

  return {
    statusCode: 200,
    body: JSON.stringify(filtered),
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  };
}

/** -------------------------
 *  GraphQL queries for counts
 *  ------------------------- */

const GQL_userMountainsByUser = `
  query UserMountainsByUser($userID: ID!, $limit: Int, $nextToken: String) {
    userMountainsByUser(userID: $userID, limit: $limit, nextToken: $nextToken) {
      items { id }
      nextToken
    }
  }
`;

const GQL_userTrailsByUser = `
  query UserTrailsByUser($userID: ID!, $limit: Int, $nextToken: String) {
    userTrailsByUser(userID: $userID, limit: $limit, nextToken: $nextToken) {
      items { trailID }
      nextToken
    }
  }
`;

const GQL_userPatchesByUserByPatch = `
  query UserPatchesByUserByPatch($userID: String!, $limit: Int, $nextToken: String) {
    userPatchesByUserByPatch(userID: $userID, limit: $limit, nextToken: $nextToken) {
      items { id }
      nextToken
    }
  }
`;

/** -------------------------
 *  Count helper (paginates and totals items)
 *  ------------------------- */

async function countAllPages(query, variablesBase, connectionName) {
  let total = 0;
  let nextToken = null;

  do {
    const data = await graphQL(
      query,
      { ...variablesBase, limit: 200, nextToken },
      { forceIAM: true } // critical: user data is owner-protected
    );

    const conn = data?.[connectionName];
    total += conn?.items?.length || 0;
    nextToken = conn?.nextToken ?? null;
  } while (nextToken);

  return total;
}

/** -------------------------
 *  Route handlers
 *  ------------------------- */

async function handleListUsers() {
  console.log("handleListUsers()");
  const userPoolId = process.env.AUTH_HIKINGPATCHESAPP368A1661_USERPOOLID;

  let allUsers = [];
  let paginationToken = undefined;

  do {
    const params = { UserPoolId: userPoolId, Limit: 60 };
    if (paginationToken) params.PaginationToken = paginationToken;

    const result = await cognito.listUsers(params).promise();
    allUsers = allUsers.concat(result.Users);
    paginationToken = result.PaginationToken;
  } while (paginationToken);

  console.log(`handleListUsers() returning ${allUsers.length} users`);
  return {
    statusCode: 200,
    body: JSON.stringify(allUsers),
    headers: { 'Content-Type': 'application/json' },
  };
}

async function handleUserEntryCounts(event) {
  const body = typeof event.body === 'string' ? JSON.parse(event.body || '{}') : (event.body || {});
  const userIds = body.userIds;

  if (!Array.isArray(userIds)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'userIds must be an array' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }

  // protect against accidental huge payloads
  if (userIds.length > 200) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Too many userIds (max 200)' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }

  // Concurrency limit so we don’t hammer AppSync
  const pool = 8;
  const results = [];

  for (let i = 0; i < userIds.length; i += pool) {
    const batch = userIds.slice(i, i + pool);

    const part = await Promise.all(
      batch.map(async (userId) => {
        const [mountains, trails, patches] = await Promise.all([
          countAllPages(GQL_userMountainsByUser, { userID: userId }, 'userMountainsByUser'),
          countAllPages(GQL_userTrailsByUser, { userID: userId }, 'userTrailsByUser'),
          countAllPages(GQL_userPatchesByUserByPatch, { userID: userId }, 'userPatchesByUserByPatch'),
        ]);

        return { userId, mountains, patches, trails };
      })
    );

    results.push(...part);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(results),
    headers: { 'Content-Type': 'application/json' },
  };
}

/** -------------------------
 *  Main handler with routing
 *  ------------------------- */

exports.handler = async (event) => {
  try {
    const path = event.path || event.rawPath || '';
    const resource = event.resource || '';
    const method = event.httpMethod || event.requestContext?.http?.method || 'GET';

    // Normalize route matching for different API Gateway flavors
    const isListUsers =
      (method === 'POST' || method === 'GET') &&
      (path.endsWith('/list-users') || resource.endsWith('/list-users'));

    const isUserEntryCounts =
      method === 'POST' &&
      (path.endsWith('/user-entry-counts') || resource.endsWith('/user-entry-counts'));

    const isPopularPatches =
      method === 'GET' &&
      (path.endsWith('/popular-patches') || resource.endsWith('/popular-patches'));

    console.log("isListUsers: "+isListUsers);
    if (isListUsers) {
      return await handleListUsers();
    }

    if (isUserEntryCounts) {
      return await handleUserEntryCounts(event);
    }

    if (isPopularPatches) {
      return await handlePopularPatches();
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Not Found' }),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (error) {
    console.error('Lambda error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
};

