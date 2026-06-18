'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateClient } from 'aws-amplify/api';
import { fetchAuthSession } from 'aws-amplify/auth';
import { uploadData } from 'aws-amplify/storage';
import { useAuth } from '@/context/auth-context';
import Header from '@/components/Header';
import { s3Bucket as bucket, s3Region as region } from '@/lib/config';
import { patchOwnersByPatch as patchOwnersByPatchQuery } from '@/graphql/custom-queries';

const client = generateClient();

const getPatchForOwner = /* GraphQL */ `
  query GetPatchForOwner($id: ID!) {
    getPatch(id: $id) {
      id
      name
      description
      howToGet
      imageUrl
    }
  }
`;

type Stats = { inProgressCount: number; completedCount: number };

export default function OwnerDashboardClient({ id }: { id: string }) {
  const { user, authReady } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [patchName, setPatchName] = useState('');
  const [description, setDescription] = useState('');
  const [howToGet, setHowToGet] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Redirect anonymous users home once auth has settled.
  useEffect(() => {
    if (authReady && !user) router.replace('/');
  }, [authReady, user, router]);

  // Load patch fields + verify ownership.
  useEffect(() => {
    const load = async () => {
      if (!user?.userId || !id) return;
      try {
        const [patchRes, ownersRes] = await Promise.all([
          client.graphql({ query: getPatchForOwner, variables: { id }, authMode: 'userPool' }),
          client.graphql({
            query: patchOwnersByPatchQuery,
            variables: { patchID: id, limit: 100 },
            authMode: 'userPool',
          }),
        ]);
        const patch = (patchRes as any).data?.getPatch;
        const owners = (ownersRes as any).data?.patchOwnersByPatch?.items ?? [];
        setIsOwner(owners.some((o: any) => o.userID === user.userId));
        if (patch) {
          setPatchName(patch.name ?? '');
          setDescription(patch.description ?? '');
          setHowToGet(patch.howToGet ?? '');
          setImageUrl(patch.imageUrl ?? '');
        }
      } catch (err) {
        console.error('Error loading owner dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, id]);

  // Load aggregate stats once ownership is confirmed.
  useEffect(() => {
    const loadStats = async () => {
      if (!isOwner) return;
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();
        if (!token) return;
        const res = await fetch(`/api/patch-stats/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setStats(await res.json());
      } catch (err) {
        console.error('Error loading patch stats:', err);
      }
    };
    loadStats();
  }, [isOwner, id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      let newImageUrl = imageUrl;
      if (imageFile) {
        const filename = `public/${Date.now()}-${imageFile.name}`;
        await uploadData({ path: filename, data: imageFile }).result;
        newImageUrl = `https://${bucket}.s3.${region}.amazonaws.com/${filename}`;
      }

      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      if (!token) throw new Error('Not authenticated');

      const res = await fetch(`/api/owner-patch/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ description, howToGet, imageUrl: newImageUrl }),
      });

      if (!res.ok) throw new Error(`Save failed (${res.status})`);
      setImageUrl(newImageUrl);
      setImageFile(null);
      setMessage('✅ Saved! Your changes are live on the patch page.');
    } catch (err) {
      console.error('Error saving patch:', err);
      setMessage('❌ Something went wrong saving your changes.');
    } finally {
      setSaving(false);
    }
  };

  if (!authReady || loading) return <p className="p-6">Loading…</p>;
  if (!user) return null; // redirecting home
  if (!isOwner) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <Header />
        <p className="p-6 text-red-600 font-semibold">⛔ You are not an owner of this patch.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Header />
      <h1 className="text-2xl font-bold mb-1">Owner Dashboard</h1>
      <p className="text-gray-600 mb-6">{patchName}</p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border rounded-lg p-4 bg-white shadow text-center">
          <div className="text-3xl font-bold">{stats ? stats.inProgressCount : '—'}</div>
          <div className="text-sm text-gray-600">working on this patch</div>
        </div>
        <div className="border rounded-lg p-4 bg-white shadow text-center">
          <div className="text-3xl font-bold">{stats ? stats.completedCount : '—'}</div>
          <div className="text-sm text-gray-600">completed this patch</div>
        </div>
      </div>

      {/* Scoped edit form */}
      <form onSubmit={handleSave} className="space-y-4 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold">Edit Patch Details</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border rounded p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">How to Get This Patch</label>
          <textarea
            value={howToGet}
            onChange={(e) => setHowToGet(e.target.value)}
            rows={6}
            className="w-full border rounded p-2 text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">Markdown is supported.</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Patch Image</label>
          {imageUrl && (
            <img src={imageUrl} alt={patchName} className="w-32 h-auto rounded shadow mb-2" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          />
        </div>

        {message && <p className="text-sm">{message}</p>}

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
