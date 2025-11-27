'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { generateClient } from 'aws-amplify/api';
import type { GraphQLResult } from '@aws-amplify/api';
import { listPatchPurchases } from '@/graphql/queries';
import { useAuth } from '@/context/auth-context';
import type { ListPatchPurchasesQuery, PatchPurchase } from '@/API';
import Header from '@/components/Header';

const client = generateClient();

export default function AccountPage() {
  const { user, logout, authReady } = useAuth();
  const router = useRouter();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [purchases, setPurchases] = useState<PatchPurchase[]>([]);
  const [loadingPurchases, setLoadingPurchases] = useState(false);

  // Redirect unauthenticated users once auth status is known
  useEffect(() => {
    if (authReady && !user) {
      router.push('/');
    }
  }, [authReady, user, router]);

  // Load recent purchases for this user
  useEffect(() => {
    if (!authReady || !user?.userId) return;

    let cancelled = false;

    const run = async () => {
      setLoadingPurchases(true);
      try {
        const res = (await client.graphql({
          query: listPatchPurchases,
          variables: {
            filter: {
              userId: { eq: user.userId },
            },
          },
          authMode: 'userPool',
        })) as GraphQLResult<ListPatchPurchasesQuery>;

        const items =
          (res.data?.listPatchPurchases?.items as (PatchPurchase | null)[]) ??
          [];

        const cleaned: PatchPurchase[] = items.filter(
          (p): p is PatchPurchase => !!p
        );

        // Sort newest first by createdAt if available
        cleaned.sort((a, b) => {
          const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bDate - aDate;
        });

        if (!cancelled) setPurchases(cleaned);
      } catch (err) {
        console.error('Error loading purchases:', err);
        if (!cancelled) setPurchases([]);
      } finally {
        if (!cancelled) setLoadingPurchases(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [authReady, user?.userId]);

  if (!authReady) {
    return (
      <div>
        <Header />
        <div className="max-w-2xl mx-auto p-6 text-gray-600">
          Loading your account…
        </div>
      </div>
    );
  }

  if (!user) return null; // will redirect

  const email = user.signInDetails?.loginId ?? '';

  return (
    <div>
      <Header />
      <div className="max-w-2xl mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold border-b pb-2">Your Account</h1>

        {/* Profile Section */}
        <section className="p-4 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-3">Profile</h2>

          <div className="space-y-2 text-gray-700">
            <p>
              <span className="font-medium">Email:</span> {email}
            </p>
            <p>
              <span className="font-medium">User ID: {user.userId}</span>
            </p>
          </div>
        </section>

        {/* Recent Purchases */}
        <section className="p-4 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-3">Recent Purchases</h2>

          {loadingPurchases ? (
            <p className="text-sm text-gray-500">Loading purchases…</p>
          ) : purchases.length === 0 ? (
            <p className="text-sm text-gray-500">
              You don&apos;t have any recorded purchases yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {purchases.slice(0, 10).map((p) => {
                const created =
                  p.createdAt &&
                  new Date(p.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                   });

                const patchName =
                  (p as any).patch?.name ||
                  (p as any).patchName ||
                  `Patch ${p.patchId ?? ''}`;

                const formattedAmount =
                  p.amount != null && p.currency
                    ? `${(p.amount / 100).toFixed(2)} ${p.currency.toUpperCase()}`
                    : null;

                return (
                  <li
                    key={p.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{patchName}</div>
                      <div className="text-gray-500">
                        Purchased {created || 'recently'}
                         {formattedAmount && ` • ${formattedAmount}`}
                      </div>
                      {p.stripeReceiptUrl && (
                        <a
                          href={p.stripeReceiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-xs"
                        >
                          View receipt
                        </a>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="mt-4">
            <Link
              href="/my-patches"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              View All My Patches
            </Link>
          </div>
        </section>

        {/* Account Actions */}
        <section className="p-4 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-3">Account Actions</h2>

          <button
            onClick={async () => {
              setIsLoggingOut(true);
              await logout();
              setIsLoggingOut(false);
              router.push('/');
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Logging out…' : 'Log Out'}
          </button>
        </section>
      </div>
    </div>
  );
}

