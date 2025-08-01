'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { UserMountain } from '@/API';
import { format } from 'date-fns';

type MountainAscentModalProps = {
  open: boolean;
  onClose: () => void;
  userMountain: UserMountain[];
  onSave: (newDate: string | null) => void;
};

export default function MountainAscentModal({
  open,
  onClose,
  mountain,
  userMountain,
  onSave,
}: MountainAscentModalProps) {
  console.log(userMountain);
  console.log("open: "+open);
  const mostRecentDate = userMountain.length > 0
    ? userMountain[userMountain.length - 1].dateClimbed
    : '';

  const [dateClimbed, setDateClimbed] = useState(mostRecentDate || '');
  const [cleared, setCleared] = useState(false);

  const handleSave = () => {
    if (cleared) {
      onSave(null); // Clear date
    } else {
      onSave(dateClimbed);
    }
    onClose();
  };

  const handleClear = () => {
    setDateClimbed('');
    setCleared(true);
  };

  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

      <div className="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-md z-50">
        <Dialog.Title className="text-xl font-bold mb-2">
          Edit Ascent for -get mountain name- 
        </Dialog.Title>

        <div className="space-y-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date Hiked
            </label>
            <input
              id="date"
              type="date"
              value={dateClimbed || ''}
              onChange={(e) => {
                setDateClimbed(e.target.value);
                setCleared(false);
              }}
              className="mt-1 w-full"
            />
          </div>

          {userMountain.length > 0 && (
            <div className="text-sm text-gray-600">
              Previous dates: {userMountain.map((c) => format(new Date(c.dateClimbed), 'yyyy-MM-dd')).join(', ')}
            </div>
          )}

          <div className="flex justify-between gap-3 pt-4">
            <button variant="destructive" onClick={handleClear}>
              Clear All
            </button>
            <div className="flex gap-2">
              <button variant="outline" onClick={onClose}>
                Cancel
              </button>
              <button onClick={handleSave}>
                Save Date Hiked
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

