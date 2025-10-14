'use client';

import { useEffect, useState } from 'react';
import type { UserTrail } from '@/API';

export default function TrailProgressModal({
  open,
  onClose,
  onSave,
  existing,
  trailName,
  requiredMiles,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: { dateCompleted: string | null; milesRemaining: number | null; notes?: string | null }) => void;
  existing?: Partial<UserTrail> | null;
  trailName: string;
  requiredMiles?: number | null; // from PatchTrail, optional
}) {
  const [mode, setMode] = useState<'complete' | 'partial'>('partial');
  const [dateCompleted, setDateCompleted] = useState<string>('');
  const [milesRemaining, setMilesRemaining] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (!open) return;
    const done = !!existing?.dateCompleted;
    setMode(done ? 'complete' : 'partial');
    setDateCompleted(existing?.dateCompleted ?? '');
    setMilesRemaining(
      existing?.milesRemaining != null ? String(existing.milesRemaining) : (requiredMiles != null ? String(requiredMiles) : '')
    );
    setNotes(existing?.notes ?? '');
  }, [open, existing, requiredMiles]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === 'complete') {
      if (!dateCompleted) { alert('Pick a completion date'); return; }
      onSave({ dateCompleted, milesRemaining: 0, notes: notes || null });
    } else {
      const n = milesRemaining === '' ? null : Number(milesRemaining);
      if (n != null && (!Number.isFinite(n) || n < 0)) { alert('Miles remaining must be a number ≥ 0'); return; }
      onSave({ dateCompleted: null, milesRemaining: n, notes: notes || null });
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-3">Update Trail Progress</h3>
        <p className="text-sm text-gray-600 mb-3">{trailName}</p>

        <form onSubmit={submit} className="space-y-4">
          <fieldset className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="mode"
                checked={mode === 'partial'}
                onChange={() => setMode('partial')}
              />
              <span>Partial (set miles remaining)</span>
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

          {mode === 'partial' ? (
            <div>
              <label className="block text-sm font-medium">Miles remaining</label>
              <input
                type="number"
                step="any"
                value={milesRemaining}
                onChange={(e) => setMilesRemaining(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2"
                placeholder={requiredMiles != null ? `e.g. ${requiredMiles}` : 'e.g. 5'}
              />
              {requiredMiles != null && (
                <p className="text-xs text-gray-500 mt-1">Required for this patch: {requiredMiles} mi</p>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium">Date completed</label>
              <input
                type="date"
                value={dateCompleted}
                onChange={(e) => setDateCompleted(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2"
                required
              />
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

