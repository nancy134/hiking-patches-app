'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { uploadData, getUrl } from 'aws-amplify/storage';
import { generateClient } from 'aws-amplify/api';
import { createPatch } from '@/graphql/mutations';
import { fetchAuthSession } from 'aws-amplify/auth';
import awsExports from '@/aws-exports';

const bucket = awsExports.aws_user_files_s3_bucket;
const region = awsExports.aws_user_files_s3_bucket_region;

const client = generateClient();

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          setIsAdmin(false);
          return;
        }

        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();

        if (!idToken) {
          setIsAdmin(false);
          return;
        }

        const payload = JSON.parse(atob(idToken.split('.')[1]));
        const groups = payload['cognito:groups'] || [];
        console.log('User groups:', groups);

        setIsAdmin(groups.includes('Admin'));
      } catch (err) {
        console.warn('Not logged in or error fetching session:', err);
        setIsAdmin(false);
      }
    };

    checkAccess();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !imageFile) return;

    setLoading(true);
    setSuccess(false);

    try {
      const filename = `${Date.now()}-${imageFile.name}`;
      await uploadData({
        key: filename,
        data: imageFile,
        options: { accessLevel: 'public', contentType: imageFile.type }
      }).result;

      if (!bucket || !region) {
        throw new Error('Missing S3 bucket or region in Amplify config');
      }

      // Construct public URL
      const url = `https://${bucket}.s3.${region}.amazonaws.com/public/${filename}`;
      console.log("url: "+url);
      await client.graphql({
        query: createPatch,
        variables: {
          input: {
            name,
            description,
            imageUrl: url,
          },
        },
        authMode: "userPool"
      });

      setName('');
      setDescription('');
      setImageFile(null);
      setSuccess(true);
    } catch (err) {
      console.error('Error creating patch:', err);
    } finally {
      setLoading(false);
    }
  };

  if (isAdmin === null) {
    return <p className="p-6">Checking permissions...</p>;
  }

  if (!isAdmin) {
    return <p className="p-6 text-red-600 font-semibold">⛔ Access denied. Admins only.</p>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🛠️ Admin: Add a New Patch</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Patch name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Patch description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          className="w-full"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Saving...' : 'Add Patch'}
        </button>
      </form>
      {success && <p className="text-green-600 mt-4">✅ Patch added successfully!</p>}
    </div>
  );
}

