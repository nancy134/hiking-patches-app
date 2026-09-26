#!/usr/bin/env node
/**
 * Import reference-link URLs onto Patch and Trail records from the enriched
 * CSVs at the repo root.
 *
 * Reads current records via AppSync (API key — public read, same as the
 * backfill-userpatch script). Writes via DynamoDB UpdateItem, because the
 * schema only grants write access to the Admin Cognito group and an API key
 * cannot mutate.
 *
 * Usage — from this directory after `npm install`; prefer the run-*.sh wrappers:
 *
 *   ./run-dev.sh                  # dry run against the sandbox
 *   ./run-dev.sh --execute        # apply
 *
 * Flags:
 *   --execute            Actually write. Without it, nothing is modified.
 *   --match=id|name      How to pair a CSV row with a record. Default "id".
 *                        "name" (case-insensitive) exists because the CSVs were
 *                        exported from prod and prod ids do not exist in the
 *                        sandbox — it is a smoke-test aid, not an import path.
 *   --overwrite          Replace existing non-empty values. Default is to leave
 *                        them alone and report the conflict.
 *   --only=patches|trails  Import just one of the two.
 *
 * Required env vars (see run-*.sh):
 *   APPSYNC_URL, API_KEY, PATCH_TABLE, TRAIL_TABLE, TARGET_ENV
 *
 * AWS credentials come from the normal chain (AWS_PROFILE etc). The principal
 * needs dynamodb:UpdateItem on the two tables.
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const https = require('https');
const { DynamoDBClient, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');

// ── Config ────────────────────────────────────────────────────────────────────

const APPSYNC_URL = process.env.APPSYNC_URL;
const API_KEY     = process.env.API_KEY;
const PATCH_TABLE = process.env.PATCH_TABLE;
const TRAIL_TABLE = process.env.TRAIL_TABLE;
const TARGET_ENV  = process.env.TARGET_ENV;
const REGION      = process.env.AWS_REGION || 'us-east-1';

const argv      = process.argv.slice(2);
const DRY_RUN   = !argv.includes('--execute');
const OVERWRITE = argv.includes('--overwrite');
const MATCH_BY  = (argv.find((a) => a.startsWith('--match=')) || '--match=id').split('=')[1];
const ONLY      = (argv.find((a) => a.startsWith('--only=')) || '--only=').split('=')[1];

if (!APPSYNC_URL || !API_KEY || !PATCH_TABLE || !TRAIL_TABLE || !TARGET_ENV) {
  console.error('ERROR: APPSYNC_URL, API_KEY, PATCH_TABLE, TRAIL_TABLE and TARGET_ENV are required.');
  console.error('Use one of the run-*.sh wrappers rather than calling node directly.');
  process.exit(1);
}
if (!['id', 'name'].includes(MATCH_BY)) {
  console.error(`ERROR: --match must be "id" or "name" (got "${MATCH_BY}").`);
  process.exit(1);
}

const REPO_ROOT  = path.resolve(__dirname, '..', '..');
const PATCH_CSV  = path.join(REPO_ROOT, 'patch-links-enriched.csv');
const TRAIL_CSV  = path.join(REPO_ROOT, 'trail-links-enriched.csv');

// CSV column → model field.
const PATCH_FIELDS = {
  'Website URL':   'websiteUrl',
  'Facebook URL':  'facebookUrl',
  'AllTrails URL': 'alltrailsUrl',
  'Purchase URL':  'purchaseUrl',
  'Form URL':      'formUrl',
};
const TRAIL_FIELDS = {
  'TrailLink URL': 'trailLinkUrl',
  'AllTrails URL': 'alltrailsUrl',
};

const dynamo = new DynamoDBClient({ region: REGION });

// ── CSV ───────────────────────────────────────────────────────────────────────

// RFC 4180 parser. The exported "How to get this Patch" / "Description" columns
// contain embedded newlines, commas and doubled quotes, so a split(',') will
// silently corrupt rows — hence parsing properly rather than pulling in a dep.
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // strip BOM
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\r') { /* handled by \n */ }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  if (!rows.length) return [];
  const header = rows.shift().map((h) => h.trim());
  return rows
    .filter((r) => r.some((v) => v.trim() !== ''))
    .map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? '').trim()])));
}

// ── URL validation ────────────────────────────────────────────────────────────

// A bare "www.example.com" in an href is a *relative* link — the patch page
// would navigate to /patch/www.example.com. Normalise what we safely can and
// reject the rest rather than importing a broken link.
function normaliseUrl(raw) {
  const v = (raw || '').trim();
  if (!v) return { ok: false, skip: true };
  if (/^https?:\/\//i.test(v)) return { ok: true, value: v };
  if (/^www\./i.test(v))       return { ok: true, value: `https://${v}`, coerced: true };
  return { ok: false, reason: `not an absolute URL: "${v}"` };
}

// ── AppSync (API key, read-only) ──────────────────────────────────────────────

function gql(query, variables = {}) {
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
        res.on('data', (d) => (data += d));
        res.on('end', () => {
          let parsed;
          try { parsed = JSON.parse(data); }
          catch { return reject(new Error(`Bad JSON from AppSync (HTTP ${res.statusCode}): ${data.slice(0, 200)}`)); }
          if (parsed.errors) return reject(new Error(`AppSync: ${JSON.stringify(parsed.errors)}`));
          resolve(parsed.data);
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function listAll(op, fields) {
  const query = `query($t:String){ ${op}(limit:1000, nextToken:$t){ items{ ${fields} } nextToken } }`;
  const items = [];
  let nextToken = null;
  do {
    const data = await gql(query, { t: nextToken });
    items.push(...data[op].items);
    nextToken = data[op].nextToken;
  } while (nextToken);
  return items;
}

// ── Import ────────────────────────────────────────────────────────────────────

async function importEntity({ label, csvPath, table, listOp, fieldMap, idCol, nameCol }) {
  const fields  = ['id', 'name', ...Object.values(fieldMap)].join(' ');
  const records = await listAll(listOp, fields);

  const byId   = new Map(records.map((r) => [r.id, r]));
  const byName = new Map();
  for (const r of records) {
    const k = (r.name || '').trim().toLowerCase();
    if (!byName.has(k)) byName.set(k, r);
    else byName.set(k, null); // ambiguous name — refuse to guess
  }

  const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
  const stats = { rows: rows.length, unmatched: 0, ambiguous: 0, noop: 0, invalid: 0, conflicts: 0, updated: 0, failed: 0 };
  const plan = [];

  for (const row of rows) {
    const id   = (row[idCol] || '').trim();
    const name = (row[nameCol] || '').trim();

    let rec;
    if (MATCH_BY === 'id') rec = byId.get(id);
    else {
      const hit = byName.get(name.toLowerCase());
      if (hit === null) { stats.ambiguous++; console.log(`  ⚠️  ambiguous name, skipped: "${name}"`); continue; }
      rec = hit;
    }
    if (!rec) { stats.unmatched++; continue; }

    const sets = {};
    for (const [col, field] of Object.entries(fieldMap)) {
      const res = normaliseUrl(row[col]);
      if (res.skip) continue;
      if (!res.ok) { stats.invalid++; console.log(`  ⚠️  ${name}: ${field} ${res.reason}`); continue; }

      const current = (rec[field] || '').trim();
      if (current === res.value) continue;                       // already correct
      if (current && !OVERWRITE) {
        stats.conflicts++;
        console.log(`  ⏭️  ${name}: ${field} already set to "${current}", CSV has "${res.value}" (use --overwrite)`);
        continue;
      }
      sets[field] = res.value;
      if (res.coerced) console.log(`  🔧 ${name}: ${field} coerced to "${res.value}"`);
    }

    if (!Object.keys(sets).length) { stats.noop++; continue; }
    plan.push({ id: rec.id, name: rec.name, sets });
  }

  console.log(`\n${label}: ${plan.length} record(s) to update`);
  for (const p of plan) {
    console.log(`  • ${p.name}`);
    for (const [f, v] of Object.entries(p.sets)) console.log(`      ${f} = ${v}`);
  }

  if (!DRY_RUN) {
    for (const p of plan) {
      const names  = {};
      const values = {};
      const sets   = [];
      Object.entries(p.sets).forEach(([f, v], i) => {
        names[`#f${i}`] = f;
        values[`:v${i}`] = { S: v };
        sets.push(`#f${i} = :v${i}`);
      });
      names['#u'] = 'updatedAt';
      values[':u'] = { S: new Date().toISOString() };
      sets.push('#u = :u');

      try {
        await dynamo.send(new UpdateItemCommand({
          TableName: table,
          Key: { id: { S: p.id } },
          UpdateExpression: `SET ${sets.join(', ')}`,
          ExpressionAttributeNames: names,
          ExpressionAttributeValues: values,
          ConditionExpression: 'attribute_exists(id)', // never create a record
        }));
        stats.updated++;
      } catch (err) {
        stats.failed++;
        console.error(`  ❌ ${p.name}: ${err.name} — ${err.message}`);
      }
    }
  }

  stats.planned = plan.length;
  return stats;
}

// ── Main ──────────────────────────────────────────────────────────────────────

(async () => {
  console.log('='.repeat(64));
  console.log(`Target env  : ${TARGET_ENV}`);
  console.log(`Patch table : ${PATCH_TABLE}`);
  console.log(`Trail table : ${TRAIL_TABLE}`);
  console.log(`Match by    : ${MATCH_BY}`);
  console.log(`Overwrite   : ${OVERWRITE ? 'YES — existing values will be replaced' : 'no (conflicts reported and skipped)'}`);
  console.log(`Mode        : ${DRY_RUN ? '🔍 DRY RUN  (no changes — pass --execute to apply)' : '🚀 EXECUTE'}`);
  console.log('='.repeat(64));

  const results = {};
  if (ONLY !== 'trails') {
    results.patches = await importEntity({
      label: 'Patches', csvPath: PATCH_CSV, table: PATCH_TABLE, listOp: 'listPatches',
      fieldMap: PATCH_FIELDS, idCol: 'Patch Id', nameCol: 'Patch Name',
    });
  }
  if (ONLY !== 'patches') {
    results.trails = await importEntity({
      label: 'Trails', csvPath: TRAIL_CSV, table: TRAIL_TABLE, listOp: 'listTrails',
      fieldMap: TRAIL_FIELDS, idCol: 'Trail Id', nameCol: 'Trail Name',
    });
  }

  console.log(`\n${'='.repeat(64)}\nSummary (${TARGET_ENV}, ${DRY_RUN ? 'dry run' : 'executed'})`);
  for (const [k, s] of Object.entries(results)) {
    console.log(`\n  ${k}:`);
    console.log(`    csv rows              : ${s.rows}`);
    console.log(`    no matching record    : ${s.unmatched}`);
    if (s.ambiguous) console.log(`    ambiguous name       : ${s.ambiguous}`);
    console.log(`    already up to date    : ${s.noop}`);
    console.log(`    invalid url skipped   : ${s.invalid}`);
    console.log(`    conflicts skipped     : ${s.conflicts}`);
    console.log(`    ${DRY_RUN ? 'would update          ' : 'updated               '}: ${DRY_RUN ? s.planned : s.updated}`);
    if (s.failed) console.log(`    FAILED                : ${s.failed}`);
  }
  console.log('='.repeat(64));

  const anyFailed = Object.values(results).some((s) => s.failed > 0);
  process.exit(anyFailed ? 1 : 0);
})().catch((err) => {
  console.error('\nFATAL:', err.message);
  process.exit(1);
});
