'use client';

import { useEffect, useState, useCallback } from 'react';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { uploadData } from 'aws-amplify/storage';
import { generateClient } from 'aws-amplify/api';
import { createPatch, updatePatch, deletePatch } from '@/graphql/mutations';
import { listPatches } from '@/graphql/queries';
import awsExports from '@/aws-exports';

const bucket = awsExports.aws_user_files_s3_bucket;
const region = awsExports.aws_user_files_s3_bucket_region;
const client = generateClient();

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [patches, setPatches] = useState<Patch[]>([]);
  const [editingPatch, setEditingPatch] = useState<Partial<Patch> | null>(null);

  const fetchPatches = useCallback(async () => {
    const response = await client.graphql({ query: listPatches });
    setPatches(response.data.listPatches.items);
  }, []);

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
        console.warn('Not logged in or error fetching session:', err);
        setIsAdmin(false);
      }
    };
    checkAccess();
  }, []);

  useEffect(() => {
    fetchPatches();
  }, [fetchPatches]);

  const handleEdit = (patch: Patch) => {
    setEditingPatch(patch);
    setName(patch.name);
    setDescription(patch.description);
  };

  const cancelEdit = () => {
    setEditingPatch(null);
    setName('');
    setDescription('');
    setImageFile(null);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this patch?");
    if (!confirmDelete) return;
    await client.graphql({
      query: deletePatch,
      variables: { input: { id } },
      authMode: 'userPool',
    });
    fetchPatches();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || (editingPatch === null && !imageFile)) return;
    setLoading(true);
    try {
      let imageUrl = editingPatch?.imageUrl ?? '';
      if (imageFile) {
        const filename = `${Date.now()}-${imageFile.name}`;
        await uploadData({
          key: filename,
          data: imageFile,
          options: { accessLevel: 'public', contentType: imageFile.type }
        }).result;

        if (!bucket || !region) throw new Error('Missing S3 bucket or region in Amplify config');
        imageUrl = `https://${bucket}.s3.${region}.amazonaws.com/public/${filename}`;
      }

      const patchInput = { name, description, imageUrl };
      if (editingPatch) {
        await client.graphql({
          query: updatePatch,
          variables: { input: { ...patchInput, id: editingPatch.id } },
          authMode: 'userPool',
        });
      } else {
        await client.graphql({
          query: createPatch,
          variables: { input: patchInput },
          authMode: 'userPool',
        });
      }

      cancelEdit();
      fetchPatches();
    } catch (err) {
      console.error('Error saving patch:', err);
    } finally {
      setLoading(false);
    }
  };

  if (isAdmin === null) return <p className="p-6">Checking permissions...</p>;
  if (!isAdmin) return <p className="p-6 text-red-600 font-semibold">⛔ Access denied. Admins only.</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🛠️ Admin: Manage Hiking Patches</h1>

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
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          className="w-full"
        />
        {imageFile && (
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            className="h-24 object-contain"
          />
        )}
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
      </form>

      <table className="w-full table-auto border border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Image</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patches.map((patch) => (
            <tr key={patch.id}>
              <td className="border px-4 py-2">{patch.name}</td>
              <td className="border px-4 py-2">{patch.description}</td>
              <td className="border px-4 py-2">
                <img src={patch.imageUrl} alt={patch.name} className="h-16" />
              </td>
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
    </div>
  );
}

type Patch = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
};

