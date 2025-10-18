'use client';

import { useState, useEffect, useMemo } from 'react';
import { uploadData } from 'aws-amplify/storage';
import { generateClient } from 'aws-amplify/api';
import { createPatch, updatePatch } from '@/graphql/mutations';
import { Patch, Difficulty } from '@/API';
import awsExports from '@/aws-exports';
import FileUploader from '@/components/FileUploader';

const client = generateClient();
const bucket = awsExports.aws_user_files_s3_bucket;
const region = awsExports.aws_user_files_s3_bucket_region;

type RuleType =
  | 'default'
  | 'excludeDelisted'
  | 'anyN';

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
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [popularity, setPopularity] = useState<number | null>(null);
  const [hasPeaks, setHasPeaks] = useState<boolean>(false);
  const [hasTrails, setHasTrails] = useState<boolean>(false);

  // --- Completion Rule editor state ---
  const [ruleType, setRuleType] = useState<RuleType>('default');
  const [anyNCount, setAnyNCount] = useState<number | ''>('');
  const [winterOnly, setWinterOnly] = useState<boolean>(false);

  // Hydrate fields from incoming patch prop
  useEffect(() => {
    if (patch) {
      setName(patch.name ?? '');
      setDescription(patch.description ?? '');
      setHowToGet(patch.howToGet ?? '');
      setRegions((patch.regions ?? []).filter((r): r is string => r !== null));
      setDifficulty(patch.difficulty ?? '');
      setLatitude(isNaN(Number(patch.latitude)) ? null : patch.latitude ?? null);
      setLongitude(isNaN(Number(patch.longitude)) ? null : patch.longitude ?? null);
      setPopularity(isNaN(Number(patch.popularity)) ? null : Number(patch.popularity));
      setHasPeaks(patch.hasPeaks ?? false);
      setHasTrails((patch as any).hasTrails ?? false);

      // Parse completionRule (can be object or JSON string from AppSync)
      const raw = (patch as any)?.completionRule as unknown;
      let obj: any = raw;
      if (typeof raw === 'string') {
        try { obj = JSON.parse(raw); } catch { obj = null; }
      }
      if (!obj || typeof obj !== 'object') {
        setRuleType('default');
        setAnyNCount('');
        setWinterOnly(false);
      } else {
        const t = obj.type as RuleType;
        if (t === 'excludeDelisted') {
          setRuleType('excludeDelisted');
          setAnyNCount('');
        } else if (t === 'anyN') {
          setRuleType('anyN');
          const n = Number(obj.n);
          setAnyNCount(Number.isFinite(n) && n > 0 ? Math.floor(n) : '');
        } else {
          setRuleType('default');
          setAnyNCount('');
        }
        setWinterOnly(!!obj.winterOnly);
      }
    }
  }, [patch]);

const completionRuleObject = useMemo(() => {
  const winter = winterOnly ? { winterOnly: true } : {}; // ✅ include only if true
  switch (ruleType) {
    case 'excludeDelisted':
      return { type: 'excludeDelisted', ...winter };
    case 'anyN': {
      const n = typeof anyNCount === 'number' ? anyNCount : parseInt(String(anyNCount));
      if (Number.isFinite(n) && n > 0) return { type: 'anyN', n, ...winter };
      return { type: 'default', ...winter }; // ✅ keep winterOnly if invalid N
    }
    case 'default':
    default:
      return { type: 'default', ...winter };
  }
}, [ruleType, anyNCount, winterOnly]);

  const completionRulePreview = useMemo(
    () => JSON.stringify(completionRuleObject, null, 2),
    [completionRuleObject]
  );

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

const completionRuleToSend =
  (ruleType !== 'default' || winterOnly)
    ? JSON.stringify(completionRuleObject)
    : undefined;

      const commonInput = {
        name,
        description,
        howToGet,
        imageUrl,
        regions,
        difficulty: difficulty as Difficulty,
        latitude,
        longitude,
        popularity,
        hasPeaks,
        hasTrails,
        completionRule: completionRuleToSend, // <-- NEW
      };

      if (patch?.id) {
        await client.graphql({
          query: updatePatch,
          variables: {
            input: {
              id: patch.id,
              ...commonInput,
            }
          },
          authMode: 'userPool'
        });
      } else {
        await client.graphql({
          query: createPatch,
          variables: {
            input: {
              ...commonInput,
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
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-4xl relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>✖</button>
        <h2 className="text-xl font-bold mb-4">{patch ? 'Edit Patch' : 'Add New Patch'}</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left column */}
          <div className="space-y-4">
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
              rows={5}
            />

            <textarea
              value={howToGet}
              onChange={(e) => setHowToGet(e.target.value)}
              placeholder="How to Get"
              className="w-full p-2 border rounded"
              required
              rows={4}
            />

            <FileUploader
              onFileSelected={(file) => setImageFile(file)}
              label="Upload Patch Image"
            />
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <select
              multiple
              value={regions}
              onChange={(e) =>
                setRegions(Array.from(e.target.selectedOptions, (opt) => opt.value))
              }
              className="w-full p-2 border rounded h-32"
            >
              {[
                'Connecticut', 'Maine', 'Massachusetts', 'New Hampshire', 'New York', 'Vermont'
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

            <div className="flex gap-2">
              <input
                type="text"
                value={latitude ?? ''}
                onChange={(e) => setLatitude(parseFloat(e.target.value))}
                placeholder="Latitude"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                value={longitude ?? ''}
                onChange={(e) => setLongitude(parseFloat(e.target.value))}
                placeholder="Longitude"
                className="w-full p-2 border rounded"
              />
            </div>

            <label className="flex items-center gap-2">
              <span>Popularity (1–5):</span>
              <input
                type="number"
                min={1}
                max={5}
                value={popularity ?? ''}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setPopularity(isNaN(val) ? null : val);
                }}
                className="w-24 p-2 border rounded"
              />
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={hasPeaks}
                onChange={(e) => setHasPeaks(e.target.checked)}
                className="accent-blue-600"
              />
              This patch includes specific peaks
            </label>

            <label className="flex items-center gap-2"> {/* NEW: hasTrails */}
              <input
                type="checkbox"
                checked={hasTrails}
                onChange={(e) => setHasTrails(e.target.checked)}
                className="accent-blue-600"
              />
              This patch includes specific trails
            </label>

            {/* Completion Rule Editor */}
<div className="border rounded p-3 space-y-3">
  <div className="font-semibold">Completion Rule</div>

  <select
    value={ruleType}
    onChange={(e) => setRuleType(e.target.value as RuleType)}
    className="w-full p-2 border rounded"
  >
    <option value="default">Default (completed / total)</option>
    <option value="excludeDelisted">Exclude delisted from denominator</option>
    <option value="anyN">Any N mountains</option>
  </select>

  {ruleType === 'anyN' && (
    <label className="block">
      <span className="text-sm text-gray-700">N (e.g., 10)</span>
      <input
        type="number"
        min={1}
        value={anyNCount}
        onChange={(e) => {
          const n = parseInt(e.target.value);
          setAnyNCount(Number.isFinite(n) && n > 0 ? n : '');
        }}
        className="mt-1 w-full p-2 border rounded"
        placeholder="Enter N"
      />
    </label>
  )}

  {/* ✅ Winter-only toggle */}
  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      className="accent-blue-600"
      checked={winterOnly}
      onChange={(e) => setWinterOnly(e.target.checked)}
    />
    <span className="text-sm">Winter-only (astronomical winter)</span>
  </label>

  <div>
    <div className="text-xs text-gray-500 mb-1">Preview (saved as AWSJSON):</div>
    <pre className="bg-gray-50 border rounded p-2 text-xs overflow-x-auto">
{completionRulePreview}
    </pre>
  </div>
</div>
            {/* /Completion Rule Editor */}
          </div>

          {/* Footer row spans both columns */}
          <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-2">
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

