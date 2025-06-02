'use client';

import { uploadData } from 'aws-amplify/storage';
import { useState } from 'react';

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    setFile(selected || null);
    setUploadSuccess(false);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const result = await uploadData({
        key: file.name,
        data: file,
        options: {
          contentType: file.type,
        },
      }).result;

      console.log('Upload success:', result);
      setUploadSuccess(true);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded bg-gray-50">
      <label className="block mb-2 font-semibold">Upload a hiking patch photo:</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {uploadSuccess && <p className="text-green-600 mt-2">✅ Upload successful!</p>}
      {error && <p className="text-red-600 mt-2">⚠️ {error}</p>}
    </div>
  );
}

