'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Hub } from '@aws-amplify/core';
import { getCurrentUser, signOut, fetchAuthSession } from 'aws-amplify/auth';

type AuthUser = Awaited<ReturnType<typeof getCurrentUser>>;

interface AuthContextValue {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  isAdmin: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const updateUserAndRoles = async () => {
    try {
      const currentUser = await getCurrentUser();
      console.log(currentUser);
      setUser(currentUser);
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      const payload = idToken ? JSON.parse(atob(idToken.split('.')[1])) : {};
      const groups = payload["cognito:groups"] || [];

      setIsAdmin(groups.includes("Admin"));

    } catch {
      console.log("auth-context error getting current user");
      setUser(null);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    console.log("auth-content useeffect");
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      console.log("payload.event: "+payload.event);
      // Other events userDelete, autoSignIn (from signup)
      if (payload.event === 'signedIn' || payload.event === 'tokenRefresh') {
        updateUserAndRoles();
      } else if (payload.event === 'signedOut') {
        setUser(null);
        setIsAdmin(false);
      }
    });

    // Check current user on mount
    updateUserAndRoles();

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut();
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, setUser, isAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

