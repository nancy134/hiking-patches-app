// components/PatchMountain.tsx
'use client';
import { useEffect, useState } from 'react';
import { PatchMountain as PatchMountainType, UserMountain } from '@/API';
import Mountain from './Mountain';
import { generateClient } from 'aws-amplify/api';
import { listUserMountains } from '@/graphql/queries';

const client = generateClient();

type PatchMountainProps = {
  patchMountains: (PatchMountainType | null)[];
  userId?: string;
};

export default function PatchMountain({ patchMountains, userId }: PatchMountainProps) {
  const [userMountains, setUserMountains] = useState<UserMountain[]>([]);

  const fetchUserMountains = async () => {
    if (!userId) return;
    try {
      const response = await client.graphql({
        query: listUserMountains,
        variables: { filter: { userID: { eq: userId } } },
        authMode: 'userPool',
      });
      const items = response.data?.listUserMountains?.items ?? [];
      setUserMountains(items.filter((um: UserMountain | null): um is UserMountain => !!um));
    } catch (err) {
      console.error('Error fetching user mountains:', err);
    }
  };

  useEffect(() => {
    fetchUserMountains();
  }, [userId]);

  if (!patchMountains?.length) {
    return <p className="text-gray-600">No mountains linked yet.</p>;
  }

  const mountainIdsInPatch = patchMountains
    .filter((pm): pm is PatchMountainType => !!pm && !!pm.mountain)
    .map((pm) => pm.mountain!.id);

  const completedIds = new Set(
    userMountains
      .filter((um) => mountainIdsInPatch.includes(um.mountainID))
      .map((um) => um.mountainID)
  );

  const percentComplete = 
    userId && mountainIdsInPatch.length > 0
      ? Math.round((completedIds.size / mountainIdsInPatch.length) * 100)
      : null;

  return (
    <div className="space-y-4">
      {percentComplete !== null && (
        <p className="text-sm text-gray-700">✅ {percentComplete}% complete</p>
      )}
      {patchMountains.map((pm) =>
        pm?.mountain ? (
          <Mountain
            key={pm.mountain.id}
            mountain={pm.mountain}
            userId={userId}
            climbs={
              userId
                ? userMountains.filter((um) => um.mountainID === pm.mountain!.id)
                : []
            }
            refetch={fetchUserMountains}
          />
        ) : null
      )}

    </div>
  );
}

