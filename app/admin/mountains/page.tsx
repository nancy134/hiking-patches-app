'use client';

import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import Header from '@/components/Header';
import { listMountains } from '@/graphql/queries';
import { createMountain, updateMountain, deleteMountain } from '@/graphql/mutations';
import { Mountain } from '@/API';
import { useAuth } from '@/context/auth-context';
import MountainFormModal from '@/components/MountainFormModal';
import Papa from 'papaparse';

const client = generateClient();

export default function AdminMountainsPage() {
  const [mountains, setMountains] = useState<Mountain[]>([]);
  const [editingMountain, setEditingMountain] = useState<Partial<Mountain> | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    fetchMountains();
  }, []);

  const fetchMountains = async () => {
    const response = await client.graphql({ query: listMountains });
    setMountains(response.data.listMountains.items);
  };




const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: async (results) => {
      const mountainsToCreate = results.data as Partial<Mountain>[];

      for (const mtn of mountainsToCreate) {
        // Optional: validate required fields before submitting
        if (!mtn.name) continue;

        const input: CreateMountainInput = {
          name: mtn.name!,
          elevation: mtn.elevation ? Number(mtn.elevation) : undefined,
          latitude: mtn.latitude ? parseFloat(mtn.latitude as string) : undefined,
          longitude: mtn.longitude ? parseFloat(mtn.longitude as string) : undefined,
          city: mtn.city ?? '',
          state: mtn.state ?? '',
        };

        try {
          await client.graphql({
            query: createMountain,
            variables: { input },
            authMode: 'userPool',
          });
        } catch (err) {
          console.error('Failed to create mountain:', input.name, err);
        }
      }

      fetchMountains();
    },
    error: (err) => {
      console.error('CSV parsing error:', err);
    },
  });

  // Reset the file input
  event.target.value = '';
};





  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Delete this mountain?');
    if (!confirmDelete) return;

    await client.graphql({
      query: deleteMountain,
      variables: { input: { id } },
      authMode: 'userPool',
    });
    fetchMountains();
  };

  const handleEdit = (mountain: Mountain) => {
    setEditingMountain(mountain);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingMountain(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMountain(null);
  };

  if (isAdmin === null) return <p className="p-6">Checking permissions...</p>;
  if (!isAdmin) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <Header />
        <p className="text-red-600 font-semibold">⛔ Access denied. Admins only.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Header />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">🗻 Admin: Manage Mountains</h1>
        <button
          onClick={handleAddNew}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Mountain
        </button>

        <label className="ml-2 cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Import CSV
          <input
            type="file"
            accept=".csv"
            onChange={handleImportCSV}
            className="hidden"
          />
        </label>

      </div>

      {showModal && (
        <MountainFormModal
          mountain={editingMountain}
          onClose={closeModal}
          onSaved={() => {
            closeModal();
            fetchMountains();
          }}
        />
      )}
      <table className="w-full table-auto border border-collapse mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Elevation (ft)</th>
            <th className="border px-4 py-2">Latitude</th>
            <th className="border px-4 py-2">Longitude</th>
            <th className="border px-4 py-2">City</th>
            <th className="border px-4 py-2">State</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {mountains.map((mtn) => (
            <tr key={mtn.id}>
              <td className="border px-4 py-2">{mtn.name}</td>
              <td className="border px-4 py-2">{mtn.elevation}</td>
              <td className="border px-4 py-2">{mtn.latitude}</td>
              <td className="border px-4 py-2">{mtn.longitude}</td>
              <td className="border px-4 py-2">{mtn.city}</td>
              <td className="border px-4 py-2">{mtn.state}</td>
              <td className="border px-4 py-2 space-x-2">
                <button onClick={() => handleEdit(mtn)} className="text-blue-600 underline">
                  Edit
                </button>
                <button onClick={() => handleDelete(mtn.id)} className="text-red-600 underline">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

