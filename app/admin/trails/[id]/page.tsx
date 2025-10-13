'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { useParams } from 'next/navigation';
import { generateClient } from 'aws-amplify/api';
import type { GraphQLResult } from '@aws-amplify/api';
import type { GetTrailQuery, Trail, PatchTrail, Patch } from '@/API';
import { getTrail } from '@/graphql/queries';
import { listPatchTrailsWithPatch } from '@/graphql/custom-queries';

const client = generateClient();

export default function TrailDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [trail, setTrail] = useState<Trail | null>(null);
  const [loading, setLoading] = useState(true);
  const [patches, setPatches] = useState<Patch[]>([]);
  const [patchesLoading, setPatchesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const resp: GraphQLResult<GetTrailQuery> = await client.graphql({
          query: getTrail,
          variables: { id },
          authMode: 'userPool',
        });
        const t = resp.data?.getTrail as Trail | null;
        setTrail(t ?? null);
        if (!t) setError('Trail not found.');
      } catch (e) {
        console.error(e);
        setError('Failed to load trail.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!id || Array.isArray(id)) return;
    (async () => {
      setPatchesLoading(true);
      try {
        const all: Patch[] = [];
        let nextToken: string | null | undefined = null;
        do {
          const resp = await client.graphql({
            query: listPatchTrailsWithPatch,
            variables: { limit: 100, nextToken, filter: { trailPatchTrailsId: { eq: id } } },
          }) as GraphQLResult<any>;
          const items = resp.data?.listPatchTrails?.items ?? [];
          for (const pt of items as PatchTrail[]) {
            const p = (pt as any).patch as Patch | null;
            if (p) all.push(p);
          }
          nextToken = resp.data?.listPatchTrails?.nextToken ?? null;
        } while (nextToken);
        setPatches(all);
      } catch (e) {
        console.error('Failed to load patches', e);
        setPatches([]);
      } finally {
        setPatchesLoading(false);
      }
    })();
  }, [id]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Header />
      <Link href="/admin/trails" className="text-blue-600 underline mb-4 inline-block">← Back to Admin: Trails</Link>

      {loading ? <p>Loading…</p> : error ? (
        <p className="text-red-600">{error}</p>
      ) : trail ? (
        <>
          <h1 className="text-3xl font-bold mb-2">{trail.name}</h1>
          {trail.description && <p className="text-gray-700 mb-2">{trail.description}</p>}
          <div className="text-gray-600">Length: {trail.lengthMiles} miles</div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-3">Patches</h2>
            {patchesLoading ? (
              <p>Loading patches…</p>
            ) : patches.length === 0 ? (
              <p className="text-gray-600">No patches include this trail yet.</p>
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {patches.map((p) => (
                  <li key={p.id} className="border rounded-lg p-4 bg-white">
                    <div className="text-lg font-medium">{p.name ?? 'Untitled Patch'}</div>
                    {p.description && <p className="text-sm text-gray-600 mt-1">{p.description}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}

