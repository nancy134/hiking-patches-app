'use client';

import { useEffect, useState } from 'react';
import { normaliseUrlFields } from '@/lib/urls';
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
    state: '',
    alltrailsUrl: '',
    peakbaggerUrl: '',
    weatherUrl: ''
  });

  useEffect(() => {
    if (mountain) {
      setForm({
        name: mountain.name || '',
        elevation: mountain.elevation?.toString() || '',
        latitude: mountain.latitude?.toString() || '',
        longitude: mountain.longitude?.toString() || '',
        city: mountain.city || '',
        state: mountain.state || '',
        alltrailsUrl: mountain.alltrailsUrl || '',
        peakbaggerUrl: (mountain as any).peakbaggerUrl || '',
        weatherUrl: (mountain as any).weatherUrl || ''
      });
    }
  }, [mountain]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const [errors, setErrors] = useState<
    Partial<Record<'alltrailsUrl' | 'peakbaggerUrl' | 'weatherUrl', string>>
  >({});
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Store absolute URLs so a bare "www.peakbagger.com/..." doesn't become a
    // relative href that navigates inside the app.
    const { values: urls, errors: urlErrs } = normaliseUrlFields(
      {
        alltrailsUrl: form.alltrailsUrl,
        peakbaggerUrl: form.peakbaggerUrl,
        weatherUrl: form.weatherUrl,
      },
      {
        alltrailsUrl: 'AllTrails URL',
        peakbaggerUrl: 'Peakbagger URL',
        weatherUrl: 'Weather forecast URL',
      }
    );
    setErrors(urlErrs);
    if (Object.keys(urlErrs).length > 0) return;

    const input = {
      name: form.name.trim(),
      elevation: parseInt(form.elevation, 10),
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      city: form.city.trim(),
      state: form.state.trim(),
      alltrailsUrl: urls.alltrailsUrl,
      peakbaggerUrl: urls.peakbaggerUrl,
      weatherUrl: urls.weatherUrl
    };

    // Without this the save failed as an unhandled rejection: onSaved() never
    // ran, so the modal simply sat there with no indication anything was wrong.
    setSaveError(null);
    try {
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
    } catch (err) {
      console.error('Error saving mountain:', err);
      const detail =
        (err as any)?.errors?.[0]?.message ??
        (err instanceof Error ? err.message : null);
      setSaveError(
        detail ? `Could not save this mountain: ${detail}` : 'Could not save this mountain. Please try again.'
      );
      return;
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

          <div>
            <label className="block font-medium">AllTrails widget URL</label>
            <input
              name="alltrailsUrl"
              value={form.alltrailsUrl}
              onChange={handleChange}
              placeholder="https://www.alltrails.com/widget/..."
              className="w-full border px-3 py-2 rounded"
            />
            <p className="text-xs text-gray-500 mt-1">
              Paste the <code>src</code> URL from the AllTrails embed code (optional).
            </p>
          </div>

          <div>
            <label className="block font-medium">Peakbagger URL</label>
            <input
              name="peakbaggerUrl"
              value={form.peakbaggerUrl}
              onChange={handleChange}
              placeholder="https://www.peakbagger.com/peak.aspx?pid=..."
              className="w-full border px-3 py-2 rounded"
            />
            {errors.peakbaggerUrl && <p className="mt-1 text-sm text-red-600">{errors.peakbaggerUrl}</p>}
          </div>

          <div>
            <label className="block font-medium">Weather forecast URL</label>
            <input
              name="weatherUrl"
              value={form.weatherUrl}
              onChange={handleChange}
              placeholder="https://forecast.weather.gov/..."
              className="w-full border px-3 py-2 rounded"
            />
            {errors.weatherUrl && <p className="mt-1 text-sm text-red-600">{errors.weatherUrl}</p>}
          </div>

          {saveError && (
            <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {saveError}
            </div>
          )}

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

