// components/TrailProgressModal.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import type { UserTrail } from '@/API';

export default function TrailProgressModal({
  open,
  onClose,
  onSave,
  existing,
  trailName,
  requiredMiles,
  trailLengthMiles,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: { dateCompleted: string | null; milesRemaining: number | null; notes?: string | null }) => void;
  existing?: Partial<UserTrail> | null;
  trailName: string;
  requiredMiles?: number | null;
  trailLengthMiles?: number | null;
}) {
  const [dateCompleted, setDateCompleted] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [completedStr, setCompletedStr] = useState<string>(''); // miles completed

  const targetMiles = useMemo(() => {
    const req = toPosNum(requiredMiles);
    const len = toPosNum(trailLengthMiles);
    return req ?? len ?? null;
  }, [requiredMiles, trailLengthMiles]);

  useEffect(() => {
    if (!open) return;

    setDateCompleted(existing?.dateCompleted ?? '');
    setNotes(existing?.notes ?? '');

    if (targetMiles != null) {
      if (isFiniteNum(existing?.milesRemaining)) {
        const comp = clamp(targetMiles - (existing!.milesRemaining as number), 0, targetMiles);
        setCompletedStr(String(round2(comp)));
      } else {
        setCompletedStr('0');
      }
    } else {
      setCompletedStr('');
    }
  }, [open, existing, targetMiles]);

  const completed = parseFloat(completedStr);
  const hasCompleted = Number.isFinite(completed);
  const clampedCompleted =
    targetMiles != null && hasCompleted
      ? clamp(completed, 0, targetMiles)
      : hasCompleted
      ? Math.max(0, completed)
      : NaN;

  const milesRemaining = useMemo(() => {
    if (targetMiles == null || !Number.isFinite(clampedCompleted)) return NaN;
    return round2(targetMiles - clampedCompleted);
  }, [clampedCompleted, targetMiles]);

  const percent = useMemo(() => {
    if (targetMiles == null || !Number.isFinite(clampedCompleted) || targetMiles <= 0) return 0;
    return Math.floor((clampedCompleted / targetMiles) * 100);
  }, [clampedCompleted, targetMiles]);

  const showSlider = targetMiles != null;

  // Auto-set dateCompleted when the slider hits full for the first time
  useEffect(() => {
    if (!showSlider || targetMiles == null) return;
    if (!Number.isFinite(clampedCompleted)) return;

    const isComplete = clampedCompleted >= targetMiles;
    if (isComplete && !dateCompleted) {
      setDateCompleted(todayYMD());
    }
  }, [clampedCompleted, showSlider, targetMiles, dateCompleted]);

  function submit(e: React.FormEvent) {
    e.preventDefault();

    // If no target miles, treat this as a simple "completed" flow with date
    if (!showSlider) {
      if (!dateCompleted) {
        alert('Pick a completion date');
        return;
      }
      onSave({ dateCompleted, milesRemaining: 0, notes: notes || null });
      return;
    }

    // Slider / target miles path
    if (targetMiles == null) {
      alert('This trail has no target miles set. Please set a trail length or required miles first.');
      return;
    }
    if (!Number.isFinite(clampedCompleted)) {
      alert('Enter miles completed as a number');
      return;
    }
    if (clampedCompleted < 0 || clampedCompleted > targetMiles) {
      alert(`Completed must be between 0 and ${targetMiles} miles.`);
      return;
    }

    const isComplete = clampedCompleted >= targetMiles;

    if (isComplete) {
      if (!dateCompleted) {
        alert('Pick a completion date');
        return;
      }
      onSave({ dateCompleted, milesRemaining: 0, notes: notes || null });
      return;
    }

    // Partial progress
    const remainingToSave = round2(targetMiles - clampedCompleted);
    onSave({ dateCompleted: null, milesRemaining: remainingToSave, notes: notes || null });
  }

  if (!open) return null;

  const dateEnabled =
    !showSlider || (targetMiles != null && Number.isFinite(clampedCompleted) && clampedCompleted >= targetMiles);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-1">Update Trail Progress</h3>
        <p className="text-sm text-gray-700">{trailName}</p>

        <p className="text-xs text-gray-500 mb-3">
          Trail length: {isFiniteNum(trailLengthMiles) ? `${trailLengthMiles} mi` : '—'}
          {isFiniteNum(requiredMiles) && <> · Required for this patch: {requiredMiles} mi</>}
        </p>

        <form onSubmit={submit} className="space-y-4">
          {/* Progress control — slider at the top */}
          {showSlider ? (
            <div>
              <label className="block text-sm font-medium mb-1">
                Miles completed ({Number.isFinite(clampedCompleted) ? clampedCompleted : 0} / {targetMiles} mi)
              </label>

              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={targetMiles!}
                  step={0.1}
                  value={Number.isFinite(clampedCompleted) ? clampedCompleted : 0}
                  onChange={(e) => {
                    const next = parseFloat(e.target.value);
                    setCompletedStr(e.target.value);
                    // If they drag to full and there's no date yet, the effect will auto-set it
                  }}
                  className="flex-1"
                  aria-label="Miles completed"
                />
                <input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  min={0}
                  max={targetMiles!}
                  value={completedStr}
                  onChange={(e) => {
                    setCompletedStr(e.target.value);
                  }}
                  className="w-28 border rounded px-2 py-1 text-right"
                />
              </div>

              {/* Preview */}
              <div className="rounded border bg-gray-50 p-3 text-sm mt-3">
                <div className="flex justify-between">
                  <span>Completed</span>
                  <span>{Number.isFinite(clampedCompleted) ? `${round2(clampedCompleted)} mi` : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining</span>
                  <span>{Number.isFinite(milesRemaining) ? `${milesRemaining} mi` : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Progress</span>
                  <span>{`${percent}%`}</span>
                </div>
              </div>
            </div>
          ) : (
            // No target — simple progress info
            <div className="rounded border bg-gray-50 p-3 text-sm">
              <div className="w-full h-2 bg-gray-200 rounded mb-2">
                <div
                  className="h-2 bg-blue-600 rounded"
                  style={{ width: dateCompleted ? '100%' : '0%' }}
                />
              </div>
              <div className="flex justify-between">
                <span>Progress</span>
                <span>{dateCompleted ? '100%' : '0%'}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Set trail length or required miles to enable the slider.
              </p>
            </div>
          )}

          {/* Date completed */}
          <div className="mt-2">
            <label className="block text-sm font-medium">Date completed</label>
            <input
              type="date"
              value={dateCompleted}
              onChange={(e) => setDateCompleted(e.target.value)}
              disabled={!dateEnabled}
              className="mt-1 w-full border rounded px-3 py-2 disabled:opacity-50"
            />
            {showSlider && (
              <p className="text-xs text-gray-500 mt-1">
                Date is enabled when the slider is at full mileage.
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---- helpers ---- */
function toPosNum(v: unknown): number | null {
  const n = typeof v === 'string' ? parseFloat(v) : (typeof v === 'number' ? v : NaN);
  return Number.isFinite(n) && n > 0 ? n : null;
}
function isFiniteNum(v: unknown): v is number {
  return Number.isFinite(typeof v === 'string' ? parseFloat(v) : (v as number));
}
function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}
function round2(n: number) {
  return Math.round(n * 100) / 100;
}
function todayYMD(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

