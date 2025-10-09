// src/components/WishHeartButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import {
  userPatchesByUserByPatchLite,
} from '@/graphql/custom-queries';

import {
  createUserPatchLite,
  updateUserPatchLite,
} from '@/graphql/custom-queries';
import { GraphQLResult } from '@aws-amplify/api';

type UserPatchesByUserByPatchLiteResult = {
  userPatchesByUserByPatch?: {
    items?: ({ id: string } | null)[] | null;
  } | null;
};

const client = generateClient();

type Props = {
  patchId: string;
  initial?: boolean;                          // initial wishlisted state
  onChange?: (next: boolean) => void;         // bubble up so parent can update local filter state
  className?: string;
};

export default function WishHeartButton({ patchId, initial = false, onChange, className }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [wish, setWish] = useState<boolean>(initial);

  useEffect(() => {
    setWish(initial);
  }, [initial]);

  const toggle = async () => {
    if (!user?.userId) {
      router.push('/login');                  // or show a toast
      return;
    }
    if (busy) return;
    console.log("wish: "+wish);
    const next = !wish;
    console.log("next: "+next);
    setWish(next);                            // optimistic
    onChange?.(next);
    setBusy(true);

    try {
      // Find existing row for (user, patch)
      const q = await client.graphql({
        query: userPatchesByUserByPatchLite,
        variables: { userID: user.userId, patchID: patchId, limit: 1 },
        authMode: 'userPool',
      })as GraphQLResult<UserPatchesByUserByPatchLiteResult>;

      const existing = q.data?.userPatchesByUserByPatch?.items?.[0];

      if (existing?.id) {
        await client.graphql({
          query: updateUserPatchLite,
          variables: { input: { id: existing.id, wishlisted: next } },
          authMode: 'userPool',
        });
      } else {
        // create a bare row with wishlisted=true (progress fields null/false)
        await client.graphql({
          query: createUserPatchLite,
          variables: {
            input: {
              userID: user.userId,
              patchID: patchId,
              wishlisted: next,
              inProgress: false,
              dateCompleted: null,
            },
          },
          authMode: 'userPool',
        });
      }
    } catch (e) {
      console.error('wishlist toggle failed', e);
      // revert optimistic update on error
      setWish(!next);
      onChange?.(!next);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      aria-pressed={wish ? 'true' : 'false'}
      aria-label={wish ? 'Remove from wishlist' : 'Add to wishlist'}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(); }}
      disabled={busy}
      className={`rounded-full p-1 hover:bg-gray-100 disabled:opacity-50 ${className ?? ''}`}
      title={wish ? 'Wishlisted' : 'Add to wishlist'}
    >
      {/* Heart icon (outline when false, filled when true) */}
      <svg
        viewBox="0 0 24 24"
        className={`h-5 w-5 ${wish ? 'text-red-500' : 'text-red-500'}`}
        aria-hidden="true"
        shapeRendering="geometricPrecision"
      >
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"
          fill={wish ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

