'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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

export function usePatchProgressSummary(
  patchId: string | null,
  userId: string | null
) {
  const [progress, setProgress] = useState<PatchProgress | null>(null);

  // loading = first load only (when no cached progress)
  const [loading, setLoading] = useState<boolean>(!!(patchId && userId));

  // refreshing = background refresh (keep UI visible)
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  // ✅ keep latest progress without making refresh() change identity
  const progressRef = useRef<PatchProgress | null>(null);
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  // prevent updates after unmount
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    if (!patchId || !userId) {
      setProgress(null);
      setLoading(false);
      setRefreshing(false);
      setError(null);
      return;
    }

    const hasCached = progressRef.current != null;
    if (hasCached) setRefreshing(true);
    else setLoading(true);

    setError(null);

    try {
      const r = (await client.graphql({
        query: getPatchProgressSummary,
        variables: { patchId, userId },
        authMode: 'userPool',
      })) as { data: GetPatchProgressSummaryQuery };

      const p = r.data?.getPatchProgressSummary ?? null;

      const next = p
        ? {
            completed: p.completed,
            denom: p.denom,
            percent: p.percent,
            note: p.note ?? null,
          }
        : null;

      if (alive.current) setProgress(next);
    } catch (e) {
      console.error('getPatchProgressSummary failed:', e);
      // ✅ keep old progress visible
      if (alive.current) setError('Failed to load progress.');
    } finally {
      if (!alive.current) return;
      setLoading(false);
      setRefreshing(false);
    }
  }, [patchId, userId]); // ✅ NO progress here

  // initial load + when patchId/userId changes
  useEffect(() => {
    refresh();
  }, [refresh]);

  return { progress, loading, refreshing, error, refresh };
}

