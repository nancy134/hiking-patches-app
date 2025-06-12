'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser, fetchAuthSession, signOut } from 'aws-amplify/auth';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/logo.png'; // Optional: remove if you're not using an image

export default function Header() {
  const [user, setUser] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();
        const payload = idToken ? JSON.parse(atob(idToken.split('.')[1])) : {};
        const groups = payload["cognito:groups"] || [];

        setIsAdmin(groups.includes("Admin"));
      } catch {
        setUser(null);
        setIsAdmin(false);
      }
    };

    checkUser();
  }, []);

  return (
    <div className="flex justify-between items-center border-b mb-4 p-4 bg-white shadow-sm">
      <Link href="/" className="flex items-center space-x-2 hover:opacity-80">
        {/* Uncomment this line if using a logo */}
        <Image src="/person-hiking-solid.svg" alt="Hiking Patches Logo" width={20} height={20} /> 
        <span className="text-xl font-bold text-gray-800">Hiking-Patches.com</span>
      </Link>
      
      <div className="flex items-center space-x-4">
        {!user ? (
          <Link href="/my-patches" className="text-blue-600 underline hover:text-blue-800">
            Log in
          </Link>
        ) : (
          <>
            <Link href="/my-patches" className="text-blue-600 underline hover:text-blue-800">
              My Patches
            </Link>
            {isAdmin && (
              <Link href="/admin" className="text-green-700 underline hover:text-green-900">
                Admin
              </Link>
            )}
            <button
              onClick={async () => {
                await signOut();
                setUser(null);
                setIsAdmin(false);
              }}
              className="text-red-600 underline hover:text-red-800"
            >
              Log out
            </button>
          </>
        )}
      </div>
    </div>
  );
}

