// src/components/UserProgressOverlay.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { useAuth } from '@/context/auth-context';

const client = generateClient();

// replace this with your real query when ready
const getPatchProgressSummary = /* GraphQL */ `
  query GetPatchProgressSummary($patchId: ID!, $userId: ID!) {
    getPatchProgressSummary(patchId: $patchId, userId: $userId) {
      percent
    }
  }
`;

export default function UserProgressOverlay({ patchId }: { patchId: string }) {
  const { user } = useAuth();
  const [percent, setPercent] = useState<number | null>(null);
  const [started, setStarted] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!user?.userId) return;

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e.isIntersecting && !started) {
          setStarted(true);
          (async () => {
            try {
              const r = await client.graphql({
                query: getPatchProgressSummary,
                variables: { patchId, userId: user.userId },
                authMode: 'userPool',
              });
              const p = r.data?.getPatchProgressSummary?.percent;
              if (typeof p === 'number') setPercent(Math.max(0, Math.min(100, Math.round(p))));
            } catch {
              // ignore — overlay is optional
            }
          })();
        }
      },
      { rootMargin: '200px 0px' } // prefetch just before it scrolls in
    );

    io.observe(el);
    return () => io.disconnect();
  }, [user, patchId, started]);

  if (!user?.userId) return null;

  return (
    <div ref={ref} className="pointer-events-none absolute top-2 left-2 text-xs bg-black/70 text-white px-2 py-0.5 rounded">
      {percent == null ? '—' : `${percent}%`}
    </div>
  );
}

