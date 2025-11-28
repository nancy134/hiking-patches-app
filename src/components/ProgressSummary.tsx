'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { generateClient } from 'aws-amplify/api';
import type { GraphQLResult } from '@aws-amplify/api';
import { listPatchPurchases } from '@/graphql/queries';
import type { ListPatchPurchasesQuery, PatchPurchase } from '@/API';
import Link from 'next/link';

const client = generateClient();

function Spinner({ label }: { label?: string }) {
  return (
    <span
      className="inline-flex items-center gap-2"
      role="status"
      aria-live="polite"
    >
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
      {label ? <span className="text-sm text-gray-600">{label}</span> : null}
    </span>
  );
}

export default function ProgressSummary(props: {
  loading: boolean;
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

  const progress = Math.max(0, Math.min(100, percent ?? 0));
  const isComplete = progress >= 100;

  const label =
    unit === 'miles'
      ? `${completed?.toFixed(1)} / ${denom} miles`
      : `${completed} / ${denom}`;

  // 🔍 Check if user has already purchased this patch
  useEffect(() => {
    const run = async () => {
      if (!user?.userId || !patchId) {
        console.log('No user or patchId, skipping purchase check');
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
          (res.data?.listPatchPurchases?.items as (PatchPurchase | null)[]) ??
          [];

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

  // Only *after* hooks, you can early-return
  if (loading) return <div>Loading progress…</div>;

  // Stripe API call (Amplify backend)
  async function handlePurchase() {
    if (!isComplete) return;

    if (!user) {
      alert('Please sign in to purchase this patch.');
      return;
    }

    // 👇 removed the hasPurchased early-return so they can buy multiple times

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
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="font-medium">Progress</div>
        <div className="text-sm text-gray-600 flex items-center gap-2">
          <span>{label}</span>
          {typeof percent === 'number' && (
            <span className="text-gray-500">({percent.toFixed(0)}%)</span>
          )}
        </div>
      </div>

      {/* progress bar */}
      <div className="w-full bg-gray-100 rounded h-3 overflow-hidden">
        <div
          className="bg-blue-600 h-3 transition-all duration-300"
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
                  You’ve already purchased this patch. You can view it any time from the{' '}
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

