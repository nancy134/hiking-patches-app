// app/mountains/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { useParams } from 'next/navigation';
import { generateClient } from 'aws-amplify/api';
import { GraphQLResult } from '@aws-amplify/api';
import { GraphQLQuery } from '@aws-amplify/api';
import { getMountain } from '@/graphql/queries';
import type { ListPatchMountainsWithPatchQuery, GetMountainQuery, Mountain, Patch, PatchMountain } from '@/API';
import { listPatchMountains } from '@/graphql/queries';
import { listPatchMountainsWithPatch } from '@/graphql/custom-queries';

const client = generateClient();

export default function MountainDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [mountain, setMountain] = useState<Mountain | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [patches, setPatches] = useState<Patch[]>([]);
  const [patchesLoading, setPatchesLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const resp: GraphQLResult<GetMountainQuery> = await client.graphql({
          query: getMountain,
          variables: { id },
          authMode: 'userPool'
        });
        setMountain((resp.data?.getMountain as Mountain) ?? null);
        if (!resp.data?.getMountain) setErrorMsg('Mountain not found.');
      } catch (e) {
        console.error(e);
        setErrorMsg('Failed to load mountain.');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  useEffect(() => {
    if (!id || Array.isArray(id)) return;

    const fetchPatches = async () => {
      setPatchesLoading(true);
      try {
        const all: Patch[] = [];
        let nextToken: string | null | undefined = null;

        do {
          const resp = (await client.graphql<GraphQLQuery<ListPatchMountainsWithPatchQuery>>({
            query: listPatchMountainsWithPatch,
            variables: {
              limit: 100,
              nextToken,
              filter: { mountainPatchMountainsId: { eq: id as string } },
            },
          })) as GraphQLResult<ListPatchMountainsWithPatchQuery>;

          const data: ListPatchMountainsWithPatchQuery | undefined = resp.data;
          const page = data?.listPatchMountains;
          const items = page?.items ?? [];

          for (const pm of items) {
            // Each item is a PatchMountain; we want the nested Patch
            const patch = (pm as PatchMountain)?.patch as Patch | null;
            if (patch) all.push(patch);
          }
          nextToken = data?.listPatchMountains?.nextToken;
        } while (nextToken);

        setPatches(all);
      } catch (e) {
        console.error('Failed to load patches', e);
        setPatches([]);
      } finally {
        setPatchesLoading(false);
      }
    };

    fetchPatches();
  }, [id]);

  // …render same UI as above
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Header />
      {loading ? <p>Loading…</p> : errorMsg ? <p className="text-red-600">{errorMsg}</p> : (
        <>
          <Link href="/admin/mountains" className="text-blue-600 underline mb-4 inline-block">
            ← Back to Admin: Mountains
          </Link>
          <h1 className="text-3xl font-bold mb-2">{mountain?.name}</h1>
          {/* Add fields just like the Pages Router example */}
        </>
      )}
<div className="mt-8">
  <h2 className="text-2xl font-semibold mb-3">Patches</h2>

  {patchesLoading ? (
    <p>Loading patches…</p>
  ) : patches.length === 0 ? (
    <p className="text-gray-600">No patches are associated with this mountain yet.</p>
  ) : (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {patches.map((p) => (
        <li key={p.id} className="border rounded-lg p-4 bg-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-lg font-medium">{p.name ?? 'Untitled Patch'}</div>
              {p.description && (
                <p className="text-sm text-gray-600 mt-1">{p.description}</p>
              )}
            </div>
            {/* Optional: patch image thumbnail if you have one */}
            {/* {p.imageUrl && (
              <img src={p.imageUrl} alt={p.name ?? 'Patch'} className="w-16 h-16 object-contain ml-3" />
            )} */}
          </div>
          {/* Optional metadata rows—customize to your schema fields */}
          <div className="mt-3 text-sm text-gray-700 space-y-1">
            {p.createdAt && <div><span className="text-gray-500">Created:</span> {new Date(p.createdAt).toLocaleDateString()}</div>}
          </div>
        </li>
      ))}
    </ul>
  )}
</div>

    </div>
  );
}

