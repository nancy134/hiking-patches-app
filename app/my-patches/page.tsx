'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import FileUploader from '@/components/FileUploader';
import UploadedFileList from '@/components/UploadedFileList';

export default function MyPatchesPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadComplete = () => {
    setRefreshKey((prev) => prev + 1); // 👈 trigger list refresh
  };

  return (
    <ProtectedRoute>
      <h1 className="text-2xl font-bold mb-4">My Hiking Patches</h1>
      <p className="mb-2">Here you can view and manage your earned hiking patches.</p>
      <FileUploader onUploadComplete={handleUploadComplete} />
      <UploadedFileList refreshTrigger={refreshKey}/>

      {/* TODO: Add uploaded patch list here */}
    </ProtectedRoute>
  );
}

