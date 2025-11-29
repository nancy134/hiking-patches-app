// app/page.tsx
'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import Header from '@/components/Header';
import PatchGrid from '@/components/PatchGrid';
import SearchBar from '@/components/SearchBar'; // ✅ add this import
import { generateClient } from 'aws-amplify/api';
import { listPatches, listUserPatches } from '@/graphql/queries';
import { Patch, UserPatch } from '@/API';
import { useAuth } from '@/context/auth-context';

const client = generateClient();
const ITEMS_PER_PAGE = 16;

// Small helper to normalize text for searching
const norm = (s: string) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');

export default function HomePage() {
  const { user, isAdmin } = useAuth();

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
  const [wishlistSet, setWishlistSet] = useState<Set<string>>(new Set());

  // status filters (only meaningful when userDataReady === true)
  const [showCompleted, setShowCompleted] = useState(true);
  const [showInProgress, setShowInProgress] = useState(true);
  const [showNotStarted, setShowNotStarted] = useState(true);
  const [showWishlisted, setShowWishlisted] = useState(true);
  const [onlyMyPatches, setOnlyMyPatches] = useState(false);

  // ------------- fetch public patches immediately -------------
  useEffect(() => {
    (async () => {
      try {
        const response = await client.graphql({ query: listPatches });
        let patches = (response?.data?.listPatches?.items || []).filter(Boolean) as Patch[];
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
          const meaningful = items.filter((p) => p.dateCompleted || p.inProgress || p.wishlisted);
          setUserPatches(meaningful);
          setWishlistSet(new Set(meaningful.filter(p => p.wishlisted).map(p => p.patchID))); // ✅ seed
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
    const m = new Map<string, { dateCompleted: string | null; inProgress: boolean; wishlisted: boolean;  }>();
    for (const up of userPatches) {
      m.set(up.patchID, {
        dateCompleted: up.dateCompleted ?? null,
        inProgress: !!up.inProgress && !up.dateCompleted,
        wishlisted: !!up.wishlisted,
      });
    }
    return m;
  }, [userPatches]);

  // ------------- public-first filtering/sorting -------------
  useEffect(() => {
    startTransition(() => {
      let next = allPatches;

      // ✅ Search by name OR description
      if (searchTerm.trim()) {
        const q = norm(searchTerm.trim());
        next = next.filter((p) => {
          const name = norm(p.name as unknown as string);
          // If Patch has no description in the TS type, this stays safe via optional chaining
          const desc = norm((p as any).description ?? '');
          return name.includes(q) || desc.includes(q);
        });
      }

      if (selectedRegion) {
        next = next.filter((p) => p.regions?.includes(selectedRegion));
      }
      if (selectedDifficulty) {
        next = next.filter((p) => p.difficulty === selectedDifficulty);
      }

      if (!isAdmin) {
        next = next.filter((p) => {
          const status = (p as any).status ?? 'PUBLISHED'; // treat missing as PUBLISHED
          return status !== 'DRAFT';
        });
      }

      // Only apply status filters once user data is available.
      if (userDataReady && user) {
        next = next.filter((patch) => {
          const e = userPatchMap.get(patch.id);
          const completed = !!e?.dateCompleted;
          const inProgress = !!e?.inProgress && !e?.dateCompleted;
          const wishlisted = wishlistSet.has(patch.id);

          if (onlyMyPatches) {
            // Show only my items, filtered by the three personal boxes
            if (completed && showCompleted) return true;
            if (inProgress && showInProgress) return true;
            if (wishlisted && showWishlisted) return true;
            return false;
          } else {
            // Browsing all: the three boxes act as *includes* for my statuses,
            // but we don’t hide “everything else” unless onlyMyPatches is on.
            if (!showCompleted && completed) return false;
            if (!showInProgress && inProgress) return false;
            if (!showWishlisted && wishlisted) return false;
            return true; // keep non-started rows visible in “All”
          }
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
    showWishlisted,
    onlyMyPatches,
    isAdmin,
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

  // ✅ Search handler (also resets to page 1)
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleWishlistChange = (patchId: string, next: boolean) => {
    setWishlistSet(prev => {
      const n = new Set(prev);
      if (next) n.add(patchId); else n.delete(patchId);
      return n;
    });
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
        <div className="flex items-center gap-2">
          <label htmlFor="patch-search" className="text-sm font-semibold">Search:</label>
          <SearchBar
            value={searchTerm}
            onChange={handleSearch}
            className="w-48 sm:w-64 md:w-72" // ✅ smaller; grows a bit on larger screens
          />
        </div>
        <div>
          <label className="mr-2 font-semibold">State:</label>
          <select
            value={selectedRegion}
            onChange={handleRegionChange}
            className="p-2 border rounded min-w-[160px]"
          >
            <option value="">All Regions</option>
            <option value="Connecticut">Connecticut</option>
            <option value="Florida">Florida</option>
            <option value="Maine">Maine</option>
            <option value="Massachusetts">Massachusetts</option>
            <option value="New Hampshire">New Hampshire</option>
            <option value="New York">New York</option>
            <option value="Vermont">Vermont</option>
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
                Filter by my status 
                {!userDataReady && <DotSpinner />}
              </span>
            </legend>
            <label className={`ml-auto flex items-center gap-2 ${!userDataReady ? 'opacity-60' : ''}`}>
              <input
                type="checkbox"
                checked={onlyMyPatches}
                onChange={(e) => setOnlyMyPatches(e.target.checked)}
                disabled={!userDataReady}
              />
              <span>Only show my patches</span>
            </label>
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
                checked={showWishlisted}
                onChange={(e) => setShowWishlisted(e.target.checked)}
                disabled={!userDataReady}
              />
              <span>Wishlisted</span>
            </label>

            {(showCompleted !== true || showInProgress !== true || showNotStarted !== true) && (
              <button
                type="button"
                onClick={() => { setShowCompleted(true); setShowInProgress(true); setShowNotStarted(true); setOnlyMyPatches(false)}}
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
      <PatchGrid
        patches={paginated}
        userPatchMap={userPatchMap}
        userDataReady={userDataReady}
        wishlistSet={wishlistSet}
        onWishlistChange={handleWishlistChange}
      />
    </div>
  );
}

