'use client';

import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { useAuth } from '@/context/auth-context';
import Header from '@/components/Header';
import { getAppSettingCustom } from '@/graphql/custom-queries';
import {
  createAppSettingCustom,
  updateAppSettingCustom,
} from '@/graphql/custom-mutations';
import { OWNER_EDITING_KEY } from '@/lib/featureFlags';

const client = generateClient();

type AppSetting = { key: string; value?: string | null };

export default function AdminSettingsPage() {
  const { isAdmin, authReady } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ownerEditing, setOwnerEditing] = useState(false);
  const [exists, setExists] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await client.graphql({
          query: getAppSettingCustom,
          variables: { key: OWNER_EDITING_KEY },
          authMode: 'userPool',
        });
        const setting = (res as { data?: { getAppSetting?: AppSetting | null } })
          .data?.getAppSetting;
        setExists(!!setting);
        setOwnerEditing(setting?.value === 'true');
      } catch (err) {
        console.error('Error loading settings:', err);
      } finally {
        setLoading(false);
      }
    };
    if (isAdmin) load();
  }, [isAdmin]);

  const toggleOwnerEditing = async () => {
    const next = !ownerEditing;
    setSaving(true);
    setMessage('');
    try {
      await client.graphql({
        query: exists ? updateAppSettingCustom : createAppSettingCustom,
        variables: { input: { key: OWNER_EDITING_KEY, value: next ? 'true' : 'false' } },
        authMode: 'userPool',
      });
      setExists(true);
      setOwnerEditing(next);
      setMessage(next ? '✅ Owner editing enabled.' : '✅ Owner editing disabled.');
    } catch (err) {
      console.error('Error saving setting:', err);
      setMessage('❌ Could not save. Try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!authReady) return <p className="p-6">Checking permissions…</p>;
  if (!isAdmin) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <Header />
        <p className="p-6 text-red-600 font-semibold">⛔ Access denied. Admins only.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Header />
      <h1 className="text-3xl font-bold mb-1">Settings</h1>
      <p className="text-gray-600 mb-8">Feature toggles for this environment.</p>

      <div className="border rounded-lg p-5 bg-white shadow flex items-start justify-between gap-6">
        <div>
          <h2 className="text-lg font-semibold">Owner editing</h2>
          <p className="text-sm text-gray-600 mt-1 max-w-md">
            Lets approved patch owners edit a patch&rsquo;s description, image, and
            the Markdown &ldquo;How to Get This Patch&rdquo; section from their owner
            dashboard. When off, the owner dashboard and ownership requests are hidden
            and owner edits are rejected.
          </p>
          {!loading && (
            <p className="text-xs mt-2 font-medium">
              Status:{' '}
              <span className={ownerEditing ? 'text-green-700' : 'text-gray-500'}>
                {ownerEditing ? 'Enabled' : 'Disabled'}
              </span>
            </p>
          )}
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={ownerEditing}
          disabled={loading || saving}
          onClick={toggleOwnerEditing}
          className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition disabled:opacity-50 ${
            ownerEditing ? 'bg-green-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
              ownerEditing ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {message && <p className="text-sm mt-3">{message}</p>}
    </div>
  );
}
