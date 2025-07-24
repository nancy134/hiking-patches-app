// app/not-found.js
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Redirect to home page, optionally including original path
    router.replace(`/`);
  }, [pathname, router]);

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-gray-600 mt-2">Redirecting to the home page...</p>
    </div>
  );
}

