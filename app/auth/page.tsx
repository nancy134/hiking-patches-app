'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Authenticator } from '@aws-amplify/ui-react';
import { useAuth } from '@/context/auth-context';

import '@aws-amplify/ui-react/styles.css';

function AuthContent() {
  const { user, authReady } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (authReady && user) {
      router.push(redirect);
    }
  }, [authReady, user, redirect, router]);

  return (
    <Authenticator>
      {({ signOut }) => (
        <main className="p-4">
          <p>Redirecting...</p>
          <button className="mt-4 p-2 bg-gray-200 rounded" onClick={signOut}>
            Sign out
          </button>
        </main>
      )}
    </Authenticator>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthContent />
    </Suspense>
  );
}
