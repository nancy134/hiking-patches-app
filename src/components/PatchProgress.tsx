'use client';
import { useState } from 'react';
import { GraphQLResult } from '@aws-amplify/api';
import { CreateUserPatchMutation, UpdateUserPatchMutation, UserPatch } from '@/API';
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

interface PatchProgressProps {
  patchId: string;
  userId: string;
  initialUserPatch: UserPatch | null;
  onUpdate: (patch: UserPatch | null) => void;
}

export default function PatchProgress({
  patchId,
  userId,
  initialUserPatch,
  onUpdate,
}: PatchProgressProps) {
  const [dateCompleted, setDateCompleted] = useState<string | null>(initialUserPatch?.dateCompleted ?? null);
  const [difficulty, setDifficulty] = useState(initialUserPatch?.difficulty?.toString() || '');
  const [notes, setNotes] = useState(initialUserPatch?.notes || '');
  const [isInProgress, setIsInProgress] = useState<boolean | null>(initialUserPatch?.inProgress ?? null);
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    const input = {
      patchID: patchId,
      userID: userId,
      dateCompleted: isInProgress ? null : dateCompleted || null,
      difficulty: difficulty ? parseInt(difficulty) : null,
      inProgress: isInProgress,
      notes: notes || null,
      ...(initialUserPatch && { id: initialUserPatch.id }),
    };

    const mutation = initialUserPatch ? updateUserPatch : createUserPatch;

    try {
      const response = await client.graphql({
        query: mutation,
        variables: { input },
        authMode: 'userPool',
      }) as GraphQLResult<UpdateUserPatchMutation | CreateUserPatchMutation>;

      const updated = initialUserPatch
        ? (response.data as UpdateUserPatchMutation)?.updateUserPatch
        : (response.data as CreateUserPatchMutation)?.createUserPatch;

      if (updated) {
        onUpdate(updated);
        setMessage('🎉 Patch progress updated!');
      }
    } catch (err) {
      console.error('Error updating patch progress:', err);
      setMessage('❌ Failed to update progress.');
    }
  };

  const handleClear = async () => {
    if (!initialUserPatch) return;

    try {
      await client.graphql({
        query: `
          mutation DeleteUserPatch($input: DeleteUserPatchInput!) {
            deleteUserPatch(input: $input) { id }
          }
        `,
        variables: { input: { id: initialUserPatch.id } },
        authMode: 'userPool',
      });
      onUpdate(null);
      setDateCompleted(null);
      setDifficulty('');
      setNotes('');
      setIsInProgress(false);
      setMessage('🗑️ Progress cleared.');
    } catch (err) {
      console.error('Error clearing user patch:', err);
      setMessage('❌ Failed to clear progress.');
    }
  };

  const canSubmit = isInProgress !== null && (isInProgress || Boolean(dateCompleted));

  return (
    <div className="bg-gray-100 p-4 rounded shadow-md max-w-md">
      <div className="mb-3">
        <div className="flex gap-4">
          <label>
            <input
              type="radio"
              checked={isInProgress === true}
              onChange={() => setIsInProgress(true)}
              className="mr-2"
            />
            I'm working on this patch
          </label>
          <label>
            <input
              type="radio"
              checked={isInProgress === false}
              onChange={() => setIsInProgress(false)}
              className="mr-2"
            />
            I've completed this patch
          </label>
        </div>
      </div>

      <label className="block mb-3">
        Date Completed:
        <input
          type="date"
          value={dateCompleted ?? ''}
          onChange={(e) => setDateCompleted(e.target.value)}
          disabled={isInProgress !== false}
          className={`block w-full border p-2 rounded ${isInProgress !== false ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
        />
      </label>

      <div className="flex justify-between gap-2 mt-4">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`px-4 py-2 rounded text-white ${canSubmit ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          Save
        </button>
        {initialUserPatch && (
          <button
            onClick={handleClear}
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
          >
            Clear
          </button>
        )}
      </div>
      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
    </div>
  );
}

