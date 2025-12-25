'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

type UserTrailItem = {
  userID: string;
  trailID: string;
  dateCompleted?: string | null;
  milesRemaining?: number | null;
  notes?: string | null;
  trail?: {
    id: string;
    name: string;
    lengthMiles?: number | null;
  } | null;
};

const GQL_userTrailsByUser = /* GraphQL */ `
  query UserTrailsByUser($userID: ID!, $limit: Int, $nextToken: String) {
    userTrailsByUser(userID: $userID, limit: $limit, nextToken: $nextToken) {
      items {
        userID
        trailID
        dateCompleted
        milesRemaining
        notes
        trail {
          id
          name
          lengthMiles
        }
      }
      nextToken
    }
  }
`;

export default function AdminUserTrailsPage() {
  const params = useParams<{ id: string }>();
  const userId = params?.id;

  const [items, setItems] = useState<UserTrailItem[]>([]);
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
        query: GQL_userTrailsByUser,
        variables: { userID: userId, limit: 50, nextToken: token },
        authMode: "userPool",
      });

      // @ts-ignore
      const conn = res.data?.userTrailsByUser;
      const newItems: UserTrailItem[] = conn?.items ?? [];
      const newNextToken: string | null = conn?.nextToken ?? null;

      setItems((prev) => (append ? [...prev, ...newItems] : newItems));
      setNextToken(newNextToken);
    } catch (e: any) {
      console.error('Failed to load user trails', e);
      setError(e?.message ?? 'Failed to load trails');
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
          <h1 className="text-xl font-semibold">User Trails</h1>
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
        <p className="text-gray-600">No trails entered.</p>
      ) : (
        <>
          <div className="overflow-auto">
            <table className="min-w-full table-auto border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">Trail</th>
                  <th className="border px-4 py-2 text-left">Completed</th>
                  <th className="border px-4 py-2 text-left">Miles Remaining</th>
                  <th className="border px-4 py-2 text-left">Trail Length</th>
                  <th className="border px-4 py-2 text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={`${row.userID}-${row.trailID}`} className="border-t">
                    <td className="border px-4 py-2 font-medium">
                      {row.trail?.name ?? (
                        <span className="text-gray-400 italic">Unknown trail</span>
                      )}
                    </td>
                    <td className="border px-4 py-2">{row.dateCompleted ?? '—'}</td>
                    <td className="border px-4 py-2">
                      {row.milesRemaining != null ? row.milesRemaining : '—'}
                    </td>
                    <td className="border px-4 py-2">
                      {row.trail?.lengthMiles != null ? row.trail.lengthMiles : '—'}
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

