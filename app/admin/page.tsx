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
import { Patch } from '@/API';

const bucket = awsExports.aws_user_files_s3_bucket;
const region = awsExports.aws_user_files_s3_bucket_region;

const client = generateClient();

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [howToGet, setHowToGet] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [patches, setPatches] = useState<Patch[]>([]);
  const [editingPatch, setEditingPatch] = useState<Partial<Patch> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [regions, setRegions] = useState<string[]>([]);
  const patchesPerPage = 25;

  const fetchPatches = async () => {
    const response = await client.graphql({ query: listPatches });
    setPatches(response.data.listPatches.items);
  };

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) return setIsAdmin(false);
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();
        if (!idToken) return setIsAdmin(false);
        const payload = JSON.parse(atob(idToken.split('.')[1]));
        const groups = payload['cognito:groups'] || [];
        setIsAdmin(groups.includes('Admin'));
      } catch (err) {
        console.warn('Access check failed:', err);
        setIsAdmin(false);
      }
    };

    checkAccess();
  }, []);

  useEffect(() => {
    fetchPatches();
  }, []);

  const cancelEdit = () => {
    setEditingPatch(null);
    setName('');
    setDescription('');
    setHowToGet('');
    setImageFile(null);
    setRegions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !howToGet || (!editingPatch && !imageFile)) return;
    setLoading(true);
    setSuccess(false);
    try {
      let imageUrl = editingPatch?.imageUrl ?? '';
      if (imageFile) {
        const filename = `public/${Date.now()}-${imageFile.name}`;
        await uploadData({
          path: filename,
          data: imageFile
        }).result;

        if (!bucket || !region) throw new Error('Missing S3 bucket or region');
        imageUrl = `https://${bucket}.s3.${region}.amazonaws.com/${filename}`;
      }
      console.log("regions:");
      console.log(regions);
      console.log("editingPatch:");
      console.log(editingPatch);
      if (editingPatch?.id) {
        await client.graphql({
          query: updatePatch,
          variables: {
            input: {
              id: editingPatch.id,
              name,
              description,
              howToGet,
              imageUrl,
              regions
            },
          },
          authMode: 'userPool',
        });
      } else {
        await client.graphql({
          query: createPatch,
          variables: {
            input: { name, description, howToGet, imageUrl, regions },
          },
          authMode: 'userPool',
        });
      }

      cancelEdit();
      setSuccess(true);
      fetchPatches();
    } catch (err) {
      console.error('Error submitting patch:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (patch: Patch) => {
    setEditingPatch(patch);
    setName(patch.name ?? '');
    setDescription(patch.description ?? '');
    setHowToGet(patch.howToGet ?? '');
    setRegions((patch.regions ?? []).filter((r): r is string => r !== null));
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

  // Pagination logic
  const indexOfLastPatch = currentPage * patchesPerPage;
  const indexOfFirstPatch = indexOfLastPatch - patchesPerPage;
  const currentPatches = patches.slice(indexOfFirstPatch, indexOfLastPatch);
  const totalPages = Math.ceil(patches.length / patchesPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (isAdmin === null) return <p className="p-6">Checking permissions...</p>;
  if (!isAdmin) return <p className="p-6 text-red-600 font-semibold">⛔ Access denied. Admins only.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Header />
      <h1 className="text-2xl font-bold mb-4">🛠️ Admin: Manage Hiking Patches</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-gray-50 p-4 rounded shadow">
        <h2 className="text-lg font-semibold">{editingPatch ? 'Edit Patch' : 'Add New Patch'}</h2>
        <input
          type="text"
          placeholder="Patch name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Patch description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="How to get"
          value={howToGet}
          onChange={(e) => setHowToGet(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <select
          multiple
          value={regions}
          onChange={(e) =>
            setRegions(Array.from(e.target.selectedOptions, (opt) => opt.value))
          }
          className="w-full p-2 border rounded"
        >
          {[ 'Maine', 'Massachusetts', 'New Hampshire', 'New York', 'Vermont'
          ].map((region) => (
        <option key={region} value={region}>{region}</option>
      ))}
      </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          className="w-full"
        />
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? 'Saving...' : editingPatch ? 'Update Patch' : 'Add Patch'}
          </button>
          {editingPatch && (
            <button type="button" onClick={cancelEdit} className="text-gray-600 underline">
              Cancel
            </button>
          )}
        </div>
        {success && <p className="text-green-600 mt-2">✅ Patch saved successfully!</p>}
      </form>

      {/* Patch Table */}
      <table className="w-full table-auto border border-collapse mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Image</th>
            <th className="border px-4 py-2">Regions</th>
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

      {/* Pagination Controls */}
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

