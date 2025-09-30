'use client';

import { useMemo, useEffect, useState } from 'react';
import { listUserMountains } from '@/graphql/queries';
import { ListPatchMountainsQuery, ListUserMountainsQuery, PatchMountain, UserMountain } from '@/API';
import { listPatchMountainsWithMountain } from '@/graphql/custom-queries';
import MountainAscentModal from '@/components/MountainAscentModal';
import { generateClient } from 'aws-amplify/api';
import { deleteUserMountainMinimal, createUserMountainMinimal } from '@/graphql/custom-mutations';
import { GraphQLResult } from '@aws-amplify/api';
import { ListPatchMountainsQueryVariables } from '@/API';
import { ListPatchMountainsWithMountainQuery as LPWQuery } from '@/API';

const client = generateClient();

type UserMountainMap = Record<string, UserMountain[] | undefined>;

interface PatchMountainProps {
  patchId: string;
  userId?: string;
}

/** --- Little UI helpers --- */
function Spinner({ label }: { label?: string }) {
  return (
    <div className="inline-flex items-center gap-2" role="status" aria-live="polite">
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
      {label ? <span className="text-sm text-gray-600">{label}</span> : null}
    </div>
  );
}

function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <tbody className="animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-t">
          <td className="p-2 w-10 text-right">
            <div className="h-4 w-6 bg-gray-200 rounded" />
          </td>
          <td className="p-2">
            <div className="h-4 w-44 bg-gray-200 rounded" />
          </td>
          <td className="p-2">
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </td>
          <td className="p-2">
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </td>
          <td className="p-2">
            <div className="h-4 w-40 bg-gray-200 rounded" />
          </td>
          <td className="p-2">
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </td>
        </tr>
      ))}
    </tbody>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="ml-2 inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
      {children}
    </span>
  );
}

export default function PatchMountains({ patchId, userId }: PatchMountainProps) {
  // Derive the item type returned by *your* query (which can include nulls)
  type Query = LPWQuery;
  type Item = NonNullable<NonNullable<Query['listPatchMountains']>['items']>[number];
  // Non-null item
  type ItemNN = NonNullable<Item>;
  // Non-null item with a non-null mountain
  type ItemWithMountain = ItemNN & { mountain: NonNullable<ItemNN['mountain']> };

  // State should match what you render (you use `pm.mountain!`), not the model type
  const [patchMountains, setPatchMountains] = useState<ItemWithMountain[]>([]);
  const [userMountainMap, setUserMountainMap] = useState<UserMountainMap>({});
  const [modalMountain, setModalMountain] = useState<ItemWithMountain | null>(null);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<'all' | 'done' | 'todo'>('all');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'elev'>('elev');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // NEW: loading flags
  const [loadingPatch, setLoadingPatch] = useState<boolean>(true);
  const [loadingUser, setLoadingUser] = useState<boolean>(!!userId);

  // Optional (but nice): error state (shown inline if it happens)
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async (pageSize = 100) => {
      setLoadingPatch(true);
      setError(null);
      try {
        const all: Item[] = [];
        let token: string | undefined;

        while (true) {
          const variables: ListPatchMountainsQueryVariables = {
            filter: { patchPatchMountainsId: { eq: patchId } },
            limit: pageSize,
            ...(token ? { nextToken: token } : {}),
          };

          const r = (await client.graphql<Query>({
            query: listPatchMountainsWithMountain,
            variables,
          })) as GraphQLResult<Query>;

          const conn = r.data?.listPatchMountains;
          if (conn?.items?.length) {
            // items can contain `null`, keep the type accurate
            all.push(...(conn.items as Item[]));
          }

          token = conn?.nextToken ?? undefined;
          if (!token) break;
        }

        // 1) remove null items
        const nonNull: ItemNN[] = all.filter((pm): pm is ItemNN => pm !== null);

        // 2) keep only rows that have a mountain
        const withMountain: ItemWithMountain[] = nonNull.filter(
          (pm): pm is ItemWithMountain => pm.mountain != null
        );

        // 3) optional dedupe and sort
        const deduped = Array.from(new Map(withMountain.map((pm) => [pm.id, pm])).values());
        const sorted = deduped.sort((a, b) => a.mountain.name.localeCompare(b.mountain.name));

        setPatchMountains(sorted);
      } catch (e: any) {
        console.error(e);
        setError('Failed to load mountains.');
      } finally {
        setLoadingPatch(false);
      }
    };

    fetchData();
  }, [patchId]);

  useEffect(() => {
    const fetchUserMountains = async () => {
      if (!userId) {
        setUserMountainMap({});
        setLoadingUser(false);
        return;
      }
      setLoadingUser(true);
      setError(null);
      try {
        const userResponse = (await client.graphql({
          query: listUserMountains,
          variables: { filter: { userID: { eq: userId } } },
          authMode: 'userPool',
        })) as { data: ListUserMountainsQuery };

        const map: UserMountainMap = {};
        userResponse.data?.listUserMountains?.items?.forEach((um) => {
          if (um?.mountainID) {
            if (!map[um.mountainID]) map[um.mountainID] = [];
            map[um.mountainID]!.push(um);
          }
        });

        setUserMountainMap(map);
      } catch (e: any) {
        console.error(e);
        setError('Failed to load your ascents.');
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserMountains();
  }, [userId]);

  // helper: completion for a mountain
  const isCompleted = (pm: ItemWithMountain) => (userMountainMap[pm.mountain.id] ?? []).length > 0;

  // distinct states for dropdown
  const uniqueStates = useMemo(
    () => Array.from(new Set(patchMountains.map((pm) => pm.mountain.state).filter(Boolean) as string[])).sort(),
    [patchMountains]
  );

  const visibleMountains = useMemo(() => {
    const qNorm = q.trim().toLowerCase();

    // filter first
    const filtered = patchMountains.filter((pm) => {
      const m = pm.mountain;
      const matchesQ =
        qNorm === '' || [m.name, m.city ?? '', m.state ?? ''].some((v) => v.toLowerCase().includes(qNorm));

      const matchesState = stateFilter === 'all' || m.state === stateFilter;

      const done = isCompleted(pm);
      const matchesStatus = status === 'all' ? true : status === 'done' ? done : !done;

      return matchesQ && matchesState && matchesStatus;
    });

    // then sort
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'elev') {
        // Treat missing elevations as very low, so they sort last in 'desc'
        const ea = a.mountain.elevation ?? Number.NEGATIVE_INFINITY;
        const eb = b.mountain.elevation ?? Number.NEGATIVE_INFINITY;
        const cmp = ea - eb; // asc baseline
        return sortDir === 'asc' ? cmp : -cmp;
      } else {
        const cmp = a.mountain.name.localeCompare(b.mountain.name);
        return sortDir === 'asc' ? cmp : -cmp;
      }
    });

    return sorted;
  }, [patchMountains, q, status, stateFilter, userMountainMap, sortBy, sortDir]);

  const handleEdit = (pm: PatchMountain) => {
    setModalMountain(pm as any);
  };

  const handleSave = async (newDates: string[]) => {
    setModalMountain(null);
    const mountainId = (modalMountain as any)?.mountain?.id as string | undefined;
    if (!mountainId || !userId) return;

    const existingUMs = userMountainMap[mountainId] || [];

    const existingDates = new Set(existingUMs.map((um) => um.dateClimbed.split('T')[0]));
    const newDatesSet = new Set(newDates);

    const datesToDelete = existingUMs.filter((um) => !newDatesSet.has(um.dateClimbed.split('T')[0]));
    const datesToAdd = newDates.filter((date) => !existingDates.has(date));

    // Delete removed ascents
    for (const um of datesToDelete) {
      await client.graphql({
        query: deleteUserMountainMinimal,
        variables: { input: { id: um.id } },
        authMode: 'userPool',
      });
    }

    // Add new ascents
    for (const date of datesToAdd) {
      await client.graphql({
        query: createUserMountainMinimal,
        variables: {
          input: {
            userID: userId,
            mountainID: mountainId,
            dateClimbed: date,
          },
        },
        authMode: 'userPool',
      });
    }

    // Refresh
    try {
      setLoadingUser(true);
      const userResponse = (await client.graphql({
        query: listUserMountains,
        variables: { filter: { userID: { eq: userId } } },
        authMode: 'userPool',
      })) as { data: ListUserMountainsQuery };

      const map: UserMountainMap = {};
      userResponse.data?.listUserMountains?.items?.forEach((um) => {
        if (um?.mountainID) {
          if (!map[um.mountainID]) map[um.mountainID] = [];
          map[um.mountainID]!.push(um);
        }
      });
      setUserMountainMap(map);
    } finally {
      setLoadingUser(false);
    }
  };

  const completed = patchMountains.filter((pm) => {
    const userMountains = userMountainMap[pm.mountain?.id || ''];
    return userMountains && userMountains.length > 0;
  }).length;

  const percent = patchMountains.length === 0 ? 0 : Math.round((completed / patchMountains.length) * 100);

  const controlsDisabled = loadingPatch;

  return (
    <div aria-busy={loadingPatch ? 'true' : 'false'}>
      {/* subtle top loading bar when the main list is loading */}
      {loadingPatch && <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent animate-[pulse_1.2s_ease-in-out_infinite]" />}

      <h2 className="text-xl font-semibold mb-2">Mountains in Patch</h2>

      <div className="flex items-center justify-between mb-1">
        <p className="text-sm text-gray-600">
          Complete: {percent}%
        </p>
        {/* show secondary spinner while user ascents load/refresh */}
        {loadingUser && !loadingPatch && <Spinner label="Updating ascents…" />}
      </div>

      {error && (
        <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2 sm:items-center mb-3">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, city, or state…"
          className="w-full sm:w-64 border rounded px-3 py-1.5 text-sm disabled:opacity-50"
          disabled={controlsDisabled}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          className="border rounded px-3 py-1.5 text-sm disabled:opacity-50"
          disabled={controlsDisabled}
        >
          <option value="all">All</option>
          <option value="todo">Not completed</option>
          <option value="done">Completed</option>
        </select>

        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="border rounded px-3 py-1.5 text-sm disabled:opacity-50"
          disabled={controlsDisabled}
        >
          <option value="all">All states</option>
          {uniqueStates.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {(q || status !== 'all' || stateFilter !== 'all') && (
          <button
            className="ml-auto sm:ml-0 text-sm underline disabled:opacity-50"
            onClick={() => {
              setQ('');
              setStatus('all');
              setStateFilter('all');
            }}
            disabled={controlsDisabled}
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="mb-2 text-xs text-gray-500" aria-live="polite">
        {loadingPatch ? (
          <span className="inline-flex items-center gap-2">
            <Spinner />
            Loading mountains…
          </span>
        ) : (
          <>Showing {visibleMountains.length} of {patchMountains.length}</>
        )}
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 w-10 text-right">#</th>
            <th className="text-left p-2">Mountain</th>
            <th className="text-left p-2">Elevation</th>
            <th className="text-left p-2">State</th>
            <th className="text-left p-2">Dates Ascended</th>
            {userId && <th className="text-left p-2">Action</th>}
          </tr>
        </thead>

        {loadingPatch ? (
          <TableSkeleton rows={8} />
        ) : (
          <tbody>
            {visibleMountains.map((pm, idx) => {
              const mountain = pm.mountain!;
              const userMountains = userMountainMap[mountain.id] || [];

              return (
                <tr key={mountain.id} className="border-t">
                  <td className="p-2 text-gray-500 w-10 text-right">{idx + 1}</td>
                  <td className="p-2">
                    <span className="inline-flex items-center">
                      {mountain.name}
                      {!!(pm as any).delisted && <Badge>Delisted</Badge>}
                    </span>
                  </td>
                  <td className="p-2">{mountain.elevation}</td>
                  <td className="p-2">{mountain.state}</td>
                  <td className="p-2">
                    {loadingUser ? (
                      <Spinner />
                    ) : userMountains.length > 0 ? (
                      <div className="flex gap-2 text-sm text-gray-700 flex-wrap items-center">
                        {userMountains.map((um) => (
                          <span key={um.id}>{um.dateClimbed}</span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  {userId && (
                    <td className="p-2">
                      <button
                        onClick={() => setModalMountain(pm)}
                        className="text-blue-600 hover:underline text-sm disabled:opacity-50"
                        disabled={loadingUser}
                      >
                        Ascent Log
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        )}
      </table>

      {modalMountain && (
        <MountainAscentModal
          open={!!modalMountain}
          userMountain={userMountainMap[modalMountain.mountain!.id] || []}
          onClose={() => setModalMountain(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

