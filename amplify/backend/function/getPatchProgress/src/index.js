'use strict';
const https = require('https');
const { SignatureV4 } = require('@aws-sdk/signature-v4');
const { Sha256 } = require('@aws-crypto/sha256-js');
const { HttpRequest } = require('@aws-sdk/protocol-http');
const { defaultProvider } = require('@aws-sdk/credential-provider-node');
const { Seasons } = require('astronomy-engine');

// Timezone for interpreting "local day" of a hike.
const HIKES_TZ = process.env.HIKES_TZ || 'America/New_York';

/** ---- Timezone helpers & astronomical winter ---- */
function getOffsetMinutesAt(utcMs, tz) {
  const s = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset' })
    .format(new Date(utcMs));
  const m = s.match(/([+-]\d{2})(?::?(\d{2}))?/);
  if (!m) return 0;
  const hh = parseInt(m[1], 10);
  const mm = m[2] ? parseInt(m[2], 10) : 0;
  return hh * 60 + Math.sign(hh) * mm;
}
function localToUtcInstant(y, m /*0..11*/, d, hh = 0, mm = 0, tz = HIKES_TZ) {
  let guess = Date.UTC(y, m, d, hh, mm);
  for (let i = 0; i < 2; i++) {
    const offMin = getOffsetMinutesAt(guess, tz);
    guess = Date.UTC(y, m, d, hh, mm) - offMin * 60_000;
  }
  return new Date(guess);
}
function getLocalYmdAt(dateLike, tz = HIKES_TZ) {
  const d = typeof dateLike === 'string' || typeof dateLike === 'number' ? new Date(dateLike) : dateLike;
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(d);
  const obj = Object.fromEntries(parts.map(p => [p.type, p.value]));
  return { y: parseInt(obj.year, 10), m: parseInt(obj.month, 10) - 1, d: parseInt(obj.day, 10) };
}
function localDayBoundsToUtc(dateLike, tz = HIKES_TZ) {
  const { y, m, d } = getLocalYmdAt(dateLike, tz);
  const startUtc = localToUtcInstant(y, m, d, 0, 0, tz);
  const endUtc = localToUtcInstant(y, m, d, 23, 59, tz);
  endUtc.setSeconds(59, 999);
  return { startUtc, endUtc };
}
function isAstronomicalWinterLocalDay(dateLike, tz = HIKES_TZ) {
  const { y, m } = getLocalYmdAt(dateLike, tz);
  const seasonsPrev = Seasons(y - 1);
  const seasonsY    = Seasons(y);
  const seasonsNext = Seasons(y + 1);
  const winterA = { start: seasonsPrev.dec_solstice.date, end: seasonsY.mar_equinox.date };
  const winterB = { start: seasonsY.dec_solstice.date,   end: seasonsNext.mar_equinox.date };
  const { startUtc: dayStart, endUtc: dayEnd } = localDayBoundsToUtc(dateLike, tz);
  const overlaps = (a1, a2, b1, b2) => a1 < b2 && b1 <= a2;
  if (m === 0 || m === 1) return overlaps(dayStart, dayEnd, winterA.start, winterA.end);
  if (m === 11)           return overlaps(dayStart, dayEnd, winterB.start, winterB.end);
  return overlaps(dayStart, dayEnd, winterA.start, winterA.end) ||
         overlaps(dayStart, dayEnd, winterB.start, winterB.end);
}
function toNumOrNull(v) {
  if (v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** ---- AppSync helpers ---- */
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

// --- GraphQL operations (added trails) ---
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
const GQL_patchTrailsByPatch = `
  query PatchTrailsByPatch($patchId: ID!, $limit: Int, $nextToken: String) {
    patchTrailsByPatch(patchPatchTrailsId: $patchId, limit: $limit, nextToken: $nextToken) {
      items {
        id
        trailPatchTrailsId
        requiredMiles
        trail { id lengthMiles }
      }
      nextToken
    }
  }
`;
const GQL_userMountainsByUser = `
  query UserMountainsByUser($userID: ID!, $limit: Int, $nextToken: String) {
    userMountainsByUser(userID: $userID, limit: $limit, nextToken: $nextToken) {
      items { id mountainID dateClimbed }
      nextToken
    }
  }
`;
const GQL_userTrailsByUser = `
  query UserTrailsByUser($userID: ID!, $limit: Int, $nextToken: String) {
    userTrailsByUser(userID: $userID, limit: $limit, nextToken: $nextToken) {
      items { userID trailID dateCompleted milesRemaining }
      nextToken
    }
  }
`;

async function graphQL(query, variables, { forceIAM = false } = {}) {
  const endpoint = getAppSyncEndpoint();
  const url = new URL(endpoint);
  const region = process.env.AWS_REGION || process.env.REGION || 'us-east-1';
  const body = JSON.stringify({ query, variables });

  const apiKey = getAppSyncApiKey();
  if (apiKey && !forceIAM) {
    const res = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': apiKey }, body });
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
    body
  });
  const signer = new SignatureV4({ credentials: defaultProvider(), service: 'appsync', region, sha256: Sha256 });
  const signed = await signer.sign(request);

  const resBody = await new Promise((resolve, reject) => {
    const req = https.request(
      { hostname: url.hostname, method: 'POST', path: request.path, headers: signed.headers },
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
function normalizeRule(raw) {
  if (!raw) return { type: 'default', winterOnly: false };
  let obj = raw;
  if (typeof raw === 'string') { try { obj = JSON.parse(raw); } catch { return { type: 'default', winterOnly: false }; } }
  if (!obj || typeof obj !== 'object') return { type: 'default', winterOnly: false };

  const base = { type: 'default', winterOnly: !!obj.winterOnly };

  if (obj.type === 'excludeDelisted') return { ...base, type: 'excludeDelisted' };

  if (obj.type === 'anyN') {
    const n = Number(obj.n);
    return Number.isFinite(n) && n > 0 ? { ...base, type: 'anyN', n: Math.floor(n) } : base;
  }

  if (obj.type === 'trailMilesTarget') {
    const miles = Number(obj.miles);
    return Number.isFinite(miles) && miles > 0
      ? { ...base, type: 'trailMilesTarget', miles: Math.floor(miles) }
      : base;
  }

  return base;
}

/** ---- Fetchers (now include trails) ---- */
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
async function fetchAllPatchTrails(patchId) {
  const out = [];
  let nextToken = null;
  do {
    const data = await graphQL(GQL_patchTrailsByPatch, { patchId, limit: 200, nextToken });
    const conn = data.patchTrailsByPatch;
    if (conn?.items?.length) out.push(...conn.items);
    nextToken = conn?.nextToken ?? null;
  } while (nextToken);
  return out;
}
async function fetchAllUserMountains(userId) {
  const out = [];
  let nextToken = null;
  do {
    const data = await graphQL(GQL_userMountainsByUser, { userID: userId, limit: 200, nextToken }, { forceIAM: true });
    const conn = data.userMountainsByUser;
    if (conn?.items?.length) out.push(...conn.items);
    nextToken = conn?.nextToken ?? null;
  } while (nextToken);
  return out;
}
async function fetchAllUserTrails(userId) {
  const out = [];
  let nextToken = null;
  do {
    const data = await graphQL(GQL_userTrailsByUser, { userID: userId, limit: 200, nextToken }, { forceIAM: true });
    const conn = data.userTrailsByUser;
    if (conn?.items?.length) out.push(...conn.items);
    nextToken = conn?.nextToken ?? null;
  } while (nextToken);
  return out;
}

/** ---- Security ---- */
function ensureCallerIsUserOrAdmin(event, userId) {
  const sub = event.identity?.sub || event.identity?.username;
  const groups = event.identity?.groups || [];
  const isAdmin = groups.includes('Admin');
  if (!isAdmin && sub !== userId && event.identity?.username !== userId) {
    throw new Error("Not authorized to access another user's progress.");
  }
}

/** ---- Combined compute across mountains + trails ---- */
function computeCombinedPercent(rule, items, { isMountainDone, isTrailDone, isEligibleMountain }) {
  // items = array of { kind: 'm'|'t', id, delisted? }
  const completedAll = items.reduce((acc, it) => {
    if (it.kind === 'm') return acc + (isMountainDone(it.id) ? 1 : 0);
    return acc + (isTrailDone(it.id, it) ? 1 : 0);
  }, 0);

  if (rule.type === 'excludeDelisted') {
    // Eligible = non-delisted mountains + all trails
    const eligible = items.filter(it => it.kind === 't' || isEligibleMountain(it));
    const denom = eligible.length || 1;
    const percent = Math.floor((completedAll / denom) * 100);
    return { completed: completedAll, denom, percent, note: 'Delisted excluded from denominator' };
  }

  if (rule.type === 'anyN') {
    const denom = rule.n;
    const percent = Math.max(0, Math.min(100, Math.floor((completedAll / denom) * 100)));
    return { completed: Math.min(completedAll, denom), denom, percent, note: `Any ${denom}` };
  }

  const denom = items.length;
  const percent = denom === 0 ? 0 : Math.floor((completedAll / denom) * 100);
  return { completed: completedAll, denom, percent, note: undefined };
}

function milesDoneForTrail(ptRow /* { requiredMiles, trail? } */, ut /* { dateCompleted, milesRemaining } */) {
  if (!ptRow) return 0;

  const reqMiles = (ptRow.requiredMiles !== null && ptRow.requiredMiles !== undefined)
    ? toNumOrNull(ptRow.requiredMiles)
    : null;
  const lenMiles = (ptRow.trail && ptRow.trail.lengthMiles !== null && ptRow.trail.lengthMiles !== undefined)
    ? toNumOrNull(ptRow.trail.lengthMiles)
    : null;
  const req = (reqMiles !== null ? reqMiles : (lenMiles !== null ? lenMiles : null));
  // Optional debug

  if (req === null || req <= 0) return 0;
  if (!ut) return 0;

  if (ut.dateCompleted) {
    return Math.max(0, req);
  }

  if (ut.milesRemaining === null || ut.milesRemaining === undefined) return 0;

  const rem = Number(ut.milesRemaining);
  if (!Number.isFinite(rem)) return 0;
  const done = req - rem;
  return Math.max(0, Math.min(req, done));
}

function sumTrailMilesCompleted(items /* combined items array */, trailById /* Map */) {
  let sum = 0;
  for (const it of items) {
    if (it.kind !== 't') continue;
    const ut = trailById.get(it.id);
    sum += milesDoneForTrail(it, ut);
  }
  return sum;
}

function sumRequiredTrailMiles(items) {
  let total = 0;
  for (const it of items) {
    if (it.kind !== 't') continue;
    const reqMiles = toNumOrNull(it.requiredMiles);
    const lenMiles = it.trail && toNumOrNull(it.trail.lengthMiles);
    const req = reqMiles ?? lenMiles;
    if (req && req > 0) total += req;
  }
  return total;
}

/** ---- Per-patch progress ---- */
async function progressForPatch(patchId, userId) {
  const [patch, patchMountains, patchTrails, userMountains, userTrails] = await Promise.all([
    fetchPatch(patchId),
    fetchAllPatchMountains(patchId),
    fetchAllPatchTrails(patchId),
    fetchAllUserMountains(userId),
    fetchAllUserTrails(userId),
  ]);

  const rule = normalizeRule(patch?.completionRule);

  // Mountains: map mountainID -> [dates...]
  const ascentsByMountain = new Map();
  for (const u of userMountains) {
    const mid = u.mountainID;
    if (!mid) continue;
    if (!ascentsByMountain.has(mid)) ascentsByMountain.set(mid, []);
    ascentsByMountain.get(mid).push(u.dateClimbed || null);
  }
  // Trails: map trailID -> single record { dateCompleted, milesRemaining }
  const trailById = new Map();
  for (const ut of userTrails) {
    const tid = ut.trailID;
    if (!tid) continue;
    // one-to-one; last write wins (or first, doesn’t matter much here)
    trailById.set(tid, { dateCompleted: ut.dateCompleted || null, milesRemaining: ut.milesRemaining });
  }

  const hasAnyAscent = (mid) => ascentsByMountain.has(mid);
  const hasAstronomicalWinterAscent = (mid) => {
    const arr = ascentsByMountain.get(mid);
    if (!arr || arr.length === 0) return false;
    return arr.some(d => d && isAstronomicalWinterLocalDay(d, HIKES_TZ));
  };
  const isMountainDone = (mid) => (rule.winterOnly ? hasAstronomicalWinterAscent(mid) : hasAnyAscent(mid));

  const isTrailDone = (trailId /* string */, ptRow /* has requiredMiles */) => {
    const ut = trailById.get(trailId);
    if (!ut) return false;
    if (ut.dateCompleted) return true;
    if (ut.milesRemaining == null) return false;
    const rem = Number(ut.milesRemaining);
    return Number.isFinite(rem) && rem <= 0; // completed if 0 or negative
  };

  const isEligibleMountain = (it) => it.kind === 'm' && !it.delisted;

  // Combine items: mountains + trails
  const items = [
    ...patchMountains.map(r => ({ kind: 'm', id: r.mountainPatchMountainsId, delisted: !!r.delisted })),
    ...patchTrails.map(r => ({
      kind: 't',
      id: r.trailPatchTrailsId,
      requiredMiles: r.requiredMiles ?? null,
      trail: { lengthMiles: r.trail?.lengthMiles ?? null } // <-- NEW
    })),
  ].filter(x => !!x.id);

  if (rule.type === 'trailMilesTarget') {
    const totalDone = sumTrailMilesCompleted(items, trailById);
    const denom = Math.max(1, rule.miles); // avoid divide-by-zero
    const completed = Math.min(totalDone, denom);
    const percent = Math.floor((completed / denom) * 100);
    const winterNote = rule.winterOnly ? 'Winter-only (astronomical)' : undefined;
    return { patchId, userId, completed, denom, percent, note: winterNote ?? 'Trail miles target' };
  }

  const hasMountains = items.some(it => it.kind === 'm');
  const hasTrails = items.some(it => it.kind === 't');

  if (!hasMountains && hasTrails && rule.type === 'default') {
    const denom = Math.max(1, sumRequiredTrailMiles(items));  // total required miles
    const completed = Math.min(sumTrailMilesCompleted(items, trailById), denom);
    const percent = Math.floor((completed / denom) * 100);
    const winterNote = rule.winterOnly ? 'Winter-only (astronomical)' : undefined;
    return { patchId, userId, completed, denom, percent, note: winterNote ?? 'All trail miles' };
  }

  const { completed, denom, percent, note } =
    computeCombinedPercent(rule, items, { isMountainDone, isTrailDone, isEligibleMountain });

  const winterNote = rule.winterOnly
    ? (note ? `${note}; Winter-only (astronomical)` : 'Winter-only (astronomical)')
    : note;

  return { patchId, userId, completed, denom, percent, note: winterNote };
}

/** ---- Batch progress ---- */
async function batchProgress(patchIds, userId) {
  const [userMountains, userTrails] = await Promise.all([
    fetchAllUserMountains(userId),
    fetchAllUserTrails(userId),
  ]);

  // Prepare user maps once
  const ascentsByMountain = new Map();
  for (const u of userMountains) {
    const mid = u.mountainID;
    if (!mid) continue;
    if (!ascentsByMountain.has(mid)) ascentsByMountain.set(mid, []);
    ascentsByMountain.get(mid).push(u.dateClimbed || null);
  }
  const trailById = new Map();
  for (const ut of userTrails) {
    const tid = ut.trailID;
    if (!tid) continue;
    trailById.set(tid, { dateCompleted: ut.dateCompleted || null, milesRemaining: ut.milesRemaining });
  }

  const hasAnyAscent = (mid) => ascentsByMountain.has(mid);
  const hasAstronomicalWinterAscent = (mid) => {
    const arr = ascentsByMountain.get(mid);
    if (!arr || arr.length === 0) return false;
    return arr.some(d => d && isAstronomicalWinterLocalDay(d, HIKES_TZ));
  };

  const pool = 5;
  const chunks = [];
  for (let i = 0; i < patchIds.length; i += pool) chunks.push(patchIds.slice(i, i + pool));

  const results = [];
  for (const group of chunks) {
    const part = await Promise.all(
      group.map(async (patchId) => {
        const [patch, patchMountains, patchTrails] = await Promise.all([
          fetchPatch(patchId),
          fetchAllPatchMountains(patchId),
          fetchAllPatchTrails(patchId),
        ]);
        const rule = normalizeRule(patch?.completionRule);

        const isMountainDone = (mid) => (rule.winterOnly ? hasAstronomicalWinterAscent(mid) : hasAnyAscent(mid));
        const isTrailDone = (trailId) => {
          const ut = trailById.get(trailId);
          if (!ut) return false;
          if (ut.dateCompleted) return true;
          if (ut.milesRemaining == null) return false;
          const rem = Number(ut.milesRemaining);
          return Number.isFinite(rem) && rem <= 0;
        };
        const isEligibleMountain = (it) => it.kind === 'm' && !it.delisted;

        const items = [
          ...patchMountains.map(r => ({ kind: 'm', id: r.mountainPatchMountainsId, delisted: !!r.delisted })),
          ...patchTrails.map(r => ({
            kind: 't',
            id: r.trailPatchTrailsId,
            requiredMiles: r.requiredMiles ?? null,
            trail: { lengthMiles: r.trail?.lengthMiles ?? null } // <-- NEW
          })),
        ].filter(x => !!x.id);

        if (rule.type === 'trailMilesTarget') {
          const totalDone = sumTrailMilesCompleted(items, trailById);
          const denom = Math.max(1, rule.miles);
          const completed = Math.min(totalDone, denom);
          const percent = Math.floor((completed / denom) * 100);
          const winterNote = rule.winterOnly ? 'Winter-only (astronomical)' : undefined;
          return { patchId, userId, completed, denom, percent, note: winterNote ?? 'Trail miles target' };
        }

        const hasMountains = items.some(it => it.kind === 'm');
        const hasTrails = items.some(it => it.kind === 't');

        if (!hasMountains && hasTrails && rule.type === 'default') {
          const denom = Math.max(1, sumRequiredTrailMiles(items));  // total required miles
          const completed = Math.min(sumTrailMilesCompleted(items, trailById), denom);
          const percent = Math.floor((completed / denom) * 100);
          const winterNote = rule.winterOnly ? 'Winter-only (astronomical)' : undefined;
          return { patchId, userId, completed, denom, percent, note: winterNote ?? 'All trail miles' };
        }

        const { completed, denom, percent, note } =
          computeCombinedPercent(rule, items, { isMountainDone, isTrailDone, isEligibleMountain });
        const winterNote = rule.winterOnly
          ? (note ? `${note}; Winter-only (astronomical)` : 'Winter-only (astronomical)')
          : note;

        return { patchId, userId, completed, denom, percent, note: winterNote };
      })
    );
    results.push(...part);
  }
  return results;
}

/** ---- Handler ---- */
exports.handler = async (event) => {
  const args = event.arguments || {};
  if (!args.userId) throw new Error('userId is required.');
  ensureCallerIsUserOrAdmin(event, args.userId);

  if (args.patchId) return progressForPatch(args.patchId, args.userId);
  if (Array.isArray(args.patchIds)) return batchProgress(args.patchIds, args.userId);
  throw new Error('Provide either patchId or patchIds.');
};

