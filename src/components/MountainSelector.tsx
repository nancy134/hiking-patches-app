'use client';

import { useEffect, useMemo, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listMountains } from '@/graphql/queries';
import { createPatchMountain, deletePatchMountain, updatePatchMountain } from '@/graphql/mutations';
import {
  Mountain, Patch, PatchMountain,
  UpdatePatchMountainInput, GetPatchWithMountainsQuery, ListMountainsQuery
} from '@/API';
import { getPatchWithMountainsPaged } from '@/graphql/custom-queries';
import { GraphQLResult } from '@aws-amplify/api';

const client = generateClient();

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="ml-2 inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
      {children}
    </span>
  );
}

type PatchWithMountains = Patch & {
  patchMountains?: { items: (PatchMountain & { mountain: Mountain } | null)[] }
};

export default function MountainSelector({ patchId }: { patchId: string }) {
  const [search, setSearch] = useState('');
  const [mountains, setMountains] = useState<Mountain[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [patch, setPatch] = useState<PatchWithMountains | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [adding, setAdding] = useState<Record<string, boolean>>({});
  const [toggling, setToggling] = useState<Record<string, boolean>>({}); // key by PatchMountain.id
  const itemsPerPage = 10;

  useEffect(() => {
    if (typeof patchId === 'string') fetchPatch(patchId);
  }, [patchId]);

  const fetchPatch = async (pid: string, pageSize = 100) => {
    try {
      let nextToken: string | null | undefined = null;
      let allItems: any[] = [];
      let patchMeta: any = null;

      do {
        const resp = (await client.graphql<GetPatchWithMountainsQuery>({
          query: getPatchWithMountainsPaged,
          variables: { id: pid, limit: pageSize, nextToken },
        })) as GraphQLResult<GetPatchWithMountainsQuery>;

        if (!('data' in resp) || !resp.data?.getPatch) throw new Error('No data returned');

        const p = resp.data.getPatch;
        if (!patchMeta) {
          const { patchMountains, ...rest } = p;
          patchMeta = rest;
        }
        const conn = p.patchMountains;
        allItems.push(...(conn?.items ?? []));
        nextToken = conn?.nextToken ?? null;
      } while (nextToken);

      const fullPatch: PatchWithMountains = {
        ...patchMeta,
        patchMountains: { items: allItems },
      };

      setPatch(fullPatch);
    } catch (err) {
      console.error('Error fetching patch:', err);
    }
  };

  useEffect(() => {
    fetchMountains();
  }, []);

  async function fetchMountains() {
    setLoading(true);
    try {
      let nextToken: string | null = null;
      const all: any[] = [];
      do {
        const response: GraphQLResult<ListMountainsQuery> = await client.graphql({
          query: listMountains,
          variables: { limit: 1000, nextToken },
        });
        const data = response.data?.listMountains;
        nextToken = data?.nextToken ?? null;
        if (data?.items) all.push(...data.items);
      } while (nextToken);
      setMountains(all.filter(Boolean));
    } catch (err) {
      console.error('Error fetching mountains:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredMountains = useMemo(
    () => mountains.filter((mtn) => mtn.name?.toLowerCase().includes(search.toLowerCase())),
    [mountains, search]
  );

  const totalPages = Math.ceil(filteredMountains.length / itemsPerPage);
  const paginatedMountains = filteredMountains.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Map mountain.id -> PatchMountain (if in patch)
  const pmByMountainId = useMemo(() => {
    const map: Record<string, (PatchMountain & { mountain: Mountain }) | undefined> = {};
    (patch?.patchMountains?.items ?? [])
      .filter((x): x is PatchMountain & { mountain: Mountain } => !!x?.mountain)
      .forEach((pm) => (map[pm.mountain.id] = pm));
    return map;
  }, [patch]);

  async function handleAddMountain(mountainId: string) {
    if (!mountainId) return;
    if (adding[mountainId]) return;

    setAdding((p) => ({ ...p, [mountainId]: true }));
    try {
      await client.graphql({
        query: createPatchMountain,
        variables: {
          input: {
            patchPatchMountainsId: patchId,
            mountainPatchMountainsId: mountainId,
            // If you made delisted: Boolean! @default(false), you can also set delisted: false here explicitly.
          },
        },
        authMode: 'userPool',
      });

      setMessage('Mountain added!');
      await fetchPatch(patchId);
    } catch (err: any) {
      const msg =
        err?.errors?.[0]?.errorType ||
        err?.errors?.[0]?.message ||
        err?.name ||
        '';
      if (msg.includes('ConditionalCheckFailed') || msg.includes('Conflict')) {
        setMessage('Mountain already added.');
      } else {
        setMessage('Failed to add mountain.');
        console.error('Add error:', err);
      }
    } finally {
      setAdding((p) => {
        const { [mountainId]: _omit, ...rest } = p;
        return rest;
      });
    }
  }

  async function handleDeleteMountain(patchMountainId: string) {
    try {
      await client.graphql({
        query: deletePatchMountain,
        variables: { input: { id: patchMountainId } },
        authMode: 'userPool',
      });
      setMessage('Mountain removed!');
      fetchPatch(patchId);
    } catch (err) {
      setMessage('Failed to remove mountain.');
      console.error('Delete error:', err);
    }
  }

  async function setDelisted(pmId: string, value: boolean) {
    // optimistic update
    setToggling((p) => ({ ...p, [pmId]: true }));
    const prev = patch;
    try {
      setPatch((curr) => {
        if (!curr) return curr;
        const items = (curr.patchMountains?.items ?? []).map((x) =>
          x && x.id === pmId ? ({ ...x, delisted: value } as any) : x
        );
        return { ...curr, patchMountains: { items } } as PatchWithMountains;
      });

      const input: UpdatePatchMountainInput = { id: pmId, delisted: value };
      await client.graphql({
        query: updatePatchMountain,
        variables: { input },
        authMode: 'userPool',
      });
    } catch (err) {
      console.error('Toggle delisted failed:', err);
      setPatch(prev || null); // rollback
      setMessage('Failed to update delisted status.');
    } finally {
      setToggling((p) => {
        const { [pmId]: _omit, ...rest } = p;
        return rest;
      });
    }
  }

  if (!patch) return <p className="p-6">Patch not found.</p>;

  return (
    <div className="p-4 bg-white border rounded shadow mt-6">
      <h2 className="text-lg font-semibold mb-2">Add a Mountain to this Patch</h2>
      <input
        type="text"
        placeholder="Search mountains..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 w-full mb-4 rounded"
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Mountain</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Elevation</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">City</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">State</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedMountains.map((mountain) => {
                const pm = pmByMountainId[mountain.id];
                const isInPatch = !!pm;
                const isPending = !!adding[mountain.id];
                return (
                  <tr key={mountain.id}>
                    <td className="px-4 py-2">{mountain.name}</td>
                    <td className="px-4 py-2">{mountain.elevation}</td>
                    <td className="px-4 py-2">{mountain.city}</td>
                    <td className="px-4 py-2">{mountain.state}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleAddMountain(mountain.id)}
                        disabled={isInPatch || isPending}
                        className={`px-3 py-1 rounded text-sm ${
                          isInPatch || isPending
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isInPatch ? 'Added' : isPending ? 'Adding…' : 'Add'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}

      <div className="flex justify-center items-center space-x-4 mt-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {message && <p className="mt-2 text-sm">{message}</p>}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Mountains in this Patch</h2>
        {(patch.patchMountains?.items ?? []).length === 0 ? (
          <p className="text-gray-600">No mountains linked yet.</p>
        ) : (
          <>
            <table className="w-full table-auto border border-gray-200 rounded-md overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-right font-medium text-gray-700 w-12">#</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Mountain</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Location</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-700">Elevation</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-700">Delisted</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...(patch.patchMountains?.items ?? [])]
                  .filter((m): m is PatchMountain & { mountain: Mountain } => !!m?.mountain)
                  .sort((a, b) => (b.mountain.elevation ?? 0) - (a.mountain.elevation ?? 0))
                  .map((m, idx) => {
                    const { mountain } = m;
                    const location = [mountain.city, mountain.state].filter(Boolean).join(', ');
                    const elevation = mountain.elevation != null ? `${Number(mountain.elevation).toLocaleString()} ft` : '—';
                    const delisted = !!m.delisted;
                    const isToggling = !!toggling[m.id];

                    return (
                      <tr key={m.id} className="border-t">
                        <td className="px-3 py-2 align-middle text-right">{idx + 1}</td>
                        <td className="px-3 py-2 align-middle">
                          <span className="inline-flex items-center">
                            {mountain.name}
                            {delisted && <Badge>Delisted</Badge>}
                          </span>
                        </td>
                        <td className="px-3 py-2 align-middle">{location || '—'}</td>
                        <td className="px-3 py-2 align-middle text-right">{elevation}</td>

                        {/* Delisted checkbox (admins only page) */}
                        <td className="px-3 py-2 align-middle text-center">
                          <label className="inline-flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={delisted}
                              onChange={(e) => setDelisted(m.id, e.target.checked)}
                              disabled={isToggling}
                              aria-label={delisted ? 'Relist this mountain' : 'Delist this mountain'}
                              className="h-4 w-4"
                            />
                            {isToggling && (
                              <span className="text-xs text-gray-500">Updating…</span>
                            )}
                          </label>
                        </td>

                        <td className="px-3 py-2 align-middle text-right">
                          <button
                            onClick={() => handleDeleteMountain(m.id)}
                            className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </>
        )}
      </div>

      <p className="mt-3 text-xs text-gray-500">
        Delisted mountains remain visible for management. Hikes on delisted mountains still count toward patch completion.
      </p>
    </div>
  );
}

