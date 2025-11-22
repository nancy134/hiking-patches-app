'use client';

import { useState } from 'react';

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

export default function ProgressSummary({
  loading,
  completed,
  denom,
  percent,
  note,
  unit,
  isPurchasable,
  patchId
}: {
  loading: boolean;
  completed?: number | null;
  denom?: number | null;
  percent?: number | null;
  note?: string | null;
  unit?: 'miles' | null;
  isPurchasable?: boolean | null;
  patchId?: string;
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (loading) return <div>Loading progress…</div>;

  const checkoutUrl = process.env.NEXT_PUBLIC_CHECKOUT_API!;
  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!;

  const progress = Math.max(0, Math.min(100, percent ?? 0));
  const isComplete = progress >= 100;

  const label =
    unit === 'miles'
      ? `${completed?.toFixed(1)} / ${denom} miles`
      : `${completed} / ${denom}`;

  // ✅ Stripe API call (Amplify backend)
  async function handlePurchase() {
    if (!isComplete) return;
    setIsProcessing(true);

    try {
      const res = await fetch(
        checkoutUrl,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 'user123', // replace with your real user ID
            priceId: priceId,
            patchId: patchId
          }),
        }
      );

      const data = await res.json();

      if (data?.url) {
        window.location.href = data.url; // redirect to Stripe Checkout
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

      {/* show button only if purchasable */}
      {isPurchasable && (
        <div className="flex justify-center">
          <button
            disabled={!isComplete || isProcessing}
            onClick={handlePurchase}
            className={`mt-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              isComplete
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            {isProcessing ? <Spinner label="Connecting…" /> : 'Get the Patch Now'}
          </button>
        </div>
      )}
    </div>
  );
}

