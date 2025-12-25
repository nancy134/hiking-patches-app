'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

type UserMountainItem = {
  id: string;
  mountainID: string;
  dateClimbed: string;
  notes?: string | null;
  mountain?: {
    id: string;
    name: string;
    elevation?: number | null;
    city?: string | null;
    state?: string | null;
  } | null;
};

const GQL_userMountainsByUser = /* GraphQL */ `
  query UserMountainsByUser($userID: ID!, $limit: Int, $nextToken: String) {
    userMountainsByUser(userID: $userID, limit: $limit, nextToken: $nextToken) {
      items {
        id
        mountainID
        dateClimbed
        notes
        mountain {
          id
          name
          elevation
          city
          state
        }
      }
      nextToken
    }
  }
`;

export default function AdminUserMountainsPage() {
  const params = useParams<{ id: string }>();
  const userId = params?.id;

  const [items, setItems] = useState<UserMountainItem[]>([]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (token: string | null, append = false) => {
    try {
      if (!userId) return;
      append ? setLoadingMore(true) : setLoading(true);
      setError(null);

      const res = await client.graphql({
        query: GQL_userMountainsByUser,
        variables: { userID: userId, limit: 50, nextToken: token },
        authMode: "userPool",
      });

      // @ts-ignore
      const conn = res.data?.userMountainsByUser;
      const newItems: UserMountainItem[] = conn?.items ?? [];
      const newNextToken: string | null = conn?.nextToken ?? null;

      setItems((prev) => (append ? [...prev, ...newItems] : newItems));
      setNextToken(newNextToken);
    } catch (e: any) {
      console.error('Failed to load user mountains', e);
      setError(e?.message ?? 'Failed to load mountains');
    } finally {
      append ? setLoadingMore(false) : setLoading(false);
    }
  };

  useEffect(() => {
    load(null, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <div className="p-4">
      <Header />

      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">User Mountains</h1>
          <p className="text-sm text-gray-600">
            User: <span className="font-mono">{userId}</span>
          </p>
        </div>

        <Link href="/admin/users" className="text-blue-600 hover:underline">
          ← Back to users
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="border border-red-300 bg-red-50 p-3 text-sm text-red-700 rounded">
          {error}
        </div>
      ) : items.length === 0 ? (
        <p className="text-gray-600">No mountains entered.</p>
      ) : (
        <>
          <div className="overflow-auto">
            <table className="min-w-full table-auto border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">Mountain</th>
                  <th className="border px-4 py-2 text-left">Date</th>
                  <th className="border px-4 py-2 text-left">Location</th>
                  <th className="border px-4 py-2 text-left">Elevation</th>
                  <th className="border px-4 py-2 text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.id} className="border-t">
                    <td className="border px-4 py-2 font-medium">
                      {row.mountain?.name ?? (
                        <span className="text-gray-400 italic">Unknown mountain</span>
                      )}
                    </td>
                    <td className="border px-4 py-2">{row.dateClimbed}</td>
                    <td className="border px-4 py-2">
                      {row.mountain?.city || row.mountain?.state
                        ? `${row.mountain?.city ?? ''}${row.mountain?.city && row.mountain?.state ? ', ' : ''}${
                            row.mountain?.state ?? ''
                          }`
                        : <span className="text-gray-400 italic">—</span>}
                    </td>
                    <td className="border px-4 py-2">
                      {row.mountain?.elevation != null ? row.mountain.elevation : '—'}
                    </td>
                    <td className="border px-4 py-2">{row.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {nextToken && (
            <button
              onClick={() => load(nextToken, true)}
              disabled={loadingMore}
              className="mt-4 px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              {loadingMore ? 'Loading…' : 'Load more'}
            </button>
          )}
        </>
      )}
    </div>
  );
}

