import * as https from 'https';
import type { AppSyncResolverHandler, AppSyncIdentityCognito } from 'aws-lambda';
import { Seasons } from 'astronomy-engine';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { Sha256 } from '@aws-crypto/sha256-js';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { defaultProvider } from '@aws-sdk/credential-provider-node';

const HIKES_TZ = process.env.HIKES_TZ || 'America/New_York';

type PatchProgressArgs = {
  patchId?: string;
  patchIds?: string[];
  userId: string;
};

interface PatchProgress {
  patchId: string;
  userId: string;
  completed: number;
  denom: number;
  percent: number;
  note?: string;
}

/** ---- Timezone helpers & astronomical winter ---- */
function getOffsetMinutesAt(utcMs: number, tz: string): number {
  const s = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset' }).format(new Date(utcMs));
  const m = s.match(/([+-]\d{2})(?::?(\d{2}))?/);
  if (!m) return 0;
  const hh = parseInt(m[1], 10);
  const mm = m[2] ? parseInt(m[2], 10) : 0;
  return hh * 60 + Math.sign(hh) * mm;
}

function localToUtcInstant(y: number, m: number, d: number, hh = 0, mm = 0, tz = HIKES_TZ): Date {
  let guess = Date.UTC(y, m, d, hh, mm);
  for (let i = 0; i < 2; i++) {
    const offMin = getOffsetMinutesAt(guess, tz);
    guess = Date.UTC(y, m, d, hh, mm) - offMin * 60_000;
  }
  return new Date(guess);
}

function getLocalYmdAt(dateLike: string | number | Date, tz = HIKES_TZ): { y: number; m: number; d: number } {
  const d = typeof dateLike === 'string' || typeof dateLike === 'number' ? new Date(dateLike) : dateLike;
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(d);
  const obj = Object.fromEntries(parts.map((p) => [p.type, p.value])) as Record<string, string>;
  return { y: parseInt(obj.year, 10), m: parseInt(obj.month, 10) - 1, d: parseInt(obj.day, 10) };
}

function localDayBoundsToUtc(dateLike: string | number | Date, tz = HIKES_TZ): { startUtc: Date; endUtc: Date } {
  const { y, m, d } = getLocalYmdAt(dateLike, tz);
  const startUtc = localToUtcInstant(y, m, d, 0, 0, tz);
  const endUtc = localToUtcInstant(y, m, d, 23, 59, tz);
  endUtc.setSeconds(59, 999);
  return { startUtc, endUtc };
}

function isAstronomicalWinterLocalDay(dateLike: string | number | Date, tz = HIKES_TZ): boolean {
  const { y, m } = getLocalYmdAt(dateLike, tz);
  const seasonsPrev = Seasons(y - 1);
  const seasonsY = Seasons(y);
  const seasonsNext = Seasons(y + 1);
  const winterA = { start: seasonsPrev.dec_solstice.date, end: seasonsY.mar_equinox.date };
  const winterB = { start: seasonsY.dec_solstice.date, end: seasonsNext.mar_equinox.date };
  const { startUtc: dayStart, endUtc: dayEnd } = localDayBoundsToUtc(dateLike, tz);
  const overlaps = (a1: Date, a2: Date, b1: Date, b2: Date) => a1 < b2 && b1 <= a2;
  if (m === 0 || m === 1) return overlaps(dayStart, dayEnd, winterA.start, winterA.end);
  if (m === 11) return overlaps(dayStart, dayEnd, winterB.start, winterB.end);
  return overlaps(dayStart, dayEnd, winterA.start, winterA.end) || overlaps(dayStart, dayEnd, winterB.start, winterB.end);
}

function toNumOrNull(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** ---- GraphQL operations ---- */
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

/** ---- AppSync access (apiKey for public reads, IAM for owner-restricted reads) ---- */
async function graphQL<T>(query: string, variables: Record<string, unknown>, opts: { forceIAM?: boolean } = {}): Promise<T> {
  const endpoint = process.env.APPSYNC_URL!;
  const url = new URL(endpoint);
  const region = process.env.AWS_REGION || 'us-east-1';
  const body = JSON.stringify({ query, variables });

  const apiKey = process.env.APPSYNC_API_KEY;
  if (apiKey && !opts.forceIAM) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': apiKey },
      body,
    });
    const json = (await res.json()) as { data: T; errors?: unknown[] };
    if (!res.ok || json.errors) throw new Error(`AppSync(APIKEY) error: ${JSON.stringify(json.errors ?? json)}`);
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
      { hostname: url.hostname, method: 'POST', path: request.path, headers: signed.headers as Record<string, string> },
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

  const json = JSON.parse(resBody) as { data: T; errors?: unknown[] };
  if (json.errors) throw new Error(`AppSync(IAM) error: ${JSON.stringify(json.errors)}`);
  return json.data;
}

/** ---- Completion rule ---- */
interface CompletionRule {
  type: 'default' | 'excludeDelisted' | 'anyN' | 'trailMilesTarget';
  winterOnly: boolean;
  n?: number;
  miles?: number;
}

function normalizeRule(raw: unknown): CompletionRule {
  if (!raw) return { type: 'default', winterOnly: false };
  let obj: unknown = raw;
  if (typeof raw === 'string') {
    try {
      obj = JSON.parse(raw);
    } catch {
      return { type: 'default', winterOnly: false };
    }
  }
  if (!obj || typeof obj !== 'object') return { type: 'default', winterOnly: false };
  const o = obj as Record<string, unknown>;

  const base: CompletionRule = { type: 'default', winterOnly: !!o.winterOnly };

  if (o.type === 'excludeDelisted') return { ...base, type: 'excludeDelisted' };

  if (o.type === 'anyN') {
    const n = Number(o.n);
    return Number.isFinite(n) && n > 0 ? { ...base, type: 'anyN', n: Math.floor(n) } : base;
  }

  if (o.type === 'trailMilesTarget') {
    const miles = Number(o.miles);
    return Number.isFinite(miles) && miles > 0 ? { ...base, type: 'trailMilesTarget', miles: Math.floor(miles) } : base;
  }

  return base;
}

/** ---- Data shapes ---- */
interface PatchMountainItem {
  id: string;
  mountainPatchMountainsId: string | null;
  delisted: boolean | null;
}
interface PatchTrailItem {
  id: string;
  trailPatchTrailsId: string | null;
  requiredMiles: number | null;
  trail: { id: string; lengthMiles: number | null } | null;
}
interface UserMountainItem {
  id: string;
  mountainID: string;
  dateClimbed: string | null;
}
interface UserTrailItem {
  userID: string;
  trailID: string;
  dateCompleted: string | null;
  milesRemaining: number | null;
}
interface CombinedItem {
  kind: 'm' | 't';
  id: string;
  delisted?: boolean;
  requiredMiles?: number | null;
  trail?: { lengthMiles: number | null };
}

/** ---- Fetchers ---- */
async function fetchPatch(patchId: string): Promise<{ id?: string; completionRule?: unknown }> {
  const data = await graphQL<{ getPatch: { id: string; completionRule: unknown } | null }>(GQL_getPatch, { id: patchId });
  return data.getPatch ?? {};
}
async function fetchAllPatchMountains(patchId: string): Promise<PatchMountainItem[]> {
  const out: PatchMountainItem[] = [];
  let nextToken: string | null = null;
  do {
    const data: { patchMountainsByPatch: { items: PatchMountainItem[]; nextToken?: string | null } } = await graphQL(
      GQL_patchMountainsByPatch,
      { patchId, limit: 200, nextToken }
    );
    const conn = data.patchMountainsByPatch;
    if (conn?.items?.length) out.push(...conn.items);
    nextToken = conn?.nextToken ?? null;
  } while (nextToken);
  return out;
}
async function fetchAllPatchTrails(patchId: string): Promise<PatchTrailItem[]> {
  const out: PatchTrailItem[] = [];
  let nextToken: string | null = null;
  do {
    const data: { patchTrailsByPatch: { items: PatchTrailItem[]; nextToken?: string | null } } = await graphQL(
      GQL_patchTrailsByPatch,
      { patchId, limit: 200, nextToken }
    );
    const conn = data.patchTrailsByPatch;
    if (conn?.items?.length) out.push(...conn.items);
    nextToken = conn?.nextToken ?? null;
  } while (nextToken);
  return out;
}
async function fetchAllUserMountains(userId: string): Promise<UserMountainItem[]> {
  const out: UserMountainItem[] = [];
  let nextToken: string | null = null;
  do {
    const data: { userMountainsByUser: { items: UserMountainItem[]; nextToken?: string | null } } = await graphQL(
      GQL_userMountainsByUser,
      { userID: userId, limit: 200, nextToken },
      { forceIAM: true }
    );
    const conn = data.userMountainsByUser;
    if (conn?.items?.length) out.push(...conn.items);
    nextToken = conn?.nextToken ?? null;
  } while (nextToken);
  return out;
}
async function fetchAllUserTrails(userId: string): Promise<UserTrailItem[]> {
  const out: UserTrailItem[] = [];
  let nextToken: string | null = null;
  do {
    const data: { userTrailsByUser: { items: UserTrailItem[]; nextToken?: string | null } } = await graphQL(
      GQL_userTrailsByUser,
      { userID: userId, limit: 200, nextToken },
      { forceIAM: true }
    );
    const conn = data.userTrailsByUser;
    if (conn?.items?.length) out.push(...conn.items);
    nextToken = conn?.nextToken ?? null;
  } while (nextToken);
  return out;
}

/** ---- Security ---- */
function ensureCallerIsUserOrAdmin(identity: AppSyncIdentityCognito | null | undefined, userId: string) {
  const sub = identity?.sub || identity?.username;
  const groups = identity?.groups || [];
  const isAdmin = groups.includes('Admin');
  if (!isAdmin && sub !== userId && identity?.username !== userId) {
    throw new Error("Not authorized to access another user's progress.");
  }
}

/** ---- Combined compute across mountains + trails ---- */
function computeCombinedPercent(
  rule: CompletionRule,
  items: CombinedItem[],
  helpers: {
    isMountainDone: (id: string) => boolean;
    isTrailDone: (id: string, item: CombinedItem) => boolean;
    isEligibleMountain: (item: CombinedItem) => boolean;
  }
): { completed: number; denom: number; percent: number; note?: string } {
  const { isMountainDone, isTrailDone, isEligibleMountain } = helpers;

  const completedAll = items.reduce((acc, it) => {
    if (it.kind === 'm') return acc + (isMountainDone(it.id) ? 1 : 0);
    return acc + (isTrailDone(it.id, it) ? 1 : 0);
  }, 0);

  if (rule.type === 'excludeDelisted') {
    const eligible = items.filter((it) => it.kind === 't' || isEligibleMountain(it));
    const denom = eligible.length || 1;
    const percent = Math.floor((completedAll / denom) * 100);
    return { completed: completedAll, denom, percent, note: 'Delisted excluded from denominator' };
  }

  if (rule.type === 'anyN') {
    const denom = rule.n!;
    const percent = Math.max(0, Math.min(100, Math.floor((completedAll / denom) * 100)));
    return { completed: Math.min(completedAll, denom), denom, percent, note: `Any ${denom}` };
  }

  const denom = items.length;
  const percent = denom === 0 ? 0 : Math.floor((completedAll / denom) * 100);
  return { completed: completedAll, denom, percent, note: undefined };
}

function milesDoneForTrail(ptRow: CombinedItem | undefined, ut: { dateCompleted: string | null; milesRemaining: number | null } | undefined): number {
  if (!ptRow) return 0;

  const reqMiles = ptRow.requiredMiles !== null && ptRow.requiredMiles !== undefined ? toNumOrNull(ptRow.requiredMiles) : null;
  const lenMiles = ptRow.trail && ptRow.trail.lengthMiles !== null && ptRow.trail.lengthMiles !== undefined ? toNumOrNull(ptRow.trail.lengthMiles) : null;
  const req = reqMiles !== null ? reqMiles : lenMiles !== null ? lenMiles : null;

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

function sumTrailMilesCompleted(items: CombinedItem[], trailById: Map<string, { dateCompleted: string | null; milesRemaining: number | null }>): number {
  let sum = 0;
  for (const it of items) {
    if (it.kind !== 't') continue;
    const ut = trailById.get(it.id);
    sum += milesDoneForTrail(it, ut);
  }
  return sum;
}

function sumRequiredTrailMiles(items: CombinedItem[]): number {
  let total = 0;
  for (const it of items) {
    if (it.kind !== 't') continue;
    const reqMiles = toNumOrNull(it.requiredMiles);
    const lenMiles = it.trail ? toNumOrNull(it.trail.lengthMiles) : null;
    const req = reqMiles ?? lenMiles;
    if (req && req > 0) total += req;
  }
  return total;
}

/** ---- Per-patch progress ---- */
async function progressForPatch(patchId: string, userId: string): Promise<PatchProgress> {
  const [patch, patchMountains, patchTrails, userMountains, userTrails] = await Promise.all([
    fetchPatch(patchId),
    fetchAllPatchMountains(patchId),
    fetchAllPatchTrails(patchId),
    fetchAllUserMountains(userId),
    fetchAllUserTrails(userId),
  ]);

  const rule = normalizeRule(patch?.completionRule);

  const ascentsByMountain = new Map<string, (string | null)[]>();
  for (const u of userMountains) {
    const mid = u.mountainID;
    if (!mid) continue;
    if (!ascentsByMountain.has(mid)) ascentsByMountain.set(mid, []);
    ascentsByMountain.get(mid)!.push(u.dateClimbed || null);
  }
  const trailById = new Map<string, { dateCompleted: string | null; milesRemaining: number | null }>();
  for (const ut of userTrails) {
    const tid = ut.trailID;
    if (!tid) continue;
    trailById.set(tid, { dateCompleted: ut.dateCompleted || null, milesRemaining: ut.milesRemaining });
  }

  const hasAnyAscent = (mid: string) => ascentsByMountain.has(mid);
  const hasAstronomicalWinterAscent = (mid: string) => {
    const arr = ascentsByMountain.get(mid);
    if (!arr || arr.length === 0) return false;
    return arr.some((d) => d && isAstronomicalWinterLocalDay(d, HIKES_TZ));
  };
  const isMountainDone = (mid: string) => (rule.winterOnly ? hasAstronomicalWinterAscent(mid) : hasAnyAscent(mid));

  const isTrailDone = (trailId: string) => {
    const ut = trailById.get(trailId);
    if (!ut) return false;
    if (ut.dateCompleted) return true;
    if (ut.milesRemaining == null) return false;
    const rem = Number(ut.milesRemaining);
    return Number.isFinite(rem) && rem <= 0;
  };

  const isEligibleMountain = (it: CombinedItem) => it.kind === 'm' && !it.delisted;

  const items: CombinedItem[] = [
    ...patchMountains.map((r) => ({ kind: 'm' as const, id: r.mountainPatchMountainsId ?? '', delisted: !!r.delisted })),
    ...patchTrails.map((r) => ({
      kind: 't' as const,
      id: r.trailPatchTrailsId ?? '',
      requiredMiles: r.requiredMiles ?? null,
      trail: { lengthMiles: r.trail?.lengthMiles ?? null },
    })),
  ].filter((x) => !!x.id);

  if (rule.type === 'trailMilesTarget') {
    const totalDone = sumTrailMilesCompleted(items, trailById);
    const denom = Math.max(1, rule.miles!);
    const completed = Math.min(totalDone, denom);
    const percent = Math.floor((completed / denom) * 100);
    const winterNote = rule.winterOnly ? 'Winter-only (astronomical)' : undefined;
    return { patchId, userId, completed, denom, percent, note: winterNote ?? 'Trail miles target' };
  }

  const hasMountains = items.some((it) => it.kind === 'm');
  const hasTrails = items.some((it) => it.kind === 't');

  if (!hasMountains && hasTrails && rule.type === 'default') {
    const denom = Math.max(1, sumRequiredTrailMiles(items));
    const completed = Math.min(sumTrailMilesCompleted(items, trailById), denom);
    const percent = Math.floor((completed / denom) * 100);
    const winterNote = rule.winterOnly ? 'Winter-only (astronomical)' : undefined;
    return { patchId, userId, completed, denom, percent, note: winterNote ?? 'All trail miles' };
  }

  const { completed, denom, percent, note } = computeCombinedPercent(rule, items, { isMountainDone, isTrailDone, isEligibleMountain });

  const winterNote = rule.winterOnly ? (note ? `${note}; Winter-only (astronomical)` : 'Winter-only (astronomical)') : note;

  return { patchId, userId, completed, denom, percent, note: winterNote };
}

/** ---- Batch progress ---- */
async function batchProgress(patchIds: string[], userId: string): Promise<PatchProgress[]> {
  const [userMountains, userTrails] = await Promise.all([fetchAllUserMountains(userId), fetchAllUserTrails(userId)]);

  const ascentsByMountain = new Map<string, (string | null)[]>();
  for (const u of userMountains) {
    const mid = u.mountainID;
    if (!mid) continue;
    if (!ascentsByMountain.has(mid)) ascentsByMountain.set(mid, []);
    ascentsByMountain.get(mid)!.push(u.dateClimbed || null);
  }
  const trailById = new Map<string, { dateCompleted: string | null; milesRemaining: number | null }>();
  for (const ut of userTrails) {
    const tid = ut.trailID;
    if (!tid) continue;
    trailById.set(tid, { dateCompleted: ut.dateCompleted || null, milesRemaining: ut.milesRemaining });
  }

  const hasAnyAscent = (mid: string) => ascentsByMountain.has(mid);
  const hasAstronomicalWinterAscent = (mid: string) => {
    const arr = ascentsByMountain.get(mid);
    if (!arr || arr.length === 0) return false;
    return arr.some((d) => d && isAstronomicalWinterLocalDay(d, HIKES_TZ));
  };

  const pool = 5;
  const chunks: string[][] = [];
  for (let i = 0; i < patchIds.length; i += pool) chunks.push(patchIds.slice(i, i + pool));

  const results: PatchProgress[] = [];
  for (const group of chunks) {
    const part = await Promise.all(
      group.map(async (patchId): Promise<PatchProgress> => {
        const [patch, patchMountains, patchTrails] = await Promise.all([
          fetchPatch(patchId),
          fetchAllPatchMountains(patchId),
          fetchAllPatchTrails(patchId),
        ]);
        const rule = normalizeRule(patch?.completionRule);

        const isMountainDone = (mid: string) => (rule.winterOnly ? hasAstronomicalWinterAscent(mid) : hasAnyAscent(mid));
        const isTrailDone = (trailId: string) => {
          const ut = trailById.get(trailId);
          if (!ut) return false;
          if (ut.dateCompleted) return true;
          if (ut.milesRemaining == null) return false;
          const rem = Number(ut.milesRemaining);
          return Number.isFinite(rem) && rem <= 0;
        };
        const isEligibleMountain = (it: CombinedItem) => it.kind === 'm' && !it.delisted;

        const items: CombinedItem[] = [
          ...patchMountains.map((r) => ({ kind: 'm' as const, id: r.mountainPatchMountainsId ?? '', delisted: !!r.delisted })),
          ...patchTrails.map((r) => ({
            kind: 't' as const,
            id: r.trailPatchTrailsId ?? '',
            requiredMiles: r.requiredMiles ?? null,
            trail: { lengthMiles: r.trail?.lengthMiles ?? null },
          })),
        ].filter((x) => !!x.id);

        if (rule.type === 'trailMilesTarget') {
          const totalDone = sumTrailMilesCompleted(items, trailById);
          const denom = Math.max(1, rule.miles!);
          const completed = Math.min(totalDone, denom);
          const percent = Math.floor((completed / denom) * 100);
          const winterNote = rule.winterOnly ? 'Winter-only (astronomical)' : undefined;
          return { patchId, userId, completed, denom, percent, note: winterNote ?? 'Trail miles target' };
        }

        const hasMountains = items.some((it) => it.kind === 'm');
        const hasTrails = items.some((it) => it.kind === 't');

        if (!hasMountains && hasTrails && rule.type === 'default') {
          const denom = Math.max(1, sumRequiredTrailMiles(items));
          const completed = Math.min(sumTrailMilesCompleted(items, trailById), denom);
          const percent = Math.floor((completed / denom) * 100);
          const winterNote = rule.winterOnly ? 'Winter-only (astronomical)' : undefined;
          return { patchId, userId, completed, denom, percent, note: winterNote ?? 'All trail miles' };
        }

        const { completed, denom, percent, note } = computeCombinedPercent(rule, items, { isMountainDone, isTrailDone, isEligibleMountain });
        const winterNote = rule.winterOnly ? (note ? `${note}; Winter-only (astronomical)` : 'Winter-only (astronomical)') : note;

        return { patchId, userId, completed, denom, percent, note: winterNote };
      })
    );
    results.push(...part);
  }
  return results;
}

/** ---- Handler ---- */
export const handler: AppSyncResolverHandler<PatchProgressArgs, PatchProgress | PatchProgress[]> = async (event) => {
  const args = event.arguments;
  if (!args.userId) throw new Error('userId is required.');
  ensureCallerIsUserOrAdmin(event.identity as AppSyncIdentityCognito | null | undefined, args.userId);

  if (args.patchId) return progressForPatch(args.patchId, args.userId);
  if (Array.isArray(args.patchIds)) return batchProgress(args.patchIds, args.userId);
  throw new Error('Provide either patchId or patchIds.');
};
