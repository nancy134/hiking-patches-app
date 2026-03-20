'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { Difficulty } from '@/API';

type PatchCounts = {
  inProgress: number;
  wishlisted: number;
  total: number;
};

type PatchSummary = {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  regions?: (string | null)[] | null;
  difficulty?: Difficulty | null;
};

type RankedPatch = {
  patch: PatchSummary;
  counts: PatchCounts;
};

export default function PopularPage() {
  const [ranked, setRanked] = useState<RankedPatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/popular-patches');
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data: RankedPatch[] = await res.json();
        console.log('[popular-patches] response:', data);
        setRanked(data);
      } catch (e) {
        console.error('Error loading popular patches:', e);
        setError('Failed to load popular patches.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Popular Patches</h1>
        <p className="text-gray-500 mb-8">The patches people are working on and wishlisting most.</p>

        {loading && (
          <div className="flex justify-center py-16">
            <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          </div>
        )}

        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && ranked.length === 0 && (
          <p className="text-gray-500">No tracking data yet.</p>
        )}

        {!loading && !error && ranked.length > 0 && (
          <ol className="space-y-4">
            {ranked.map(({ patch, counts }, index) => (
              <li key={patch.id}>
                <Link
                  href={`/patch/${patch.id}`}
                  className="flex items-center gap-4 border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white"
                >
                  {/* Rank */}
                  <span className="text-3xl font-bold text-gray-300 w-10 text-center shrink-0">
                    {index + 1}
                  </span>

                  {/* Image */}
                  {patch.imageUrl ? (
                    <img
                      src={patch.imageUrl}
                      alt={patch.name}
                      className="w-16 h-16 object-contain rounded shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded shrink-0" />
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-lg truncate">{patch.name}</h2>
                    {patch.regions && patch.regions.length > 0 && (
                      <p className="text-sm text-gray-500">{patch.regions.join(', ')}</p>
                    )}
                    <div className="flex gap-3 mt-1 text-sm flex-wrap">
                      {counts.inProgress > 0 && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                          {counts.inProgress} in progress
                        </span>
                      )}
                      {counts.wishlisted > 0 && (
                        <span className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">
                          {counts.wishlisted} wishlisted
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="text-right shrink-0">
                    <span className="text-2xl font-bold text-blue-600">{counts.total}</span>
                    <p className="text-xs text-gray-400">tracking</p>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </main>
    </div>
  );
}
