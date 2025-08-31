'use client';

import { useMemo, useEffect, useState } from 'react';
import { listPatchMountains, listUserMountains } from '@/graphql/queries';
import { ListPatchMountainsQuery, ListUserMountainsQuery, PatchMountain, UserMountain } from '@/API';
import { listPatchMountainsWithMountain } from '@/graphql/custom-queries';
import MountainAscentModal from '@/components/MountainAscentModal';
import { generateClient } from 'aws-amplify/api';
import { deleteUserMountainMinimal } from '@/graphql/custom-mutations';
import { createUserMountainMinimal } from '@/graphql/custom-mutations';
import { GraphQLResult } from '@aws-amplify/api';
import { ListPatchMountainsQueryVariables } from '@/API';
import {
  ListPatchMountainsWithMountainQuery,
} from '@/API';
const client = generateClient();

type UserMountainMap = Record<string, UserMountain[] | undefined>;

interface PatchMountainProps {
  patchId: string;
  userId?: string;
}


export default function PatchMountains({ patchId, userId }: PatchMountainProps) {

  // Derive the item type returned by *your* query (which can include nulls)
  type Query = ListPatchMountainsWithMountainQuery;
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

  useEffect(() => {
    const fetchData = async (pageSize = 100) => {
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
      const sorted = deduped.sort((a, b) =>
        a.mountain.name.localeCompare(b.mountain.name)
      );

      setPatchMountains(sorted);
    };

    fetchData();
  }, [patchId]);

  useEffect(() => {
    const fetchUserMountains = async () => {
      if (!userId) return;
      console.log(userId);
      const userResponse = await client.graphql({
        query: listUserMountains,
        variables: { filter: { userID: { eq: userId } } },
        authMode: 'userPool',
      }) as { data: ListUserMountainsQuery };

      const map: UserMountainMap = {};

      console.log(userResponse.data?.listUserMountains?.items);
      userResponse.data?.listUserMountains?.items?.forEach((um) => {
        if (um?.mountainID) {
          if (!map[um.mountainID]) map[um.mountainID] = [];
          map[um.mountainID]!.push(um);
        }
      });

      setUserMountainMap(map);
    };

    fetchUserMountains();
  }, [userId]);


  // helper: completion for a mountain
  const isCompleted = (pm: ItemWithMountain) =>
    (userMountainMap[pm.mountain.id] ?? []).length > 0;

  // distinct states for dropdown
  const uniqueStates = useMemo(
    () =>
      Array.from(
        new Set(patchMountains.map(pm => pm.mountain.state).filter(Boolean) as string[])
      ).sort(),
    [patchMountains]
  );


  const visibleMountains = useMemo(() => {
    const qNorm = q.trim().toLowerCase();

    // filter first
    const filtered = patchMountains.filter(pm => {
      const m = pm.mountain;
      const matchesQ =
        qNorm === '' ||
        [m.name, m.city ?? '', m.state ?? ''].some(v => v.toLowerCase().includes(qNorm));

      const matchesState = stateFilter === 'all' || m.state === stateFilter;

      const done = isCompleted(pm);
      const matchesStatus =
        status === 'all' ? true : status === 'done' ? done : !done;

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
    setModalMountain(pm);
  };

  const handleSave = async (newDates: string[]) => {
    setModalMountain(null);
    const mountainId = modalMountain?.mountain?.id;
    if (!mountainId || !userId) return;

    const existingUMs = userMountainMap[mountainId] || [];

    const existingDates = new Set(
      existingUMs.map((um) => um.dateClimbed.split('T')[0])
    );

    const newDatesSet = new Set(newDates);

    const datesToDelete = existingUMs.filter(
      (um) => !newDatesSet.has(um.dateClimbed.split('T')[0])
    );

    const datesToAdd = newDates.filter(
      (date) => !existingDates.has(date)
    );

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
    const userResponse = await client.graphql({
      query: listUserMountains,
      variables: { filter: { userID: { eq: userId } } },
      authMode: 'userPool',
    }) as { data: ListUserMountainsQuery };

    const map: UserMountainMap = {};
    userResponse.data?.listUserMountains?.items?.forEach((um) => {
      if (um?.mountainID) {
        if (!map[um.mountainID]) map[um.mountainID] = [];
        map[um.mountainID]!.push(um);
      }
    });
    setUserMountainMap(map);
  };

  const completed = patchMountains.filter((pm) => {
    const userMountains = userMountainMap[pm.mountain?.id || ''];
    return userMountains && userMountains.length > 0;
  }).length;

  const percent = patchMountains.length === 0 ? 0 : Math.round((completed / patchMountains.length) * 100);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Mountains in Patch</h2>
      <p className="mb-4 text-sm text-gray-600">Complete: {percent}%</p>


      <div className="flex flex-col sm:flex-row gap-2 sm:items-center mb-3">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, city, or state…"
          className="w-full sm:w-64 border rounded px-3 py-1.5 text-sm"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          className="border rounded px-3 py-1.5 text-sm"
        >
          <option value="all">All</option>
          <option value="todo">Not completed</option>
          <option value="done">Completed</option>
        </select>

        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="border rounded px-3 py-1.5 text-sm"
        >
          <option value="all">All states</option>
          {uniqueStates.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {(q || status !== 'all' || stateFilter !== 'all') && (
          <button
            className="ml-auto sm:ml-0 text-sm underline"
            onClick={() => { setQ(''); setStatus('all'); setStateFilter('all'); }}
          >
            Clear filters
          </button>
        )}
      </div>

      <p className="mb-2 text-xs text-gray-500">
         Showing {visibleMountains.length} of {patchMountains.length}
      </p>

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
        <tbody>
          {visibleMountains.map((pm, idx) => {
            const mountain = pm.mountain!;
    const userMountains = userMountainMap[mountain.id] || [];

    return (
      <tr key={mountain.id} className="border-t">
        <td className="p-2 text-gray-500 w-10 text-right">{idx + 1}</td>
        <td className="p-2">{mountain.name}</td>
        <td className="p-2">{mountain.elevation}</td>
        <td className="p-2">{mountain.state}</td>
        <td className="p-2">
          {userMountains.length > 0 ? (
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
              className="text-blue-600 hover:underline text-sm"
            >
              Ascent Log
            </button>
          </td>
        )}
      </tr>
    );
  })}
</tbody>

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

