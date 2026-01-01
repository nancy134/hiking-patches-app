'use client';

import { useEffect, useState } from 'react';
import { Mountain } from '@/API';
import { createMountain, updateMountain } from '@/graphql/mutations';
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

interface Props {
  mountain?: Partial<Mountain> | null;
  onClose: () => void;
  onSaved: () => void;
}

const US_STATES = [
  'Any Location', 'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina',
  'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

export default function MountainFormModal({ mountain, onClose, onSaved }: Props) {
  const isEdit = Boolean(mountain?.id);
  const [form, setForm] = useState({
    name: '',
    elevation: '',
    latitude: '',
    longitude: '',
    city: '',
    state: ''
  });

  useEffect(() => {
    if (mountain) {
      setForm({
        name: mountain.name || '',
        elevation: mountain.elevation?.toString() || '',
        latitude: mountain.latitude?.toString() || '',
        longitude: mountain.longitude?.toString() || '',
        city: mountain.city || '',
        state: mountain.state || ''
      });
    }
  }, [mountain]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const input = {
      name: form.name.trim(),
      elevation: parseInt(form.elevation, 10),
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      city: form.city.trim(),
      state: form.state.trim()
    };

    if (isEdit && mountain?.id) {
      await client.graphql({
        query: updateMountain,
        variables: {
          input: {
            id: mountain.id,
            ...input,
          },
        },
        authMode: 'userPool',
      });
    } else {
      await client.graphql({
        query: createMountain,
        variables: { input },
        authMode: 'userPool',
      });
    }

    onSaved();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? 'Edit Mountain' : 'Add Mountain'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Elevation (ft)</label>
            <input
              name="elevation"
              type="number"
              value={form.elevation}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Latitude</label>
            <input
              name="latitude"
              type="number"
              step="any"
              value={form.latitude}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Longitude</label>
            <input
              name="longitude"
              type="number"
              step="any"
              value={form.longitude}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">City</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">State</label>
            <select
              name="state"
              value={form.state}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
             <option value="">Select a state</option>
              {US_STATES.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>

          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

