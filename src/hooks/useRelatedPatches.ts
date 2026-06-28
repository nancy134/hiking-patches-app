'use client';

import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import type { GraphQLResult } from '@aws-amplify/api';
import { getRelatedPatches } from '@/graphql/custom-queries';
import type { GetRelatedPatchesQuery } from '@/API';

const client = generateClient();

export function useRelatedPatches(patchId: string | null, limit = 6) {
  const [patches, setPatches] = useState<GetRelatedPatchesQuery['getRelatedPatches']>([]);
  const [loading, setLoading] = useState<boolean>(!!patchId);

  useEffect(() => {
    if (!patchId) {
      setPatches([]);
      setLoading(false);
      return;
    }

    let alive = true;
    setLoading(true);

    (client.graphql({
      query: getRelatedPatches,
      variables: { patchId, limit },
    }) as Promise<GraphQLResult<GetRelatedPatchesQuery>>)
      .then((r) => {
        if (alive) setPatches(r.data?.getRelatedPatches ?? []);
      })
      .catch((e) => console.error('getRelatedPatches failed:', e))
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [patchId, limit]);

  return { patches, loading };
}
