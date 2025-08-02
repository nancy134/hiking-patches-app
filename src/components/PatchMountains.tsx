'use client';

import { useEffect, useState } from 'react';
import { listPatchMountains, listUserMountains } from '@/graphql/queries';
import { ListPatchMountainsQuery, ListUserMountainsQuery, PatchMountain, UserMountain } from '@/API';
import { listPatchMountainsWithMountain } from '@/graphql/custom-queries';
import MountainAscentModal from '@/components/MountainAscentModal';
import { generateClient } from 'aws-amplify/api';
import { deleteUserMountainMinimal } from '@/graphql/custom-mutations';
import { createUserMountainMinimal } from '@/graphql/custom-mutations';

const client = generateClient();

type UserMountainMap = Record<string, UserMountain[] | undefined>;

interface PatchMountainProps {
  patchId: string;
  userId?: string;
}

export default function PatchMountains({ patchId, userId }: PatchMountainProps) {
  const [patchMountains, setPatchMountains] = useState<PatchMountain[]>([]);
  const [userMountainMap, setUserMountainMap] = useState<UserMountainMap>({});
  const [modalMountain, setModalMountain] = useState<PatchMountain | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const patchResponse = await client.graphql({
        query: listPatchMountainsWithMountain,
        variables: { filter: { patchPatchMountainsId: { eq: patchId } } },
        //authMode: 'API_KEY', // or use 'AMAZON_COGNITO_USER_POOLS' if needed
      }) as { data: ListPatchMountainsQuery };

      console.log(patchResponse.data?.listPatchMountains?.items)
      //const sorted = patchResponse.data?.listPatchMountains?.items
      //  ?.filter((pm): pm is PatchMountain => !!pm && !!pm.mountain)
      //  ?.sort((a, b) => a.mountain!.name.localeCompare(b.mountain!.name)) || [];

      setPatchMountains((patchResponse.data?.listPatchMountains?.items ?? []).filter((item): item is PatchMountain => item !== null));

    };

    fetchData();
  }, [patchId]);

  useEffect(() => {
    const fetchUserMountains = async () => {
      if (!userId) return;
      console.log(userId);
      const userResponse = await client.graphql({
        query: listUserMountains,
        variables: { filter: { userID: { eq: userId } } },
        authMode: 'userPool',
      }) as { data: ListUserMountainsQuery };

      const map: UserMountainMap = {};

      console.log(userResponse.data?.listUserMountains?.items);
      userResponse.data?.listUserMountains?.items?.forEach((um) => {
        if (um?.mountainID) {
          if (!map[um.mountainID]) map[um.mountainID] = [];
          map[um.mountainID]!.push(um);
        }
      });

      setUserMountainMap(map);
    };

    fetchUserMountains();
  }, [userId]);

  const handleEdit = (pm: PatchMountain) => {
    setModalMountain(pm);
  };

const handleSave = async (newDates: string[]) => {
  setModalMountain(null);
  const mountainId = modalMountain?.mountain?.id;
  if (!mountainId || !userId) return;

  const existingUMs = userMountainMap[mountainId] || [];

  const existingDates = new Set(
    existingUMs.map((um) => um.dateClimbed.split('T')[0])
  );

  const newDatesSet = new Set(newDates);

  const datesToDelete = existingUMs.filter(
    (um) => !newDatesSet.has(um.dateClimbed.split('T')[0])
  );

  const datesToAdd = newDates.filter(
    (date) => !existingDates.has(date)
  );

  // Delete removed ascents
  for (const um of datesToDelete) {
    await client.graphql({
      query: deleteUserMountainMinimal,
      variables: { input: { id: um.id } },
      authMode: 'userPool',
    });
  }

  // Add new ascents
  for (const date of datesToAdd) {
    await client.graphql({
      query: createUserMountainMinimal,
      variables: {
        input: {
          userID: userId,
          mountainID: mountainId,
          dateClimbed: date,
        },
      },
      authMode: 'userPool',
    });
  }

  // Refresh
  const userResponse = await client.graphql({
    query: listUserMountains,
    variables: { filter: { userID: { eq: userId } } },
    authMode: 'userPool',
  }) as { data: ListUserMountainsQuery };

  const map: UserMountainMap = {};
  userResponse.data?.listUserMountains?.items?.forEach((um) => {
    if (um?.mountainID) {
      if (!map[um.mountainID]) map[um.mountainID] = [];
      map[um.mountainID]!.push(um);
    }
  });
  setUserMountainMap(map);
};

  const completed = patchMountains.filter((pm) => {
    const userMountains = userMountainMap[pm.mountain?.id || ''];
    return userMountains && userMountains.length > 0;
  }).length;

  const percent = patchMountains.length === 0 ? 0 : Math.round((completed / patchMountains.length) * 100);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Mountains in Patch</h2>
      <p className="mb-4 text-sm text-gray-600">Complete: {percent}%</p>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2">Mountain</th>
            <th className="text-left p-2">Dates Ascended</th>
            {userId && <th className="text-left p-2">Action</th>}
          </tr>
        </thead>
        <tbody>
          {patchMountains.map((pm) => {
            const mountain = pm.mountain!;
            const userMountains = userMountainMap[mountain.id] || [];

            return (
              <tr key={mountain.id} className="border-t">
                <td className="p-2">{mountain.name}</td>
                <td className="p-2">
                  {userMountains.length > 0 ? (
                    <div className="flex gap-2 text-sm text-gray-700 flex-wrap items-center">
                      {userMountains.map((um) => (
                        <span key={um.id}>{um.dateClimbed}</span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </td>
                {userId && (
                  <td className="p-2">
                    <button
                      onClick={() => setModalMountain(pm)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Ascent Log 
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {modalMountain && (
        <MountainAscentModal
          open={!!modalMountain}
          userMountain={userMountainMap[modalMountain.mountain!.id] || []}
          onClose={() => setModalMountain(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

