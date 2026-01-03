// components/PatchesScreen.tsx
'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import Header from '@/components/Header';
import PatchGrid from '@/components/PatchGrid';
import SearchBar from '@/components/SearchBar';
import { generateClient } from 'aws-amplify/api';
import { listPatches, listUserPatches } from '@/graphql/queries';
import { Patch, UserPatch, PatchStatus, Season } from '@/API';
import { useAuth } from '@/context/auth-context';
import FiltersDialog from '@/components/FiltersDialog';

const client = generateClient();
const ITEMS_PER_PAGE = 16;

type PatchesScreenProps = {
  /** "home" = main landing page, "mine" = My Patches page */
  variant: 'home' | 'mine';
};

// Small helper to normalize text for searching
const norm = (s: string) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');

function DotSpinner() {
  return (
    <span
      className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-transparent align-[-2px]"
      aria-hidden="true"
    />
  );
}

export default function PatchesScreen({ variant }: PatchesScreenProps) {
  const { user, isAdmin } = useAuth();
  const isMyView = variant === 'mine';

  // public data
  const [allPatches, setAllPatches] = useState<Patch[]>([]);
  const [filteredPatches, setFilteredPatches] = useState<Patch[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [winterOnly, setWinterOnly] = useState(false); 
  const [currentPage, setCurrentPage] = useState(1);

  // user data
  const [userPatches, setUserPatches] = useState<UserPatch[]>([]);
  const [userDataReady, setUserDataReady] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [wishlistSet, setWishlistSet] = useState<Set<string>>(new Set());

  // status filters
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);
  const [showInProgress, setShowInProgress] = useState(true);
  const [showNotStarted, setShowNotStarted] = useState(true);
  const [showWishlisted, setShowWishlisted] = useState(true);
  const [onlyMyPatches, setOnlyMyPatches] = useState(isMyView); // 👈 preset for My Patches

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
          setWishlistSet(new Set(meaningful.filter((p) => p.wishlisted).map((p) => p.patchID)));
          setUserDataReady(true);
        }
      } catch (e) {
        console.error('Failed to fetch user patches:', e);
        if (!cancelled) setUserDataReady(true); // avoid “stuck” state
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Fast lookup by patchID
  const userPatchMap = useMemo(() => {
    const m = new Map<
      string,
      { dateCompleted: string | null; inProgress: boolean; wishlisted: boolean }
    >();
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

      // Search by name OR description
      if (searchTerm.trim()) {
        const q = norm(searchTerm.trim());
        next = next.filter((p) => {
          const name = norm(p.name as unknown as string);
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

      if (winterOnly) {
        next = next.filter((p) => {
          const seasons = (p as any).seasons as Season[] | null | undefined;
          return seasons?.includes(Season.WINTER);
        });
      }
      if (!isAdmin) {
        next = next.filter((p) => {
          const status = (p as any).status ?? PatchStatus.PUBLISHED; // treat missing as PUBLISHED
          return status !== PatchStatus.DRAFT;
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
    winterOnly,
    userDataReady,
    user,
    userPatchMap,
    showCompleted,
    showInProgress,
    showWishlisted,
    onlyMyPatches,
    isAdmin,
    wishlistSet,
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

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleWishlistChange = (patchId: string, next: boolean) => {
    setWishlistSet((prev) => {
      const n = new Set(prev);
      if (next) n.add(patchId);
      else n.delete(patchId);
      return n;
    });
  };

  const showReset =
    showCompleted !== true || showInProgress !== true || showNotStarted !== true || (!isMyView && onlyMyPatches);

  const clearAll = () => {
    setSearchTerm('');
    setSelectedRegion('');
    setSelectedDifficulty('');
    setWinterOnly(false);

    setShowCompleted(true);
    setShowInProgress(true);
    setShowNotStarted(true);
    setShowWishlisted(true);

    if (!isMyView) setOnlyMyPatches(false);
    else setOnlyMyPatches(true);

    setCurrentPage(1);
  };

  const hasActiveFilters =
    !!searchTerm.trim() ||
    !!selectedRegion ||
    !!selectedDifficulty ||
    winterOnly ||
    showCompleted !== true ||
    showInProgress !== true ||
    showNotStarted !== true ||
    showWishlisted !== true ||
    (!isMyView && onlyMyPatches);

  return (
    <div className="p-4">
      <Header />

      {/* Top toolbar: Search + Filters + Pagination */}
      <div className="my-4 flex flex-wrap items-center gap-3">
        {/* Left side: Search + Filters */}
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Search always visible */}
          <div className="flex items-center gap-2">
            <label htmlFor="patch-search" className="text-sm font-semibold">
              Search:
            </label>
            <SearchBar
              value={searchTerm}
              onChange={handleSearch}
              className="w-48 sm:w-64 md:w-72"
            />
          </div>
          {/* Clear Filters (always visible + prominent) */}
          <button
            type="button"
            onClick={clearAll}
            disabled={!hasActiveFilters}
            className="
              inline-flex items-center justify-center
              rounded-md border border-red-300
              bg-red-50 px-3 py-2 text-sm font-semibold text-red-700
              hover:bg-red-100
              disabled:opacity-40 disabled:cursor-not-allowed
            "
            aria-disabled={!hasActiveFilters}
          >
            Clear filters
          </button>

          {/* Filters panel */}
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="inline-flex items-center gap-2 rounded border px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Filters
            {hasActiveFilters && (
              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
                Active
              </span>
            )}
          </button>

          <FiltersDialog
            open={filtersOpen}
            onClose={() => setFiltersOpen(false)}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            selectedDifficulty={selectedDifficulty}
            setSelectedDifficulty={setSelectedDifficulty}
            winterOnly={winterOnly}
            setWinterOnly={setWinterOnly}
            user={user}
            isMyView={isMyView}
            userDataReady={userDataReady}
            onlyMyPatches={onlyMyPatches}
            setOnlyMyPatches={setOnlyMyPatches}
            showCompleted={showCompleted}
            setShowCompleted={setShowCompleted}
            showInProgress={showInProgress}
            setShowInProgress={setShowInProgress}
            showWishlisted={showWishlisted}
            setShowWishlisted={setShowWishlisted}
            hasActiveFilters={hasActiveFilters}
            onClearAll={clearAll}
            DotSpinner={DotSpinner}
          />

        </div>

        {/* Right side: Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border rounded disabled:opacity-50 text-sm"
            >
              Prev
            </button>

            <span className="text-sm text-gray-700 whitespace-nowrap">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border rounded disabled:opacity-50 text-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Empty states (for My Patches) */}
      {isMyView && user && userDataReady && filteredPatches.length === 0 && (
        <div className="text-sm text-gray-500 mb-4">
          No patches yet. Start, complete, or add some to your wishlist from the home page!
        </div>
      )}
      {isMyView && !user && (
        <div className="text-sm text-gray-500 mb-4">Log in to see your patches.</div>
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

