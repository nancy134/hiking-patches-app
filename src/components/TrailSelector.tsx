'use client';

import { useEffect, useMemo, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { GraphQLResult } from '@aws-amplify/api';

import { listTrails } from '@/graphql/queries';
import { createPatchTrail, deletePatchTrail, updatePatchTrail } from '@/graphql/mutations';
import { getPatchWithTrailsPaged } from '@/graphql/custom-queries';

import type {
  Trail,
  Patch,
  PatchTrail,
  GetPatchWithTrailsQuery,
  ListTrailsQuery,
  UpdatePatchTrailInput,
} from '@/API';

const client = generateClient();

type PatchWithTrails = Patch & {
  patchTrails?: { items: (PatchTrail & { trail?: Trail | null } | null)[] } | null;
};

export default function TrailSelector({ patchId }: { patchId: string }) {
  const [search, setSearch] = useState('');
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [patch, setPatch] = useState<PatchWithTrails | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [adding, setAdding] = useState<Record<string, boolean>>({});
  const [savingRow, setSavingRow] = useState<Record<string, boolean>>({});
  const [removingRow, setRemovingRow] = useState<Record<string, boolean>>({});

  const itemsPerPage = 10;

  useEffect(() => {
    if (typeof patchId === 'string') fetchPatch(patchId);
  }, [patchId]);

  async function fetchPatch(pid: string, pageSize = 100) {
    try {
      let nextToken: string | null | undefined = null;
      let allItems: any[] = [];
      let patchMeta: any = null;

      do {
        const resp = (await client.graphql<GetPatchWithTrailsQuery>({
          query: getPatchWithTrailsPaged,
          variables: { id: pid, limit: pageSize, nextToken },
        })) as GraphQLResult<GetPatchWithTrailsQuery>;

        const data = resp.data?.getPatch;
        if (!data) throw new Error('No patch found');

        if (!patchMeta) {
          const { patchTrails, ...rest } = data;
          patchMeta = rest;
        }

        const conn = data.patchTrails;
        allItems.push(...(conn?.items ?? []));
        nextToken = conn?.nextToken ?? null;
      } while (nextToken);

      const full: PatchWithTrails = {
        ...patchMeta,
        patchTrails: { items: allItems },
      };
      setPatch(full);
    } catch (err) {
      console.error('Error fetching patch (trails):', err);
      setPatch(null);
    }
  }

  useEffect(() => { fetchTrails(); }, []);

  async function fetchTrails() {
    setLoading(true);
    try {
      let nextToken: string | null = null;
      const all: any[] = [];
      do {
        const resp: GraphQLResult<ListTrailsQuery> = await client.graphql({
          query: listTrails,
          variables: { limit: 1000, nextToken },
        });
        const data = resp.data?.listTrails;
        nextToken = data?.nextToken ?? null;
        if (data?.items) all.push(...data.items);
      } while (nextToken);
      setTrails(all.filter(Boolean));
    } catch (err) {
      console.error('Error fetching trails:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredTrails = useMemo(
    () => trails.filter((t) => (t.name ?? '').toLowerCase().includes(search.toLowerCase())),
    [trails, search]
  );

  const totalPages = Math.ceil(filteredTrails.length / itemsPerPage) || 1;
  const paginatedTrails = filteredTrails.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Map trail.id -> PatchTrail (if already in patch)
  const ptByTrailId = useMemo(() => {
    const map: Record<string, (PatchTrail & { trail?: Trail | null }) | undefined> = {};
    (patch?.patchTrails?.items ?? [])
      .filter((x): x is PatchTrail & { trail?: Trail | null } => !!x)
      .forEach((pt) => {
        const tId = (pt as any).trail?.id ?? (pt as any).trailPatchTrailsId;
        if (tId) map[tId] = pt;
      });
    return map;
  }, [patch]);

  async function handleAddTrail(trailId: string) {
    if (!trailId) return;
    if (adding[trailId]) return;

    setAdding((p) => ({ ...p, [trailId]: true }));
    try {
      await client.graphql({
        query: createPatchTrail,
        variables: {
          input: {
            patchPatchTrailsId: patchId,
            trailPatchTrailsId: trailId,
            // requiredMiles is optional; admin can set it below
          },
        },
        authMode: 'userPool',
      });
      setMessage('Trail added!');
      await fetchPatch(patchId);
    } catch (err: any) {
      console.error('Add trail error:', err);
      setMessage('Failed to add trail (maybe already added?).');
    } finally {
      setAdding((p) => {
        const { [trailId]: _omit, ...rest } = p;
        return rest;
      });
    }
  }

  async function handleRemovePatchTrail(patchTrailId: string) {
    if (!confirm('Remove this trail from the patch?')) return;
    setRemovingRow((p) => ({ ...p, [patchTrailId]: true }));
    try {
      await client.graphql({
        query: deletePatchTrail,
        variables: { input: { id: patchTrailId } },
        authMode: 'userPool',
      });
      setMessage('Trail removed.');
      await fetchPatch(patchId);
    } catch (err) {
      console.error('Delete PatchTrail error:', err);
      setMessage('Failed to remove.');
    } finally {
      setRemovingRow((p) => {
        const { [patchTrailId]: _omit, ...rest } = p;
        return rest;
      });
    }
  }

  async function handleSaveRequiredMiles(row: PatchTrail) {
    const id = row.id;
    const val = row.requiredMiles;
    if (val != null && (!Number.isFinite(Number(val)) || Number(val) < 0)) {
      alert('Required miles must be a number ≥ 0');
      return;
    }

    setSavingRow((p) => ({ ...p, [id]: true }));
    try {
      const input: UpdatePatchTrailInput = { id, requiredMiles: val == null ? null : Number(val) } as any;
      await client.graphql({
        query: updatePatchTrail,
        variables: { input },
        authMode: 'userPool',
      });
      setMessage('Saved.');
    } catch (err) {
      console.error('Save requiredMiles failed:', err);
      setMessage('Failed to save.');
    } finally {
      setSavingRow((p) => {
        const { [id]: _omit, ...rest } = p;
        return rest;
      });
      await fetchPatch(patchId);
    }
  }

  if (!patch) return <p className="p-4">Patch not found.</p>;

  return (
    <div className="p-4 bg-white border rounded shadow mt-6">
      <h2 className="text-lg font-semibold mb-2">Add a Trail to this Patch</h2>
      <input
        type="text"
        placeholder="Search trails..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 w-full mb-4 rounded"
      />

      {loading ? (
        <p>Loading…</p>
      ) : (
        <>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Trail</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Length (mi)</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedTrails.map((trail) => {
                const pt = ptByTrailId[trail.id];
                const isInPatch = !!pt;
                const isPending = !!adding[trail.id];
                return (
                  <tr key={trail.id}>
                    <td className="px-4 py-2">{trail.name}</td>
                    <td className="px-4 py-2">{trail.lengthMiles}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleAddTrail(trail.id)}
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

      {/* Existing trails in this patch */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Trails in this Patch</h2>
        {(patch.patchTrails?.items ?? []).length === 0 ? (
          <p className="text-gray-600">No trails linked yet.</p>
        ) : (
          <table className="w-full table-auto border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-right font-medium text-gray-700 w-12">#</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Trail</th>
                <th className="px-3 py-2 text-right font-medium text-gray-700">Length (mi)</th>
                <th className="px-3 py-2 text-right font-medium text-gray-700">Required Miles</th>
                <th className="px-3 py-2 text-right font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...(patch.patchTrails?.items ?? [])]
                .filter((x): x is PatchTrail & { trail?: Trail | null } => !!x)
                .sort((a, b) => {
                  const la = (a as any).trail?.lengthMiles ?? 0;
                  const lb = (b as any).trail?.lengthMiles ?? 0;
                  return lb - la;
                })
                .map((row, idx) => {
                  const t = (row as any).trail as Trail | null;
                  const isSaving = !!savingRow[row.id];
                  const isRemoving = !!removingRow[row.id];

                  return (
                    <tr key={row.id} className="border-t">
                      <td className="px-3 py-2 align-middle text-right">{idx + 1}</td>
                      <td className="px-3 py-2 align-middle">
                        {t ? (
                          <div className="flex flex-col">
                            <span className="font-medium">{t.name}</span>
                            <span className="text-xs text-gray-500">ID: {t.id}</span>
                          </div>
                        ) : (
                          <>Trail ID: {row.trailPatchTrailsId}</>
                        )}
                      </td>
                      <td className="px-3 py-2 align-middle text-right">
                        {t?.lengthMiles ?? '—'}
                      </td>
                      <td className="px-3 py-2 align-middle text-right">
                        <input
                          type="number"
                          step="any"
                          className="border rounded px-2 py-1 w-28 text-right"
                          value={row.requiredMiles ?? ''}
                          onChange={(e) => {
                            const val = e.target.value === '' ? null : Number(e.target.value);
                            setPatch((curr) => {
                              if (!curr?.patchTrails?.items) return curr;
                              const items = curr.patchTrails.items.map((it) =>
                                it?.id === row.id ? ({ ...it, requiredMiles: val } as any) : it
                              );
                              return { ...curr, patchTrails: { items } } as PatchWithTrails;
                            });
                          }}
                        />
                      </td>
                      <td className="px-3 py-2 align-middle text-right space-x-2">
                        <button
                          onClick={() => handleSaveRequiredMiles(row)}
                          disabled={isSaving}
                          className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                          {isSaving ? 'Saving…' : 'Save'}
                        </button>
                        <button
                          onClick={() => handleRemovePatchTrail(row.id)}
                          disabled={isRemoving}
                          className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                        >
                          {isRemoving ? 'Removing…' : 'Remove'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

