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

  useEffect(() => {
    let cancelled = false;
    if (!user?.userId || !patchId) { setPercent(null); return; }

    (async () => {
      try {
        const r = await client.graphql({
          query: getPatchProgressSummary,
          variables: { patchId, userId: user.userId },
          authMode: 'userPool',
        });
        const p = r.data?.getPatchProgressSummary?.percent ?? 0;
        if (!cancelled) setPercent(p);
      } catch (e) {
        console.error('progress overlay error', e);
        if (!cancelled) setPercent(0);
      }
    })();

    return () => { cancelled = true; };
  }, [patchId, user?.userId]);

  // Not signed in? or still loading? or 0% progress? → render nothing
  if (!user) return null;
  const pct = percent == null ? null : Math.max(0, Math.min(100, percent));
  if (pct == null || pct <= 0) return null;

  return (
    <div className={className}>
      <div className="h-1.5 bg-gray-200 rounded overflow-hidden">
        <div
          className={`h-full rounded ${pct === 100 ? 'bg-green-600' : 'bg-green-500'}`}
          style={{ width: `${pct}%`, transition: 'width 400ms ease' }}
          aria-label={`Progress ${pct}%`}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-[11px] text-gray-600 text-center tabular-nums">
          {pct}%
        </div>
      )}
    </div>
  );
}

