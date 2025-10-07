// src/components/PatchProgress.tsx
'use client';
import { useMemo, useRef, useEffect, useState } from 'react';
import { GraphQLResult } from '@aws-amplify/api';
import { CreateUserPatchMutation, UpdateUserPatchMutation, UserPatch } from '@/API';
import { generateClient } from 'aws-amplify/api';
import { customCreateUserPatch, customUpdateUserPatch } from '@/graphql/custom-queries';

const client = generateClient();

interface PatchProgressProps {
  patchId: string;
  userId: string;
  initialUserPatch: UserPatch | null;
  onUpdate: (patch: UserPatch | null) => void;
}

function deriveIsInProgress(p: UserPatch | null): boolean | null {
  if (!p) return null;
  if (p.dateCompleted) return false;           // proper “Completed”
  if (p.inProgress === true) return true;      // “In Progress”
  // If inProgress is false but there's no date, treat as "no selection"
  return null;
}

export default function PatchProgress({
  patchId,
  userId,
  initialUserPatch,
  onUpdate,
}: PatchProgressProps) {

  const dateRef = useRef<HTMLInputElement>(null);

  const [dateCompleted, setDateCompleted] = useState<string | null>(initialUserPatch?.dateCompleted ?? null);
  const [isInProgress, setIsInProgress] = useState<boolean | null>(deriveIsInProgress(initialUserPatch));

  const [difficulty, setDifficulty] = useState(initialUserPatch?.difficulty?.toString() || '');
  const [notes, setNotes] = useState(initialUserPatch?.notes || '');

  const [wishlisted, setWishlisted] = useState<boolean>(!!initialUserPatch?.wishlisted);
  const initialWish = useMemo(() => !!initialUserPatch?.wishlisted, [initialUserPatch]);

  const [message, setMessage] = useState('');

  // computed: Completed radio is only “checked” when we have a date
  const completedSelected = isInProgress === false && !!dateCompleted;

  // if the parent swaps initialUserPatch later, keep state consistent
  useEffect(() => {
    setIsInProgress(deriveIsInProgress(initialUserPatch));
    setDateCompleted(initialUserPatch?.dateCompleted ?? null);
  }, [initialUserPatch]);

  // when date is cleared while "Completed" was selected, unselect it
  useEffect(() => {
    if (isInProgress === false && !dateCompleted) {
      setIsInProgress(null);
    }
  }, [dateCompleted, isInProgress]);

  const handleSubmit = async () => {

    const goingCompleted = Boolean(dateCompleted);
    const goingInProgress = isInProgress === true && !dateCompleted;
    console.log("goingCompleted: "+goingCompleted+" goingInProgress: "+goingInProgress);
    const nextWishlisted =
      (goingCompleted || goingInProgress) ? false : (initialUserPatch?.wishlisted ?? false);
    console.log(initialUserPatch);
    console.log("nextWishlisted: "+nextWishlisted);
    const input: any = {
      patchID: patchId,
      userID: userId,

      dateCompleted: goingCompleted ? dateCompleted : null,
      inProgress: goingInProgress ? true : (goingCompleted ? false : null),
      wishlisted: nextWishlisted,

      difficulty: difficulty ? parseInt(difficulty) : null,
      notes: notes || null,

      ...(initialUserPatch && { id: initialUserPatch.id }),
    };

    const mutation = initialUserPatch ? customUpdateUserPatch : customCreateUserPatch;

    try {
      const response = (await client.graphql({
        query: mutation,
        variables: { input },
        authMode: 'userPool',
      })) as GraphQLResult<UpdateUserPatchMutation | CreateUserPatchMutation>;

      const updated = initialUserPatch
        ? (response.data as UpdateUserPatchMutation)?.updateUserPatch
        : (response.data as CreateUserPatchMutation)?.createUserPatch;

      if (updated) {
        onUpdate(updated);
        setMessage('🎉 Saved!');
      }
    } catch (err) {
      console.error('Error updating patch progress:', err);
      setMessage('❌ Failed to save.');
    }
  };

  // Clear PROGRESS but preserve wishlist if set
  const handleClear = async () => {
    if (!initialUserPatch) return;

    try {
      if (initialUserPatch.wishlisted) {
        // keep the row (so wishlist remains), just clear progress fields
        const response = (await client.graphql({
          query: customUpdateUserPatch,
          variables: {
            input: {
              id: initialUserPatch.id,
              dateCompleted: null,
              inProgress: null,
              difficulty: null,
              notes: null,
              // leave wishlisted AS IS
            },
          },
          authMode: 'userPool',
        })) as GraphQLResult<UpdateUserPatchMutation>;
        const updated = response.data?.updateUserPatch ?? null;
        onUpdate(updated as any);
      } else {
        // no wishlist → delete row as before
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
      }

      // local UI reset (preserve wishlist toggle if it was true)
      setDateCompleted(null);
      setDifficulty('');
      setNotes('');
      setIsInProgress(false);
      setWishlisted(initialUserPatch.wishlisted ?? false);
      setMessage('🧹 Progress cleared.');
    } catch (err) {
      console.error('Error clearing user patch:', err);
      setMessage('❌ Failed to clear.');
    }
  };

  // Enable Save if user set progress OR changed wishlist
  const canSubmit =
    (isInProgress !== null && (isInProgress || Boolean(dateCompleted))) ||
    wishlisted !== initialWish;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Patch Progress</h2>

      {/* Wishlist toggle */}
      <label className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          checked={wishlisted}
          onChange={(e) => setWishlisted(e.target.checked)}
          className="accent-red-500"
        />
        <span className="inline-flex items-center gap-1">
          Add to wishlist
          <svg viewBox="0 0 24 24" className={`h-4 w-4 ${wishlisted ? 'text-red-500' : 'text-red-500'}`} aria-hidden="true">
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"
              fill={wishlisted ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </label>

      {/* Progress radios */}
      <div className="space-y-2">
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
              // Only looks selected if there's a date
              checked={completedSelected}
              onChange={() => {
                // set target state, then nudge the user to pick a date
                setIsInProgress(false);
                if (!dateCompleted) {
                  // focus the date field to make it obvious
                  setTimeout(() => dateRef.current?.focus(), 0);
                }
              }}
              className="accent-blue-500"
            />
            I've completed this patch
          </label>
          <label className="flex items-center gap-2">
            <span>Date Completed:</span>
            <input
              ref={dateRef}
              type="date"
              value={dateCompleted ?? ''}
              onChange={(e) => setDateCompleted(e.target.value || null)}
              // date is enabled whenever the user wants to set completion
              // (we don't disable it when completedSelected is false so they can pick it first)
              className="border p-1 rounded text-sm bg-white"
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
            canSubmit ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'
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

