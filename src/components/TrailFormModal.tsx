'use client';

import { useEffect, useState } from 'react';
import type { Trail } from '@/API';
import { createTrail, updateTrail } from '@/graphql/mutations';
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

export default function TrailFormModal({
  trail,
  onClose,
  onSaved,
}: {
  trail?: Partial<Trail> | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = Boolean(trail?.id);
  const [form, setForm] = useState({
    name: '',
    description: '',
    lengthMiles: '',
  });

  useEffect(() => {
    if (trail) {
      setForm({
        name: trail.name ?? '',
        description: trail.description ?? '',
        lengthMiles: trail.lengthMiles?.toString() ?? '',
      });
    }
  }, [trail]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      lengthMiles: Number(form.lengthMiles),
    };
    if (!Number.isFinite(input.lengthMiles) || input.lengthMiles <= 0) {
      alert('Length (miles) must be > 0'); return;
    }

    if (isEdit && trail?.id) {
      await client.graphql({
        query: updateTrail,
        variables: { input: { id: trail.id, ...input } },
        authMode: 'userPool',
      });
    } else {
      await client.graphql({
        query: createTrail,
        variables: { input },
        authMode: 'userPool',
      });
    }
    onSaved();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">{isEdit ? 'Edit Trail' : 'Add Trail'}</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Name</label>
            <input name="name" value={form.name} onChange={onChange} className="w-full border px-3 py-2 rounded" required />
          </div>
          <div>
            <label className="block font-medium">Description</label>
            <textarea name="description" value={form.description} onChange={onChange} className="w-full border px-3 py-2 rounded" rows={3} />
          </div>
          <div>
            <label className="block font-medium">Length (miles)</label>
            <input name="lengthMiles" type="number" step="any" value={form.lengthMiles} onChange={onChange} className="w-full border px-3 py-2 rounded" required />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              {isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

