'use client';

import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { UserMountain } from '@/API';

type MountainAscentModalProps = {
  open: boolean;
  onClose: () => void;
  userMountain: UserMountain[];
  onSave: (dates: string[]) => void;
  mountainName: string;
};

export default function MountainAscentModal({
  open,
  onClose,
  userMountain,
  onSave,
  mountainName,
}: MountainAscentModalProps) {
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

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Centered modal container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
          <Dialog.Title className="text-xl font-bold mb-2">
            Update Ascents for {mountainName}
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

            <button onClick={handleAddDate} className="text-blue-600 text-sm mt-2">
              + Add another ascent date
            </button>
          </div>

          <div className="flex justify-end gap-2 pt-4">
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
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

