'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchAuthSession } from 'aws-amplify/auth';
import Header from '@/components/Header';

type User = {
  Username: string;
  UserCreateDate: string;
  Attributes: { Name: string; Value: string }[];
};

type UserCounts = {
  userId: string;
  mountains: number;
  patches: number;
  trails: number;
};

const PAGE_SIZE = 20;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [countsByUser, setCountsByUser] = useState<Record<string, UserCounts>>({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchUsersAndCounts = async () => {
      try {
        const session = await fetchAuthSession();
        console.log("session: ");
        console.log(session);
        
        const token = session.tokens?.idToken?.toString();
        console.log("token: ");
        console.log(token);
        console.log("/api/list-users called");
        // 1) get users
        const res = await fetch('/api/list-users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("res:");
        console.log(res);
        const usersData: User[] = await res.json();
        setUsers(usersData);

        // 2) get counts for all users
        const ids = usersData.map((u) => u.Username);

        const countsRes = await fetch('/api/user-entry-counts', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userIds: ids }),
        });

        const countsData: UserCounts[] = await countsRes.json();

        const map: Record<string, UserCounts> = {};
        for (const row of countsData) map[row.userId] = row;
        setCountsByUser(map);
      } catch (err) {
        console.error('Failed to fetch users/counts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndCounts();
  }, []);

  const renderLink = (count: number, href: string) => {
    if (!count || count <= 0) return null;
    return (
      <Link href={href} className="text-blue-600 hover:underline">
        {count}
      </Link>
    );
  };

  return (
    <div className="p-4">
      <Header />
      <h1 className="text-xl font-semibold mb-4">Registered Users</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-2">{users.length} users total</p>
          <div className="overflow-auto">
            <table className="min-w-full table-auto border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">Email</th>
                  <th className="border px-4 py-2 text-left">Id</th>
                  <th className="border px-4 py-2 text-left">Created</th>
                  <th className="border px-4 py-2 text-left">Mountains</th>
                  <th className="border px-4 py-2 text-left">Patches</th>
                  <th className="border px-4 py-2 text-left">Trails</th>
                </tr>
              </thead>

              <tbody>
                {users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((user) => {
                  const email =
                    user.Attributes.find((attr) => attr.Name === 'email')?.Value;

                  const c = countsByUser[user.Username];

                  return (
                    <tr key={user.Username} className="border-t">
                      <td className="border px-4 py-2">
                        {email || (
                          <span className="text-gray-400 italic">No email</span>
                        )}
                      </td>
                      <td className="border px-4 py-2 font-medium">{user.Username}</td>
                      <td className="border px-4 py-2">{user.UserCreateDate}</td>

                      <td className="border px-4 py-2">
                        {c ? renderLink(c.mountains, `/admin/users/${user.Username}/mountains`) : null}
                      </td>
                      <td className="border px-4 py-2">
                        {c ? renderLink(c.patches, `/admin/users/${user.Username}/patches`) : null}
                      </td>
                      <td className="border px-4 py-2">
                        {c ? renderLink(c.trails, `/admin/users/${user.Username}/trails`) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {users.length > PAGE_SIZE && (
            <div className="flex items-center gap-4 mt-4 text-sm">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Prev
              </button>
              <span>Page {page} of {Math.ceil(users.length / PAGE_SIZE)}</span>
              <button
                onClick={() => setPage((p) => Math.min(Math.ceil(users.length / PAGE_SIZE), p + 1))}
                disabled={page === Math.ceil(users.length / PAGE_SIZE)}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

