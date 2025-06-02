'use client';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function MyPatchesPage() {
  return (
    <ProtectedRoute>
      <h1 className="text-2xl font-bold mb-4">My Hiking Patches</h1>
      <p className="mb-2">Here you can view and manage your earned hiking patches.</p>

      {/* TODO: Add uploaded patch list here */}
    </ProtectedRoute>
  );
}

