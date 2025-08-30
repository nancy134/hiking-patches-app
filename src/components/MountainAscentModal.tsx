'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { UserMountain } from '@/API';
import { format } from 'date-fns';

type MountainAscentModalProps = {
  open: boolean;
  onClose: () => void;
  userMountain: UserMountain[];
  onSave: (dates: string[]) => void;
};

export default function MountainAscentModal({
  open,
  onClose,
  userMountain,
  onSave,
}: MountainAscentModalProps) {
  const mostRecentDate = userMountain.length > 0
    ? userMountain[userMountain.length - 1].dateClimbed
    : '';

  const [dateClimbed, setDateClimbed] = useState(mostRecentDate || '');
  const [cleared, setCleared] = useState(false);
  const [ascentDates, setAscentDates] = useState<string[]>([]);

  useEffect(() => {
    const dates = userMountain.map((c) => c.dateClimbed).filter(Boolean);
    setAscentDates(dates);
  }, [userMountain]);

useEffect(() => {
  if (open && userMountain.length === 0) {
    setAscentDates(['']);
  }
}, [open, userMountain]);

  const handleDateChange = (index: number, newDate: string) => {
    const newDates = [...ascentDates];
    newDates[index] = newDate;
    setAscentDates(newDates);
  };

  const handleRemoveDate = (index: number) => {
    const newDates = ascentDates.filter((_, i) => i !== index);
    setAscentDates(newDates);
  };

  const handleAddDate = () => {
    setAscentDates([...ascentDates, '']);
  };

  const handleSave = () => {
    onSave(ascentDates.filter(Boolean)); // Remove blanks
    onClose();
  };

  const handleClear = () => {
    setDateClimbed('');
    setCleared(true);
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Centered modal container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
          <Dialog.Title className="text-xl font-bold mb-2">
            Update Ascents for ...
          </Dialog.Title>


          <div className="space-y-2">

            {ascentDates.map((date, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex items-center border rounded-md px-2 flex-1 hover:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => handleDateChange(index, e.target.value)}
                    className="flex-1 py-1 outline-none"
                  />
                </div>
                <button
                  onClick={() => handleRemoveDate(index)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              onClick={handleAddDate}
              className="text-blue-600 text-sm mt-2"
            >
              + Add another ascent date
            </button>
          </div>


          <div>
            <div className="flex justify-between gap-3 pt-4">
               { /*
              <button
                onClick={handleClear}
                className="text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-50"
              >
                Clear All
              </button>
              */ }
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="border border-gray-400 px-3 py-1 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

