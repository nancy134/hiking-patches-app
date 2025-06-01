'use client';

import { Authenticator } from '@aws-amplify/ui-react';

import '@aws-amplify/ui-react/styles.css';

export default function AuthPage() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main className="p-4">
          <h1 className="text-2xl font-bold">Welcome, {user?.username}!</h1>
          <button className="mt-4 p-2 bg-gray-200 rounded" onClick={signOut}>
            Sign out
          </button>
        </main>
      )}
    </Authenticator>
  );
}


