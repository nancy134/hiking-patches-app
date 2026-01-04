'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { generateClient } from 'aws-amplify/api';
import type { GraphQLResult } from '@aws-amplify/api';
import { listPatchPurchases } from '@/graphql/queries';
import type { ListPatchPurchasesQuery, PatchPurchase } from '@/API';
import Link from 'next/link';

const client = generateClient();

function Spinner({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2" role="status" aria-live="polite">
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
      {label ? <span className="text-sm text-gray-600">{label}</span> : null}
    </span>
  );
}

function TinySpinner() {
  return (
    <span
      className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-transparent"
      aria-hidden="true"
    />
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-4 w-40 bg-gray-200 rounded" />
      </div>
      <div className="h-3 w-full bg-gray-200 rounded" />
      <div className="h-3 w-2/3 bg-gray-200 rounded" />
    </div>
  );
}

export default function ProgressSummary(props: {
  loading: boolean;
  refreshing?: boolean; // ✅ new (optional): true when revalidating, but we keep old values
  completed?: number | null;
  denom?: number | null;
  percent?: number | null;
  note?: string | null;
  unit?: 'miles' | null;
  isPurchasable?: boolean | null;
  patchId?: string;
}) {
  const {
    loading,
    refreshing = false,
    completed,
    denom,
    percent,
    note,
    unit,
    isPurchasable,
    patchId,
  } = props;

  const [isProcessing, setIsProcessing] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(false);
  const { user } = useAuth();

  const checkoutUrl = process.env.NEXT_PUBLIC_CHECKOUT_API!;
  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!;

  // ✅ Determine whether we have usable progress data
  const hasProgressData =
    typeof percent === 'number' ||
    typeof completed === 'number' ||
    typeof denom === 'number' ||
    !!note;

  const progress = Math.max(0, Math.min(100, percent ?? 0));
  const isComplete = progress >= 100;

  const label = useMemo(() => {
    // keep label stable even if data is partially missing
    const safeCompleted =
      typeof completed === 'number' ? completed : null;
    const safeDenom =
      typeof denom === 'number' ? denom : null;

    if (unit === 'miles') {
      if (safeCompleted == null || safeDenom == null) return '—';
      return `${safeCompleted.toFixed(1)} / ${safeDenom} miles`;
    }

    if (safeCompleted == null || safeDenom == null) return '—';
    return `${safeCompleted} / ${safeDenom}`;
  }, [unit, completed, denom]);

  // 🔍 Check if user has already purchased this patch
  useEffect(() => {
    const run = async () => {
      if (!user?.userId || !patchId) {
        setHasPurchased(false);
        return;
      }

      setCheckingPurchase(true);
      try {
        const res = (await client.graphql({
          query: listPatchPurchases,
          variables: {
            filter: {
              userId: { eq: user.userId },
              patchId: { eq: patchId },
            },
          },
          authMode: 'userPool',
        })) as GraphQLResult<ListPatchPurchasesQuery>;

        const items =
          (res.data?.listPatchPurchases?.items as (PatchPurchase | null)[]) ?? [];

        setHasPurchased(items.some((p) => !!p));
      } catch (err) {
        console.error('Error checking purchase status:', err);
        setHasPurchased(false);
      } finally {
        setCheckingPurchase(false);
      }
    };

    run();
  }, [user?.userId, patchId]);

  // ✅ Only show skeleton on initial load (no data yet)
  if (loading && !hasProgressData) {
    return <Skeleton />;
  }

  // Stripe API call (Amplify backend)
  async function handlePurchase() {
    if (!isComplete) return;

    if (!user) {
      alert('Please sign in to purchase this patch.');
      return;
    }

    setIsProcessing(true);

    try {
      const res = await fetch(checkoutUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.userId,
          priceId,
          patchId,
        }),
      });

      const data = await res.json();

      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert('Something went wrong creating your checkout session.');
        console.error('Stripe response:', data);
      }
    } catch (err) {
      console.error('Error calling Stripe checkout API:', err);
      alert('There was a problem connecting to Stripe.');
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="relative flex flex-col gap-3">
      {/* ✅ refreshing indicator (keeps bar visible) */}

      <div className="flex items-center justify-between gap-3">
        <div className="font-medium">Progress</div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="whitespace-nowrap">{label}</span>

          {typeof percent === 'number' && (
            <span className="text-gray-500 whitespace-nowrap">
              ({percent.toFixed(0)}%)
            </span>
          )}

          {refreshing && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
              <span
                className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-transparent"
                aria-hidden="true"
              />
              Updating…
            </span>
          )}
        </div>
      </div>

      {/* progress bar */}
      <div className="w-full bg-gray-100 rounded h-3 overflow-hidden">
        <div
          className="
            bg-slate-500 h-3
            transition-[width] duration-300 ease-out
          "
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {note && <div className="text-xs text-gray-500">{note}</div>}

      {isPurchasable && (
        <div className="flex flex-col items-center">
          <button
            disabled={!isComplete || isProcessing}
            onClick={handlePurchase}
            className={`mt-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              !isComplete
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isProcessing ? (
              <Spinner label="Connecting…" />
            ) : hasPurchased ? (
              'Purchase another Patch'
            ) : (
              'Get the Patch Now'
            )}
          </button>

          {user && (
            <>
              {checkingPurchase && (
                <p className="mt-2 text-xs text-gray-500">
                  Checking your purchase status…
                </p>
              )}
              {!checkingPurchase && hasPurchased && (
                <p className="mt-2 text-xs text-green-700 text-center">
                  You’ve already purchased this patch. You can view it any time
                  from the{' '}
                  <Link
                    href="/account"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    Account
                  </Link>{' '}
                  screen, or purchase another patch using the button above.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

