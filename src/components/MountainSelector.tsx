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

const client = generateClient();

export default function MountainSelector({ patchId }: { patchId: string }) {
  const [search, setSearch] = useState('');
  const [mountains, setMountains] = useState<Mountain[]>([]);
  const [selectedMountainId, setSelectedMountainId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [patch, setPatch] = useState<Patch | null>(null);

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
        setPatch(response.data.getPatch);
      }
    } catch (err) {
      console.error('Error fetching patch:', err);
    }
  };

  useEffect(() => {
    fetchMountains();
  }, [search]);

  async function fetchMountains() {
    setLoading(true);
    try {
      const response = await client.graphql({
        query: listMountains,
        variables: {
          filter: {
            name: { contains: search },
          },
          limit: 20,
        },
      });
      setMountains(response.data.listMountains.items);
    } catch (err) {
      console.error('Error fetching mountains:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddMountain() {
    if (!selectedMountainId) return;
    const existing = await client.graphql({
      query: listPatchMountains,
      variables: {
        filter: {
          patchPatchMountainsId: { eq: patchId },
          mountainPatchMountainsId: { eq: selectedMountainId },
        },
      },
    });
    if (existing.data.listPatchMountains.items.length === 0) {
      try {
        await client.graphql({
          query: createPatchMountain,
          variables: {
            input: {
              patchPatchMountainsId: patchId,
              mountainPatchMountainsId: selectedMountainId,
            },
          },
          authMode: 'userPool',
        });
        setMessage('Mountain added!');
        setSelectedMountainId(null);
        fetchPatch(patchId);
        fetchMountains(); // optional refresh
      } catch (err) {
        setMessage('Failed to add mountain.');
        console.error('Add error:', err);
      }
    } else {
      console.log("Mountain already added to patch");
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
        <table className="w-full text-left border-collapse mb-4">
          <thead>
            <tr className="border-b">
              <th className="p-2">Select</th>
              <th className="p-2">Name</th>
              <th className="p-2">Elevation</th>
              <th className="p-2">City</th>
              <th className="p-2">State</th>
            </tr>
          </thead>
          <tbody>
            {mountains.map((mountain) => (
              <tr key={mountain.id} className="border-b hover:bg-gray-50">
                <td className="p-2">
                  <input
                    type="radio"
                    name="selectedMountain"
                    value={mountain.id}
                    checked={selectedMountainId === mountain.id}
                    onChange={() => setSelectedMountainId(mountain.id!)}
                  />
                </td>
                <td className="p-2">{mountain.name}</td>
                <td className="p-2">{mountain.elevation}</td>
                <td className="p-2">{mountain.city}</td>
                <td className="p-2">{mountain.state}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={handleAddMountain}
        disabled={!selectedMountainId}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Add
      </button>

      {message && <p className="mt-2 text-sm">{message}</p>}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Mountains in this Patch</h2>
        {(patch.patchMountains?.items ?? []).length === 0 ? (
          <p className="text-gray-600">No mountains linked yet.</p>
        ) : (
          <ul className="list-disc list-inside">
            {patch.patchMountains?.items?.map((m: PatchMountain | null) =>
              m?.mountain && (
                <li key={m.mountain.id}>
                  {m.mountain.name}
                  {m.mountain.city && ` — ${m.mountain.city}`}
                  {m.mountain.state && `, ${m.mountain.state}`}
                  {m.mountain.elevation && ` — (${Number(m.mountain.elevation).toLocaleString()} ft)`}
                </li>
              )
            )}
          </ul>
        )}
      </div>


    </div>
  );
}

