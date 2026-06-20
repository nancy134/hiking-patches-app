'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Authenticator } from '@aws-amplify/ui-react';
import { signUp } from 'aws-amplify/auth';
import { useAuth } from '@/context/auth-context';
import { notifyAdmins } from '@/lib/notify';

import '@aws-amplify/ui-react/styles.css';

// Override the Authenticator's sign-up so we can record an admin notification
// when a new account is created. referenceAuth blocks a Cognito post-confirmation
// trigger, so this client hook is the simple stand-in. Best-effort: notifyAdmins
// never throws, and we only notify once the signUp call itself succeeds.
const authServices = {
  async handleSignUp(input: Parameters<typeof signUp>[0]) {
    const result = await signUp(input);
    notifyAdmins({
      type: 'NEW_USER',
      title: 'New user signed up',
      body: input.username,
      link: '/admin/users',
    });
    return result;
  },
};

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
    <Authenticator services={authServices}>
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
