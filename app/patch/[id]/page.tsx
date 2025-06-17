// app/patch/[id]/page.tsx
'use client';
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
import { useAuth } from '@/context/auth-context';
import { GraphQLResult } from '@aws-amplify/api';
import {
  UpdateUserPatchMutation,
  CreateUserPatchMutation,
} from '@/API';

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
  const [dateCompleted, setDateCompleted] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [userPatch, setUserPatch] = useState<UserPatch | null>(null);
  const [isInProgress, setIsInProgress] = useState(false);
  const { user } = useAuth();

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
      if (!user?.userId || !id) return;
      try {
        const response = await client.graphql({
          query: listUserPatches,
          variables: {
            filter: {
              userID: { eq: user.userId },
              patchID: { eq: id },
            },
          },
        });
        const match = response.data?.listUserPatches?.items?.[0];
        console.log(match);
        if (match) {
          setUserPatch(match);
          if (match.dateCompleted) setDateCompleted(match.dateCompleted);
          else setDateCompleted(null);
          setDifficulty(match.difficulty?.toString() || '');
          setNotes(match.notes || '');
          setIsInProgress(match.inProgress ?? false);
        }
      } catch (err) {
        console.error('Error fetching userPatch:', err);
      }
    };
    console.log("useEffect");
    fetchUserPatch();
  }, [user, id]);

  // Update dateCompleted whenever "In Progress" is selected
  const handleInProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsInProgress(checked);
    if (checked) {
      setDateCompleted('');
    }
  };

  // Determine whether to enable Submit
  const canSubmit = isInProgress || Boolean(dateCompleted);

  const handleSubmit = async () => {
    if (!patch || !user?.userId) {
      setMessage('❌ Missing patch or user information.');
      return;
    }

    const input = {
      patchID: patch.id,
      userID: user.userId,
      dateCompleted: dateCompleted ? dateCompleted : null,
      difficulty: difficulty ? parseInt(difficulty) : null,
      notes: notes ? notes : null,
      ...(userPatch && { id: userPatch.id }), // include ID if updating
    };

    try {
      const mutation = userPatch ? customUpdateUserPatch : customCreateUserPatch;
      const response = await client.graphql({
        query: mutation,
        variables: { input},
        authMode: 'userPool'
      }) as GraphQLResult<UpdateUserPatchMutation | CreateUserPatchMutation>;
     

      let updatedUserPatch;

      if (userPatch) {
        const updateResponse = response as GraphQLResult<UpdateUserPatchMutation>;
        updatedUserPatch = updateResponse.data?.updateUserPatch;
      } else {
         const createResponse = response as GraphQLResult<CreateUserPatchMutation>;
         updatedUserPatch = createResponse.data?.createUserPatch;
     }
 
      //const updatedUserPatch = userPatch ? response.data?.updateUserPatch : response.data?.createUserPatch;
      console.log(updatedUserPatch);
      if (updatedUserPatch) setUserPatch(updatedUserPatch);
      setMessage('🎉 Patch progress updated!');
      setShowModal(false);
    } catch (err) {
      console.error('Error submitting UserPatch:', err);
      setMessage('❌ Failed to mark patch as completed.');
    }
  };
  if (!patch) return <p className="p-4">Loading patch...</p>;
  return (
    <div className="p-4">
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
        <div className="prose">
        <ReactMarkdown
          components={{
            a: ({ href, children }) => {
              const isExternal = href?.startsWith('http');

              return isExternal ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline inline-flex items-center gap-1"
                >
                  {children}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 inline"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 13V18a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h5M15 3h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              ) : (
                <a href={href} className="text-blue-600 underline">
                  {children}
                </a>
              );
            },
          }}
        >{patch.howToGet}</ReactMarkdown>
        </div>
      </div>
      )}
      {user ? (
      <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Your Progress</h2>
        {userPatch ? (
        <div>
          {userPatch.dateCompleted ? (
          <p className="text-green-800">
            ✅ You completed this patch on <strong>{userPatch.dateCompleted}</strong>
          </p>
          ) : (
          <p className="text-yellow-800">
             This patch is In Progress
          </p>         
          )}
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
          Track Your Progress 
        </button>
        )}
        {showModal && (
<div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
  <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative">
    <h2 className="text-xl font-semibold mb-4">
      {userPatch ? 'Edit Completion Info' : 'Mark Patch as Completed'}
    </h2>

    <label className="block mb-3">
      <input
        type="checkbox"
        checked={isInProgress}
        onChange={handleInProgressChange}
        className="mr-2"
      />
      I'm still working on this patch
    </label>

    <label className="block mb-3">
      Date Completed:
      <input
        type="date"
        value={dateCompleted ?? ''}
        onChange={(e) => {
          setDateCompleted(e.target.value);
          setIsInProgress(false); // uncheck if they choose a date
        }}
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
      Notes (optional):
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="block w-full border p-2 rounded"
      />
    </label>

    <div className="flex justify-between mt-4">
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`px-4 py-2 rounded text-white ${canSubmit ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'}`}
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
        Want to keep track of your progress? Login to mark this patch as complete and add your own notes.
      </div>
      )}
    </div>
  );
}

