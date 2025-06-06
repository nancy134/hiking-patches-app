'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { uploadData, getUrl } from 'aws-amplify/storage';
import { generateClient } from 'aws-amplify/api';
import { 
  createPatch,
  updatePatch,
  deletePatch
} from '@/graphql/mutations';
import { fetchAuthSession } from 'aws-amplify/auth';
import {
  listPatches,
} from '@/graphql/queries';

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
  const [success, setSuccess] = useState(false);
  const [patches, setPatches] = useState<Patch[]>([]);
  const [newPatch, setNewPatch] = useState({ name: '', description: '', imageUrl: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingPatch, setEditingPatch] = useState<Partial<Patch> | null>(null);

  const fetchPatches = async () => {
    const response = await client.graphql({ query: listPatches });
    setPatches(response.data.listPatches.items);
  };

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          setIsAdmin(false);
          return;
        }

        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();

        if (!idToken) {
          setIsAdmin(false);
          return;
        }

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
  }, []);

  const handleAdd = async () => {
    if (!newPatch.name) return;
    await client.graphql({
      query: createPatch,
      variables: {
        input: { ...newPatch }
      },
      authMode: 'userPool',
    });
    setNewPatch({ name: '', description: '', imageUrl: '' });
    await fetchPatches();
  };

  const handleEdit = (patch: Patch) => {
    setEditingPatch(patch);
    setName(patch.name);
    setDescription(patch.description);
    //setImageUrl(patch.imageUrl);
  };

  const handleDelete = async (id: string) => {
    await client.graphql({
      query: deletePatch,
      variables: { input: { id } },
      authMode: 'userPool',
    });
    fetchPatches();
  };

  const cancelEdit = () => {
    setEditingPatch(null);
    setName('');
    setDescription('');
    setImageFile(null);
  };

  const handleUpdate = async () => {
    await client.graphql({
      query: updatePatch,
      variables: { input: editingPatch },
      authMode: 'userPool',
    });
    setEditingId(null);
    setEditingPatch({});
    fetchPatches();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || (editingPatch === null && !imageFile)) return;
    setLoading(true);
    setSuccess(false);
    try {
      let imageUrl = editingPatch?.imageUrl ?? '';
      if (imageFile){
        const filename = `${Date.now()}-${imageFile.name}`;
        await uploadData({
          key: filename,
          data: imageFile,
          options: { accessLevel: 'public', contentType: imageFile.type }
        }).result;

        if (!bucket || !region) {
          throw new Error('Missing S3 bucket or region in Amplify config');
        }

        // Construct public URL
        const url = `https://${bucket}.s3.${region}.amazonaws.com/public/${filename}`;
        imageUrl = url;
      }
      if (editingPatch){
        await client.graphql({
          query: updatePatch,
          variables: {
            input: {
              id: editingPatch.id,
              name,
              description,
              imageUrl
            },
          },
          authMode: "userPool"
        });
      } else {
        await client.graphql({
          query: createPatch,
          variables: {
            input: { name, description, imageUrl },
          },
          authMode: 'userPool',
        });
      }
      setName('');
      setDescription('');
      setImageFile(null);
      setSuccess(true);
      setEditingPatch(null);
      await fetchPatches();
    } catch (err) {
      console.error('Error creating patch:', err);
    } finally {
      setLoading(false);
    }
  };

  if (isAdmin === null) {
    return <p className="p-6">Checking permissions...</p>;
  }

  if (!isAdmin) {
    return <p className="p-6 text-red-600 font-semibold">⛔ Access denied. Admins only.</p>;
  }

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
      {success && <p className="text-green-600 mt-4">✅ Patch added successfully!</p>}

      {/* Patch List */}
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

