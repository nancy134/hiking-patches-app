// app/trail/[id]/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { generateClient } from 'aws-amplify/api';
import type { GraphQLResult } from '@aws-amplify/api';
import Link from 'next/link';

import Header from '@/components/Header';
import { useAuth } from '@/context/auth-context';

import { listUserTrails } from '@/graphql/queries';
import { getTrailPublic } from '@/graphql/custom-queries';
import { createUserTrailMinimal, updateUserTrailMinimal, deleteUserTrailMinimal } from '@/graphql/custom-mutations';

import type { Trail, ListUserTrailsQuery, UserTrail } from '@/API';
import TrailProgressModal from '@/components/TrailProgressModal';
import ReactMarkdown from 'react-markdown';

const client = generateClient();

export default function TrailDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const trailId = params?.id as string | undefined;
  const fromPatchId = searchParams.get('patchId');
  const backHref = fromPatchId ? `/patch/${fromPatchId}` : null;

  const { user } = useAuth();

  const [trail, setTrail] = useState<Trail | null>(null);
  const [loadingTrail, setLoadingTrail] = useState(true);
  const [errorTrail, setErrorTrail] = useState<string | null>(null);

  // One user-trail for this trail
  const [userTrail, setUserTrail] = useState<UserTrail | null>(null);
  const [loadingUserTrail, setLoadingUserTrail] = useState<boolean>(!!user);
  const [modalOpen, setModalOpen] = useState(false);

  // ---------- Load trail ----------
  useEffect(() => {
    if (!trailId) return;
    (async () => {
      setLoadingTrail(true);
      setErrorTrail(null);
      try {
        const res = (await client.graphql({
          query: getTrailPublic as any,
          variables: { id: trailId },
        })) as GraphQLResult<{ getTrail: Trail | null }>;
        console.log(res.data?.getTrail);
        setTrail(res.data?.getTrail ?? null);
      } catch (e) {
        console.error('Error loading trail:', e);
        setErrorTrail('Failed to load trail.');
      } finally {
        setLoadingTrail(false);
      }
    })();
  }, [trailId]);

  // ---------- Load existing user progress for this trail ----------
  async function refreshUserTrail() {
    if (!user?.userId || !trailId) { setUserTrail(null); setLoadingUserTrail(false); return; }
    setLoadingUserTrail(true);
    try {
      const r = (await client.graphql({
        query: listUserTrails,
        variables: { userID: user.userId }, // mirrors your existing usage in PatchTrails
        authMode: 'userPool',
      })) as { data: ListUserTrailsQuery };

      const list = (r.data as any)?.listUserTrails?.items ?? [];
      const found: UserTrail | null = (list.find((ut: UserTrail | null) => ut?.trailID === trailId) ?? null) as UserTrail | null;
      setUserTrail(found);
    } catch (e) {
      console.error('Error loading user trail:', e);
    } finally {
      setLoadingUserTrail(false);
    }
  }

  useEffect(() => {
    refreshUserTrail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userId, trailId]);

  // ---------- Save (create / update / delete+create) ----------
  async function saveTrailProgress(payload: { dateCompleted: string | null; milesRemaining: number | null; notes?: string | null }) {
    if (!user?.userId || !trailId) return;

    const existing = userTrail ?? undefined;
    const fields: Record<string, any> = { userID: user.userId, trailID: trailId };
    if (payload.dateCompleted) fields.dateCompleted = payload.dateCompleted;
    if (payload.milesRemaining != null) fields.milesRemaining = Number(payload.milesRemaining);
    if (payload.notes != null && payload.notes !== '') fields.notes = payload.notes;

    const clearingDateCompleted = !!existing?.dateCompleted && !payload.dateCompleted;

    try {
      if (!existing) {
        // CREATE
        await client.graphql({
          query: createUserTrailMinimal,
          variables: { input: fields },
          authMode: 'userPool',
        });
      } else if (clearingDateCompleted) {
        // DELETE then RECREATE to clear the dateCompleted GSI entry (same as PatchTrails)
        await client.graphql({
          query: deleteUserTrailMinimal,
          variables: { input: { userID: existing.userID!, trailID: existing.trailID! } },
          authMode: 'userPool',
        });
        await client.graphql({
          query: createUserTrailMinimal,
          variables: { input: fields }, // without dateCompleted
          authMode: 'userPool',
        });
      } else {
        // UPDATE
        await client.graphql({
          query: updateUserTrailMinimal,
          variables: { input: fields },
          authMode: 'userPool',
        });
      }
    } catch (e) {
      console.error('Error saving trail progress:', e);
      alert('Failed to save progress.');
      return;
    } finally {
      setModalOpen(false);
      await refreshUserTrail();
    }
  }

  const statusText = useMemo(() => {
    const ut = userTrail;
    if (!ut) return 'Not started';
    const done = !!ut.dateCompleted || (ut.milesRemaining != null && ut.milesRemaining <= 0);
    if (done) return ut.dateCompleted ? `Completed on ${ut.dateCompleted}` : 'Completed';
    return ut.milesRemaining != null ? `${ut.milesRemaining} mi remaining` : 'Not started';
  }, [userTrail]);

  // ---------- Render ----------
  if (!trailId) return <div className="p-4">Missing trail ID.</div>;
  if (loadingTrail) return <div className="p-4">Loading trail…</div>;
  if (errorTrail) return <div className="p-4 text-red-600">{errorTrail}</div>;
  if (!trail) return <div className="p-4">Trail not found.</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Header />

      <div className="mb-6">
        {backHref ? (
          <Link href={backHref} className="text-sm text-blue-600 hover:underline">
            ← Back to Patch
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back
          </button>
        )}
      </div>

      <h1 className="text-3xl font-bold mb-2">{trail.name}</h1>

      <div className="text-gray-700 mb-4">
        <span className="font-semibold">Length:</span>{' '}
        {trail.lengthMiles != null ? `${trail.lengthMiles} miles` : '—'}
      </div>

      {trail.description ? (
          <div className="mb-6">
            <ReactMarkdown
              components={{
                a: ({ href, children }) => {
                  const isExternal = href?.startsWith('http');

                  return isExternal ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline inline-flex items-center gap-1"
                     >
                       {children}
                       <svg
                         xmlns="http://www.w3.org/2000/svg"
                         className="h-4 w-4 inline"
                         fill="none"
                         viewBox="0 0 24 24"
                         stroke="currentColor"
                         strokeWidth={2}
                         aria-hidden="true"
                        >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M18 13V18a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h5M15 3h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  ) : (
                    <a href={href} className="text-blue-600 underline">
                      {children}
                    </a>
                  );
                },
              }}
            >{trail.description}</ReactMarkdown>
        </div>
      ) : (
        <p className="text-gray-500 italic mb-6">No description available.</p>
      )}

      <div className="bg-white rounded shadow p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-gray-500">Your Status</div>
            <div className="text-base">
              {loadingUserTrail ? 'Syncing…' : statusText}
            </div>
          </div>

          {user ? (
            <button
              onClick={() => setModalOpen(true)}
              className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={loadingUserTrail}
            >
              {userTrail ? 'Update Progress' : 'Log Progress'}
            </button>
          ) : (
            <div className="text-sm text-gray-600">
              Sign in to log your trail progress.
            </div>
          )}
        </div>
      </div>

      <TrailProgressModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={saveTrailProgress}
        existing={userTrail ?? undefined}
        trailName={trail.name ?? ''}
        // We don't have a patch context here; pass undefined so the modal hides the “required” helper.
        requiredMiles={undefined}
        trailLengthMiles={trail.lengthMiles ?? null}
      />
    </div>
  );
}

