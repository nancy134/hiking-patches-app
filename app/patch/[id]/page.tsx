// app/patch/[id]/page.tsx
'use client';
import { getCurrentUser } from 'aws-amplify/auth';
import { createUserPatch } from '@/graphql/mutations';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { generateClient } from 'aws-amplify/api';
import { getPatch } from '@/graphql/queries';
import { Patch } from '@/API';
import Header from '@/components/Header';

const client = generateClient();

export default function PatchDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  if (!id) {
    return <p>Missing patch ID</p>;
  }
  const [patch, setPatch] = useState<Patch | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [dateCompleted, setDateCompleted] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
useEffect(() => {
  getCurrentUser().then(setCurrentUser).catch(() => setCurrentUser(null));
}, []);
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

  const handleSubmit = async () => {
    try {
      await client.graphql({
        query: createUserPatch,
        variables: {
          input: {
            patchID: patch.id,
            userID: currentUser?.userId,
            dateCompleted,
            difficulty: parseInt(difficulty),
            notes,
          },
        },
        authMode: 'userPool'
      });
      setMessage('🎉 Patch marked as completed!');
    } catch (err) {
      console.error('Error submitting UserPatch:', err);
      setMessage('❌ Failed to mark patch as completed.');
    }
  };
  if (!patch) return <p className="p-4">Loading patch...</p>;
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Header />
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
        <h1 className="text-3xl font-bold mb-2 sm:mb-0">{patch.name}</h1>
        {patch.imageUrl && (
          <img
            src={patch.imageUrl}
            alt={patch.name}
            className="w-32 h-auto rounded shadow sm:ml-4"
          />
        )}
      </div>
      <p className="text-lg mb-4">{patch.description}</p>
      {Array.isArray(patch.regions) && patch.regions.length > 0 && (
        <p className="text-gray-700">Regions: {patch.regions.filter(Boolean).join(', ')}</p>
      )}
      {currentUser && (
      <div className="mt-8 p-4 border rounded shadow bg-gray-50">
        <h2 className="text-xl font-semibold mb-2">Mark as Completed</h2>

        <label className="block mb-2">
          Date Completed:
          <input
            type="date"
            value={dateCompleted}
            onChange={(e) => setDateCompleted(e.target.value)}
            className="block border p-1 rounded w-full"
          />
        </label>

        <label className="block mb-2">
          Difficulty (1–5):
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="block border p-1 rounded w-full"
          >
            <option value="">Select</option>
            {[1, 2, 3, 4, 5].map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </label>

        <label className="block mb-2">
          Notes:
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="block border p-1 rounded w-full"
          />
        </label>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-2 hover:bg-blue-700"
        >
          Submit
        </button>

        {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
      </div>
    )}
  </div>
  );
}

