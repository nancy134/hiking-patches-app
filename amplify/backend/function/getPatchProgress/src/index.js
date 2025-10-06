'use strict';
const https = require('https');
const { SignatureV4 } = require('@aws-sdk/signature-v4');
const { Sha256 } = require('@aws-crypto/sha256-js');
const { HttpRequest } = require('@aws-sdk/protocol-http');
const { defaultProvider } = require('@aws-sdk/credential-provider-node');

function findEnvKey(suffix) {
  const hit = Object.entries(process.env).find(([k]) => k.endsWith(suffix));
  return hit?.[1];
}

function getAppSyncEndpoint() {
  // e.g. API_<APINAME>_GRAPHQLAPIENDPOINTOUTPUT
  const url = findEnvKey('GRAPHQLAPIENDPOINTOUTPUT');
  if (!url) {
    throw new Error('AppSync endpoint env var not found (…GRAPHQLAPIENDPOINTOUTPUT).');
  }
  return url;
}

function getAppSyncApiKey() {
  // e.g. API_<APINAME>_GRAPHQLAPIKEYOUTPUT (only present if API key auth enabled)
  return findEnvKey('GRAPHQLAPIKEYOUTPUT') || null;
}

const GQL_getPatch = `
  query GetPatch($id: ID!) {
    getPatch(id: $id) { id completionRule }
  }
`;

const GQL_patchMountainsByPatch = `
  query PatchMountainsByPatch($patchId: ID!, $limit: Int, $nextToken: String) {
    patchMountainsByPatch(patchPatchMountainsId: $patchId, limit: $limit, nextToken: $nextToken) {
      items { id mountainPatchMountainsId delisted }
      nextToken
    }
  }
`;

const GQL_userMountainsByUser = `
  query UserMountainsByUser($userID: ID!, $limit: Int, $nextToken: String) {
    userMountainsByUser(userID: $userID, limit: $limit, nextToken: $nextToken) {
      items { id mountainID }
      nextToken
    }
  }
`;

// forceIAM=true => always sign with SigV4
async function graphQL(query, variables, { forceIAM = false } = {}) {
  const endpoint = getAppSyncEndpoint();
  const url = new URL(endpoint);
  const region = process.env.AWS_REGION || process.env.REGION || 'us-east-1';
  const body = JSON.stringify({ query, variables });

  // --- API KEY PATH (simple)
  const apiKey = getAppSyncApiKey();
  if (apiKey && !forceIAM) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': apiKey },
      body
    });
    const json = await res.json();
    if (!res.ok || json.errors) throw new Error(`AppSync(APIKEY) error: ${JSON.stringify(json.errors || json)}`);
    return json.data;
  }

  // --- IAM PATH (use https to preserve signed headers)
  const request = new HttpRequest({
    protocol: 'https:',
    hostname: url.hostname,
    method: 'POST',
    path: url.pathname || '/graphql',
    headers: { host: url.hostname, 'content-type': 'application/json' },
    body
  });

  const signer = new SignatureV4({
    credentials: defaultProvider(),
    service: 'appsync',
    region,
    sha256: Sha256
  });

  const signed = await signer.sign(request);

  const resBody = await new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: url.hostname,
        method: 'POST',
        path: request.path,
        headers: signed.headers // includes Authorization, X-Amz-Date, X-Amz-Security-Token, host
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
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

function normalizeRule(raw) {
  if (!raw) return { type: 'default' };
  let obj = raw;
  if (typeof raw === 'string') {
    try { obj = JSON.parse(raw); } catch { return { type: 'default' }; }
  }
  if (!obj || typeof obj !== 'object') return { type: 'default' };
  if (obj.type === 'excludeDelisted') return { type: 'excludeDelisted' };
  if (obj.type === 'anyN') {
    const n = Number(obj.n);
    return Number.isFinite(n) && n > 0 ? { type: 'anyN', n: Math.floor(n) } : { type: 'default' };
  }
  return { type: 'default' };
}

function computePercent(rule, rows, hasAscent) {
  const items = rows.filter(r => r.mountainPatchMountainsId);
  const completedAll = items.reduce((acc, r) => acc + (r.mountainPatchMountainsId && hasAscent(r.mountainPatchMountainsId) ? 1 : 0), 0);
  if (rule.type === 'excludeDelisted') {
    const eligible = items.filter(r => !r.delisted);
    const denom = eligible.length || 1;
    const percent = Math.round((completedAll / denom) * 100);
    return { completed: completedAll, denom, percent, note: 'Delisted excluded from denominator' };
  }
  if (rule.type === 'anyN') {
    const denom = rule.n;
    const percent = Math.max(0, Math.min(100, Math.round((completedAll / denom) * 100)));
    return { completed: Math.min(completedAll, denom), denom, percent, note: `Any ${denom}` };
  }

  const denom = items.length;
  const percent = denom === 0 ? 0 : Math.round((completedAll / denom) * 100);
  return { completed: completedAll, denom, percent, note: undefined };
}

async function fetchPatch(patchId) {
  const data = await graphQL(GQL_getPatch, { id: patchId });
  return data.getPatch ?? {};
}

async function fetchAllPatchMountains(patchId) {
  const out = [];
  let nextToken = null;
  do {
    const data = await graphQL(GQL_patchMountainsByPatch, { patchId, limit: 200, nextToken });
    const conn = data.patchMountainsByPatch;
    if (conn?.items?.length) out.push(...conn.items);
    nextToken = conn?.nextToken ?? null;
  } while (nextToken);
  return out;
}

async function fetchAllUserMountains(userId) {
  const out = [];
  let nextToken = null;
  do {
    const data = await graphQL(GQL_userMountainsByUser, { userID: userId, limit: 200, nextToken }, {forceIAM: true});
    const conn = data.userMountainsByUser;
    if (conn?.items?.length) out.push(...conn.items);
    nextToken = conn?.nextToken ?? null;
  } while (nextToken);
  return out;
}

function ensureCallerIsUserOrAdmin(event, userId) {
  const sub = event.identity?.sub || event.identity?.username;
  const groups = event.identity?.groups || [];
  const isAdmin = groups.includes('Admin');
  if (!isAdmin && sub !== userId && event.identity?.username !== userId) {
    throw new Error("Not authorized to access another user's progress.");
  }
}

async function progressForPatch(patchId, userId) {
  const [patch, patchMountains, userMountains] = await Promise.all([
    fetchPatch(patchId),
    fetchAllPatchMountains(patchId),
    fetchAllUserMountains(userId),
  ]);
  const rule = normalizeRule(patch?.completionRule);
  const userSet = new Set(userMountains.map(u => u.mountainID).filter(Boolean));
  const hasAscent = (mid) => userSet.has(mid);
  const { completed, denom, percent, note } = computePercent(rule, patchMountains, hasAscent);
  return { patchId, userId, completed, denom, percent, note };
}

async function batchProgress(patchIds, userId) {
  const userMountains = await fetchAllUserMountains(userId);
  const userSet = new Set(userMountains.map(u => u.moutainUserMountainsId).filter(Boolean));
  const hasAscent = (mid) => userSet.has(mid);

  const pool = 5;
  const chunks = [];
  for (let i = 0; i < patchIds.length; i += pool) chunks.push(patchIds.slice(i, i + pool));

  const results = [];
  for (const group of chunks) {
    const part = await Promise.all(
      group.map(async (patchId) => {
        const [patch, patchMountains] = await Promise.all([
          fetchPatch(patchId),
          fetchAllPatchMountains(patchId),
        ]);
        const rule = normalizeRule(patch?.completionRule);
        const { completed, denom, percent, note } = computePercent(rule, patchMountains, hasAscent);
        return { patchId, userId, completed, denom, percent, note };
      })
    );
    results.push(...part);
  }
  return results;
}

exports.handler = async (event) => {
  const args = event.arguments || {};
  if (!args.userId) throw new Error('userId is required.');
  ensureCallerIsUserOrAdmin(event, args.userId);

  if (args.patchId) return progressForPatch(args.patchId, args.userId);
  if (Array.isArray(args.patchIds)) return batchProgress(args.patchIds, args.userId);
  throw new Error('Provide either patchId or patchIds.');
};

