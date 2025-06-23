'use client';

import { useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import Header from '@/components/Header';

type User = {
  Username: string;
  Attributes: { Name: string; Value: string }[];
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();

        const res = await fetch('/api/list-users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res);
        const data = await res.json();
        console.log(data);
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <Header />
      <h1 className="text-xl font-semibold mb-4">Registered Users</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-3">
          {users.map((user) => (
            <li key={user.Username} className="border p-2 rounded">
              <strong>{user.Username}</strong>
              <ul className="text-sm text-gray-700">
                {user.Attributes.map((attr) => (
                  <li key={attr.Name}>
                    {attr.Name}: {attr.Value}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

