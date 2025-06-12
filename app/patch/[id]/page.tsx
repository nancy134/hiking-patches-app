// app/patch/[id]/page.tsx
'use client';
import { getCurrentUser } from 'aws-amplify/auth';
import { 
  createUserPatch,
  updateUserPatch
} from '@/graphql/mutations';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { generateClient } from 'aws-amplify/api';
import { 
  getPatch,
  listUserPatches
} from '@/graphql/queries';
import { 
  Patch,
  UserPatch
} from '@/API';
import Header from '@/components/Header';
import ReactMarkdown from 'react-markdown';

const client = generateClient();

const customCreateUserPatch = `
  mutation CreateUserPatch($input: CreateUserPatchInput!) {
    createUserPatch(input: $input) {
      id
      patchID
      userID
      dateCompleted
      notes
      difficulty
      imageUrl
      createdAt
      updatedAt
    }
  }
`;

const customUpdateUserPatch = `
  mutation UpdateUserPatch($input: UpdateUserPatchInput!) {
    updateUserPatch(input: $input) {
      id
      patchID
      userID
      dateCompleted
      notes
      difficulty
      imageUrl
      createdAt
      updatedAt
    }
  }
`;

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
  const [showModal, setShowModal] = useState(false);
  const [userPatch, setUserPatch] = useState<UserPatch | null>(null);

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
        setPatch(response.data?.getPatch as Patch);
      } catch (error) {
        console.error('Error fetching patch:', error);
      }
    };

    if (id) fetchPatch();
  }, [id]);

  useEffect(() => {
    const fetchUserPatch = async () => {
      console.log("fetchUserPatch");
      if (!currentUser?.userId || !id) return;
      try {
        const response = await client.graphql({
          query: listUserPatches,
          variables: {
            filter: {
              userID: { eq: currentUser.userId },
              patchID: { eq: id },
            },
          },
        });
        const match = response.data?.listUserPatches?.items?.[0];
        console.log(match);
        if (match) {
          setUserPatch(match);
          setDateCompleted(match.dateCompleted);
          setDifficulty(match.difficulty?.toString() || '');
          setNotes(match.notes || '');
        }
      } catch (err) {
        console.error('Error fetching userPatch:', err);
      }
    };
    console.log("useEffect");
    fetchUserPatch();
  }, [currentUser, id]);

  const handleSubmit = async () => {
    if (!patch || !currentUser?.userId) {
      setMessage('❌ Missing patch or user information.');
      return;
    }

    const input = {
      patchID: patch.id,
      userID: currentUser.userId,
      dateCompleted,
      difficulty: parseInt(difficulty),
      notes,
      ...(userPatch && { id: userPatch.id }), // include ID if updating
    };

    try {
      const mutation = userPatch ? customUpdateUserPatch : customCreateUserPatch;
      await client.graphql({
        query: mutation,
        variables: { input},
        authMode: 'userPool'
      });
      setMessage('🎉 Patch marked as completed!');
      setShowModal(false);
    } catch (err) {
      console.error('Error submitting UserPatch:', err);
      setMessage('❌ Failed to mark patch as completed.');
    }
  };
  if (!patch) return <p className="p-4">Loading patch...</p>;
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Header />
      <div className="mb-4">
        <h1 className="text-3xl font-bold mb-2">{patch.name}</h1>
        {patch.imageUrl && (
        <img
          src={patch.imageUrl}
          alt={patch.name}
          className="w-40 float-right mr-4 mb-2 rounded shadow"
        />
        )}
        <p className="text-lg mb-2">{patch.description}</p>
          {Array.isArray(patch.regions) && patch.regions.length > 0 && (
          <p className="text-gray-700 mb-4">
            <strong>Regions:</strong> {patch.regions.filter(Boolean).join(', ')}
          </p>
          )}
      </div>
      {patch.howToGet && (
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">How to Get This Patch</h2>
        <ReactMarkdown>{patch.howToGet}</ReactMarkdown>
      </div>
      )}
      {currentUser ? (
      <div className="mt-6">
        {userPatch ? (
        <div className="p-4 bg-green-50 border rounded shadow">
          <p className="text-green-800">
            ✅ You completed this patch on <strong>{userPatch.dateCompleted}</strong>
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit Entry
          </button>
        </div>
        ) : (
        <button
          onClick={() => setShowModal(true)}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Mark as Completed
        </button>
        )}
        {showModal && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4">
              {userPatch ? 'Edit Completion Info' : 'Mark Patch as Completed'}
            </h2>
            <label className="block mb-3">
              Date Completed:
              <input
                type="date"
                value={dateCompleted}
                onChange={(e) => setDateCompleted(e.target.value)}
                className="block w-full border p-2 rounded"
              />
            </label>

            <label className="block mb-3">
              Difficulty (1–5):
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="block w-full border p-2 rounded"
              >
                <option value="">Select</option>
                {[1, 2, 3, 4, 5].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </label>
            <label className="block mb-3">
              Notes:
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="block w-full border p-2 rounded"
              />
            </label>
            <div className="flex justify-between mt-4">
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Submit
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
            {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
          </div>
        </div>
        )}
      </div>   
      ) : (
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded text-blue-800">
        Want to keep track of your progress?{' '}
        <a href="/my-patches" className="underline text-blue-700 hover:text-blue-900">
          Log in
        </a>{' '}
         to mark this patch as completed and add your own notes.
      </div>
      )}
    </div>
  );
}

