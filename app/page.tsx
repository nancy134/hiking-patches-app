// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import SearchBar from '@/components/SearchBar';
import PatchGrid from '@/components/PatchGrid';
import { generateClient } from 'aws-amplify/api';
import { listPatches } from '@/graphql/queries';
import { listUserPatches } from '@/graphql/queries'; 
import { Patch } from '@/API';
//import { getCurrentUser, signOut, fetchAuthSession } from 'aws-amplify/auth';
import Header from '@/components/Header';
import { useAuth } from '@/context/auth-context';

const client = generateClient();

export default function HomePage() {
  const [allPatches, setAllPatches] = useState<Patch[]>([]);
  const [filteredPatches, setFilteredPatches] = useState<Patch[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [completedPatches, setCompletedPatches] = useState<{ patchID: string; completedDate: string | null }[]>([]);

  const { user } = useAuth();

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
        // Map to list of objects with patchID and completedDate
        const completed = items.map((p: any) => ({
          patchID: p.patchID,
          completedDate: p.dateCompleted ?? null, // or whatever the actual field is called
          inProgress: p.inProgress
        }));
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
        const response = await client.graphql({ 
          query: listPatches
        });
        const patches = response?.data?.listPatches?.items || [];
        console.log(patches);
        setAllPatches(patches);
        setFilteredPatches(patches);
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
        patch.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedRegion) {
      filtered = filtered.filter(patch =>
        patch.regions?.includes(selectedRegion)
      );
    }

    setFilteredPatches(filtered);
  }, [searchTerm, selectedRegion, allPatches]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

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
    <div className="my-4">
      <label className="mr-2 font-semibold">Filter by State/Province:</label>
      <select value={selectedRegion} onChange={handleRegionChange} className="p-2 border rounded">
        <option value="">All Regions</option>
        <option value="Connecticut">Connecticut</option>
        <option value="Massachusetts">Massachusetts</option>
        <option value="New Hampshire">New Hampshire</option>
        <option value="Vermont">Vermont</option>
        <option value="New York">New York</option>
      </select>
    </div>
    <PatchGrid patches={filteredPatches} userPatchEntries={completedPatches} />
  </div>
  );
}

