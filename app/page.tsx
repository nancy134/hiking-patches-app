// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import SearchBar from '@/components/SearchBar';
import PatchGrid from '@/components/PatchGrid';
import { generateClient } from 'aws-amplify/api';
import { listPatches } from '@/graphql/queries';
import { listUserPatches } from '@/graphql/queries'; 
import { Patch } from '@/API';
import Header from '@/components/Header';
import { useAuth } from '@/context/auth-context';
import { useMemo } from 'react';
import { UserPatch } from '@/API';

const client = generateClient();

const ITEMS_PER_PAGE = 16;

export default function HomePage() {
  const [allPatches, setAllPatches] = useState<Patch[]>([]);
  const [filteredPatches, setFilteredPatches] = useState<Patch[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [completedPatches, setCompletedPatches] = useState<UserPatch[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCompleted, setShowCompleted] = useState(true);
  const [showInProgress, setShowInProgress] = useState(true);
  const [showNotStarted, setShowNotStarted] = useState(true);
  const { user } = useAuth();

  const userPatchMap = useMemo(() => {
    const map = new Map<string, { dateCompleted: string | null; inProgress: boolean }>();
    for (const entry of completedPatches) {
      map.set(entry.patchID, {
        dateCompleted: entry.dateCompleted ?? null,
        inProgress: entry.inProgress ?? false,
      });
    }
    return map;
  }, [completedPatches]);

  useEffect(() => {
    const fetchCompletedPatches = async () => {
      if (!user) {
        setCompletedPatches([]);
        return;
      }

      try {
        const result = await client.graphql({
          query: listUserPatches,
          variables: { filter: { userID: { eq: user.userId } } },
          authMode: 'userPool',
        });

        const items = result.data?.listUserPatches?.items ?? [];
        // Map to list of objects with patchID and dateCompleted 
        const completed = items
          .filter((p: any) => p.dateCompleted || p.inProgress) as UserPatch[];
        setCompletedPatches(completed);
      } catch (err) {
        console.error('Failed to fetch completed patches:', err);
      }
    };

    fetchCompletedPatches();
  }, [user]);

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(e.target.value);
  };

  useEffect(() => {
    const fetchPatches = async () => {
      try {
        const response = await client.graphql({ query: listPatches });
        const patches = response?.data?.listPatches?.items || [];
        setAllPatches(patches);
      } catch (error) {
        console.error('Error fetching patches:', error);
      }
    };

    fetchPatches();
  }, []);


  useEffect(() => {
    let filtered = allPatches;

    if (searchTerm) {
      filtered = filtered.filter(patch =>
        patch.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRegion) {
      filtered = filtered.filter(patch =>
        patch.regions?.includes(selectedRegion)
      );
    }

    if (selectedDifficulty) {
      filtered = filtered.filter(patch =>
        patch.difficulty === selectedDifficulty
      );
    }
    // Filter by patch status
    filtered = filtered.filter(patch => {
      const userEntry = userPatchMap.get(patch.id);
      const isCompleted = userEntry?.dateCompleted;
      const isInProgress = userEntry?.inProgress && !userEntry?.dateCompleted;

      if (isCompleted && showCompleted) return true;
      if (isInProgress && showInProgress) return true;
      if (!userEntry && showNotStarted) return true;

      return false;
    });

    setFilteredPatches(filtered);
    setCurrentPage(1);
  }, [
    searchTerm, 
    selectedRegion,
    selectedDifficulty,
    allPatches,
    userPatchMap,
    showCompleted,
    showInProgress,
    showNotStarted
  ]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const paginatedPatches = filteredPatches.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredPatches.length / ITEMS_PER_PAGE);

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
          onChange={(e) => setSelectedDifficulty(e.target.value)}
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
      { user && (
      <>
      <label className="flex items-center space-x-1">
        <input
          type="checkbox"
          checked={showCompleted}
          onChange={(e) => setShowCompleted(e.target.checked)}
        />
        <span>Completed</span>
      </label>
      <label className="flex items-center space-x-1">
        <input
          type="checkbox"
          checked={showInProgress}
          onChange={(e) => setShowInProgress(e.target.checked)}
        />
        <span>In Progress</span>
      </label>
      <label className="flex items-center space-x-1">
        <input
          type="checkbox"
          checked={showNotStarted}
          onChange={(e) => setShowNotStarted(e.target.checked)}
        />
        <span>Not Started</span>
      </label>
      </>
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
    <PatchGrid patches={paginatedPatches} userPatches={completedPatches} />
  </div>
  );
}

