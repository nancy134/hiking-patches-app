// context/auth-context.tsx
'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Hub } from '@aws-amplify/core';
import { getCurrentUser, signOut, fetchAuthSession } from 'aws-amplify/auth';

type AuthUser = Awaited<ReturnType<typeof getCurrentUser>>;

interface AuthContextValue {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  isAdmin: boolean;
  authReady: boolean;
  /** Re-read the session. Lets a component that knows better (e.g. the sign-in
   *  modal, which has its own view of auth state) pull this context back in sync. */
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authReady, setAuthReady] = useState(false); // ✅ NEW

  /**
   * One attempt at reading auth state. Returns null when the browser genuinely
   * holds no session, and throws when it could not be determined.
   *
   * The session is fetched BEFORE getCurrentUser(): on a cold load
   * getCurrentUser() can reject while Amplify is still rehydrating tokens from
   * storage, and the old code treated that rejection as "signed out".
   */
  const probeOnce = async (): Promise<{ user: AuthUser; isAdmin: boolean } | null> => {
    const session = await fetchAuthSession();
    const jwt = session.tokens?.idToken;
    if (!jwt) return null;

    const currentUser = await getCurrentUser();

    const payload: any =
      (jwt as any)?.payload ??
      (() => {
        const raw = jwt?.toString();
        if (!raw) return {};
        const [, body] = raw.split('.');
        try { return JSON.parse(atob(body)); } catch { return {}; }
      })();

    const groups: string[] = payload?.['cognito:groups'] ?? [];
    return { user: currentUser, isAdmin: groups.includes('Admin') };
  };

  /**
   * True when this browser has a stored Cognito session. Used to decide whether
   * an apparently-empty auth state is worth retrying: an anonymous visitor
   * should not be made to wait, but someone who IS signed in should never be
   * shown a signed-out header just because the first read lost a race.
   */
  const hasStoredSession = () => {
    try {
      return Object.keys(window.localStorage).some(
        (k) => k.startsWith('CognitoIdentityServiceProvider.') && k.endsWith('.LastAuthUser')
      );
    } catch {
      return false;
    }
  };

  const refresh = useCallback(async () => {
    let result: { user: AuthUser; isAdmin: boolean } | null = null;

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        result = await probeOnce();
        // An empty result is only trustworthy if nothing is stored locally.
        if (result || !hasStoredSession()) break;
      } catch {
        // fall through to the retry
      }
      if (attempt === 0) await new Promise((r) => setTimeout(r, 400));
    }

    setUser(result?.user ?? null);
    setIsAdmin(result?.isAdmin ?? false);
    setAuthReady(true);
  }, []);

  useEffect(() => {
    // Listen for auth events to keep context in sync
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      const evt = payload?.event;
      if (evt === 'signedIn' || evt === 'tokenRefresh') {
        refresh();
      } else if (evt === 'signedOut') {
        setUser(null);
        setIsAdmin(false);
      }
    });

    // Initial check on mount
    refresh();

    return () => unsubscribe();
  }, [refresh]);

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isAdmin, authReady, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

