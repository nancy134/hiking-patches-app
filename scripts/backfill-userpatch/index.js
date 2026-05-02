#!/usr/bin/env node
/**
 * Backfill UserPatch records for users who have UserMountain or UserTrail
 * activity in a patch but no corresponding UserPatch record.
 *
 * Reads PatchMountain/PatchTrail via AppSync (API key — public read).
 * Reads UserMountain/UserTrail/UserPatch directly from DynamoDB (bypasses
 * AppSync auth, which only allows owner or Cognito Identity Pool IAM).
 * Writes missing UserPatch records directly to DynamoDB.
 *
 * Usage — from this directory after `npm install`:
 *
 *   # Dry run (prints what would be created, makes no changes):
 *   APPSYNC_URL=<url> API_KEY=<key> AMPLIFY_ENV=dev AWS_PROFILE=<profile> node index.js
 *
 *   # Execute:
 *   APPSYNC_URL=<url> API_KEY=<key> AMPLIFY_ENV=dev AWS_PROFILE=<profile> node index.js --execute
 *
 * Required env vars:
 *   APPSYNC_URL   — e.g. https://<id>.appsync-api.us-east-1.amazonaws.com/graphql
 *   API_KEY       — AppSync API key for this environment
 *   AMPLIFY_ENV   — dev | staging | prod
 *
 * AWS credentials come from the normal chain: AWS_PROFILE, AWS_ACCESS_KEY_ID, etc.
 * The IAM user/role needs dynamodb:Scan + dynamodb:PutItem on the relevant tables.
 */

'use strict';

const https = require('https');
const { DynamoDBClient, ScanCommand, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { v4: uuidv4 } = require('uuid');

// ── Config ────────────────────────────────────────────────────────────────────

const APPSYNC_URL = process.env.APPSYNC_URL;
const API_KEY     = process.env.API_KEY;
const AMPLIFY_ENV = process.env.AMPLIFY_ENV;
const REGION      = process.env.AWS_REGION || 'us-east-1';
const DRY_RUN     = !process.argv.includes('--execute');

if (!APPSYNC_URL || !API_KEY || !AMPLIFY_ENV) {
  console.error('ERROR: APPSYNC_URL, API_KEY, and AMPLIFY_ENV are required.\n');
  console.error('Example:');
  console.error('  APPSYNC_URL=https://xxx.appsync-api.us-east-1.amazonaws.com/graphql \\');
  console.error('  API_KEY=da2-xxx \\');
  console.error('  AMPLIFY_ENV=dev \\');
  console.error('  AWS_PROFILE=my-profile \\');
  console.error('  node index.js [--execute]');
  process.exit(1);
}

// Amplify Gen 1 DynamoDB table naming: {Model}-{apiId}-{env}
// Override any table name via env var if the auto-derived name is wrong.
const apiId               = new URL(APPSYNC_URL).hostname.split('.')[0];
const USER_MOUNTAIN_TABLE = process.env.USER_MOUNTAIN_TABLE || `UserMountain-${apiId}-${AMPLIFY_ENV}`;
const USER_TRAIL_TABLE    = process.env.USER_TRAIL_TABLE    || `UserTrail-${apiId}-${AMPLIFY_ENV}`;
const USER_PATCH_TABLE    = process.env.USER_PATCH_TABLE    || `UserPatch-${apiId}-${AMPLIFY_ENV}`;

const dynamo = new DynamoDBClient({ region: REGION });

console.log('='.repeat(60));
console.log(`Environment : ${AMPLIFY_ENV}`);
console.log(`AppSync ID  : ${apiId}`);
console.log(`Tables      :`);
console.log(`  UserMountain → ${USER_MOUNTAIN_TABLE}`);
console.log(`  UserTrail    → ${USER_TRAIL_TABLE}`);
console.log(`  UserPatch    → ${USER_PATCH_TABLE}`);
console.log(`Mode        : ${DRY_RUN ? '🔍 DRY RUN  (no changes — pass --execute to apply)' : '🚀 EXECUTE'}`);
console.log('='.repeat(60));
console.log();

// ── AppSync (API key) ─────────────────────────────────────────────────────────

function gqlRequest(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query, variables });
    const url  = new URL(APPSYNC_URL);
    const req  = https.request(
      {
        hostname: url.hostname,
        path: url.pathname,
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'content-length': Buffer.byteLength(body),
          'x-api-key': API_KEY,
        },
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json.errors) reject(new Error(JSON.stringify(json.errors)));
            else resolve(json.data);
          } catch (e) {
            reject(e);
          }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function fetchAllGqlPages(gqlQuery, connectionName) {
  const items = [];
  let nextToken = null;
  let page = 0;
  do {
    page++;
    process.stdout.write(`\r  Fetching ${connectionName} — page ${page} (${items.length} so far)...`);
    const data = await gqlRequest(gqlQuery, { limit: 1000, nextToken });
    const conn = data?.[connectionName];
    items.push(...(conn?.items ?? []));
    nextToken = conn?.nextToken ?? null;
  } while (nextToken);
  process.stdout.write(`\r  Fetched ${connectionName}: ${items.length} records          \n`);
  return items;
}

// ── DynamoDB scan ─────────────────────────────────────────────────────────────

async function scanTable(tableName, projectionFields) {
  const items = [];
  let lastKey  = undefined;
  let page     = 0;
  do {
    page++;
    process.stdout.write(`\r  Scanning ${tableName} — page ${page} (${items.length} so far)...`);
    const result = await dynamo.send(new ScanCommand({
      TableName: tableName,
      ProjectionExpression: projectionFields.join(', '),
      ExclusiveStartKey: lastKey,
    }));
    for (const item of result.Items ?? []) {
      const row = {};
      for (const field of projectionFields) row[field] = item[field]?.S ?? item[field]?.BOOL ?? null;
      items.push(row);
    }
    lastKey = result.LastEvaluatedKey;
  } while (lastKey);
  process.stdout.write(`\r  Scanned ${tableName}: ${items.length} records          \n`);
  return items;
}

// ── GraphQL queries (public — API key) ───────────────────────────────────────

const Q_PATCH_MOUNTAINS = `
  query ListPatchMountains($limit: Int, $nextToken: String) {
    listPatchMountains(limit: $limit, nextToken: $nextToken) {
      items { patchPatchMountainsId mountainPatchMountainsId }
      nextToken
    }
  }
`;

const Q_PATCH_TRAILS = `
  query ListPatchTrails($limit: Int, $nextToken: String) {
    listPatchTrails(limit: $limit, nextToken: $nextToken) {
      items { patchPatchTrailsId trailPatchTrailsId }
      nextToken
    }
  }
`;

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  // 1. Load patch structure via AppSync (public)
  console.log('Step 1: Loading patch structure (PatchMountain and PatchTrail)...');
  const [patchMountains, patchTrails] = await Promise.all([
    fetchAllGqlPages(Q_PATCH_MOUNTAINS, 'listPatchMountains'),
    fetchAllGqlPages(Q_PATCH_TRAILS,    'listPatchTrails'),
  ]);

  // mountainID → Set<patchID>
  const mountainToPatch = new Map();
  for (const { patchPatchMountainsId: patchID, mountainPatchMountainsId: mountainID } of patchMountains) {
    if (!patchID || !mountainID) continue;
    if (!mountainToPatch.has(mountainID)) mountainToPatch.set(mountainID, new Set());
    mountainToPatch.get(mountainID).add(patchID);
  }

  // trailID → Set<patchID>
  const trailToPatch = new Map();
  for (const { patchPatchTrailsId: patchID, trailPatchTrailsId: trailID } of patchTrails) {
    if (!patchID || !trailID) continue;
    if (!trailToPatch.has(trailID)) trailToPatch.set(trailID, new Set());
    trailToPatch.get(trailID).add(patchID);
  }

  console.log(`  ${mountainToPatch.size} mountains mapped to patches`);
  console.log(`  ${trailToPatch.size} trails mapped to patches`);
  console.log();

  // 2. Load user activity directly from DynamoDB
  console.log('Step 2: Loading user activity (UserMountain and UserTrail from DynamoDB)...');
  const [userMountains, userTrails] = await Promise.all([
    scanTable(USER_MOUNTAIN_TABLE, ['userID', 'mountainID']),
    scanTable(USER_TRAIL_TABLE,    ['userID', 'trailID']),
  ]);
  console.log();

  // 3. Build the set of (userID, patchID) pairs implied by activity
  const needed = new Map(); // "userID|patchID" → { userID, patchID }
  let unmappedMountains = 0;
  let unmappedTrails    = 0;

  for (const { userID, mountainID } of userMountains) {
    if (!userID || !mountainID) continue;
    const patches = mountainToPatch.get(mountainID);
    if (!patches) { unmappedMountains++; continue; }
    for (const patchID of patches) needed.set(`${userID}|${patchID}`, { userID, patchID });
  }

  for (const { userID, trailID } of userTrails) {
    if (!userID || !trailID) continue;
    const patches = trailToPatch.get(trailID);
    if (!patches) { unmappedTrails++; continue; }
    for (const patchID of patches) needed.set(`${userID}|${patchID}`, { userID, patchID });
  }

  if (unmappedMountains > 0) console.log(`  ⚠️  ${unmappedMountains} UserMountain records have no matching PatchMountain entry (orphaned data)`);
  if (unmappedTrails > 0)    console.log(`  ⚠️  ${unmappedTrails} UserTrail records have no matching PatchTrail entry (orphaned data)`);
  console.log(`  ${needed.size} unique (user, patch) pairs implied by activity`);
  console.log();

  // 4. Load existing UserPatch records from DynamoDB
  console.log('Step 3: Loading existing UserPatch records from DynamoDB...');
  const existingRows = await scanTable(USER_PATCH_TABLE, ['userID', 'patchID']);
  const existing     = new Set(existingRows.map(({ userID, patchID }) => `${userID}|${patchID}`));
  console.log(`  ${existing.size} existing UserPatch records`);
  console.log();

  // 5. Compute what's missing
  const missing = [...needed.values()].filter(({ userID, patchID }) => !existing.has(`${userID}|${patchID}`));

  if (missing.length === 0) {
    console.log('✅ Nothing to do — all active users already have UserPatch records.');
    return;
  }

  console.log(`Step 4: ${missing.length} UserPatch records to create:`);
  for (const { userID, patchID } of missing) {
    console.log(`  + userID=${userID}  patchID=${patchID}`);
  }
  console.log();

  if (DRY_RUN) {
    console.log('DRY RUN complete — no changes made. Run with --execute to apply.');
    return;
  }

  // 6. Create missing records
  console.log('Step 5: Creating missing UserPatch records...');
  const now     = new Date().toISOString();
  let created   = 0;
  let errors    = 0;

  for (const { userID, patchID } of missing) {
    try {
      await dynamo.send(new PutItemCommand({
        TableName: USER_PATCH_TABLE,
        Item: {
          id:         { S: uuidv4() },
          patchID:    { S: patchID },
          userID:     { S: userID },
          inProgress: { BOOL: true },
          createdAt:  { S: now },
          updatedAt:  { S: now },
          __typename: { S: 'UserPatch' },
        },
      }));
      created++;
      process.stdout.write(`\r  Created ${created}/${missing.length}...`);
    } catch (err) {
      console.error(`\n  ERROR creating userID=${userID} patchID=${patchID}: ${err.message}`);
      errors++;
    }
  }

  console.log(`\n\n✅ Done — created ${created} UserPatch records, ${errors} errors.`);
}

main().catch((err) => {
  console.error('\nFATAL:', err.message || err);
  process.exit(1);
});
