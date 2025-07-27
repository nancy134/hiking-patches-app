'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { generateClient } from 'aws-amplify/api';
import { getPatch } from '@/graphql/queries';
import { Patch, Mountain } from '@/API';
import Header from '@/components/Header';
import { useAuth } from '@/context/auth-context';
import { listMountains } from '@/graphql/queries';
import { listPatchMountains } from '@/graphql/queries';
import { createPatchMountain } from '@/graphql/mutations';
import { getPatchWithMountains } from '@/graphql/custom-queries';
import MountainSelector from '@/components/MountainSelector';

const client = generateClient();

export default function AdminPatchDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  if (!id) {
    return <p>Missing patch ID</p>;
  }
  const { isAdmin } = useAuth();

  const [patch, setPatch] = useState<Patch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allMountains, setAllMountains] = useState<Mountain[]>([]);
  const [selectedMountainId, setSelectedMountainId] = useState<string>('');

  useEffect(() => {
    if (typeof id === 'string') {
      fetchPatch(id);
    }

  }, [id]);

useEffect(() => {
  if (!id) return;

  const fetchData = async () => {
    // Fetch all available mountains
    const allMountainData = await client.graphql({
      query: listMountains,
    });
    setAllMountains(allMountainData.data.listMountains.items);
  };

  fetchData();
}, [id]);

  const fetchPatch = async (patchId: string) => {
    try {
      const response = await client.graphql({
        query: getPatchWithMountains,
        variables: { id: patchId }
      });
      setPatch(response.data.getPatch);
    } catch (err) {
      console.error('Error fetching patch:', err);
      setError('Failed to load patch.');
    } finally {
      setLoading(false);
    }
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

  if (loading) return <p className="p-6">Loading patch details...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!patch) return <p className="p-6">Patch not found.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Header />
      <h1 className="text-2xl font-bold mb-4">🧭 Patch Details</h1>
      <div className="bg-white shadow rounded p-4 space-y-2">
        <p><strong>ID:</strong> {patch.id}</p>
        <p><strong>Name:</strong> {patch.name}</p>
        <p><strong>Description:</strong> {patch.description}</p>
        <p><strong>Regions:</strong> {(patch.regions ?? []).join(', ')}</p>
        <p><strong>Difficulty:</strong> {patch.difficulty}</p>
        <p><strong>Popularity:</strong> {patch.popularity}</p>
        <p><strong>Image:</strong> {patch.imageUrl && <img src={patch.imageUrl} alt={patch.name ?? ''} className="h-32 mt-2" />}</p>
      </div>
      <MountainSelector patchId={id}/>
    </div>

  );
}

