// src/components/WishHeartButton.tsx
'use client';

import { useState } from 'react';
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
      });

      const existing = q?.data?.userPatchesByUserByPatch?.items?.[0];

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
      {/* Heart icon (filled if wishlisted) */}
      <svg viewBox="0 0 24 24" width="18" height="18" className="inline-block">
        <path
          d="M12 21s-6.7-4.35-9.33-7C-0.33 11 1.4 6.5 5.33 6.5c2 0 3.26 1.23 3.97 2.33.7-1.1 1.97-2.33 3.97-2.33 3.93 0 5.66 4.5 2.66 7.5C18.7 16.65 12 21 12 21z"
          fill={wish ? '#ef4444' : 'none'}
          stroke="#ef4444"
          strokeWidth="1.5"
        />
      </svg>
    </button>
  );
}

