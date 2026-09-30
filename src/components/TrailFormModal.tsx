'use client';

import { useEffect, useState } from 'react';
import { normaliseUrlFields } from '@/lib/urls';
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
    alltrailsUrl: '',
    trailLinkUrl: '',
  });

  useEffect(() => {
    if (trail) {
      setForm({
        name: trail.name ?? '',
        description: trail.description ?? '',
        lengthMiles: trail.lengthMiles?.toString() ?? '',
        alltrailsUrl: trail.alltrailsUrl ?? '',
        trailLinkUrl: (trail as any).trailLinkUrl ?? '',
      });
    }
  }, [trail]);

  const [errors, setErrors] = useState<Partial<Record<'alltrailsUrl' | 'trailLinkUrl', string>>>({});
  const [saveError, setSaveError] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Store absolute URLs: a bare "www.traillink.com/..." would render as a
    // relative href and navigate inside the app instead of out to the trail.
    const { values: urls, errors: urlErrs } = normaliseUrlFields(
      { alltrailsUrl: form.alltrailsUrl, trailLinkUrl: form.trailLinkUrl },
      { alltrailsUrl: 'AllTrails widget URL', trailLinkUrl: 'TrailLink URL' }
    );

    const input = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      lengthMiles: Number(form.lengthMiles),
      alltrailsUrl: urls.alltrailsUrl,
      trailLinkUrl: urls.trailLinkUrl,
    };
    if (!Number.isFinite(input.lengthMiles) || input.lengthMiles <= 0) {
      alert('Length (miles) must be > 0'); return;
    }

    setErrors(urlErrs);
    if (Object.keys(urlErrs).length > 0) return;

    // Without this the save failed as an unhandled rejection: onSaved() never
    // ran, so the modal simply sat there with no indication anything was wrong.
    setSaveError(null);
    try {
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
    } catch (err) {
      console.error('Error saving trail:', err);
      const detail =
        (err as any)?.errors?.[0]?.message ??
        (err instanceof Error ? err.message : null);
      setSaveError(detail ? `Could not save this trail: ${detail}` : 'Could not save this trail. Please try again.');
      return;
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
          <div>
            <label className="block font-medium">AllTrails widget URL</label>
            <input name="alltrailsUrl" value={form.alltrailsUrl} onChange={onChange} placeholder="https://www.alltrails.com/widget/..." className="w-full border px-3 py-2 rounded" />
            <p className="text-xs text-gray-500 mt-1">Paste the <code>src</code> URL from the AllTrails embed code (optional).</p>
            {errors.alltrailsUrl && <p className="mt-1 text-sm text-red-600">{errors.alltrailsUrl}</p>}
          </div>
          <div>
            <label className="block font-medium">TrailLink URL</label>
            <input name="trailLinkUrl" value={form.trailLinkUrl} onChange={onChange} placeholder="https://www.traillink.com/trail/..." className="w-full border px-3 py-2 rounded" />
            {errors.trailLinkUrl && <p className="mt-1 text-sm text-red-600">{errors.trailLinkUrl}</p>}
          </div>
          {saveError && (
            <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {saveError}
            </div>
          )}

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

