'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchAuthSession } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import { userPatchesByPatch, getPatchProgressSummary } from '@/graphql/queries';

const getPatchName = /* GraphQL */ `
  query GetPatchName($id: ID!) {
    getPatch(id: $id) {
      id
      name
    }
  }
`;
import Header from '@/components/Header';
import { useAuth } from '@/context/auth-context';

type CognitoUser = {
  Username: string;
  Attributes: { Name: string; Value: string }[];
};

type ProgressRow = {
  userId: string;
  email: string;
  percent: number;
  completed: number;
  denom: number;
  note: string | null;
  dateCompleted: string | null;
};

const client = generateClient();

export default function PatchProgressPage() {
  const { patchId } = useParams<{ patchId: string }>();
  const { isAdmin } = useAuth();
  const [patchName, setPatchName] = useState('');
  const [rows, setRows] = useState<ProgressRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin && patchId) loadData();
  }, [isAdmin, patchId]);

  async function loadData() {
    setLoading(true);
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      const patchRes = await client.graphql({ query: getPatchName, variables: { id: patchId }, authMode: 'userPool' });
      setPatchName((patchRes as any).data.getPatch?.name ?? '');

      const usersRes = await fetch('/api/list-users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const users: CognitoUser[] = await usersRes.json();
      const emailMap: Record<string, string> = {};
      for (const u of users) {
        const email = u.Attributes.find(a => a.Name === 'email')?.Value ?? u.Username;
        emailMap[u.Username] = email;
      }

      let allUserPatches: any[] = [];
      let nextToken: string | null = null;
      do {
        const result: any = await client.graphql({
          query: userPatchesByPatch,
          variables: { patchID: patchId, filter: { inProgress: { eq: true } }, limit: 100, nextToken },
          authMode: 'userPool',
        });
        allUserPatches.push(...result.data.userPatchesByPatch.items);
        nextToken = result.data.userPatchesByPatch.nextToken;
      } while (nextToken);

      const progressResults = await Promise.all(
        allUserPatches.map((up: any) =>
          client.graphql({
            query: getPatchProgressSummary,
            variables: { patchId, userId: up.userID },
            authMode: 'userPool',
          }).catch(() => null)
        )
      );

      const combined: ProgressRow[] = allUserPatches
        .map((up: any, i: number) => {
          const progress = (progressResults[i] as any)?.data?.getPatchProgressSummary;
          return {
            userId: up.userID,
            email: emailMap[up.userID] ?? up.userID,
            percent: progress?.percent ?? 0,
            completed: progress?.completed ?? 0,
            denom: progress?.denom ?? 0,
            note: progress?.note ?? null,
            dateCompleted: up.dateCompleted ?? null,
          };
        })
        .sort((a, b) => b.percent - a.percent);

      setRows(combined);
    } finally {
      setLoading(false);
    }
  }

  if (isAdmin === null) return <p className="p-6">Checking permissions...</p>;
  if (!isAdmin) {
    return (
      <div className="p-6">
        <Header />
        <p className="text-red-600 font-semibold">Access denied. Admins only.</p>
      </div>
    );
  }

  function rowBg(row: ProgressRow) {
    if (row.dateCompleted) return 'bg-green-50';
    if (row.percent >= 90) return 'bg-orange-50';
    if (row.percent >= 75) return 'bg-yellow-50';
    return '';
  }

  function statusLabel(row: ProgressRow) {
    if (row.dateCompleted) return <span className="text-green-700 font-semibold">Completed</span>;
    if (row.percent >= 90) return <span className="text-orange-600 font-semibold">Almost done!</span>;
    if (row.percent >= 75) return <span className="text-yellow-600 font-semibold">Getting close</span>;
    return <span className="text-gray-500">In progress</span>;
  }

  return (
    <div className="p-4">
      <Header />
      <div className="mb-4">
        <Link href="/admin/patches" className="text-blue-600 underline text-sm">
          ← Back to Patches
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-1">User Progress</h1>
      <p className="text-gray-600 mb-4">{patchName}</p>

      {loading ? (
        <p>Loading...</p>
      ) : rows.length === 0 ? (
        <p className="text-gray-500">No users currently in progress for this patch.</p>
      ) : (
        <table className="w-full table-auto border border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2 text-left">Email</th>
              <th className="border px-4 py-2 text-left">Progress</th>
              <th className="border px-4 py-2 text-left">Detail</th>
              <th className="border px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.userId} className={`border-t ${rowBg(row)}`}>
                <td className="border px-4 py-2 text-sm">{row.email}</td>
                <td className="border px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full"
                        style={{ width: `${Math.min(row.percent, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm">{row.percent.toFixed(1)}%</span>
                  </div>
                </td>
                <td className="border px-4 py-2 text-sm text-gray-600">
                  {row.denom > 0 ? `${row.completed.toFixed(1)} / ${row.denom.toFixed(1)}` : '—'}
                  {row.note ? (
                    <span className="ml-1 text-xs text-gray-400">({row.note})</span>
                  ) : null}
                </td>
                <td className="border px-4 py-2">{statusLabel(row)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
