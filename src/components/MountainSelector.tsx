'use client';

import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listMountains } from '@/graphql/queries';
import { listPatchMountains } from '@/graphql/queries';
import { createPatchMountain } from '@/graphql/mutations';
import { Mountain } from '@/API';
import { Patch } from '@/API';
import { PatchMountain} from '@/API';
import { getPatchWithMountains } from '@/graphql/custom-queries';
import { GraphQLResult } from '@aws-amplify/api';
import { ListMountainsQuery } from '@/API';
import { deletePatchMountain } from '@/graphql/mutations';

const client = generateClient();

export default function MountainSelector({ patchId }: { patchId: string }) {
  const [search, setSearch] = useState('');
  const [mountains, setMountains] = useState<Mountain[]>([]);
  const [selectedMountainId, setSelectedMountainId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [patch, setPatch] = useState<Patch | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (typeof patchId === 'string') {
      fetchPatch(patchId);
    }
  }, [patchId]);

  const fetchPatch = async (patchId: string) => {
    try {
      const response = await client.graphql({
        query: getPatchWithMountains,
        variables: { id: patchId }
      });
      if ('data' in response) {
        console.log("patch:");
        console.log(response.data.getPatch);
        setPatch(response.data.getPatch);
      }
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
      const mountains: any[] = []; // Replace `any` with your Mountain type

      do {
        const response: GraphQLResult<ListMountainsQuery> = await client.graphql({
          query: listMountains,
          variables: {
            limit: 1000,
            nextToken,
          },
        });

        const data = response.data?.listMountains;
        nextToken = data?.nextToken ?? null;

        if (data?.items) {
          mountains.push(...data.items);
        }
      } while (nextToken);

      setMountains(mountains);
    } catch (err) {
      console.error("Error fetching mountains:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredMountains = mountains.filter((mtn) =>
    mtn.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMountains.length / itemsPerPage);

  const paginatedMountains = filteredMountains.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  async function handleAddMountain(mountainId: string) {
    if (!mountainId) return;

      try {
        await client.graphql({
          query: createPatchMountain,
          variables: {
            input: {
              patchPatchMountainsId: patchId,
              mountainPatchMountainsId: mountainId,
            },
          },
          authMode: 'userPool',
        });
        setMessage('Mountain added!');
        setSelectedMountainId(null); // optional, or remove if not needed
        fetchPatch(patchId);
        fetchMountains(); // optional refresh
      } catch (err) {
        setMessage('Failed to add mountain.');
        console.error('Add error:', err);
      }
  }

  async function handleDeleteMountain(patchMountainId: string) {
    try {
      await client.graphql({
        query: deletePatchMountain,
        variables: {
          input: { id: patchMountainId },
        },
        authMode: 'userPool',
      });
      setMessage('Mountain removed!');
      fetchPatch(patchId); // refresh patch data
    } catch (err) {
      setMessage('Failed to remove mountain.');
      console.error('Delete error:', err);
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
                console.log("Rendering mountain:", mountain.name, "ID:", mountain.id);
                const isInPatch = patch.patchMountains?.items?.some((pm) => {
                  console.log(pm);
                  console.log("  Comparing to patch mountain ID:", pm?.mountain.id);
                  return pm?.mountain.id === mountain.id;
                });
                console.log("  => isInPatch:", isInPatch);
                return (
                  <tr key={mountain.id}>
                    <td className="px-4 py-2">{mountain.name}</td>
                    <td className="px-4 py-2">{mountain.elevation}</td>
                    <td className="px-4 py-2">{mountain.city}</td>
                    <td className="px-4 py-2">{mountain.state}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleAddMountain(mountain.id)}
                        disabled={isInPatch}
                        className={`px-3 py-1 rounded text-sm ${
                          isInPatch
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isInPatch ? 'Added' : 'Add'}
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
          <ol className="list-decimal list-inside">
            {[...(patch.patchMountains?.items ?? [])]
              .filter((m): m is PatchMountain & { mountain: Mountain } => !!m?.mountain)
              .sort((a, b) => (b.mountain.elevation ?? 0) - (a.mountain.elevation ?? 0))
              .map((m) => (
                <li key={m.mountain.id} className="flex justify-between items-center">
                  <span>
                  {m.mountain.name}
                  {m.mountain.city && ` — ${m.mountain.city}`}
                  {m.mountain.state && `, ${m.mountain.state}`}
                  {m.mountain.elevation && ` — (${Number(m.mountain.elevation).toLocaleString()} ft)`}
                  </span>
                  <button
                    onClick={() => handleDeleteMountain(m.id)}
                    className="ml-4 px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))
            }
          </ol>
        </>
        )}
      </div>
    </div>
  );
}

