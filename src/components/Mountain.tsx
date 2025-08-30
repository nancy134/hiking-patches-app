// components/Mountain.tsx
'use client';
import { Mountain as MountainType, UserMountain } from '@/API';
import { useState } from 'react';
import { generateClient } from 'aws-amplify/api';
const client = generateClient();

type MountainProps = {
  mountain: MountainType;
  userId?: string;
  climbs: UserMountain[];
  refetch: () => void;
};

export default function Mountain({ mountain, userId, climbs, refetch }: MountainProps) {
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
    <div className="border rounded p-2 space-y-2">
      <span className="font-semibold">{mountain.name}</span>

      {userId && (
        <div className="flex gap-2 items-center">
          <input
            type="date"
            className="border p-1 rounded w-40"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
            onClick={handleSave}
            disabled={saving || !date}
          >
            {saving ? 'Saving...' : 'Save Date Hiked'}
          </button>
        </div>
      )}

{climbs.length > 0 && (
  <div className="pl-1 text-sm text-gray-700 flex gap-2 flex-wrap items-center">
    <span className="font-medium">Dates Hiked:</span>
    {climbs.map((d) => (
      <span key={d.id}>{d.dateClimbed}</span>
    ))}
  </div>
)}

    </div>
  );
}

