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
  const [mode, setMode] = useState<'complete' | 'partial'>('partial');
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

    const done = !!existing?.dateCompleted;
    setMode(done ? 'complete' : 'partial');
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

  // Snap slider + prefill date when switching to Completed
  useEffect(() => {
    if (mode !== 'complete') return;
    if (targetMiles != null) {
      setCompletedStr(String(targetMiles));
    }
    if (!dateCompleted) {
      setDateCompleted(todayYMD());
    }
  }, [mode, targetMiles]); // eslint-disable-line react-hooks/exhaustive-deps

  const completed = parseFloat(completedStr);
  const hasCompleted = Number.isFinite(completed);
  const clampedCompleted =
    targetMiles != null && hasCompleted ? clamp(completed, 0, targetMiles) : (hasCompleted ? Math.max(0, completed) : NaN);

  const milesRemaining = useMemo(() => {
    if (targetMiles == null || !Number.isFinite(clampedCompleted)) return NaN;
    return round2(targetMiles - clampedCompleted);
  }, [clampedCompleted, targetMiles]);

  const percent = useMemo(() => {
    if (targetMiles == null || !Number.isFinite(clampedCompleted) || targetMiles <= 0) return 0;
    return Math.floor((clampedCompleted / targetMiles) * 100);
  }, [clampedCompleted, targetMiles]);

  function submit(e: React.FormEvent) {
    e.preventDefault();

    if (mode === 'complete') {
      if (!dateCompleted) { alert('Pick a completion date'); return; }
      onSave({ dateCompleted, milesRemaining: 0, notes: notes || null });
      return;
    }

    // Partial path
    if (targetMiles == null) {
      alert('This trail has no target miles set. Please set a trail length or required miles first.');
      return;
    }
    if (!Number.isFinite(clampedCompleted)) {
      alert('Enter miles completed as a number'); return;
    }
    if (clampedCompleted < 0 || clampedCompleted > targetMiles) {
      alert(`Completed must be between 0 and ${targetMiles} miles.`); return;
    }

    const remainingToSave = round2(targetMiles - clampedCompleted);
    onSave({ dateCompleted: null, milesRemaining: remainingToSave, notes: notes || null });
  }

  if (!open) return null;

  const showSlider = targetMiles != null;

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
          {/* Mode toggle */}
          <fieldset className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="mode"
                checked={mode === 'partial'}
                onChange={() => setMode('partial')}
              />
              <span>Partial (set progress)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="mode"
                checked={mode === 'complete'}
                onChange={() => setMode('complete')}
              />
              <span>Completed (set date)</span>
            </label>
          </fieldset>
          <div className="mt-2">
            <label className="block text-sm font-medium">Date completed</label>
            <input
              type="date"
              value={dateCompleted}
              onChange={(e) => setDateCompleted(e.target.value)}
              disabled={mode !== 'complete'}
              className="mt-1 w-full border rounded px-3 py-2 disabled:opacity-50"
            />
          </div>
          {/* Progress control — stays visible for BOTH modes */}
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
                    // If they move off max while in Completed mode -> flip to Partial
                    if (mode === 'complete' && next < (targetMiles ?? 0)) {
                      setMode('partial');
                    }
                    setCompletedStr(e.target.value);
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
                    const next = parseFloat(e.target.value);
                    if (mode === 'complete' && Number.isFinite(next) && targetMiles != null && next < targetMiles) {
                      setMode('partial');
                    }
                    setCompletedStr(e.target.value);
                  }}
                  className="w-28 border rounded px-2 py-1 text-right"
                />
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
                  onClick={() => { setMode('partial'); setCompletedStr('0'); }}
                >
                  Set 0
                </button>
                <button
                  type="button"
                  className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
                  onClick={() => { setMode('complete'); /* effect will snap & set date */ }}
                >
                  Set full
                </button>
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
            // No target — show a simple full bar when completed
            <div className="rounded border bg-gray-50 p-3 text-sm">
              <div className="w-full h-2 bg-gray-200 rounded mb-2">
                <div className="h-2 bg-blue-600 rounded" style={{ width: mode === 'complete' ? '100%' : '0%' }} />
              </div>
              <div className="flex justify-between">
                <span>Progress</span>
                <span>{mode === 'complete' ? '100%' : '0%'}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Set trail length or required miles to enable the slider.
              </p>
            </div>
          )}

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
            <button type="button" onClick={onClose} className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Save</button>
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

