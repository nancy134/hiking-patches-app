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
}: {
  loading: boolean;
  completed?: number | null;
  denom?: number | null;
  percent?: number | null;
  note?: string | null;
}) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-700">
        {loading ? (
          <Spinner label="Computing progress…" />
        ) : typeof percent === 'number' && typeof completed === 'number' && typeof denom === 'number' ? (
          <>
            Complete: {percent}% <span className="text-gray-400">({completed}/{denom})</span>
            {note ? <span className="ml-2 text-xs text-gray-500">— {note}</span> : null}
          </>
        ) : (
          <>Complete: — <span className="text-gray-400">(—/—)</span></>
        )}
      </p>
    </div>
  );
}

