'use client';

function Spinner({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2" role="status" aria-live="polite">
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
}: {
  loading: boolean;
  completed?: number | null;
  denom?: number | null;
  percent?: number | null;
  note?: string | null;
  unit?: 'miles' | null;
}) {
  if (loading) return <div>Loading progress…</div>;

  const progress = Math.max(0, Math.min(100, percent ?? 0));
  const isComplete = progress >= 100;

  const label =
    unit === 'miles'
      ? `${completed?.toFixed(1)} / ${denom} miles`
      : `${completed} / ${denom}`;

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

      {/* single progress bar */}
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

{/* button only */}
<div className="flex justify-center">
  <button
    disabled={!isComplete}
    className={`mt-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
      isComplete
        ? 'bg-green-600 text-white hover:bg-blue-700'
        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
    }`}
  >
    Get the Patch Now
  </button>
</div>

    </div>
  );
}

