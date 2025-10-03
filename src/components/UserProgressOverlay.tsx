// components/UserProgressOverlay.tsx
'use client';

import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { useAuth } from '@/context/auth-context';
import { getPatchProgressSummary } from '@/graphql/queries';

const client = generateClient();

type Props = {
  patchId: string;
  className?: string;   // for positioning in the card
  showLabel?: boolean;  // toggle % text
};

export default function UserProgressOverlay({ patchId, className, showLabel = true }: Props) {
  const { user } = useAuth();
  const [percent, setPercent] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!user?.userId || !patchId) { setPercent(null); return; }

    (async () => {
      setLoading(true);
      try {
        const r = await client.graphql({
          query: getPatchProgressSummary,
          variables: { patchId, userId: user.userId },
          authMode: 'userPool',
        });
        console.log(r.data);
        const p = r.data?.getPatchProgressSummary?.percent ?? 0;
        if (!cancelled) setPercent(p);
      } catch (e) {
        console.error('progress overlay error', e);
        if (!cancelled) setPercent(0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [patchId, user?.userId]);

  // Not signed in? no overlay
  if (!user) return null;

  const pct = Math.max(0, Math.min(100, percent ?? 0));

  return (
    <div className={className}>
      <div className="h-1.5 bg-gray-200 rounded overflow-hidden">
        <div
          className={`h-full rounded ${pct === 100 ? 'bg-green-600' : 'bg-green-500'}`}
          style={{ width: loading ? '0%' : `${pct}%`, transition: 'width 400ms ease' }}
          aria-label={`Progress ${pct}%`}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-[11px] text-gray-600 text-center tabular-nums">
          {loading ? '…' : `${pct}%`}
        </div>
      )}
    </div>
  );
}

