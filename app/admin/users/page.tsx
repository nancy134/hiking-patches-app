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

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [countsByUser, setCountsByUser] = useState<Record<string, UserCounts>>({});
  const [loading, setLoading] = useState(true);

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
              {users.map((user) => {
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
      )}
    </div>
  );
}

