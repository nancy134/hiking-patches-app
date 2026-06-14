import type { AppSyncResolverHandler } from 'aws-lambda';

type RelatedPatchesArgs = {
  patchId: string;
  limit?: number | null;
};

interface RelatedPatch {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  regions: (string | null)[] | null;
  difficulty: string | null;
  hasPeaks: boolean | null;
  hasTrails: boolean | null;
  popularity: number | null;
  isPurchasable: boolean | null;
  matchScore: number;
}

const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 12;
const MOUNTAIN_WEIGHT = 3;
const TRAIL_WEIGHT = 3;
const REGION_WEIGHT = 1;

/** ---- GraphQL operations ---- */
const GQL_getPatch = `
  query GetPatch($id: ID!) {
    getPatch(id: $id) { id regions status }
  }
`;
const GQL_patchMountainsByPatch = `
  query PatchMountainsByPatch($patchId: ID!, $limit: Int, $nextToken: String) {
    patchMountainsByPatch(patchPatchMountainsId: $patchId, limit: $limit, nextToken: $nextToken) {
      items { mountainPatchMountainsId delisted }
      nextToken
    }
  }
`;
const GQL_patchTrailsByPatch = `
  query PatchTrailsByPatch($patchId: ID!, $limit: Int, $nextToken: String) {
    patchTrailsByPatch(patchPatchTrailsId: $patchId, limit: $limit, nextToken: $nextToken) {
      items { trailPatchTrailsId }
      nextToken
    }
  }
`;
const GQL_patchMountainsByMountain = `
  query PatchMountainsByMountain($mountainId: ID!, $limit: Int, $nextToken: String) {
    patchMountainsByMountain(mountainPatchMountainsId: $mountainId, limit: $limit, nextToken: $nextToken) {
      items { patchPatchMountainsId delisted }
      nextToken
    }
  }
`;
const GQL_patchTrailsByTrail = `
  query PatchTrailsByTrail($trailId: ID!, $limit: Int, $nextToken: String) {
    patchTrailsByTrail(trailPatchTrailsId: $trailId, limit: $limit, nextToken: $nextToken) {
      items { patchPatchTrailsId }
      nextToken
    }
  }
`;
const GQL_listPatches = `
  query ListPatches($limit: Int, $nextToken: String) {
    listPatches(limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        imageUrl
        regions
        difficulty
        hasPeaks
        hasTrails
        popularity
        isPurchasable
        status
      }
      nextToken
    }
  }
`;

/** ---- AppSync access (apiKey only — all reads here are public) ---- */
async function graphQL<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const endpoint = process.env.APPSYNC_URL!;
  const apiKey = process.env.APPSYNC_API_KEY!;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': apiKey },
    body: JSON.stringify({ query, variables }),
  });
  const json = (await res.json()) as { data: T; errors?: unknown[] };
  if (!res.ok || json.errors) throw new Error(`AppSync error: ${JSON.stringify(json.errors ?? json)}`);
  return json.data;
}

/** ---- Pagination helper ---- */
async function fetchAllPages<TItem>(query: string, variables: Record<string, unknown>, fieldName: string): Promise<TItem[]> {
  type Connection = { items: TItem[] | null; nextToken?: string | null } | null;
  const out: TItem[] = [];
  let nextToken: string | null = null;
  do {
    const data: Record<string, Connection> = await graphQL<Record<string, Connection>>(query, {
      ...variables,
      limit: 200,
      nextToken,
    });
    const conn: Connection = data[fieldName];
    if (conn?.items?.length) out.push(...conn.items);
    nextToken = conn?.nextToken ?? null;
  } while (nextToken);
  return out;
}

/** ---- Data shapes ---- */
interface PatchMountainRow {
  mountainPatchMountainsId: string | null;
  delisted: boolean | null;
}
interface PatchTrailRow {
  trailPatchTrailsId: string | null;
}
interface SiblingPatchMountainRow {
  patchPatchMountainsId: string | null;
  delisted: boolean | null;
}
interface SiblingPatchTrailRow {
  patchPatchTrailsId: string | null;
}
interface PatchListItem {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  regions: (string | null)[] | null;
  difficulty: string | null;
  hasPeaks: boolean | null;
  hasTrails: boolean | null;
  popularity: number | null;
  isPurchasable: boolean | null;
  status: string | null;
}

function isExcludedStatus(status: string | null | undefined): boolean {
  return status === 'ARCHIVED' || status === 'DRAFT';
}

/** ---- Handler ---- */
export const handler: AppSyncResolverHandler<RelatedPatchesArgs, RelatedPatch[]> = async (event) => {
  const { patchId } = event.arguments;
  const limit = Math.max(1, Math.min(MAX_LIMIT, event.arguments.limit ?? DEFAULT_LIMIT));

  const [target, patchMountains, patchTrails, allPatches] = await Promise.all([
    graphQL<{ getPatch: { id: string; regions: (string | null)[] | null; status: string | null } | null }>(GQL_getPatch, { id: patchId }),
    fetchAllPages<PatchMountainRow>(GQL_patchMountainsByPatch, { patchId }, 'patchMountainsByPatch'),
    fetchAllPages<PatchTrailRow>(GQL_patchTrailsByPatch, { patchId }, 'patchTrailsByPatch'),
    fetchAllPages<PatchListItem>(GQL_listPatches, {}, 'listPatches'),
  ]);

  const targetRegions = new Set((target.getPatch?.regions ?? []).filter((r): r is string => !!r));

  const mountainIds = patchMountains
    .filter((row) => !row.delisted && row.mountainPatchMountainsId)
    .map((row) => row.mountainPatchMountainsId as string);

  const trailIds = patchTrails
    .filter((row) => row.trailPatchTrailsId)
    .map((row) => row.trailPatchTrailsId as string);

  const sharedMountains = new Map<string, number>();
  const sharedTrails = new Map<string, number>();

  await Promise.all([
    ...mountainIds.map(async (mountainId) => {
      const rows = await fetchAllPages<SiblingPatchMountainRow>(GQL_patchMountainsByMountain, { mountainId }, 'patchMountainsByMountain');
      for (const row of rows) {
        const otherId = row.patchPatchMountainsId;
        if (!otherId || otherId === patchId || row.delisted) continue;
        sharedMountains.set(otherId, (sharedMountains.get(otherId) ?? 0) + 1);
      }
    }),
    ...trailIds.map(async (trailId) => {
      const rows = await fetchAllPages<SiblingPatchTrailRow>(GQL_patchTrailsByTrail, { trailId }, 'patchTrailsByTrail');
      for (const row of rows) {
        const otherId = row.patchPatchTrailsId;
        if (!otherId || otherId === patchId) continue;
        sharedTrails.set(otherId, (sharedTrails.get(otherId) ?? 0) + 1);
      }
    }),
  ]);

  const scored = allPatches
    .filter((p) => p.id !== patchId && !isExcludedStatus(p.status))
    .map((p) => {
      const regions = (p.regions ?? []).filter((r): r is string => !!r);
      const sharedRegionCount = regions.filter((r) => targetRegions.has(r)).length;
      const score =
        MOUNTAIN_WEIGHT * (sharedMountains.get(p.id) ?? 0) +
        TRAIL_WEIGHT * (sharedTrails.get(p.id) ?? 0) +
        REGION_WEIGHT * sharedRegionCount;
      return { patch: p, score };
    });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (b.patch.popularity ?? -1) - (a.patch.popularity ?? -1);
  });

  return scored.slice(0, limit).map(({ patch, score }) => ({
    id: patch.id,
    name: patch.name,
    description: patch.description,
    imageUrl: patch.imageUrl,
    regions: patch.regions,
    difficulty: patch.difficulty,
    hasPeaks: patch.hasPeaks,
    hasTrails: patch.hasTrails,
    popularity: patch.popularity,
    isPurchasable: patch.isPurchasable,
    matchScore: score,
  }));
};
