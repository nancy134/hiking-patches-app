'use client';

import { useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listUserPatches } from '@/graphql/queries';
import Header from '@/components/Header';
import { useAuth } from '@/context/auth-context';

const client = generateClient();

const deleteUserPatchMutation = /* GraphQL */ `
  mutation DeleteUserPatch($input: DeleteUserPatchInput!) {
    deleteUserPatch(input: $input) { id }
  }
`;

type RawUserPatch = {
  id: string;
  patchID: string;
  userID: string;
  dateCompleted: string | null;
  inProgress: boolean | null;
  wishlisted: boolean | null;
  notes: string | null;
  difficulty: number | null;
  createdAt: string;
  updatedAt: string;
};

type DuplicateGroup = {
  userID: string;
  patchID: string;
  records: RawUserPatch[];
  keep: RawUserPatch;
  remove: RawUserPatch[];
};

function scoreRecord(r: RawUserPatch): number {
  if (r.dateCompleted) return 4;
  if (r.inProgress && r.wishlisted) return 3;
  if (r.inProgress) return 2;
  if (r.wishlisted) return 1;
  return 0;
}

function pickBest(records: RawUserPatch[]): RawUserPatch {
  return [...records].sort((a, b) => {
    const scoreDiff = scoreRecord(b) - scoreRecord(a);
    if (scoreDiff !== 0) return scoreDiff;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  })[0];
}

async function fetchAllUserPatches(): Promise<RawUserPatch[]> {
  const all: RawUserPatch[] = [];
  let nextToken: string | null = null;

  do {
    const response: any = await client.graphql({
      query: listUserPatches,
      variables: { limit: 500, ...(nextToken ? { nextToken } : {}) },
      authMode: 'userPool',
    });
    const page = response.data?.listUserPatches;
    all.push(...(page?.items ?? []));
    nextToken = page?.nextToken ?? null;
  } while (nextToken);

  return all;
}

function findDuplicates(records: RawUserPatch[]): DuplicateGroup[] {
  const grouped: Record<string, RawUserPatch[]> = {};
  for (const r of records) {
    const key = `${r.userID}::${r.patchID}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(r);
  }

  const groups: DuplicateGroup[] = [];
  for (const group of Object.values(grouped)) {
    if (group.length < 2) continue;
    const keep = pickBest(group);
    const remove = group.filter((r) => r.id !== keep.id);
    groups.push({ userID: group[0].userID, patchID: group[0].patchID, records: group, keep, remove });
  }
  return groups;
}

function statusLabel(r: RawUserPatch) {
  if (r.dateCompleted) return `Completed (${r.dateCompleted})`;
  if (r.inProgress) return 'In Progress';
  if (r.wishlisted) return 'Wishlisted';
  return 'Not Started';
}

export default function CleanupPage() {
  const { isAdmin } = useAuth();

  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [totalScanned, setTotalScanned] = useState(0);
  const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([]);

  const [fixing, setFixing] = useState(false);
  const [fixedGroups, setFixedGroups] = useState<Set<string>>(new Set());
  const [fixError, setFixError] = useState('');

  if (!isAdmin) {
    return <p className="p-6 text-red-600">Access denied.</p>;
  }

  const groupKey = (g: DuplicateGroup) => `${g.userID}::${g.patchID}`;

  async function handleScan() {
    setScanning(true);
    setScanned(false);
    setDuplicates([]);
    setFixedGroups(new Set());
    setFixError('');
    try {
      const all = await fetchAllUserPatches();
      setTotalScanned(all.length);
      setDuplicates(findDuplicates(all));
      setScanned(true);
    } finally {
      setScanning(false);
    }
  }

  async function fixGroup(group: DuplicateGroup) {
    for (const r of group.remove) {
      await client.graphql({
        query: deleteUserPatchMutation,
        variables: { input: { id: r.id } },
        authMode: 'userPool',
      });
    }
    setFixedGroups((prev) => new Set([...prev, groupKey(group)]));
  }

  async function handleFixAll() {
    setFixing(true);
    setFixError('');
    try {
      const pending = duplicates.filter((g) => !fixedGroups.has(groupKey(g)));
      for (const group of pending) {
        await fixGroup(group);
      }
    } catch (err) {
      console.error(err);
      setFixError('An error occurred during cleanup. Some records may not have been deleted.');
    } finally {
      setFixing(false);
    }
  }

  async function handleFixOne(group: DuplicateGroup) {
    setFixError('');
    try {
      await fixGroup(group);
    } catch (err) {
      console.error(err);
      setFixError(`Failed to fix group ${group.userID} / ${group.patchID}.`);
    }
  }

  const pending = duplicates.filter((g) => !fixedGroups.has(groupKey(g)));
  const allFixed = scanned && duplicates.length > 0 && pending.length === 0;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Header />
      <h1 className="text-2xl font-bold mb-1">UserPatch Cleanup</h1>
      <p className="text-gray-600 mb-6 text-sm">
        Finds users who have more than one UserPatch record for the same patch (duplicates
        caused by a race condition bug). The best record is kept — preferring Completed over
        In Progress over Wishlisted — and duplicates are deleted.
      </p>

      <button
        onClick={handleScan}
        disabled={scanning || fixing}
        className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {scanning ? 'Scanning…' : 'Scan for Duplicates'}
      </button>

      {scanned && (
        <div className="mt-6 space-y-4">
          <div className="bg-gray-50 border rounded p-4 text-sm">
            <p>
              <span className="font-semibold">{totalScanned}</span> UserPatch records scanned.{' '}
              <span className="font-semibold">{duplicates.length}</span> duplicate group
              {duplicates.length !== 1 ? 's' : ''} found (
              {duplicates.reduce((s, g) => s + g.remove.length, 0)} records to delete).
            </p>
          </div>

          {duplicates.length === 0 && (
            <p className="text-green-700 font-medium">No duplicates found. Database is clean.</p>
          )}

          {duplicates.length > 0 && (
            <>
              {allFixed ? (
                <p className="text-green-700 font-semibold">All duplicates fixed.</p>
              ) : (
                <button
                  onClick={handleFixAll}
                  disabled={fixing}
                  className="px-4 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  {fixing ? 'Fixing…' : `Fix All (${pending.length} group${pending.length !== 1 ? 's' : ''})`}
                </button>
              )}

              {fixError && <p className="text-red-600 text-sm">{fixError}</p>}

              <div className="space-y-3">
                {duplicates.map((group) => {
                  const key = groupKey(group);
                  const fixed = fixedGroups.has(key);
                  return (
                    <div
                      key={key}
                      className={`border rounded p-4 text-sm ${fixed ? 'bg-green-50 border-green-200' : 'bg-white'}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-mono text-xs text-gray-500 truncate">
                            User: {group.userID}
                          </p>
                          <p className="font-mono text-xs text-gray-500 truncate">
                            Patch: {group.patchID}
                          </p>
                          <div className="mt-2 space-y-1">
                            {group.records.map((r) => {
                              const isKeep = r.id === group.keep.id;
                              return (
                                <div
                                  key={r.id}
                                  className={`flex items-center gap-2 ${isKeep ? 'text-green-800' : 'text-red-700 line-through'}`}
                                >
                                  <span className="font-mono text-xs">{r.id.slice(0, 8)}…</span>
                                  <span>{statusLabel(r)}</span>
                                  <span className="text-xs text-gray-400">
                                    updated {new Date(r.updatedAt).toLocaleDateString()}
                                  </span>
                                  <span className={`text-xs font-semibold ${isKeep ? 'text-green-700' : 'text-red-600'}`}>
                                    {isKeep ? '← keep' : '← delete'}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="shrink-0">
                          {fixed ? (
                            <span className="text-green-700 font-semibold text-xs">Fixed</span>
                          ) : (
                            <button
                              onClick={() => handleFixOne(group)}
                              disabled={fixing}
                              className="px-3 py-1 text-xs bg-red-100 text-red-700 border border-red-300 rounded hover:bg-red-200 disabled:opacity-50"
                            >
                              Fix
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
