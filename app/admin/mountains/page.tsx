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
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

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
        setImporting(true);
        setImportProgress({ current: 0, total: mountainsToCreate.length });

        for (let i = 0; i < mountainsToCreate.length; i++) {
          const mtn = mountainsToCreate[i];
          if (!mtn.name) continue;

          const input = {
            name: mtn.name!,
            elevation: mtn.elevation ? Number(mtn.elevation) : undefined,
            latitude: mtn.latitude ?? undefined,
            longitude: mtn.longitude ?? undefined,
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

          setImportProgress({ current: i + 1, total: mountainsToCreate.length });
        }

        setImporting(false);
        fetchMountains();
      },
      error: (err) => {
        console.error('CSV parsing error:', err);
        setImporting(false);
      },
    });

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

  const totalPages = Math.ceil(mountains.length / itemsPerPage);
  const paginatedMountains = mountains.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
            disabled={importing}
          />
        </label>
        {importing && (
          <div className="text-blue-600 mt-2">
            Importing {importProgress.current} of {importProgress.total} mountains...
          </div>
        )}
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
          {paginatedMountains.map((mtn) => (
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
<div className="flex justify-center items-center space-x-2 mt-4">
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

    </div>
  );
}

