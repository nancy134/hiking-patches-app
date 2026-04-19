'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import PatchesScreen from '@/components/PatchesScreen';

export default function MyPatchesPage() {
  const { user, authReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authReady && !user) {
      router.push('/auth?redirect=/my-patches');
    }
  }, [authReady, user, router]);

  if (!authReady || !user) return null;

  return <PatchesScreen variant="mine" />;
}
