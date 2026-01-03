// src/components/PatchProgress.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { GraphQLResult } from '@aws-amplify/api';
import { generateClient } from 'aws-amplify/api';

import type {
  CreateUserPatchMutation,
  UpdateUserPatchMutation,
  UserPatch,
} from '@/API';
import {
  customCreateUserPatch,
  customUpdateUserPatch,
} from '@/graphql/custom-queries';

const client = generateClient();

type Status = 'none' | 'inProgress' | 'completed';

interface PatchProgressProps {
  patchId: string;
  userId: string;
  initialUserPatch: UserPatch | null;

  // overall progress + structure flags
  progressPercent?: number | null;
  hasPeaks?: boolean;
  hasTrails?: boolean;

  onUpdate: (patch: UserPatch | null) => void;
}

function deriveStatus(p: UserPatch | null): Status {
  if (!p) return 'none';
  if (p.dateCompleted) return 'completed';
  if (p.inProgress) return 'inProgress';
  return 'none';
}

function statusLabel(s: Status) {
  if (s === 'completed') return 'Completed';
  if (s === 'inProgress') return 'In progress';
  return 'Not started';
}

function statusChipStyles(s: Status) {
  switch (s) {
    case 'completed':
      return {
        text: 'text-green-800',
        bg: 'bg-green-100',
        border: 'border-green-200',
        dot: 'bg-green-500',
      };
    case 'inProgress':
      return {
        text: 'text-blue-800',
        bg: 'bg-blue-100',
        border: 'border-blue-200',
        dot: 'bg-blue-500',
      };
    default:
      return {
        text: 'text-slate-800',
        bg: 'bg-slate-100',
        border: 'border-slate-200',
        dot: 'bg-slate-500',
      };
  }
}

export default function PatchProgress({
  patchId,
  userId,
  initialUserPatch,
  progressPercent,
  hasPeaks,
  hasTrails,
  onUpdate,
}: PatchProgressProps) {
  const dateRef = useRef<HTMLInputElement>(null);

  // ----- local editor state -----
  const [status, setStatus] = useState<Status>(() =>
    deriveStatus(initialUserPatch)
  );
  const [dateCompleted, setDateCompleted] = useState<string>(
    initialUserPatch?.dateCompleted ?? ''
  );
  const [wishlisted, setWishlisted] = useState<boolean>(
    !!initialUserPatch?.wishlisted
  );

  // track baseline for canSubmit
  const initialWish = useMemo(
    () => !!initialUserPatch?.wishlisted,
    [initialUserPatch]
  );
  const originalStatus = deriveStatus(initialUserPatch);

  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // whenever the saved patch changes, sync editor + collapse
    setStatus(deriveStatus(initialUserPatch));
    setDateCompleted(initialUserPatch?.dateCompleted ?? '');
    setWishlisted(!!initialUserPatch?.wishlisted);
    setIsEditing(false);
  }, [initialUserPatch]);

  const canSubmit =
    status !== originalStatus ||
    wishlisted !== initialWish ||
    (status === 'completed' &&
      dateCompleted !== (initialUserPatch?.dateCompleted ?? ''));

  // ----- gating for Completed -----
  const pct = progressPercent ?? 0;
  const hasStructuredProgress = !!(hasPeaks || hasTrails);
  // lock "Completed" when we have structured progress and it's not 100%
  const lockCompleted = hasStructuredProgress && pct < 100;

  // ----- save -----
  async function handleSave() {
    setMessage('');

    if (status === 'completed' && lockCompleted) {
      setMessage(
        'To mark this patch as completed, first finish the required mountains and trails below.'
      );
      return;
    }

    if (status === 'completed' && !dateCompleted) {
      setMessage('Please select a completion date.');
      dateRef.current?.focus();
      return;
    }

    const input: any = {
      patchID: patchId,
      userID: userId,
      wishlisted,
    };

    if (status === 'completed') {
      input.dateCompleted = dateCompleted;
      input.inProgress = false;
    } else if (status === 'inProgress') {
      input.dateCompleted = null;
      input.inProgress = true;
    } else {
      input.dateCompleted = null;
      input.inProgress = null;
    }

    const mutation = initialUserPatch
      ? customUpdateUserPatch
      : customCreateUserPatch;

    if (initialUserPatch) input.id = initialUserPatch.id;

    try {
      const response = (await client.graphql({
        query: mutation,
        variables: { input },
        authMode: 'userPool',
      })) as GraphQLResult<CreateUserPatchMutation | UpdateUserPatchMutation>;

      const updated = initialUserPatch
        ? (response.data as UpdateUserPatchMutation)?.updateUserPatch
        : (response.data as CreateUserPatchMutation)?.createUserPatch;

      if (updated) {
        onUpdate(updated as UserPatch);
        setMessage('✔ Progress saved.');
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error updating patch progress:', err);
      setMessage('❌ Failed to save.');
    }
  }

  // ----- clear -----
  async function handleClear() {
    setMessage('');

    if (!initialUserPatch) {
      setStatus('none');
      setDateCompleted('');
      setWishlisted(false);
      setMessage('🧹 Progress cleared.');
      setIsEditing(false);
      return;
    }

    try {
      if (initialUserPatch.wishlisted) {
        // keep row but clear status
        const response = (await client.graphql({
          query: customUpdateUserPatch,
          variables: {
            input: {
              id: initialUserPatch.id,
              dateCompleted: null,
              inProgress: null,
              // keep wishlisted as-is
            },
          },
          authMode: 'userPool',
        })) as GraphQLResult<UpdateUserPatchMutation>;

        const updated = response.data?.updateUserPatch ?? null;
        onUpdate(updated as any);
      } else {
        // delete entire row if not wishlisted
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

      setStatus('none');
      setDateCompleted('');
      setWishlisted(initialUserPatch.wishlisted ?? false);
      setMessage('🧹 Progress cleared.');
      setIsEditing(false);
    } catch (err) {
      console.error('Error clearing progress:', err);
      setMessage('❌ Failed to clear.');
    }
  }

  // ----- cancel edits -----
  function handleCancelEdit() {
    setMessage('');
    setStatus(deriveStatus(initialUserPatch));
    setDateCompleted(initialUserPatch?.dateCompleted ?? '');
    setWishlisted(!!initialUserPatch?.wishlisted);
    setIsEditing(false);
  }

  // ----- UI config -----
  const hasExisting = !!initialUserPatch;

  const statusOptions: {
    key: Status;
    label: string;
    selectedClass: string;
    dotClass: string;
  }[] = [
    {
      key: 'none',
      label: 'Not started',
      selectedClass: 'bg-slate-100 border border-slate-400 text-slate-800',
      dotClass: 'bg-slate-500',
    },
    {
      key: 'inProgress',
      label: 'In progress',
      selectedClass: 'bg-blue-100 border border-blue-500 text-blue-800',
      dotClass: 'bg-blue-500',
    },
    {
      key: 'completed',
      label: 'Completed',
      selectedClass: 'bg-green-100 border border-green-500 text-green-800',
      dotClass: 'bg-green-500',
    },
  ];

  // ----- summary uses SAVED state -----
  const savedStatus = deriveStatus(initialUserPatch);
  const savedWishlisted = !!initialUserPatch?.wishlisted;

  const savedStyles = statusChipStyles(savedStatus);
  const savedLabel = statusLabel(savedStatus);

  return (
    <div className="space-y-2">
      {/* Summary row (chips) */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
          Overall Patch Status:
        </span>

        {/* Status chip */}
        <span
          className={`
            inline-flex items-center gap-2 whitespace-nowrap
            rounded-full border px-2.5 py-1 text-xs font-semibold
            ${savedStyles.bg} ${savedStyles.border} ${savedStyles.text}
          `}
        >
          <span className={`h-2 w-2 rounded-full ${savedStyles.dot}`} />
          {savedLabel}
        </span>

        {/* Wishlisted chip */}
        {savedWishlisted && (
          <span
            className="
              inline-flex items-center gap-1 whitespace-nowrap
              rounded-full border border-red-200 bg-red-50
              px-2.5 py-1 text-xs font-semibold text-red-700
            "
          >
            <span aria-hidden="true">♥</span>
            Wishlisted
          </span>
        )}

        {/* Progress chip */}
        {hasStructuredProgress && (
          <span
            className="
              inline-flex items-center whitespace-nowrap
              rounded-full border border-gray-200 bg-gray-50
              px-2.5 py-1 text-xs font-semibold text-gray-700
            "
            title="Completion percent"
          >
            {pct}% complete
          </span>
        )}
        <button
         type="button"
          onClick={() => {
            setMessage('');
            setIsEditing((v) => !v);
          }}
          className="
            inline-flex items-center gap-1 whitespace-nowrap
            rounded-full border border-blue-300
            bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800
            hover:bg-blue-100
            focus:outline-none focus:ring-2 focus:ring-blue-300
          "
        >
          {isEditing ? (
            <>
              <span aria-hidden="true">▲</span>
              Hide
            </>
          ) : (
            <>
              <span aria-hidden="true">✎</span>
              Edit
            </>
          )}
        </button>
      </div>

      {/* Editor (collapsible) - compact single-row layout */}
      {isEditing && (
        <div className="space-y-2 rounded-md border border-gray-200 bg-white p-3">
          {/* Top row: Wishlist + Status + Date + Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Wishlist */}
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={wishlisted}
                onChange={(e) => setWishlisted(e.target.checked)}
                className="accent-red-500"
              />
              <span className="flex items-center gap-1 text-sm font-medium">
                Wishlist
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 text-red-500"
                  aria-hidden="true"
                >
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"
                    fill={wishlisted ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth={1.5}
                  />
                </svg>
              </span>
            </label>

            {/* Status selector (inline) */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
               Status:
              </span>

              <div className="inline-flex rounded-full bg-gray-100 p-1 shadow-inner text-sm">
                {statusOptions.map((opt) => {
                  const selected = status === opt.key;
                  const isCompletedOpt = opt.key === 'completed';
                  const disabled = isCompletedOpt && lockCompleted;

                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => {
                        if (disabled) {
                          setMessage(
                            'To mark this patch as completed, first finish the required mountains and trails below.'
                          );
                          return;
                        }
                        setStatus(opt.key);
                        if (opt.key === 'completed' && !dateCompleted) {
                          setTimeout(() => dateRef.current?.focus(), 0);
                        }
                      }}
                      disabled={disabled}
                      title={
                        disabled
                          ? 'Finish the required mountains and trails to complete this patch.'
                          : undefined
                      }
                      className={`
                        flex items-center gap-1 px-3 py-1.5 rounded-full mx-0.5 transition-all
                        ${
                          selected
                            ? opt.selectedClass + ' font-semibold shadow-sm'
                            : 'text-gray-600 hover:bg-white'
                        }
                        ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
                      `}
                    >
                      {selected && (
                        <span
                          className={`inline-block h-2 w-2 rounded-full ${opt.dotClass}`}
                        />
                      )}
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Completion date (inline, only when needed) */}
            {status === 'completed' && !lockCompleted && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700 whitespace-nowrap">
                  Date:
                </label>
                <input
                  ref={dateRef}
                  type="date"
                  value={dateCompleted}
                  onChange={(e) => setDateCompleted(e.target.value)}
                  className="border rounded px-2 py-1 text-sm bg-white"
                />
              </div>
            )}

            {/* Actions (on the same row, pushed right) */}
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <button
                onClick={handleSave}
                disabled={!canSubmit}
                className={`px-3 py-1.5 rounded text-sm font-medium text-white ${
                  canSubmit
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Save
              </button>

              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-3 py-1.5 rounded text-sm font-medium border text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              {hasExisting && (
                <button
                  onClick={handleClear}
                  className="px-3 py-1.5 rounded text-sm font-medium text-white bg-red-500 hover:bg-red-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Helper text (only when structured progress exists) */}
          {hasStructuredProgress && (
            <p className="text-xs text-gray-500">
              Completion is based on your mountains and trails below. Once you hit
              100%, you can mark the patch as completed here.
            </p>
          )}

          {/* Messages */}
          {message && <p className="text-sm text-gray-600">{message}</p>}
        </div>
      )}

    </div>
  );
}

