'use client';

import { useEffect, useState } from 'react';
import { list, getUrl } from 'aws-amplify/storage';
import { fetchAuthSession } from 'aws-amplify/auth';

interface UploadedFilesListProps {
  refreshTrigger: number;
}

export default function UploadedFilesList({ refreshTrigger }: UploadedFilesListProps) {
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const session = await fetchAuthSession();
        const userId = session.userSub;
        const { items } = await list({ 
            prefix: `${userId}/` 
        });
        console.log("items:");
        console.log(items);
        const urls = await Promise.all(
          items.map(async (item) => {
            const { url } = await getUrl({ key: item.key });
            return url.toString();
          })
        );
        setFileUrls(urls);
      } catch (err) {
        console.error('Error listing files:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [refreshTrigger]);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">📸 Uploaded Patch Photos</h2>
      {loading ? (
        <p>Loading...</p>
      ) : fileUrls.length === 0 ? (
        <p>No uploaded files found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {fileUrls.map((url, index) => (
            <div key={index} className="border rounded shadow-sm overflow-hidden">
              <img src={url} alt={`Uploaded patch ${index}`} className="w-full h-auto" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

