'use client';

import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { generatePatchBoardImage, PatchBoardItem } from '@/lib/patchBoardImage';

type Props = {
  open: boolean;
  onClose: () => void;
  completedItems: PatchBoardItem[];
  inProgressItems: PatchBoardItem[];
};

export default function PatchBoardModal({ open, onClose, completedItems, inProgressItems }: Props) {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [includeInProgress, setIncludeInProgress] = useState(false);
  const [generating, setGenerating] = useState(false);

  const hasInProgress = inProgressItems.length > 0;
  const hasContent = completedItems.length > 0 || (includeInProgress && hasInProgress);

  useEffect(() => {
    if (!open || !hasContent || !canvas) return;

    let cancelled = false;
    setGenerating(true);
    const items = includeInProgress ? [...completedItems, ...inProgressItems] : completedItems;

    generatePatchBoardImage(canvas, items).finally(() => {
      if (!cancelled) setGenerating(false);
    });

    return () => {
      cancelled = true;
    };
  }, [open, includeInProgress, completedItems, inProgressItems, hasContent, canvas]);

  const handleDownload = () => {
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `my-hiking-patches-${new Date().toISOString().slice(0, 10)}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="text-xl font-bold mb-2">Create Patch Photo</Dialog.Title>

          {!hasContent ? (
            <p className="text-sm text-gray-600 mb-4">
              Complete a patch first to create your patch photo!
            </p>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-3">
                Here&apos;s a snapshot of your patches, ready to download and share.
              </p>

              {hasInProgress && (
                <label className="flex items-center gap-2 mb-3 text-sm">
                  <input
                    type="checkbox"
                    checked={includeInProgress}
                    onChange={(e) => setIncludeInProgress(e.target.checked)}
                  />
                  Include patches I&apos;m still working on
                </label>
              )}

              <div
                className="border rounded-lg overflow-auto bg-gray-100 mb-4"
                style={{ maxHeight: '60vh' }}
              >
                <canvas ref={setCanvas} className="block" />
              </div>
            </>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded border hover:bg-gray-50"
            >
              Close
            </button>
            {hasContent && (
              <button
                type="button"
                onClick={handleDownload}
                disabled={generating}
                className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {generating ? 'Generating…' : 'Download Image'}
              </button>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
