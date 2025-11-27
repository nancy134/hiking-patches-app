'use client';

import { useEffect, useMemo, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import type { GraphQLResult } from '@aws-amplify/api';

import { listPatchTrailsWithTrail } from '@/graphql/custom-queries';
import { createUserTrailMinimal, updateUserTrailMinimal, deleteUserTrailMinimal } from '@/graphql/custom-mutations';
import { listUserTrails } from '@/graphql/queries';
import Link from 'next/link';
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

/** Always show miles with two decimals */
function fmtMiles(n: number | null | undefined) {
  if (n == null || !Number.isFinite(Number(n))) return '—';
  return Number(n).toFixed(2);
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
        (r.data as any)?.listUserTrails?.items?.forEach((ut: UserTrail | null) => {
          if (ut?.trailID) map[ut.trailID] = ut;
        });

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

    const fields: Record<string, any> = { userID: userId, trailID };
    if (payload.dateCompleted) fields.dateCompleted = payload.dateCompleted;
    if (payload.milesRemaining != null) fields.milesRemaining = Number(payload.milesRemaining);
    if (payload.notes != null && payload.notes !== '') fields.notes = payload.notes;

    const clearingDateCompleted = !!existing?.dateCompleted && !payload.dateCompleted;

    try {
      if (!existing) {
        await client.graphql({
          query: createUserTrailMinimal,
          variables: { input: fields },
          authMode: 'userPool',
        });
      } else if (clearingDateCompleted) {
        await client.graphql({
          query: deleteUserTrailMinimal,
          variables: { input: { userID: existing.userID!, trailID: existing.trailID! } },
          authMode: 'userPool',
        });
        await client.graphql({
          query: createUserTrailMinimal,
          variables: { input: fields },
          authMode: 'userPool',
        });
      } else {
        await client.graphql({
          query: updateUserTrailMinimal,
          variables: { input: fields },
          authMode: 'userPool',
        });
      }
    } finally {
      try {
        const r = (await client.graphql({
          query: listUserTrails,
          variables: { userID: userId },
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

      {/* wrap table to handle squish on small screens */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 w-10 text-right">#</th>
              <th className="text-left p-2">Trail name</th>
              <th className="text-left p-2">Length (mi)</th>
              <th className="text-left p-2">Miles completed</th>
              <th className="text-left p-2">Miles remaining</th>
              <th className="text-left p-2">Date completed</th>
              {userId && <th className="text-left p-2">Action</th>}
            </tr>
          </thead>
          <tbody>
            {visible.map((pt, idx) => {
              const t = pt.trail!;
              const ut = userMap[t.id];

              const lengthMi = t.lengthMiles != null && Number.isFinite(Number(t.lengthMiles))
                ? Number(t.lengthMiles)
                : null;

              const requiredFromPatch = pt.requiredMiles != null && Number.isFinite(Number(pt.requiredMiles))
                ? Number(pt.requiredMiles)
                : null;

              // ✅ required defaults to requiredMiles, falling back to lengthMiles
              const required = requiredFromPatch != null
                ? requiredFromPatch
                : (lengthMi != null ? lengthMi : null);

              let milesRemaining: number | null = null;
              let milesCompleted: number | null = null;
              let dateCompleted: string | null = ut?.dateCompleted ?? null;

              // If the user has a numeric milesRemaining, compute from required
              if (ut && ut.milesRemaining != null && Number.isFinite(Number(ut.milesRemaining))) {
                milesRemaining = Number(ut.milesRemaining);

                if (required != null) {
                  const done = Math.max(0, Math.min(required, required - milesRemaining));
                  milesCompleted = done;
                } else {
                  milesCompleted = null; // no required or length to compute against
                }
              }

              // If they marked completed, give full credit against required (or length fallback)
              if (ut?.dateCompleted) {
                if (required != null) {
                  milesCompleted = required;
                  milesRemaining = 0;
                } else if (lengthMi != null) {
                  milesCompleted = lengthMi;
                  milesRemaining = 0;
                }
              }

              return (
                <tr key={t.id} className="border-t">
                  <td className="p-2 text-gray-500 w-10 text-right">{idx + 1}</td>
                  <td className="p-2">
                    <Link
                      href={`/trail/${t.id}?patchId=${patchId}`}
                      className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-sm"
                    >
                      {t.name}
                    </Link>
                  </td>
                  <td className="p-2">{fmtMiles(lengthMi)}</td>
                  <td className="p-2">{fmtMiles(milesCompleted)}</td>
                  <td className="p-2">{fmtMiles(milesRemaining)}</td>
                  <td className="p-2">{dateCompleted ?? '—'}</td>
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
      </div>

      <TrailProgressModal
        open={!!modalRow}
        trailName={modalRow?.trail?.name ?? ''}
        requiredMiles={modalRow?.requiredMiles ?? null}
        trailLengthMiles={modalRow?.trail?.lengthMiles ?? null}
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

