// app/mountain/[id]/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { generateClient } from 'aws-amplify/api';
import type { GraphQLResult } from '@aws-amplify/api';
import Link from 'next/link';

import Header from '@/components/Header';
import { useAuth } from '@/context/auth-context';

import { getMountain, userMountainsByUserByDate } from '@/graphql/queries';
import { getMountainPublic } from '@/graphql/custom-queries';
import { createUserMountainMinimal, deleteUserMountainMinimal } from '@/graphql/custom-mutations';

import type {
  Mountain,
  UserMountain,
  UserMountainsByUserByDateQuery,
} from '@/API';
import { ModelSortDirection } from '@/API';

import MountainAscentModal from '@/components/MountainAscentModal';

const client = generateClient();

export default function MountainDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const mountainId = params?.id as string | undefined;

  // Optional: support “back to patch” like your trail page
  const fromPatchId = searchParams.get('patchId');
  const backHref = fromPatchId ? `/patch/${fromPatchId}` : null;

  const { user } = useAuth();

  const [mountain, setMountain] = useState<Mountain | null>(null);
  const [loadingMountain, setLoadingMountain] = useState(true);
  const [errorMountain, setErrorMountain] = useState<string | null>(null);

  // All ascent records for this mountain
  const [userMountains, setUserMountains] = useState<UserMountain[]>([]);
  const [loadingUserMountains, setLoadingUserMountains] = useState<boolean>(!!user);
  const [modalOpen, setModalOpen] = useState(false);

  // ---------- Load mountain ----------
  useEffect(() => {
    if (!mountainId) return;
    (async () => {
      setLoadingMountain(true);
      setErrorMountain(null);
      try {
        const res = (await client.graphql({
          query: getMountainPublic,
          variables: { id: mountainId },
        })) as GraphQLResult<{ getMountain: Mountain | null }>;

        setMountain(res.data?.getMountain ?? null);
      } catch (e) {
        console.error('Error loading mountain:', e);
        setErrorMountain('Failed to load mountain.');
      } finally {
        setLoadingMountain(false);
      }
    })();
  }, [mountainId]);

  // ---------- Load user ascents (sorted by dateClimbed) ----------
  async function refreshUserMountains() {
    if (!user?.userId || !mountainId) {
      setUserMountains([]);
      setLoadingUserMountains(false);
      return;
    }

    setLoadingUserMountains(true);
    try {
      const r = (await client.graphql({
        query: userMountainsByUserByDate,
        variables: {
          userID: user.userId,
          sortDirection: ModelSortDirection.ASC, // ✅ typed enum
          filter: { mountainID: { eq: mountainId } },
          limit: 200,
        },
        authMode: 'userPool',
      })) as { data: UserMountainsByUserByDateQuery };

      const items = (r.data?.userMountainsByUserByDate?.items ?? []).filter(Boolean) as UserMountain[];
      setUserMountains(items);
    } catch (e) {
      console.error('Error loading user mountains:', e);
      setUserMountains([]);
    } finally {
      setLoadingUserMountains(false);
    }
  }

  useEffect(() => {
    refreshUserMountains();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userId, mountainId]);

  // ---------- Save ascents (diff by dateClimbed) ----------
  async function saveAscents(dates: string[]) {
    if (!user?.userId || !mountainId) return;

    // Normalize: trim, drop blanks, unique, sort
    const desiredDates = Array.from(new Set(dates.map((d) => (d ?? '').trim()).filter(Boolean))).sort();

    const existing = userMountains;
    const existingDates = new Set(existing.map((um) => um.dateClimbed));
    const desiredSet = new Set(desiredDates);

    const toDelete = existing.filter((um) => !desiredSet.has(um.dateClimbed));
    const toCreate = desiredDates.filter((d) => !existingDates.has(d));

    try {
      for (const um of toDelete) {
        if (!um?.id) continue;
        await client.graphql({
          query: deleteUserMountainMinimal,
          variables: { input: { id: um.id } },
          authMode: 'userPool',
        });
      }

      for (const dateClimbed of toCreate) {
        await client.graphql({
          query: createUserMountainMinimal,
          variables: {
            input: {
              userID: user.userId,
              mountainID: mountainId,
              dateClimbed,
            },
          },
          authMode: 'userPool',
        });
      }
    } catch (e) {
      console.error('Error saving ascents:', e);
      alert('Failed to save ascents.');
      return;
    } finally {
      setModalOpen(false);
      await refreshUserMountains();
    }
  }

  const statusText = useMemo(() => {
    if (!userMountains.length) return 'Not climbed';

    const mostRecent = userMountains[userMountains.length - 1]?.dateClimbed;
    const n = userMountains.length;

    return mostRecent
      ? `Last climbed on ${mostRecent} (${n} ascent${n === 1 ? '' : 's'})`
      : `${n} ascent${n === 1 ? '' : 's'}`;
  }, [userMountains]);

  // ---------- Render ----------
  if (!mountainId) return <div className="p-4">Missing mountain ID.</div>;
  if (loadingMountain) return <div className="p-4">Loading mountain…</div>;
  if (errorMountain) return <div className="p-4 text-red-600">{errorMountain}</div>;
  if (!mountain) return <div className="p-4">Mountain not found.</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Header />

      <div className="mb-6">
        {backHref ? (
          <Link href={backHref} className="text-sm text-blue-600 hover:underline">
            ← Back to Patch
          </Link>
        ) : (
          <button type="button" onClick={() => router.back()} className="text-sm text-blue-600 hover:underline">
            ← Back
          </button>
        )}
      </div>

      <h1 className="text-3xl font-bold mb-2">{mountain.name}</h1>

      <div className="text-gray-700 mb-4 space-y-1">
        <div>
          <span className="font-semibold">Elevation:</span>{' '}
          {mountain.elevation != null ? `${mountain.elevation.toLocaleString()} ft` : '—'}
        </div>

        <div>
          <span className="font-semibold">Location:</span>{' '}
          {[mountain.city, mountain.state].filter(Boolean).join(', ') || '—'}
        </div>

        <div>
          <span className="font-semibold">Coordinates:</span>{' '}
          {mountain.latitude != null && mountain.longitude != null
            ? `${mountain.latitude.toFixed(5)}, ${mountain.longitude.toFixed(5)}`
            : '—'}
        </div>

        {mountain.latitude != null && mountain.longitude != null ? (
          <div>
            <a
              className="text-blue-600 underline"
              href={`https://www.google.com/maps?q=${mountain.latitude},${mountain.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on map
            </a>
          </div>
        ) : null}
      </div>

      <div className="bg-white rounded shadow p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-gray-500">Your Status</div>
            <div className="text-base">{loadingUserMountains ? 'Syncing…' : statusText}</div>
          </div>

          {user ? (
            <button
              onClick={() => setModalOpen(true)}
              className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={loadingUserMountains}
            >
              {userMountains.length ? 'Update Ascents' : 'Log Ascent'}
            </button>
          ) : (
            <div className="text-sm text-gray-600">Sign in to log your ascents.</div>
          )}
        </div>
      </div>

      <MountainAscentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        userMountain={userMountains}
        onSave={saveAscents}
        mountainName={mountain.name ?? ''}
      />
    </div>
  );
}

