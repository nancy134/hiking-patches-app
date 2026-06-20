'use client';

import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { useAuth } from '@/context/auth-context';
import { getAppSettingCustom } from '@/graphql/custom-queries';

const client = generateClient();

// Feature-flag keys stored in the AppSetting model. Toggled from the admin
// console (app/admin/settings); each environment has its own value.
export const OWNER_EDITING_KEY = 'OWNER_EDITING_ENABLED';

/**
 * Reads a boolean feature flag. Fail-closed by design: a missing row, a
 * non-'true' value, or any error all resolve to `false`. Reads require a
 * signed-in user (the model allows authenticated read); the owner UI that
 * consumes flags is only shown to authenticated users anyway.
 */
export async function getFlag(key: string): Promise<boolean> {
  try {
    const res = await client.graphql({
      query: getAppSettingCustom,
      variables: { key },
      authMode: 'userPool',
    });
    return (res as { data?: { getAppSetting?: { value?: string | null } | null } })
      .data?.getAppSetting?.value === 'true';
  } catch (err) {
    console.error(`Failed to read feature flag ${key}; treating as disabled`, err);
    return false;
  }
}

/**
 * Hook for the owner-editing kill switch. Returns `{ enabled, loading }`.
 * Anonymous users always get `enabled: false` (the feature is for signed-in
 * owners only).
 */
export function useOwnerEditingEnabled(): { enabled: boolean; loading: boolean } {
  const { user, authReady } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authReady) return;
    if (!user) {
      setEnabled(false);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    getFlag(OWNER_EDITING_KEY).then((v) => {
      if (active) {
        setEnabled(v);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [authReady, user]);

  return { enabled, loading };
}
