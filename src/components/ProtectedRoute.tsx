'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <>
          <div className="px-4 py-2 text-sm text-gray-600">
            <button onClick={signOut} className="ml-4 underline text-blue-600">
              Sign out
            </button>
          </div>
          {children}
        </>
      )}
    </Authenticator>
  );
}

