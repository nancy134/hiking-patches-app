'use client';
import { useCallback, useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getPatchProgressSummary } from '@/graphql/queries';
import type { GetPatchProgressSummaryQuery } from '@/API';

const client = generateClient();

export type PatchProgress = {
  completed: number;
  denom: number;
  percent: number;
  note?: string | null;
};

export function usePatchProgressSummary(patchId: string | null, userId: string | null) {
  const [progress, setProgress] = useState<PatchProgress | null>(null);
  const [loading, setLoading] = useState<boolean>(!!(patchId && userId));
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!patchId || !userId) { setProgress(null); setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const r = (await client.graphql({
        query: getPatchProgressSummary,
        variables: { patchId, userId },
        authMode: 'userPool',
      })) as { data: GetPatchProgressSummaryQuery };

      const p = r.data?.getPatchProgressSummary ?? null;
      setProgress(p ? { completed: p.completed, denom: p.denom, percent: p.percent, note: p.note ?? null } : null);
    } catch (e) {
      console.error('getPatchProgressSummary failed:', e);
      setError('Failed to load progress.');
      setProgress(null);
    } finally {
      setLoading(false);
    }
  }, [patchId, userId]);

  useEffect(() => { refresh(); }, [refresh]);

  return { progress, loading, error, refresh };
}

