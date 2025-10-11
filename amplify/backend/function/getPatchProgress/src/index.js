'use strict';
const https = require('https');
const { SignatureV4 } = require('@aws-sdk/signature-v4');
const { Sha256 } = require('@aws-crypto/sha256-js');
const { HttpRequest } = require('@aws-sdk/protocol-http');
const { defaultProvider } = require('@aws-sdk/credential-provider-node');
const { Seasons } = require('astronomy-engine');

// Timezone for interpreting "local day" of a hike.
// Override in Lambda env if needed (e.g., "America/New_York").
const HIKES_TZ = process.env.HIKES_TZ || 'America/New_York';

/** Parse the timezone offset (minutes) for a given UTC instant in a target tz. */
function getOffsetMinutesAt(utcMs, tz) {
  // Ask Intl for the short offset, e.g. "-05:00" or "GMT-05:00"
  const s = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    timeZoneName: 'shortOffset',
  }).format(new Date(utcMs));
  // Extract something like -05:00 / +09 / GMT+01:00
  const m = s.match(/([+-]\d{2})(?::?(\d{2}))?/);
  if (!m) return 0;
  const hh = parseInt(m[1], 10);
  const mm = m[2] ? parseInt(m[2], 10) : 0;
  return hh * 60 + Math.sign(hh) * mm;
}

/**
 * Convert a *local* wall time in tz to the corresponding UTC instant.
 * Two-iteration fixed-point handles DST transitions near the boundary.
 */
function localToUtcInstant(y, m /*0..11*/, d, hh = 0, mm = 0, tz = HIKES_TZ) {
  let guess = Date.UTC(y, m, d, hh, mm);
  for (let i = 0; i < 2; i++) {
    const offMin = getOffsetMinutesAt(guess, tz);
    guess = Date.UTC(y, m, d, hh, mm) - offMin * 60_000;
  }
  return new Date(guess);
}

/** Get local Y/M/D numbers for a given instant in a tz. */
function getLocalYmdAt(dateLike, tz = HIKES_TZ) {
  const d = typeof dateLike === 'string' || typeof dateLike === 'number' ? new Date(dateLike) : dateLike;
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(d);
  const obj = Object.fromEntries(parts.map(p => [p.type, p.value]));
  return { y: parseInt(obj.year, 10), m: parseInt(obj.month, 10) - 1, d: parseInt(obj.day, 10) };
}

/** UTC start/end bounds for the *local* calendar day that contains dateLike in tz. */
function localDayBoundsToUtc(dateLike, tz = HIKES_TZ) {
  const { y, m, d } = getLocalYmdAt(dateLike, tz);
  const startUtc = localToUtcInstant(y, m, d, 0, 0, tz);
  // Use 23:59:59.999 as end-of-day; conversion remains safe across DST shifts.
  const endUtc = localToUtcInstant(y, m, d, 23, 59, tz);
  endUtc.setSeconds(59, 999);
  return { startUtc, endUtc };
}

/** Astronomical winter (Northern Hemisphere): Dec solstice → Mar equinox. */
function isAstronomicalWinterLocalDay(dateLike, tz = HIKES_TZ) {
  const { y, m } = getLocalYmdAt(dateLike, tz);
  // Seasons() returns UTC instants for solstices/equinoxes in a given year.
  const seasonsPrev = Seasons(y - 1);
  const seasonsY    = Seasons(y);
  const seasonsNext = Seasons(y + 1);

  // There are two relevant winter intervals that could touch a given local day:
  // A) Dec solstice of (y-1) → Mar equinox of (y)
  // B) Dec solstice of (y)   → Mar equinox of (y+1)  (relevant for dates in Dec)
  const winterA = { start: seasonsPrev.dec_solstice.date, end: seasonsY.mar_equinox.date };
  const winterB = { start: seasonsY.dec_solstice.date,   end: seasonsNext.mar_equinox.date };

  const { startUtc: dayStart, endUtc: dayEnd } = localDayBoundsToUtc(dateLike, tz);

  const overlaps = (a1, a2, b1, b2) => a1 < b2 && b1 <= a2;

  // Quick branch: months Jan/Feb => interval A is sufficient; Dec => interval B; Mar can straddle => check both.
  if (m === 0 || m === 1) {
    return overlaps(dayStart, dayEnd, winterA.start, winterA.end);
  } else if (m === 11) {
    return overlaps(dayStart, dayEnd, winterB.start, winterB.end);
  }

  // Shoulder days around March equinox still checked safely here.
  return overlaps(dayStart, dayEnd, winterA.start, winterA.end) ||
         overlaps(dayStart, dayEnd, winterB.start, winterB.end);
}

function getLocalMonthAt(dateLike, tz) {
  const d = typeof dateLike === 'string' ? new Date(dateLike) : dateLike;
  // month comes back as 1..12; convert to 0..11
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, month: 'numeric' })
    .formatToParts(d);
  const m = Number(parts.find(p => p.type === 'month').value);
  return m - 1;
}

// Meteorological winter: Dec/Jan/Feb in the given timezone
function isWinterLocal(dateLike, tz = HIKES_TZ) {
  const m = getLocalMonthAt(dateLike, tz);
  return m === 11 || m === 0 || m === 1; // Dec, Jan, Feb
}

// If you later want astronomical precision (solstice->equinox), replace isWinterLocal()
// with a function that checks the local day overlap vs UTC solstice/equinox moments.

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
      items { id mountainID dateClimbed }
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
  if (!raw) return { type: 'default', winterOnly: false };
  let obj = raw;
  if (typeof raw === 'string') {
    try { obj = JSON.parse(raw); } catch { return { type: 'default', winterOnly: false }; }
  }
  if (!obj || typeof obj !== 'object') return { type: 'default', winterOnly: false };

  const base = { type: 'default', winterOnly: !!obj.winterOnly };

  if (obj.type === 'excludeDelisted') return { ...base, type: 'excludeDelisted' };
  if (obj.type === 'anyN') {
    const n = Number(obj.n);
    return Number.isFinite(n) && n > 0 ? { ...base, type: 'anyN', n: Math.floor(n) } : base;
  }
  return base;
}


function computePercent(rule, rows, countsFn) {
  const items = rows.filter(r => r.mountainPatchMountainsId);

  const completedAll = items.reduce(
    (acc, r) => acc + (r.mountainPatchMountainsId && countsFn(r.mountainPatchMountainsId, r) ? 1 : 0),
    0
  );

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

  // mountainID -> array of dateClimbed (ISO string or epoch ms)
  const ascentsByMountain = new Map();
  for (const u of userMountains) {
    const mid = u.mountainID;
    if (!mid) continue;
    if (!ascentsByMountain.has(mid)) ascentsByMountain.set(mid, []);
    ascentsByMountain.get(mid).push(u.dateClimbed || null);
  }

  // Counts any ascent:
  const hasAscent = (mid, ascentsByMountain) => ascentsByMountain.has(mid);

  // Counts only ascents whose *local hiking day* overlaps astronomical winter:
  const hasAstronomicalWinterAscent = (mid, ascentsByMountain) => {
    const arr = ascentsByMountain.get(mid);
    if (!arr || arr.length === 0) return false;
    return arr.some(d => d && isAstronomicalWinterLocalDay(d, HIKES_TZ));
  };

  const countsFn = rule.winterOnly
    ? (mid) => hasAstronomicalWinterAscent(mid, ascentsByMountain)
    : (mid) => hasAscent(mid, ascentsByMountain);

  const { completed, denom, percent, note } =
    computePercent(rule, patchMountains, countsFn);

  const winterNote = rule.winterOnly ? (note ? `${note}; Winter-only (astronomical)` : 'Winter-only (astronomical)') : note;

  return { patchId, userId, completed, denom, percent, note: winterNote };
}


async function batchProgress(patchIds, userId) {
  const userMountains = await fetchAllUserMountains(userId);

  const ascentsByMountain = new Map();
  for (const u of userMountains) {
    const mid = u.mountainID;
    if (!mid) continue;
    if (!ascentsByMountain.has(mid)) ascentsByMountain.set(mid, []);
    ascentsByMountain.get(mid).push(u.dateClimbed || null);
  }

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

        const countsFn = rule.winterOnly
          ? (mid) => hasAstronomicalWinterAscent(mid, ascentsByMountain)
          : (mid) => hasAscent(mid, ascentsByMountain);

        const { completed, denom, percent, note } = computePercent(rule, patchMountains, countsFn);
        const winterNote = rule.winterOnly ? (note ? `${note}; Winter-only (astronomical)` : 'Winter-only (astronomical)') : note;
        return { patchId, userId, completed, denom, percent, note: winterNote };
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

