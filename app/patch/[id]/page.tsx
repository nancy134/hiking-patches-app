// app/patch/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { generateClient } from 'aws-amplify/api';
import { getPatch } from '@/graphql/queries';
import { Patch } from '@/API';
import Header from '@/components/Header';

const client = generateClient();
type PatchDetailProps = {
  params: { id: string }
};
export default function PatchDetailPage({ params }: { params: { id?: string } }){
  const id = params.id;
  if (!id) {
    return <p>Missing patch ID</p>;
  }
  const [patch, setPatch] = useState<Patch | null>(null);

  useEffect(() => {
    const fetchPatch = async () => {
      try {
        const response = await client.graphql({
          query: getPatch,
          variables: { id },
        });
        setPatch(response.data?.getPatch ?? null);
      } catch (error) {
        console.error('Error fetching patch:', error);
      }
    };

    if (id) fetchPatch();
  }, [id]);

  if (!patch) return <p className="p-4">Loading patch...</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Header />
      <h1 className="text-3xl font-bold mb-4">{patch.name}</h1>
      {patch.imageUrl && (
        <img src={patch.imageUrl} alt={patch.name} className="w-full mb-4 rounded" />
      )}
      <p className="text-lg mb-2">{patch.description}</p>
      {Array.isArray(patch.regions) && patch.regions.length > 0 && (
        <p className="text-gray-700">Regions: {patch.regions.filter(Boolean).join(', ')}</p>
      )}
    </div>
  );
}

