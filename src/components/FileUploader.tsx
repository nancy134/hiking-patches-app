'use client';

import { uploadData } from 'aws-amplify/storage';

interface FileUploaderProps {
  onUploadComplete: () => void;
}

export default function FileUploader({ onUploadComplete }: FileUploaderProps) {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const uniqueKey = `${Date.now()}-${file.name}`;

    try {
      await uploadData({
        key: uniqueKey,
        data: file,
        options: {
          accessLevel: 'private',
          contentType: file.type,
        },
      }).result;

      console.log('✅ Upload successful');
      onUploadComplete(); // 👈 Trigger re-fetch
    } catch (error) {
      console.error('❌ Upload error:', error);
    }
  };

  return (
    <div className="my-4">
      <input type="file" onChange={handleFileChange} />
    </div>
  );
}

