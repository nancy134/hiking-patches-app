'use client'; // if you're using Next.js app directory

import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';

export default function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const { user, isAdmin, setUser, logout } = useAuth();
  const [authTab, setAuthTab] = useState<'signIn' | 'signUp'>('signIn');

  useEffect(() => {
    if (user) {
      setShowLogin(false); // Auto-close modal on sign-in
    }
  }, [user]);

  const openModal = (tab: 'signIn' | 'signUp') => {
    setAuthTab(tab);
    setShowLogin(true);
  };

  return (
    <header className="flex justify-between items-center p-4 border-b mb-4">
      <Link href="/" className="text-2xl font-bold flex items-center space-x-2">
        <img src="/person-hiking-solid.svg" alt="Logo" className="h-6 w-6" />
        <span>Hiking Patches</span>
      </Link>

      <div className="space-x-4">
        <Link href="/" className="text-blue-600 hover:underline">Home</Link>
        {user ? (
          <>
            <Link href="/my-patches" className="text-blue-600 hover:underline">My Patches</Link>
            {isAdmin && (
              <Link href="/admin" className="text-blue-600 hover:underline">Admin</Link>
            )}
            <Link href="/about" className="text-blue-600 hover:underline">About</Link>
            <button
              onClick={async () => {
                await logout();
                setUser(null);
              }}
              className="text-blue-600 hover:underline hover:text-blue-800"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <button onClick={() => openModal("signIn")} className="text-blue-600 hover:underline">
              Sign in
            </button>
            <button onClick={() => openModal("signUp")} className="text-blue-600 hover:underline">
              Create Account
            </button>


            <Dialog open={showLogin} onClose={() => setShowLogin(false)} className="relative z-50">
              {/* Background overlay */}
              <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

              {/* Centered panel */}
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-xl shadow-lg relative">
                  <button
                    onClick={() => setShowLogin(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
                  >
                    &times;
                  </button>
                  <Authenticator initialState={authTab} socialProviders={[]} />
                </Dialog.Panel>
              </div>
            </Dialog>
          </>
        )}
      </div>
    </header>
  );
}

