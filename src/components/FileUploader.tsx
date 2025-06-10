'use client';

import { uploadData } from 'aws-amplify/storage';
import { fetchAuthSession } from 'aws-amplify/auth';

interface FileUploaderProps {
  onUploadComplete: () => void;
}

export default function FileUploader({ onUploadComplete }: FileUploaderProps) {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;
    const session = await fetchAuthSession();
    const userId = session.userSub; // Unique Cognito user ID

    const uniqueKey = `${userId}/${Date.now()}-${file.name}`;
    console.log("uniqueKey: "+uniqueKey);
    try {
      await uploadData({
        key: uniqueKey,
        data: file,
        options: {
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

