// components/MountainRow.tsx
'use client';
import { useState } from 'react';
import { Mountain as MountainType, UserMountain } from '@/API';
import { generateClient } from 'aws-amplify/api';
const client = generateClient();

type MountainRowProps = {
  mountain: MountainType;
  userId?: string;
  climbs: UserMountain[];
  refetch: () => void;
};

export default function MountainRow({ mountain, userId, climbs, refetch, onEdit }: MountainRowProps) {
  const [date, setDate] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!date) return;
    setSaving(true);
    try {
      await client.graphql({
        query: `
          mutation CreateUserMountain($input: CreateUserMountainInput!) {
            createUserMountain(input: $input) {
              id
            }
          }
        `,
        variables: {
          input: {
            userID: userId,
            mountainID: mountain.id,
            dateClimbed: date,
          },
        },
        authMode: 'userPool',
      });
      setDate('');
      await refetch();
    } catch (err) {
      console.error('Error saving UserMountain:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="border px-2 py-1 font-semibold">{mountain.name}</td>
      <td className="border px-2 py-1">
        {climbs.length > 0 ? climbs.map((d) => d.dateClimbed).join(', ') : '—'}
      </td>
      {userId && (
        <>
          <td className="border px-2 py-1">
            <input
              type="date"
              className="border p-1 rounded w-full"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </td>
          <td className="border px-2 py-1">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              onClick={onEdit}
            >
              Edit
            </button>
          </td>
        </>
      )}
    </tr>
  );
}

