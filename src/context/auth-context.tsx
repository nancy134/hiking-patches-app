// context/auth-context.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Hub } from '@aws-amplify/core';
import { getCurrentUser, signOut, fetchAuthSession } from 'aws-amplify/auth';

type AuthUser = Awaited<ReturnType<typeof getCurrentUser>>;

interface AuthContextValue {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  isAdmin: boolean;
  authReady: boolean;            // ✅ NEW
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authReady, setAuthReady] = useState(false); // ✅ NEW

  const updateUserAndRoles = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      // Prefer using Amplify's decoded payload instead of manual atob, when available
      const session = await fetchAuthSession();
      // In Amplify Auth v6, tokens may expose `payload`; fall back to manual decode if needed
      const jwt = session.tokens?.idToken;
      // Try payload first
      const payload: any =
        (jwt as any)?.payload ??
        (() => {
          const raw = jwt?.toString();
          if (!raw) return {};
          const [, body] = raw.split('.');
          try { return JSON.parse(atob(body)); } catch { return {}; }
        })();

      const groups: string[] = payload?.['cognito:groups'] ?? [];
      setIsAdmin(groups.includes('Admin'));
    } catch {
      // Not signed in
      setUser(null);
      setIsAdmin(false);
    } finally {
      setAuthReady(true); // ✅ Always mark as ready exactly once on first check
    }
  };

  useEffect(() => {
    // Listen for auth events to keep context in sync
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      const evt = payload?.event;
      if (evt === 'signedIn' || evt === 'tokenRefresh') {
        updateUserAndRoles();
      } else if (evt === 'signedOut') {
        setUser(null);
        setIsAdmin(false);
      }
    });

    // Initial check on mount
    updateUserAndRoles();

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isAdmin, authReady, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

