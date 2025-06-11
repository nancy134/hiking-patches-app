'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import FileUploader from '@/components/FileUploader';
import UploadedFileList from '@/components/UploadedFileList';
import Header from '@/components/Header';
import { generateClient } from 'aws-amplify/api';
import { listPatches, listUserPatches } from '@/graphql/queries';
import { createUserPatch } from '@/graphql/mutations';
import { uploadData } from 'aws-amplify/storage';
import { getCurrentUser } from 'aws-amplify/auth';
import UserPatchGrid from '@/components/UserPatchGrid';
import { UserPatch } from '@/API';
import { Patch } from '@/API';

const client = generateClient();

export default function MyPatchesPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [allUserPatches, setAllUserPatches] = useState<UserPatch[]>([]);
  const [allPatches, setAllPatches] = useState<Patch[]>([]);
  const [selectedPatchId, setSelectedPatchId] = useState('');
  const [dateCompleted, setDateCompleted] = useState('');
  const [notes, setNotes] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [userID, setUserID] = useState('');

  useEffect(() => {
    const loadPatches = async () => {
      const response = await client.graphql({ query: listUserPatches });
      setAllUserPatches(response.data.listUserPatches.items);

      const response1 = await client.graphql({ query: listPatches });
      setAllPatches(response1.data.listPatches.items);

      const user = await getCurrentUser();
      setUserID(user.userId);
    };
    loadPatches();
  }, []);

  const handleUpload = async () => {
    if (!selectedPatchId || !dateCompleted || !difficulty || !imageFile) return;

    const filename = `${Date.now()}-${imageFile.name}`;
    const uploadPath = `public/${userID}/${filename}`;

    await uploadData({ path: uploadPath, data: imageFile });

    await client.graphql({
      query: createUserPatch,
      variables: {
        input: {
          patchID: selectedPatchId,
          userID,
          dateCompleted,
          notes,
          difficulty: parseInt(difficulty),
          imageUrl: `https://your-s3-bucket.s3.amazonaws.com/${uploadPath}`,
        },
      },
      authMode: 'userPool'
    });

    setSelectedPatchId('');
    setDateCompleted('');
    setNotes('');
    setDifficulty('');
    setImageFile(null);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <ProtectedRoute>
      <Header />
      <h1 className="text-2xl font-bold mb-4">My Hiking Patches</h1>
      <p className="mb-2">Here you can view and manage your earned hiking patches.</p>

      {/* Upload Form */}
      <div className="space-y-2 p-4 bg-gray-50 rounded shadow mb-6">
        <select
          value={selectedPatchId}
          onChange={(e) => setSelectedPatchId(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a patch</option>
          {allPatches.map((patch) => (
            <option key={patch.id} value={patch.id}>{patch.name}</option>
          ))}
        </select>

        <input
          type="date"
          value={dateCompleted}
          onChange={(e) => setDateCompleted(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <textarea
          placeholder="Notes about this hike"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select difficulty</option>
          <option value="1">1 - Easy</option>
          <option value="2">2</option>
          <option value="3">3 - Moderate</option>
          <option value="4">4</option>
          <option value="5">5 - Difficult</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="w-full"
        />

        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload Patch Completion
        </button>
      </div>
      <UserPatchGrid patches={allUserPatches}/>
    </ProtectedRoute>
  );
}

