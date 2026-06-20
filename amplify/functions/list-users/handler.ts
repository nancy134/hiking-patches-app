import type { APIGatewayProxyHandler } from 'aws-lambda';
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { Sha256 } from '@aws-crypto/sha256-js';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import * as https from 'https';

const cognito = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION ?? 'us-east-1' });

const USER_POOL_ID = process.env.USER_POOL_ID!;

const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: USER_POOL_ID,
  tokenUse: 'id',
  clientId: null,
});

async function verifyToken(event: Parameters<APIGatewayProxyHandler>[0]) {
  const authHeader = event.headers?.Authorization ?? event.headers?.authorization ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return null;
  try {
    return await jwtVerifier.verify(token);
  } catch {
    return null;
  }
}

async function requireAdmin(event: Parameters<APIGatewayProxyHandler>[0]): Promise<boolean> {
  const payload = await verifyToken(event);
  if (!payload) return false;
  const groups = (payload['cognito:groups'] as string[] | undefined) ?? [];
  return groups.includes('Admin');
}

function getAppSyncEndpoint() {
  const url = process.env.APPSYNC_URL;
  if (!url) throw new Error('APPSYNC_URL env var not set');
  return url;
}

async function graphQL(query: string, variables: unknown, forceIAM = false): Promise<unknown> {
  const endpoint = getAppSyncEndpoint();
  const url = new URL(endpoint);
  const region = process.env.AWS_REGION ?? 'us-east-1';
  const body = JSON.stringify({ query, variables });

  const apiKey = process.env.APPSYNC_API_KEY;
  if (apiKey && !forceIAM) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': apiKey },
      body,
    });
    const json = await res.json() as { data: unknown; errors?: unknown[] };
    if (!res.ok || json.errors) throw new Error(`AppSync error: ${JSON.stringify(json.errors)}`);
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

  const signer = new SignatureV4({ credentials: defaultProvider(), service: 'appsync', region, sha256: Sha256 });
  const signed = await signer.sign(request);

  const resBody = await new Promise<string>((resolve, reject) => {
    const req = https.request(
      { hostname: url.hostname, method: 'POST', path: request.path, headers: signed.headers },
      (res) => {
        let data = '';
        res.on('data', (c: string) => (data += c));
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

  const json = JSON.parse(resBody) as { data: unknown; errors?: unknown[] };
  if (json.errors) throw new Error(`AppSync(IAM) error: ${JSON.stringify(json.errors)}`);
  return json.data;
}

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
    getPatch(id: $id) { id name description imageUrl regions difficulty status }
  }
`;
const GQL_userMountainsByUser = `
  query UserMountainsByUser($userID: ID!, $limit: Int, $nextToken: String) {
    userMountainsByUser(userID: $userID, limit: $limit, nextToken: $nextToken) {
      items { id } nextToken
    }
  }
`;
const GQL_userTrailsByUser = `
  query UserTrailsByUser($userID: ID!, $limit: Int, $nextToken: String) {
    userTrailsByUser(userID: $userID, limit: $limit, nextToken: $nextToken) {
      items { trailID } nextToken
    }
  }
`;
const GQL_userPatchesByUserByPatch = `
  query UserPatchesByUserByPatch($userID: String!, $limit: Int, $nextToken: String) {
    userPatchesByUserByPatch(userID: $userID, limit: $limit, nextToken: $nextToken) {
      items { id } nextToken
    }
  }
`;
const GQL_patchOwnersByPatch = `
  query PatchOwnersByPatch($patchID: ID!, $limit: Int, $nextToken: String) {
    patchOwnersByPatch(patchID: $patchID, limit: $limit, nextToken: $nextToken) {
      items { userID } nextToken
    }
  }
`;
const GQL_userPatchesByPatchStats = `
  query UserPatchesByPatch($patchID: ID!, $limit: Int, $nextToken: String) {
    userPatchesByPatch(patchID: $patchID, limit: $limit, nextToken: $nextToken) {
      items { inProgress dateCompleted } nextToken
    }
  }
`;
const GQL_updatePatchOwnerFields = `
  mutation UpdatePatch($input: UpdatePatchInput!) {
    updatePatch(input: $input) { id description howToGet imageUrl }
  }
`;
const GQL_getAppSetting = `
  query GetAppSetting($key: String!) {
    getAppSetting(key: $key) { value }
  }
`;

const OWNER_EDITING_KEY = 'OWNER_EDITING_ENABLED';

// Runtime kill switch for the owner feature, toggled from the admin console
// (AppSetting model). Fail-closed: any error, missing row, or non-'true' value
// disables it. Server-side enforcement so the switch is real, not just UI.
async function isOwnerEditingEnabled(): Promise<boolean> {
  try {
    const data = await graphQL(GQL_getAppSetting, { key: OWNER_EDITING_KEY }, true) as {
      getAppSetting?: { value?: string | null } | null;
    };
    return data?.getAppSetting?.value === 'true';
  } catch (err) {
    console.error('Failed to read OWNER_EDITING_ENABLED; treating as disabled', err);
    return false;
  }
}

const jsonOwnerDisabled = () => ({
  statusCode: 403,
  body: JSON.stringify({ error: 'Owner editing is currently disabled' }),
  headers: { 'Content-Type': 'application/json' },
});

async function countAllPages(query: string, variablesBase: Record<string, unknown>, connectionName: string) {
  let total = 0;
  let nextToken: string | null = null;
  do {
    const data = await graphQL(query, { ...variablesBase, limit: 200, nextToken }, true) as Record<string, { items: unknown[]; nextToken?: string }>;
    const conn = data?.[connectionName];
    total += conn?.items?.length ?? 0;
    nextToken = conn?.nextToken ?? null;
  } while (nextToken);
  return total;
}

const json200 = (body: unknown) => ({
  statusCode: 200,
  body: JSON.stringify(body),
  headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
});
const json403 = () => ({
  statusCode: 403,
  body: JSON.stringify({ error: 'Forbidden' }),
  headers: { 'Content-Type': 'application/json' },
});
const json401 = () => ({
  statusCode: 401,
  body: JSON.stringify({ error: 'Unauthorized' }),
  headers: { 'Content-Type': 'application/json' },
});
const json400 = (error: string) => ({
  statusCode: 400,
  body: JSON.stringify({ error }),
  headers: { 'Content-Type': 'application/json' },
});

async function handleListUsers(event: Parameters<APIGatewayProxyHandler>[0]) {
  if (!await requireAdmin(event)) return json403();
  let allUsers: unknown[] = [];
  let paginationToken: string | undefined;
  do {
    const result = await cognito.send(new ListUsersCommand({ UserPoolId: USER_POOL_ID, Limit: 60, ...(paginationToken ? { PaginationToken: paginationToken } : {}) }));
    allUsers = allUsers.concat(result.Users ?? []);
    paginationToken = result.PaginationToken;
  } while (paginationToken);
  return json200(allUsers);
}

async function handleUserEntryCounts(event: Parameters<APIGatewayProxyHandler>[0]) {
  if (!await requireAdmin(event)) return json403();
  const body = typeof event.body === 'string' ? JSON.parse(event.body || '{}') : (event.body ?? {});
  const { userIds } = body as { userIds: string[] };
  if (!Array.isArray(userIds)) return { statusCode: 400, body: JSON.stringify({ error: 'userIds must be an array' }), headers: { 'Content-Type': 'application/json' } };
  if (userIds.length > 200) return { statusCode: 400, body: JSON.stringify({ error: 'Too many userIds (max 200)' }), headers: { 'Content-Type': 'application/json' } };

  const POOL = 8;
  const results: unknown[] = [];
  for (let i = 0; i < userIds.length; i += POOL) {
    const batch = userIds.slice(i, i + POOL);
    const part = await Promise.all(batch.map(async (userId) => {
      const [mountains, trails, patches] = await Promise.all([
        countAllPages(GQL_userMountainsByUser, { userID: userId }, 'userMountainsByUser'),
        countAllPages(GQL_userTrailsByUser, { userID: userId }, 'userTrailsByUser'),
        countAllPages(GQL_userPatchesByUserByPatch, { userID: userId }, 'userPatchesByUserByPatch'),
      ]);
      return { userId, mountains, patches, trails };
    }));
    results.push(...part);
  }
  return json200(results);
}

async function handlePopularPatches() {
  const counts = new Map<string, { inProgress: number; wishlisted: number; total: number }>();
  let nextToken: string | null = null;
  do {
    const data = await graphQL(GQL_listUserPatchesTracking, { filter: { or: [{ inProgress: { eq: true } }, { wishlisted: { eq: true } }] }, limit: 1000, nextToken }, true) as { listUserPatches?: { items: Array<{ patchID?: string; inProgress?: boolean; wishlisted?: boolean }>; nextToken?: string } };
    for (const item of data?.listUserPatches?.items ?? []) {
      if (!item?.patchID) continue;
      const e = counts.get(item.patchID) ?? { inProgress: 0, wishlisted: 0, total: 0 };
      if (item.inProgress) e.inProgress += 1;
      if (item.wishlisted) e.wishlisted += 1;
      e.total = e.inProgress + e.wishlisted;
      counts.set(item.patchID, e);
    }
    nextToken = data?.listUserPatches?.nextToken ?? null;
  } while (nextToken);

  const top10 = [...counts.entries()].sort((a, b) => b[1].total - a[1].total).slice(0, 10);
  const results = await Promise.all(top10.map(async ([patchID, patchCounts]) => {
    const d = await graphQL(GQL_getPatchPublic, { id: patchID }, true) as { getPatch?: { status?: string } };
    const patch = d?.getPatch;
    if (!patch || (patch.status !== 'PUBLISHED' && patch.status !== null)) return null;
    return { patch, counts: patchCounts };
  }));
  return json200(results.filter(Boolean));
}

// Returns true if `userID` (a Cognito sub) is a recorded owner of the patch.
async function isPatchOwner(patchID: string, userID: string): Promise<boolean> {
  let nextToken: string | null = null;
  do {
    const data = await graphQL(GQL_patchOwnersByPatch, { patchID, limit: 200, nextToken }, true) as { patchOwnersByPatch?: { items: Array<{ userID?: string }>; nextToken?: string } };
    const items = data?.patchOwnersByPatch?.items ?? [];
    if (items.some((o) => o.userID === userID)) return true;
    nextToken = data?.patchOwnersByPatch?.nextToken ?? null;
  } while (nextToken);
  return false;
}

// Owner-gated patch edit: only description, howToGet, imageUrl are ever
// written, regardless of what the caller sends.
async function handleOwnerPatchUpdate(event: Parameters<APIGatewayProxyHandler>[0]) {
  const payload = await verifyToken(event);
  if (!payload) return json401();
  const userID = payload.sub as string;

  if (!(await isOwnerEditingEnabled())) return jsonOwnerDisabled();

  const body = typeof event.body === 'string' ? JSON.parse(event.body || '{}') : (event.body ?? {});
  const { patchId, description, howToGet, imageUrl } = body as {
    patchId?: string; description?: string; howToGet?: string; imageUrl?: string;
  };
  if (!patchId) return json400('patchId is required');

  if (!(await isPatchOwner(patchId, userID))) return json403();

  const input: Record<string, unknown> = { id: patchId };
  if (description !== undefined) input.description = description;
  if (howToGet !== undefined) input.howToGet = howToGet;
  if (imageUrl !== undefined) input.imageUrl = imageUrl;

  const data = await graphQL(GQL_updatePatchOwnerFields, { input }, true) as { updatePatch?: unknown };
  return json200({ patch: data?.updatePatch });
}

// Owner-gated aggregate stats for a patch: how many users are working on it
// vs. have completed it. Returns counts only, no PII.
async function handlePatchStats(event: Parameters<APIGatewayProxyHandler>[0]) {
  const payload = await verifyToken(event);
  if (!payload) return json401();
  const userID = payload.sub as string;

  if (!(await isOwnerEditingEnabled())) return jsonOwnerDisabled();

  const body = typeof event.body === 'string' ? JSON.parse(event.body || '{}') : (event.body ?? {});
  const { patchId } = body as { patchId?: string };
  if (!patchId) return json400('patchId is required');

  if (!(await isPatchOwner(patchId, userID))) return json403();

  let inProgressCount = 0;
  let completedCount = 0;
  let nextToken: string | null = null;
  do {
    const data = await graphQL(GQL_userPatchesByPatchStats, { patchID: patchId, limit: 200, nextToken }, true) as { userPatchesByPatch?: { items: Array<{ inProgress?: boolean; dateCompleted?: string | null }>; nextToken?: string } };
    for (const up of data?.userPatchesByPatch?.items ?? []) {
      if (up?.dateCompleted) completedCount += 1;
      else if (up?.inProgress) inProgressCount += 1;
    }
    nextToken = data?.userPatchesByPatch?.nextToken ?? null;
  } while (nextToken);

  return json200({ inProgressCount, completedCount });
}

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const path = event.path ?? '';
    const method = event.httpMethod ?? 'GET';
    if ((method === 'POST' || method === 'GET') && path.endsWith('/list-users')) return await handleListUsers(event);
    if (method === 'POST' && path.endsWith('/user-entry-counts')) return await handleUserEntryCounts(event);
    if (method === 'GET' && path.endsWith('/popular-patches')) return await handlePopularPatches();
    if (method === 'POST' && path.endsWith('/owner-patch-update')) return await handleOwnerPatchUpdate(event);
    if (method === 'POST' && path.endsWith('/patch-stats')) return await handlePatchStats(event);
    return { statusCode: 404, body: JSON.stringify({ error: 'Not Found' }), headers: { 'Content-Type': 'application/json' } };
  } catch (err) {
    console.error('Lambda error', err);
    return { statusCode: 500, body: JSON.stringify({ error: err instanceof Error ? err.message : 'Internal error' }), headers: { 'Content-Type': 'application/json' } };
  }
};
