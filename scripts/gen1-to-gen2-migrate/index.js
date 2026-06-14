#!/usr/bin/env node
/**
 * One-time data migration: copy DynamoDB table contents from a Gen1 Amplify
 * environment to the corresponding Gen2 Amplify environment.
 *
 * Both Gen1 and Gen2 use the same `<Model>-<suffix>` table naming convention
 * and (for every model in this schema) the same primary-key shape, so each
 * item is copied verbatim via BatchWriteItem/PutItem — no field remapping.
 *
 * Notable verbatim-copy detail: UserMountain relies on Gen2's default
 * `allow.owner()` rule, which checks an `owner` field formatted
 * `${sub}::${username}`. Gen1 already stores `owner` in that format, so
 * copying it as-is preserves ownership (verified: dev pool users all have
 * username === sub). UserPatch/UserTrail/PatchPurchase use
 * `ownerDefinedIn(...)` against a bare-sub field (`userID`/`userId`), which
 * Gen1 also already stores as a bare sub — also preserved by verbatim copy.
 *
 * Usage — from this directory after `npm install`:
 *
 *   # Dry run (counts items, makes no changes):
 *   SRC_SUFFIX=<src> DEST_SUFFIX=<dest> AWS_PROFILE=<profile> node index.js
 *
 *   # Execute:
 *   SRC_SUFFIX=<src> DEST_SUFFIX=<dest> AWS_PROFILE=<profile> node index.js --execute
 *
 *   # Limit to specific models:
 *   ... node index.js --only=Mountain,Trail,Patch --execute
 *
 * Required env vars:
 *   SRC_SUFFIX   — Gen1 table suffix, e.g. frdyymxsgrhjbnilqjxbifaiwe-dev
 *   DEST_SUFFIX  — Gen2 table suffix, e.g. bywflw3vpnebreoxth7mpk2rie-NONE
 *
 * AWS credentials come from the normal chain (AWS_PROFILE, etc.). The
 * IAM identity needs dynamodb:Scan on the source tables and
 * dynamodb:BatchWriteItem on the destination tables.
 */

'use strict';

const { DynamoDBClient, ScanCommand, BatchWriteItemCommand } = require('@aws-sdk/client-dynamodb');

const REGION = process.env.AWS_REGION || 'us-east-1';
const SRC_SUFFIX = process.env.SRC_SUFFIX;
const DEST_SUFFIX = process.env.DEST_SUFFIX;
const DRY_RUN = !process.argv.includes('--execute');
const onlyArg = process.argv.find((a) => a.startsWith('--only='));
const ONLY = onlyArg ? new Set(onlyArg.slice('--only='.length).split(',')) : null;

if (!SRC_SUFFIX || !DEST_SUFFIX) {
  console.error('ERROR: SRC_SUFFIX and DEST_SUFFIX are required.\n');
  console.error('Example:');
  console.error('  SRC_SUFFIX=frdyymxsgrhjbnilqjxbifaiwe-dev \\');
  console.error('  DEST_SUFFIX=bywflw3vpnebreoxth7mpk2rie-NONE \\');
  console.error('  AWS_PROFILE=my-profile \\');
  console.error('  node index.js [--execute] [--only=Model1,Model2]');
  process.exit(1);
}

const dynamo = new DynamoDBClient({ region: REGION });

// Order is cosmetic (DynamoDB has no FK constraints) — reference data first,
// then join tables, then user-owned data.
const MODELS = [
  'Mountain',
  'Trail',
  'Patch',
  'PatchMountain',
  'PatchTrail',
  'UserPatch',
  'UserMountain',
  'UserTrail',
  'PatchPurchase',
  'PatchRequest',
];

async function scanAll(tableName) {
  const items = [];
  let lastKey;
  let page = 0;
  do {
    page++;
    process.stdout.write(`\r    scanning ${tableName} (page ${page}, ${items.length} so far)...`);
    const res = await dynamo.send(new ScanCommand({ TableName: tableName, ExclusiveStartKey: lastKey }));
    items.push(...(res.Items ?? []));
    lastKey = res.LastEvaluatedKey;
  } while (lastKey);
  process.stdout.write(`\r    scanned ${tableName}: ${items.length} item(s)            \n`);
  return items;
}

async function batchWrite(tableName, items) {
  let written = 0;
  for (let i = 0; i < items.length; i += 25) {
    const chunk = items.slice(i, i + 25);
    let requestItems = { [tableName]: chunk.map((Item) => ({ PutRequest: { Item } })) };
    for (let attempt = 0; attempt < 5 && requestItems[tableName]?.length; attempt++) {
      if (attempt > 0) await new Promise((r) => setTimeout(r, 500 * attempt));
      const resp = await dynamo.send(new BatchWriteItemCommand({ RequestItems: requestItems }));
      requestItems = resp.UnprocessedItems ?? {};
    }
    written += chunk.length;
    process.stdout.write(`\r    writing ${tableName}: ${written}/${items.length}...`);
  }
  if (items.length) process.stdout.write(`\r    wrote ${tableName}: ${written}/${items.length}            \n`);
}

async function main() {
  console.log('='.repeat(70));
  console.log(`Source suffix : ${SRC_SUFFIX}`);
  console.log(`Dest suffix   : ${DEST_SUFFIX}`);
  console.log(`Mode          : ${DRY_RUN ? '\u{1F50D} DRY RUN (no changes — pass --execute to apply)' : '\u{1F680} EXECUTE'}`);
  if (ONLY) console.log(`Models        : ${[...ONLY].join(', ')}`);
  console.log('='.repeat(70));
  console.log();

  const summary = [];

  for (const model of MODELS) {
    if (ONLY && !ONLY.has(model)) continue;
    const srcTable = `${model}-${SRC_SUFFIX}`;
    const destTable = `${model}-${DEST_SUFFIX}`;
    console.log(`${model}: ${srcTable} -> ${destTable}`);

    const items = await scanAll(srcTable);
    summary.push({ model, count: items.length });

    if (DRY_RUN) {
      console.log(`    would write ${items.length} item(s) to ${destTable}`);
      continue;
    }

    if (items.length) await batchWrite(destTable, items);
  }

  console.log();
  console.log('Summary:');
  for (const { model, count } of summary) console.log(`  ${model.padEnd(15)} ${count}`);
}

main().catch((err) => {
  console.error('\nFATAL:', err.stack || err.message || err);
  process.exit(1);
});
