'use client';

import { useState, useEffect } from 'react';
import { uploadData } from 'aws-amplify/storage';
import { generateClient } from 'aws-amplify/api';
import { createPatch, updatePatch } from '@/graphql/mutations';
import { Patch, Difficulty } from '@/API';
import awsExports from '@/aws-exports';
import FileUploader from '@/components/FileUploader';

const client = generateClient();
const bucket = awsExports.aws_user_files_s3_bucket;
const region = awsExports.aws_user_files_s3_bucket_region;

export default function PatchFormModal({
  patch,
  onClose,
  onSaved
}: {
  patch: Partial<Patch> | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [howToGet, setHowToGet] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [regions, setRegions] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty | ''>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (patch) {
      setName(patch.name ?? '');
      setDescription(patch.description ?? '');
      setHowToGet(patch.howToGet ?? '');
      setRegions((patch.regions ?? []).filter((r): r is string => r !== null));
      setDifficulty(patch.difficulty ?? '');
    }
  }, [patch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = patch?.imageUrl ?? '';
      if (imageFile) {
        const filename = `public/${Date.now()}-${imageFile.name}`;
        await uploadData({ path: filename, data: imageFile }).result;
        imageUrl = `https://${bucket}.s3.${region}.amazonaws.com/${filename}`;
      }

      if (patch?.id) {
        await client.graphql({
          query: updatePatch,
          variables: {
            input: {
              id: patch.id,
              name,
              description,
              howToGet,
              imageUrl,
              regions,
              difficulty: difficulty as Difficulty
            }
          },
          authMode: 'userPool'
        });
      } else {
        await client.graphql({
          query: createPatch,
          variables: {
            input: {
              name,
              description,
              howToGet,
              imageUrl,
              regions,
              difficulty: difficulty as Difficulty 
            }
          },
          authMode: 'userPool'
        });
      }

      onSaved();
    } catch (err) {
      console.error('Error saving patch:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>✖</button>
        <h2 className="text-xl font-bold mb-4">{patch ? 'Edit Patch' : 'Add New Patch'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            value={howToGet}
            onChange={(e) => setHowToGet(e.target.value)}
            placeholder="How to Get"
            className="w-full p-2 border rounded"
            required
          />
          <select
            multiple
            value={regions}
            onChange={(e) =>
              setRegions(Array.from(e.target.selectedOptions, (opt) => opt.value))
            }
            className="w-full p-2 border rounded"
          >
            {[ 'Connecticut', 'Maine', 'Massachusetts', 'New Hampshire', 'New York', 'Vermont'
            ].map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Difficulty</option>
            <option value="EASY">Easy</option>
            <option value="MODERATE">Moderate</option>
            <option value="HARD">Hard</option>
            <option value="EXTRA_HARD">Extra Hard</option>
            <option value="EXTRA_EXTRA_HARD">Extra Extra Hard</option>
          </select>
          <FileUploader
            onFileSelected={(file) => setImageFile(file)}
            label="Upload Patch Image"
          />
          <div className="flex justify-end gap-4">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={onClose} className="text-gray-600 underline">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

