// app/page.tsx
'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import Header from '@/components/Header';
import PatchGrid from '@/components/PatchGrid';
import { generateClient } from 'aws-amplify/api';
import { listPatches, listUserPatches } from '@/graphql/queries';
import { Patch, UserPatch } from '@/API';
import { useAuth } from '@/context/auth-context';

const client = generateClient();
const ITEMS_PER_PAGE = 16;

export default function HomePage() {
  const { user } = useAuth();

  // public data
  const [allPatches, setAllPatches] = useState<Patch[]>([]);
  const [filteredPatches, setFilteredPatches] = useState<Patch[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // user data
  const [userPatches, setUserPatches] = useState<UserPatch[]>([]);
  const [userDataReady, setUserDataReady] = useState(false);
  const [isPending, startTransition] = useTransition();

  // status filters (only meaningful when userDataReady === true)
  const [showCompleted, setShowCompleted] = useState(true);
  const [showInProgress, setShowInProgress] = useState(true);
  const [showNotStarted, setShowNotStarted] = useState(true);

  // ------------- fetch public patches immediately -------------
  useEffect(() => {
    (async () => {
      try {
        const response = await client.graphql({ query: listPatches });
        const patches = response?.data?.listPatches?.items || [];
        setAllPatches(patches);
      } catch (e) {
        console.error('Error fetching patches', e);
      }
    })();
  }, []);

  // ------------- fetch user patches AFTER mount, no blocking -------------
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user?.userId) {
        setUserPatches([]);
        setUserDataReady(false);
        return;
      }
      try {
        const r = await client.graphql({
          query: listUserPatches,
          variables: { filter: { userID: { eq: user.userId } } },
          authMode: 'userPool',
        });
        if (!cancelled) {
          const items: UserPatch[] = (r.data?.listUserPatches?.items || []).filter(Boolean);
          // Only keep meaningful entries
          const meaningful = items.filter((p) => p.dateCompleted || p.inProgress);
          setUserPatches(meaningful);
          setUserDataReady(true);
        }
      } catch (e) {
        console.error('Failed to fetch user patches:', e);
        if (!cancelled) setUserDataReady(true); // avoid “stuck” state
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  // Fast lookup by patchID
  const userPatchMap = useMemo(() => {
    const m = new Map<string, { dateCompleted: string | null; inProgress: boolean }>();
    for (const up of userPatches) {
      m.set(up.patchID, {
        dateCompleted: up.dateCompleted ?? null,
        inProgress: !!up.inProgress && !up.dateCompleted,
      });
    }
    return m;
  }, [userPatches]);

  // ------------- public-first filtering/sorting -------------
  useEffect(() => {
    startTransition(() => {
      let next = allPatches;

      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        next = next.filter((p) => p.name?.toLowerCase().includes(q));
      }
      if (selectedRegion) {
        next = next.filter((p) => p.regions?.includes(selectedRegion));
      }
      if (selectedDifficulty) {
        next = next.filter((p) => p.difficulty === selectedDifficulty);
      }

      // Only apply status filters once user data is available.
      if (userDataReady && user) {
        next = next.filter((patch) => {
          const e = userPatchMap.get(patch.id);
          const isCompleted = !!e?.dateCompleted;
          const isInProgress = !!e?.inProgress && !e?.dateCompleted;

          if (isCompleted && showCompleted) return true;
          if (isInProgress && showInProgress) return true;
          if (!e && showNotStarted) return true;
          return false;
        });
      }

      // Stable sort by popularity (public field)
      next = [...next].sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));

      setFilteredPatches(next);
      setCurrentPage(1);
    });
  }, [
    allPatches,
    searchTerm,
    selectedRegion,
    selectedDifficulty,
    userDataReady,
    user, // only matters for status filters
    userPatchMap,
    showCompleted,
    showInProgress,
    showNotStarted,
  ]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPatches.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPatches, currentPage]);

  const totalPages = Math.ceil(filteredPatches.length / ITEMS_PER_PAGE);

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(e.target.value);
    e.target.blur();
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
     setSelectedDifficulty(e.target.value);
     e.target.blur();
  };

  function DotSpinner() {
    return (
      <span
        className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-transparent align-[-2px]"
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="p-4">
      <Header />
      <div className="mb-2 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Welcome to Hiking-Patches.com</h2>
        <p className="text-gray-700">
        This site is a place for hiking enthusiasts to discover new patches to pursue and 
        celebrate the ones they’ve earned. Whether you’re chasing summits or exploring scenic trails, 
        there’s always a new patch waiting.
        </p>
      </div>
      {/*<div className="font-semibold">Search for patches</div>
      <SearchBar value={searchTerm} onChange={handleSearch} /> */}
      <div className="text-right text-gray-700 text-sm mt-1 leading-tight">
        Don’t see a patch ?{' '}
        <a
          href="/request-patch"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Contact us
        </a>{' '}
        and we’ll add it!
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center my-4">
        <div>
          <label className="mr-2 font-semibold">State:</label>
          <select
            value={selectedRegion}
            onChange={handleRegionChange}
            className="p-2 border rounded min-w-[160px]"
          >
            <option value="">All Regions</option>
            <option value="Connecticut">Connecticut</option>
            <option value="Maine">Maine</option>
            <option value="Massachusetts">Massachusetts</option>
            <option value="New Hampshire">New Hampshire</option>
            <option value="Vermont">Vermont</option>
            <option value="New York">New York</option>
          </select>
        </div>

        <div>
          <label className="mr-2 font-semibold">Difficulty:</label>
          <select
            value={selectedDifficulty}
            onChange={handleDifficultyChange}
            className="p-2 border rounded min-w-[160px]"
          >
            <option value="">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MODERATE">Moderate</option>
            <option value="HARD">Hard</option>
            <option value="EXTRA_HARD">Extra Hard</option>
            <option value="EXTRA_EXTRA_HARD">Extra Extra Hard</option>
          </select>
        </div>
        {/* Status filters: disabled until user data is ready */}
        {user && (
          <fieldset
            className="flex flex-wrap items-center gap-3 rounded border border-gray-200 px-3 py-2"
            aria-busy={!userDataReady}
          >
            <legend className="px-1 text-sm font-semibold text-gray-700">
              <span className="inline-flex items-center gap-2">
                My progress
                {!userDataReady && <DotSpinner />}
              </span>
            </legend>

            <label className={`flex items-center gap-1 ${!userDataReady ? 'opacity-60' : ''}`}>
              <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                disabled={!userDataReady}
              />
              <span>Completed</span>
            </label>

            <label className={`flex items-center gap-1 ${!userDataReady ? 'opacity-60' : ''}`}>
              <input
                type="checkbox"
                checked={showInProgress}
                onChange={(e) => setShowInProgress(e.target.checked)}
                disabled={!userDataReady}
              />
              <span>In Progress</span>
            </label>

            <label className={`flex items-center gap-1 ${!userDataReady ? 'opacity-60' : ''}`}>
              <input
                type="checkbox"
                checked={showNotStarted}
                onChange={(e) => setShowNotStarted(e.target.checked)}
                disabled={!userDataReady}
              />
              <span>Not Started</span>
            </label>

            {(showCompleted !== true || showInProgress !== true || showNotStarted !== true) && (
              <button
                type="button"
                onClick={() => { setShowCompleted(true); setShowInProgress(true); setShowNotStarted(true); }}
                disabled={!userDataReady}
                className="ml-1 text-xs text-blue-600 underline disabled:opacity-50"
              >
                Reset
              </button>
            )}
          </fieldset>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-2 mb-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="mx-2 px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="mx-2 px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
      {/* PatchGrid: pass map + a loading flag so it can show subtle placeholders */}
      <PatchGrid
        patches={paginated}
        userPatchMap={userPatchMap}
        userDataReady={userDataReady}
      />
    </div>
  );
}

