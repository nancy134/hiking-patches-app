'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { uploadData } from 'aws-amplify/storage';
import { generateClient } from 'aws-amplify/api';
import {
  createPatch,
  updatePatch,
  deletePatch
} from '@/graphql/mutations';
import { listPatches } from '@/graphql/queries';
import Header from '@/components/Header';
import awsExports from '@/aws-exports';
import { Patch, Difficulty } from '@/API';
import { useAuth } from '@/context/auth-context';
import PatchFormModal from '@/components/PatchFormModal';

const bucket = awsExports.aws_user_files_s3_bucket;
const region = awsExports.aws_user_files_s3_bucket_region;
const client = generateClient();

export default function AdminPage() {
  const [patches, setPatches] = useState<Patch[]>([]);
  const [editingPatch, setEditingPatch] = useState<Partial<Patch> | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { user, isAdmin } = useAuth();
  const [selectedState, setSelectedState] = useState<string>('All');

  const uniqueStates = Array.from(
    new Set(patches.flatMap(p => p.regions ?? []).filter((r): r is string => !!r))
  ).sort();

  const patchesPerPage = 25;
  const indexOfLastPatch = currentPage * patchesPerPage;
  const indexOfFirstPatch = indexOfLastPatch - patchesPerPage;

  const filteredPatches =
    selectedState === 'All'
      ? patches
      : patches.filter(patch =>
          patch.regions?.includes(selectedState)
        );

  const totalPages = Math.ceil(filteredPatches.length / patchesPerPage);
  const currentPatches = filteredPatches.slice(indexOfFirstPatch, indexOfLastPatch);

  useEffect(() => {
    fetchPatches();
  }, []);

  const fetchPatches = async () => {
    const response = await client.graphql({ query: listPatches });
    setPatches(response.data.listPatches.items);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this patch?');
    if (!confirmDelete) return;

    await client.graphql({
      query: deletePatch,
      variables: { input: { id } },
      authMode: 'userPool',
    });
    fetchPatches();
  };

  const handleEdit = (patch: Patch) => {
    setEditingPatch(patch);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingPatch(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPatch(null);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (isAdmin === null) return <p className="p-6">Checking permissions...</p>;
  if (!isAdmin) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <Header />
        <p className="p-6 text-red-600 font-semibold">⛔ Access denied. Admins only.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Header />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">🛠️ Admin: Manage Hiking Patches</h1>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Patch
        </button>
      </div>

      <div className="mb-4">
        <label htmlFor="stateFilter" className="mr-2 font-semibold">Filter by State:</label>
        <select
          id="stateFilter"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="All">All</option>
          {uniqueStates.map(state => (
          <option key={state} value={state}>{state}</option>
          ))}        
        </select>
      </div>

      {/* Modal */}
      {showModal && (
        <PatchFormModal
          patch={editingPatch}
          onClose={closeModal}
          onSaved={() => {
            closeModal();
            fetchPatches();
          }}
        />
      )}

      <table className="w-full table-auto border border-collapse mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Image</th>
            <th className="border px-4 py-2">Regions</th>
            <th className="border px-4 py-2">Difficulty</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPatches.map((patch) => (
            <tr key={patch.id}>
              <td className="border px-4 py-2">{patch.name}</td>
              <td className="border px-4 py-2">{patch.description}</td>
              <td className="border px-4 py-2">
                <img src={patch.imageUrl ?? ''} alt={patch.name ?? 'Patch image'} className="h-16" />
              </td>
              <td className="border px-4 py-2">{(patch.regions ?? []).join(', ')}</td>
              <td className="border px-4 py-2">{patch.difficulty}</td>
              <td className="border px-4 py-2 space-x-2">
                <button onClick={() => handleEdit(patch)} className="text-blue-600 underline">
                  Edit
                </button>
                <button onClick={() => handleDelete(patch.id)} className="text-red-600 underline">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          ⬅ Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}

