#!/usr/bin/env node
/**
 * Replace a non-prod environment's catalogue with a copy of prod's, so dev,
 * staging and prod hold the same patches, mountains and trails under the same
 * ids. Without matching ids nothing keyed on a record id can be tested outside
 * prod — the reference-link import, for one, matched 0 of 93 rows in staging.
 *
 * Copies CATALOGUE tables verbatim from prod, including imageUrl, which points
 * at prod's S3 bucket. Copied rows therefore load their images from prod: a
 * deliberate trade (images work immediately) that makes the target env depend on
 * prod's bucket.
 *
 * Deletes USER_WIPE tables in the target rather than copying them. Those rows
 * reference catalogue ids and a per-env Cognito pool, so after the ids change
 * they would point at records that no longer exist.
 *
 * Never touches AppSetting (per-env feature flags such as OWNER_EDITING_ENABLED),
 * AdminNotification or PatchRequest.
 *
 * Usage — prefer the run-*.sh wrappers:
 *   ./run-dev.sh                # dry run
 *   ./run-dev.sh --execute      # apply
 *
 * Refuses to run against prod as a target under any circumstances.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const {
  DynamoDBClient, ScanCommand, BatchWriteItemCommand, DescribeTableCommand,
} = require('@aws-sdk/client-dynamodb');

// Stack hashes confirmed from the tables' amplify:branch-name /
// amplify:deployment-type tags. Every Gen2 table ends in -NONE, prod included,
// so the suffix tells you nothing — never guess these.
const STACKS = {
  dev:     'bywflw3vpnebreoxth7mpk2rie',
  staging: 'ib3bqslbhncstg7i4ascxdpun4',
  prod:    'hsodmdm5pvgnphz77odanhfwpy',
};

const CATALOGUE = ['Patch', 'Mountain', 'Trail', 'PatchMountain', 'PatchTrail'];
const USER_WIPE = ['UserPatch', 'UserMountain', 'UserTrail', 'PatchPurchase',
                   'PatchOwner', 'PatchOwnerRequest'];
const UNTOUCHED = ['AppSetting', 'AdminNotification', 'PatchRequest'];

const SOURCE = process.env.SOURCE_ENV || 'prod';
const TARGET = process.env.TARGET_ENV;
const REGION = process.env.AWS_REGION || 'us-east-1';
const DRY_RUN = !process.argv.includes('--execute');

if (!TARGET || !STACKS[TARGET]) {
  console.error(`ERROR: TARGET_ENV must be one of: ${Object.keys(STACKS).join(', ')}`);
  process.exit(1);
}
if (TARGET === 'prod') {
  console.error('ERROR: refusing to reseed prod. Prod is the source of truth.');
  process.exit(1);
}
if (!STACKS[SOURCE]) {
  console.error(`ERROR: SOURCE_ENV must be one of: ${Object.keys(STACKS).join(', ')}`);
  process.exit(1);
}

const table = (env, model) => `${model}-${STACKS[env]}-NONE`;
const db = new DynamoDBClient({ region: REGION });

/**
 * A delete needs the table's exact key, and these are not uniform: most models
 * are keyed on `id`, but UserTrail is keyed on userID + trailID. Assuming `id`
 * fails with "The provided key element does not match the schema".
 */
const keyCache = new Map();
async function keyAttributes(tableName) {
  if (!keyCache.has(tableName)) {
    const res = await db.send(new DescribeTableCommand({ TableName: tableName }));
    keyCache.set(tableName, res.Table.KeySchema.map((k) => k.AttributeName));
  }
  return keyCache.get(tableName);
}

async function scanAll(tableName) {
  const items = [];
  let ExclusiveStartKey;
  do {
    const res = await db.send(new ScanCommand({ TableName: tableName, ExclusiveStartKey }));
    items.push(...(res.Items ?? []));
    ExclusiveStartKey = res.LastEvaluatedKey;
  } while (ExclusiveStartKey);
  return items;
}

/** BatchWriteItem in chunks of 25, retrying whatever DynamoDB hands back unprocessed. */
async function batchWrite(tableName, requests) {
  for (let i = 0; i < requests.length; i += 25) {
    let batch = requests.slice(i, i + 25);
    for (let attempt = 0; batch.length && attempt < 8; attempt++) {
      const res = await db.send(new BatchWriteItemCommand({
        RequestItems: { [tableName]: batch },
      }));
      const un = res.UnprocessedItems?.[tableName] ?? [];
      if (!un.length) break;
      batch = un;
      await new Promise((r) => setTimeout(r, 2 ** attempt * 100));
    }
  }
}

(async () => {
  console.log('='.repeat(66));
  console.log(`Source (read only) : ${SOURCE}`);
  console.log(`Target (REPLACED)  : ${TARGET}`);
  console.log(`Catalogue copied   : ${CATALOGUE.join(', ')}`);
  console.log(`User rows DELETED  : ${USER_WIPE.join(', ')}`);
  console.log(`Never touched      : ${UNTOUCHED.join(', ')}`);
  console.log(`Mode               : ${DRY_RUN ? '🔍 DRY RUN (no changes — pass --execute)' : '🚀 EXECUTE'}`);
  console.log('='.repeat(66));

  const plan = [];

  console.log('\nCatalogue:');
  for (const model of CATALOGUE) {
    const src = await scanAll(table(SOURCE, model));
    const tgt = await scanAll(table(TARGET, model));
    plan.push({ model, kind: 'catalogue', src, tgt });
    console.log(`  ${model.padEnd(16)} ${TARGET}: ${String(tgt.length).padStart(4)}  ->  copy ${String(src.length).padStart(4)} from ${SOURCE}`);
  }

  console.log('\nUser rows in the target (deleted, not replaced):');
  for (const model of USER_WIPE) {
    let tgt = [];
    try {
      tgt = await scanAll(table(TARGET, model));
    } catch (e) {
      console.log(`  ${model.padEnd(16)} — table not found, skipping`);
      continue;
    }
    plan.push({ model, kind: 'wipe', src: [], tgt });
    console.log(`  ${model.padEnd(16)} ${TARGET}: ${String(tgt.length).padStart(4)}  ->  delete all`);
  }

  if (DRY_RUN) {
    console.log('\nDry run — nothing was changed. Re-run with --execute to apply.');
    return;
  }

  // Back up everything we are about to destroy, before destroying any of it.
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, 'backups');
  fs.mkdirSync(backupDir, { recursive: true });
  const backupFile = path.join(backupDir, `${TARGET}-${stamp}.json`);
  fs.writeFileSync(backupFile, JSON.stringify(
    Object.fromEntries(plan.map((p) => [p.model, p.tgt])), null, 1));
  console.log(`\nBacked up ${plan.reduce((n, p) => n + p.tgt.length, 0)} existing ${TARGET} rows -> ${path.relative(process.cwd(), backupFile)}`);

  for (const p of plan) {
    const tableName = table(TARGET, p.model);
    if (p.tgt.length) {
      const keys = await keyAttributes(tableName);
      await batchWrite(tableName, p.tgt.map((it) => ({
        DeleteRequest: { Key: Object.fromEntries(keys.map((k) => [k, it[k]])) },
      })));
      console.log(`  deleted ${String(p.tgt.length).padStart(4)} from ${p.model}`);
    }
    if (p.src.length) {
      await batchWrite(tableName, p.src.map((it) => ({ PutRequest: { Item: it } })));
      console.log(`  copied  ${String(p.src.length).padStart(4)} into ${p.model}`);
    }
  }

  console.log('\nDone. Verify with the counts above, then check a patch page in that env.');
  console.log(`Roll back by restoring ${path.relative(process.cwd(), backupFile)}.`);
})().catch((err) => {
  console.error('\nFATAL:', err.message);
  process.exit(1);
});
