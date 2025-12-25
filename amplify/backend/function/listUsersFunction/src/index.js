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

  const users = await cognito
    .listUsers({
      UserPoolId: userPoolId,
      Limit: 25,
    })
    .promise();

  console.log("users:");
  console.log(users);
  return {
    statusCode: 200,
    body: JSON.stringify(users.Users),
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

    console.log("isListUsers: "+isListUsers);
    if (isListUsers) {
      return await handleListUsers();
    }

    if (isUserEntryCounts) {
      return await handleUserEntryCounts(event);
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

