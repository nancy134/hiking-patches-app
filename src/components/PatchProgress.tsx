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

const customCreateUserPatch = `
  mutation CreateUserPatch($input: CreateUserPatchInput!) {
    createUserPatch(input: $input) {
      id
      patchID
      userID
      dateCompleted
      inProgress
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
      inProgress
      notes
      difficulty
      imageUrl
      createdAt
      updatedAt
    }
  }
`;
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

    const mutation = initialUserPatch ? customUpdateUserPatch : customCreateUserPatch;

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
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">Patch Progress</h2>

    {/* Radio buttons */}
    <div className="space-y-2">
      { /*
      <label className="inline-flex items-center gap-2">
        <input
          type="radio"
          checked={isInProgress === null}
          onChange={() => setIsInProgress(null)}
          className="accent-blue-500"
        />
        I plan to work on this patch
      </label>
      */ }
      <label className="inline-flex items-center gap-2">
        <input
          type="radio"
          checked={isInProgress === true}
          onChange={() => setIsInProgress(true)}
          className="accent-blue-500"
        />
        I'm working on this patch
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            checked={isInProgress === false}
            onChange={() => setIsInProgress(false)}
            className="accent-blue-500"
          />
          I've completed this patch
        </label>

        <label className="flex items-center gap-2">
          <span>Date Completed:</span>
          <input
            type="date"
            value={dateCompleted ?? ''}
            onChange={(e) => setDateCompleted(e.target.value)}
            disabled={isInProgress !== false}
            className={`border p-1 rounded text-sm ${
              isInProgress !== false
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-white'
            }`}
          />
        </label>
      </div>
    </div>

    {/* Buttons */}
    <div className="flex items-center gap-3">
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`px-3 py-1.5 rounded text-sm font-medium text-white ${
          canSubmit
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        Save
      </button>
      {initialUserPatch && (
        <button
          onClick={handleClear}
          className="px-3 py-1.5 rounded text-sm font-medium text-white bg-red-500 hover:bg-red-600"
        >
          Clear
        </button>
      )}
    </div>

    {message && <p className="text-sm text-gray-600">{message}</p>}
  </div>
);

}

