'use client';

import { useState, useEffect, useMemo } from 'react';
import { uploadData } from 'aws-amplify/storage';
import { generateClient } from 'aws-amplify/api';
import { createPatch, updatePatch } from '@/graphql/mutations';
import { Patch, Difficulty, PatchStatus, Season } from '@/API';
import { absoluteUrl } from '@/lib/urls';
import { s3Bucket as bucket, s3Region as region } from '@/lib/config';
import FileUploader from '@/components/FileUploader';

const client = generateClient();

type RuleType =
  | 'default'
  | 'excludeDelisted'
  | 'anyN'
  | 'trailMilesTarget';

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
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [alltrailsUrl, setAlltrailsUrl] = useState('');
  const [purchaseUrl, setPurchaseUrl] = useState('');
  const [formUrl, setFormUrl] = useState('');
  // Per-field messages for the reference-link inputs. These used to be
  // type="url", which let the browser block submission of the WHOLE form with
  // only a tooltip — so an admin editing the patch name could be stuck by a
  // pre-existing URL they never touched.
  const [urlErrors, setUrlErrors] = useState<Record<string, string>>({});
  // A failed save used to leave the modal open with no indication of why, so an
  // admin could retry indefinitely against an error only visible in the console.
  const [saveError, setSaveError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [regions, setRegions] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty | ''>('');
  const [loading, setLoading] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [popularity, setPopularity] = useState<number | null>(null);
  const [hasPeaks, setHasPeaks] = useState<boolean>(false);
  const [hasTrails, setHasTrails] = useState<boolean>(false);
  const [isPurchasable, setIsPurchasable] = useState<boolean>(false); // NEW
  const [status, setStatus] = useState<PatchStatus>(PatchStatus.PUBLISHED);
  const [seasons, setSeasons] = useState<Season[]>([]);

  // --- Completion Rule editor state ---
  const [ruleType, setRuleType] = useState<RuleType>('default');
  const [anyNCount, setAnyNCount] = useState<number | ''>('');
  const [winterOnly, setWinterOnly] = useState<boolean>(false);
  const [trailMilesTarget, setTrailMilesTarget] = useState<number | ''>('');

  // Hydrate fields from incoming patch prop
  useEffect(() => {
    if (patch) {
      setName(patch.name ?? '');
      setDescription(patch.description ?? '');
      setHowToGet(patch.howToGet ?? '');
      setWebsiteUrl((patch as any).websiteUrl ?? '');
      setFacebookUrl((patch as any).facebookUrl ?? '');
      setAlltrailsUrl((patch as any).alltrailsUrl ?? '');
      setPurchaseUrl((patch as any).purchaseUrl ?? '');
      setFormUrl((patch as any).formUrl ?? '');
      setRegions((patch.regions ?? []).filter((r): r is string => r !== null));
      setDifficulty(patch.difficulty ?? '');
      setLatitude(isNaN(Number(patch.latitude)) ? null : patch.latitude ?? null);
      setLongitude(isNaN(Number(patch.longitude)) ? null : patch.longitude ?? null);
      setPopularity(isNaN(Number(patch.popularity)) ? null : Number(patch.popularity));
      setHasPeaks(patch.hasPeaks ?? false);
      setHasTrails((patch as any).hasTrails ?? false);
      setIsPurchasable((patch as any).isPurchasable ?? false); // NEW
      const s = (patch as any).status as PatchStatus | null | undefined;
      setStatus(s ?? PatchStatus.PUBLISHED);
      setSeasons(((patch as any).seasons ?? []).filter(Boolean) as Season[]);

      // Parse completionRule (can be object or JSON string from AppSync)
      const raw = (patch as any)?.completionRule as unknown;
      let obj: any = raw;
      if (typeof raw === 'string') {
        try { obj = JSON.parse(raw); } catch { obj = null; }
      }
      if (!obj || typeof obj !== 'object') {
        setRuleType('default');
        setAnyNCount('');
        setTrailMilesTarget('');
        setWinterOnly(false);
      } else {
        const t = obj.type as RuleType;
        if (t === 'excludeDelisted') {
          setRuleType('excludeDelisted');
          setAnyNCount('');
          setTrailMilesTarget('');
        } else if (t === 'anyN') {
          setRuleType('anyN');
          const n = Number(obj.n);
          setAnyNCount(Number.isFinite(n) && n > 0 ? Math.floor(n) : '');
          setTrailMilesTarget('');
        } else if (t === 'trailMilesTarget') {
          setRuleType('trailMilesTarget');
          const miles = Number(obj.miles);
          setTrailMilesTarget(Number.isFinite(miles) && miles > 0 ? Math.floor(miles) : '');
          setAnyNCount('');
        } else {
          setRuleType('default');
          setAnyNCount('');
          setTrailMilesTarget('');
        }
        setWinterOnly(!!obj.winterOnly);
      }
    } else {
      setName('');
      setDescription('');
      setHowToGet('');
      setWebsiteUrl('');
      setFacebookUrl('');
      setAlltrailsUrl('');
      setPurchaseUrl('');
      setFormUrl('');
      setImageFile(null);
      setRegions([]);
      setDifficulty('');
      setSeasons([]);
      setLatitude(null);
      setLongitude(null);
      setPopularity(null);
      setHasPeaks(false);
      setHasTrails(false);
      setIsPurchasable(false);
      setStatus(PatchStatus.PUBLISHED);

      // completionRule editor reset
      setRuleType('default');
      setAnyNCount('');
      setTrailMilesTarget('');
      setWinterOnly(false);
    }
  }, [patch]);

  const completionRuleObject = useMemo(() => {
    const winter = winterOnly ? { winterOnly: true } : {};
    switch (ruleType) {
      case 'excludeDelisted':
        return { type: 'excludeDelisted', ...winter };
      case 'anyN': {
        const n = typeof anyNCount === 'number' ? anyNCount : parseInt(String(anyNCount));
        if (Number.isFinite(n) && n > 0) return { type: 'anyN', n: Math.floor(n), ...winter };
        return { type: 'default', ...winter };
      }
      case 'trailMilesTarget': {
        const miles = typeof trailMilesTarget === 'number'
          ? trailMilesTarget
          : parseInt(String(trailMilesTarget));
        if (Number.isFinite(miles) && miles > 0) return { type: 'trailMilesTarget', miles: Math.floor(miles), ...winter };
        return { type: 'default', ...winter };
      }
      case 'default':
      default:
        return { type: 'default', ...winter };
    }
  }, [ruleType, anyNCount, trailMilesTarget, winterOnly]);

  const completionRulePreview = useMemo(
    () => JSON.stringify(completionRuleObject, null, 2),
    [completionRuleObject]
  );

  const URL_LABELS: Record<string, string> = {
    websiteUrl: 'Website URL',
    facebookUrl: 'Facebook URL',
    alltrailsUrl: 'AllTrails URL',
    purchaseUrl: 'Purchase / order URL',
    formUrl: 'Downloadable form URL',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Normalise before saving: a stored "www.example.com" would otherwise be
    // rendered as a relative href and navigate inside the app.
    const rawUrls: Record<string, string> = {
      websiteUrl, facebookUrl, alltrailsUrl, purchaseUrl, formUrl,
    };
    const urls: Record<string, string | null> = {};
    const errs: Record<string, string> = {};
    for (const [field, value] of Object.entries(rawUrls)) {
      const raw = value.trim();
      if (!raw) { urls[field] = null; continue; }
      const abs = absoluteUrl(raw);
      if (abs) urls[field] = abs;
      else errs[field] = `${URL_LABELS[field]} doesn't look like a web address.`;
    }
    setUrlErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaveError(null);
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
        websiteUrl: urls.websiteUrl,
        facebookUrl: urls.facebookUrl,
        alltrailsUrl: urls.alltrailsUrl,
        purchaseUrl: urls.purchaseUrl,
        formUrl: urls.formUrl,
        regions,
        difficulty: difficulty as Difficulty,
        latitude,
        longitude,
        popularity,
        hasPeaks,
        hasTrails,
        isPurchasable,
        status,
        seasons: seasons.length ? seasons : undefined,
        completionRule: completionRuleToSend, // saved as AWSJSON
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
      const detail =
        (err as any)?.errors?.[0]?.message ??
        (err instanceof Error ? err.message : null);
      setSaveError(
        detail
          ? `Could not save this patch: ${detail}`
          : 'Could not save this patch. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
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

            <div>
              <input
                type="text"
                inputMode="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="Website URL"
                aria-invalid={!!urlErrors.websiteUrl}
                className={`w-full p-2 border rounded ${urlErrors.websiteUrl ? 'border-red-500' : ''}`}
              />
              {urlErrors.websiteUrl && (
                <p className="mt-1 text-sm text-red-600">{urlErrors.websiteUrl}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                inputMode="url"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                placeholder="Facebook URL"
                aria-invalid={!!urlErrors.facebookUrl}
                className={`w-full p-2 border rounded ${urlErrors.facebookUrl ? 'border-red-500' : ''}`}
              />
              {urlErrors.facebookUrl && (
                <p className="mt-1 text-sm text-red-600">{urlErrors.facebookUrl}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                inputMode="url"
                value={alltrailsUrl}
                onChange={(e) => setAlltrailsUrl(e.target.value)}
                placeholder="AllTrails URL"
                aria-invalid={!!urlErrors.alltrailsUrl}
                className={`w-full p-2 border rounded ${urlErrors.alltrailsUrl ? 'border-red-500' : ''}`}
              />
              {urlErrors.alltrailsUrl && (
                <p className="mt-1 text-sm text-red-600">{urlErrors.alltrailsUrl}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                inputMode="url"
                value={purchaseUrl}
                onChange={(e) => setPurchaseUrl(e.target.value)}
                placeholder="Purchase / order URL"
                aria-invalid={!!urlErrors.purchaseUrl}
                className={`w-full p-2 border rounded ${urlErrors.purchaseUrl ? 'border-red-500' : ''}`}
              />
              {urlErrors.purchaseUrl && (
                <p className="mt-1 text-sm text-red-600">{urlErrors.purchaseUrl}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                inputMode="url"
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                placeholder="Downloadable form URL"
                aria-invalid={!!urlErrors.formUrl}
                className={`w-full p-2 border rounded ${urlErrors.formUrl ? 'border-red-500' : ''}`}
              />
              {urlErrors.formUrl && (
                <p className="mt-1 text-sm text-red-600">{urlErrors.formUrl}</p>
              )}
            </div>

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
                'Any Location', 'Connecticut', 'Florida', 'Maine', 'Massachusetts', 'New Hampshire', 'New York', 'Vermont'
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
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
               Season
              </label>

              <select
                multiple
                value={seasons}
                onChange={(e) =>
                  setSeasons(Array.from(e.target.selectedOptions, (opt) => opt.value as Season))
                }
                className="w-full p-2 border rounded h-32"
              >
                <option value={Season.FALL}>Fall</option>
                <option value={Season.WINTER}>Winter</option>
                <option value={Season.SPRING}>Spring</option>
                <option value={Season.SUMMER}>Summer</option>
              </select>

              <p className="text-xs text-gray-500">
                Leave blank for <strong>Any season</strong>. You can select multiple.
              </p>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Patch Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PatchStatus)}
                className="w-full p-2 border rounded"
               >
                <option value={PatchStatus.PUBLISHED}>Published (visible on Home)</option>
                <option value={PatchStatus.DRAFT}>Draft (Admin only)</option>
                <option value={PatchStatus.ARCHIVED}>Archived (hidden)</option>
              </select>
              <p className="text-xs text-gray-500">
                Draft patches are only visible in the Admin screens. Published patches appear on the Home page.
              </p>
            </div>
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

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={hasTrails}
                onChange={(e) => setHasTrails(e.target.checked)}
                className="accent-blue-600"
              />
              This patch includes specific trails
            </label>

            {/* NEW: isPurchasable toggle */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isPurchasable}
                onChange={(e) => setIsPurchasable(e.target.checked)}
                className="accent-blue-600"
              />
              Patch can be purchased on our website
            </label>

            {/* The checkout button lives in ProgressSummary, which the patch page
                only renders when the patch has peaks or trails, and which keeps the
                button disabled until progress reaches 100%. A purchasable patch with
                nothing trackable therefore offers the buyer no way to pay — easy to
                miss, since the admin form gives no hint. Warn here rather than
                silently shipping an unbuyable patch. */}
            {isPurchasable && !hasPeaks && !hasTrails && ruleType === 'default' && (
              <div
                role="alert"
                className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800"
              >
                <strong className="font-semibold">Heads up:</strong> this patch has no
                peaks, no trails and no completion rule, so nothing tracks progress
                towards it. The &ldquo;Get the Patch&rdquo; button only appears once a
                patch is 100% complete, so buyers will have no way to purchase it. Add
                peaks or trails, set a completion rule, or use a purchase URL under
                Links instead.
              </div>
            )}

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
                <option value="trailMilesTarget">Trail miles target</option>
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

              {ruleType === 'trailMilesTarget' && (
                <label className="block">
                  <span className="text-sm text-gray-700">
                    Miles target (e.g., 100)
                  </span>
                  <input
                    type="number"
                    min={1}
                    value={trailMilesTarget}
                    onChange={(e) => {
                      const m = parseInt(e.target.value);
                      setTrailMilesTarget(Number.isFinite(m) && m > 0 ? m : '');
                    }}
                    className="mt-1 w-full p-2 border rounded"
                    placeholder="Enter miles target"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Progress = sum of completed miles across this patch’s trails (requires each trail’s <code>requiredMiles</code>).
                  </p>
                </label>
              )}

              {/* Winter-only toggle */}
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

          {saveError && (
            <div
              role="alert"
              className="col-span-1 md:col-span-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {saveError}
            </div>
          )}

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

