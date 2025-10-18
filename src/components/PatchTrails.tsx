'use client';

import { useEffect, useMemo, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import type { GraphQLResult } from '@aws-amplify/api';

import { listPatchTrailsWithTrail } from '@/graphql/custom-queries';
import { createUserTrailMinimal, updateUserTrailMinimal, deleteUserTrailMinimal } from '@/graphql/custom-mutations';
import { listUserTrails } from '@/graphql/queries';

import type {
  Trail,
  PatchTrail,
  ListPatchTrailsWithTrailQuery,
  ListUserTrailsQuery,
  UserTrail,
} from '@/API';

import TrailProgressModal from '@/components/TrailProgressModal';

const client = generateClient();

type Item = NonNullable<NonNullable<ListPatchTrailsWithTrailQuery['listPatchTrails']>['items']>[number];
type ItemNN = NonNullable<Item>;
type ItemWithTrail = ItemNN & { trail: NonNullable<ItemNN['trail']> };

type UserTrailMap = Record<string, UserTrail | undefined>; // one per trailID

function Spinner({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2" role="status" aria-live="polite">
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
      {label ? <span className="text-sm text-gray-600">{label}</span> : null}
    </span>
  );
}

export default function PatchTrails({
  patchId,
  userId,
  onProgressShouldRefresh,
}: {
  patchId: string;
  userId?: string;
  onProgressShouldRefresh?: () => void; // NEW: ask parent to refresh lambda progress
}) {
  const [rows, setRows] = useState<ItemWithTrail[]>([]);
  const [loadingPatch, setLoadingPatch] = useState(true);

  const [userMap, setUserMap] = useState<UserTrailMap>({});
  const [loadingUser, setLoadingUser] = useState(!!userId);

  const [modalRow, setModalRow] = useState<ItemWithTrail | null>(null);

  // fetch patch trails
  useEffect(() => {
    (async () => {
      setLoadingPatch(true);
      try {
        const all: Item[] = [];
        let nextToken: string | null | undefined = null;
        do {
          const r = (await client.graphql({
            query: listPatchTrailsWithTrail,
            variables: { filter: { patchPatchTrailsId: { eq: patchId } }, limit: 100, nextToken },
          })) as GraphQLResult<ListPatchTrailsWithTrailQuery>;

          const page = r.data?.listPatchTrails;
          if (page?.items?.length) all.push(...page.items);

          nextToken = page?.nextToken ?? null;
        } while (nextToken);

        const nn = all.filter((x): x is ItemNN => !!x);
        const wt = nn.filter((x): x is ItemWithTrail => !!x.trail);
        const sorted = wt.sort((a, b) => (b.trail.lengthMiles ?? 0) - (a.trail.lengthMiles ?? 0));
        setRows(sorted);
      } finally {
        setLoadingPatch(false);
      }
    })();
  }, [patchId]);

  // fetch user trails
  useEffect(() => {
    (async () => {
      if (!userId) { setUserMap({}); setLoadingUser(false); return; }
      setLoadingUser(true);
      try {
        const r = (await client.graphql({
          query: listUserTrails,
          variables: { userID: userId }, // if your query is filter-based, adjust to { filter: { userID: { eq: userId } } }
          authMode: 'userPool',
        })) as { data: ListUserTrailsQuery };

        const map: UserTrailMap = {};
        // Depending on codegen, this might be connection or custom query; map accordingly.
        // If listUserTrails is a connection with `filter`, then:
        (r.data as any)?.listUserTrails?.items?.forEach((ut: UserTrail | null) => {
          if (ut?.trailID) map[ut.trailID] = ut;
        });
        // If you generated a queryField `userTrailsByUser`, swap above to use that shape.

        setUserMap(map);
      } finally {
        setLoadingUser(false);
      }
    })();
  }, [userId]);

  const [q, setQ] = useState('');
  const visible = useMemo(() => {
    const qn = q.trim().toLowerCase();
    if (!qn) return rows;
    return rows.filter(r => (r.trail.name ?? '').toLowerCase().includes(qn));
  }, [rows, q]);

  async function saveTrailProgress(
    row: ItemWithTrail,
    payload: { dateCompleted: string | null; milesRemaining: number | null; notes?: string | null }
  ) {
    if (!userId) return;

    const trailID = row.trail.id;
    const existing = userMap[trailID];

    // Build field fragments, OMITTING nulls
    const fields: Record<string, any> = { userID: userId, trailID };
    if (payload.dateCompleted) fields.dateCompleted = payload.dateCompleted;      // <-- only if provided
    if (payload.milesRemaining != null) fields.milesRemaining = Number(payload.milesRemaining); // <-- only if provided
    if (payload.notes != null && payload.notes !== '') fields.notes = payload.notes;

    // If we are switching from "completed" to "partial", we must REMOVE the dateCompleted attribute.
    const clearingDateCompleted = !!existing?.dateCompleted && !payload.dateCompleted;

    try {
      if (!existing) {
        // CREATE (no nulls)
        await client.graphql({
          query: createUserTrailMinimal,
          variables: { input: fields },
          authMode: 'userPool',
        });
      } else if (clearingDateCompleted) {
        // DELETE then RECREATE without dateCompleted so the GSI entry is removed correctly
        await client.graphql({
          query: deleteUserTrailMinimal,
          variables: { input: { userID: existing.userID!, trailID: existing.trailID! } },
          authMode: 'userPool',
        });
        await client.graphql({
          query: createUserTrailMinimal,
          variables: { input: fields }, // this has no dateCompleted
          authMode: 'userPool',
        });
      } else {
        // Plain UPDATE, but still omitting any nulls
        await client.graphql({
          query: updateUserTrailMinimal,
          variables: { input: fields },
          authMode: 'userPool',
        });
      }
    } finally {
      // refresh user map
      try {
        const r = (await client.graphql({
          query: listUserTrails,
          variables: { userID: userId }, // or filter shape if that’s your query
          authMode: 'userPool',
        })) as { data: ListUserTrailsQuery };

        const map: UserTrailMap = {};
        (r.data as any)?.listUserTrails?.items?.forEach((ut: UserTrail | null) => {
          if (ut?.trailID) map[ut.trailID] = ut;
        });
        setUserMap(map);
      } finally {
        setModalRow(null);
        onProgressShouldRefresh?.();
      }
    }
  }

  return (
    <div aria-busy={loadingPatch ? 'true' : 'false'}>
      {loadingPatch && <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent animate-[pulse_1.2s_ease-in-out_infinite]" />}

      <h2 className="text-xl font-semibold mb-2">Trails in Patch</h2>

      <div className="flex items-center justify-between mb-1">
        {/* Parent shows overall progress; keep only the user syncing indicator */}
        {loadingUser && !loadingPatch && <Spinner label="Syncing your trail progress…" />}
      </div>
      <div className="flex gap-2 items-center mb-3">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by trail name…"
          className="w-full sm:w-64 border rounded px-3 py-1.5 text-sm disabled:opacity-50"
          disabled={loadingPatch}
        />
      </div>

      <div className="mb-2 text-xs text-gray-500" aria-live="polite">
        {loadingPatch ? (
          <span className="inline-flex items-center gap-2">
            <Spinner />
            Loading trails…
          </span>
        ) : (
          <>Showing {visible.length} of {rows.length}</>
        )}
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 w-10 text-right">#</th>
            <th className="text-left p-2">Trail</th>
            <th className="text-left p-2">Length (mi)</th>
            <th className="text-left p-2">Your Status</th>
            {userId && <th className="text-left p-2">Action</th>}
          </tr>
        </thead>
        <tbody>
          {visible.map((pt, idx) => {
            const t = pt.trail!;
            const ut = userMap[t.id];
            const done = !!ut?.dateCompleted || (ut?.milesRemaining != null && ut.milesRemaining <= 0);
            const status = done
              ? (ut?.dateCompleted ? `Completed on ${ut.dateCompleted}` : 'Completed')
              : (ut?.milesRemaining != null ? `${ut.milesRemaining} mi remaining` : 'Not started');

            return (
              <tr key={t.id} className="border-t">
                <td className="p-2 text-gray-500 w-10 text-right">{idx + 1}</td>
                <td className="p-2">{t.name}</td>
                <td className="p-2">{t.lengthMiles ?? '—'}</td>
                <td className="p-2">{status}</td>
                {userId && (
                  <td className="p-2">
                    <button
                      onClick={() => setModalRow(pt)}
                      className="text-blue-600 hover:underline text-sm disabled:opacity-50"
                      disabled={loadingUser}
                    >
                      {ut ? 'Update' : 'Log Progress'}
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      <TrailProgressModal
        open={!!modalRow}
        trailName={modalRow?.trail?.name ?? ''}
        requiredMiles={modalRow?.requiredMiles ?? null}
        existing={modalRow ? userMap[modalRow.trail.id] : null}
        onClose={() => setModalRow(null)}
        onSave={(data) => {
          if (!modalRow) return;
          saveTrailProgress(modalRow, data);
        }}
      />
    </div>
  );
}

