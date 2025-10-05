// app/my-patches/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Header from '@/components/Header';
import PatchGrid from '@/components/PatchGrid';
import { generateClient } from 'aws-amplify/api';
import { listUserPatchesWithPatch } from '@/graphql/custom-queries';
import { Patch, UserPatch } from '@/API';
import { useAuth } from '@/context/auth-context';

const client = generateClient();

export default function MyPatchesPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<UserPatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user?.userId) { setRows([]); setLoading(false); return; }
      setLoading(true);
      try {
        const r = await client.graphql({
          query: listUserPatchesWithPatch,
          variables: { filter: { userID: { eq: user.userId } } },
          authMode: 'userPool',
        });
        const items: UserPatch[] = r.data?.listUserPatches?.items?.filter(Boolean) ?? [];
        // keep only started/completed
        const meaningful = items.filter(up => up.dateCompleted || up.inProgress);
        if (!cancelled) setRows(meaningful);
      } catch (e) {
        console.error('my-patches load failed', e);
        if (!cancelled) setRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.userId]);

  // Build the same inputs PatchGrid expects: Patch[] + userPatchMap
  const { patches, userPatchMap } = useMemo(() => {
    const map = new Map<string, { dateCompleted: string | null; inProgress: boolean }>();
    const seen = new Set<string>();
    const out: Patch[] = [];

    for (const up of rows) {
      const pid = up.patchID;
      if (!pid) continue;

      // prefer Completed over In Progress if both exist
      const prev = map.get(pid);
      const thisCompleted = !!up.dateCompleted;
      const thisInProgress = !!up.inProgress && !up.dateCompleted;

      if (!prev) {
        map.set(pid, { dateCompleted: up.dateCompleted ?? null, inProgress: thisInProgress });
      } else {
        const prevCompleted = !!prev.dateCompleted;
        if (!prevCompleted && thisCompleted) {
          map.set(pid, { dateCompleted: up.dateCompleted ?? null, inProgress: false });
        } else if (!prevCompleted && thisInProgress) {
          map.set(pid, { dateCompleted: null, inProgress: true });
        }
      }

      // collect the Patch object once
      const p = up.patch as Patch | null | undefined;
      if (p?.id && !seen.has(p.id)) {
        seen.add(p.id);
        out.push(p);
      }
    }

    // Sort like Home (by popularity desc)
    out.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));

    return { patches: out, userPatchMap: map };
  }, [rows]);

  return (
    <div className="p-4">
      <Header />
      <h1 className="text-2xl font-bold mb-2">My Patches</h1>
      <p className="text-gray-700 mb-4">Patches you’ve started or completed.</p>

      {!user ? (
        <div>Log in to see your patches</div>
      ) : loading ? (
        <div className="text-sm text-gray-500">Loading…</div>
      ) : patches.length === 0 ? (
        <div className="text-sm text-gray-500">No patches yet. Start one from the home page!</div>
      ) : (
        <PatchGrid
          patches={patches}
          userPatchMap={userPatchMap}
          userDataReady={true}   // we already fetched the user's data
        />
      )}
    </div>
  );
}

