// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import SearchBar from '@/components/SearchBar';
import PatchGrid from '@/components/PatchGrid';
import { generateClient } from 'aws-amplify/api';
import { listPatches } from '@/graphql/queries';
import { Patch } from '@/API';
import { getCurrentUser, signOut, fetchAuthSession } from 'aws-amplify/auth';

const client = generateClient();

export default function HomePage() {
  const [allPatches, setAllPatches] = useState<Patch[]>([]);
  const [filteredPatches, setFilteredPatches] = useState<Patch[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [user, setUser] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();
        const payload = idToken ? JSON.parse(atob(idToken.split('.')[1])) : {};
        const groups = payload["cognito:groups"] || [];

        setIsAdmin(groups.includes("Admin"));
      } catch {
        setUser(null);
        setIsAdmin(false);
      }
    };

    checkUser();
  }, []);


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
    console.log("selectedRegion: "+selectedRegion);
    if (selectedRegion) {
      filtered = filtered.filter(patch =>
        patch.regions?.includes(selectedRegion)
      );
      console.log("filtered:");
      console.log(filtered);
    }

    setFilteredPatches(filtered);
  }, [searchTerm, selectedRegion, allPatches]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
<div className="p-4">
  <div className="flex justify-between items-center mb-4">
    <div className="flex items-center space-x-2">
      <img src="/person-hiking-solid.svg" alt="Logo" className="h-8 w-8" />
      <span className="text-xl font-bold">Hiking-Patches.com</span>
    </div>
    <div className="flex space-x-4">
      {!user ? (
        <a
          href="/my-patches"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Log in
        </a>
      ) : (
        <>
          <a
            href="/my-patches"
            className="text-blue-600 underline hover:text-blue-800"
          >
            My Patches
          </a>
          {isAdmin && (
            <a
              href="/admin"
              className="text-green-700 underline hover:text-green-900"
            >
              Admin
            </a>
          )}
          <button
            onClick={async () => {
              await signOut();
              setUser(null);
              setIsAdmin(false);
            }}
            className="text-red-600 underline hover:text-red-800"
          >
            Log out
          </button>
        </>
      )}
    </div>
  </div>

<div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded shadow">
  <h2 className="text-xl font-semibold mb-2">🥾 Welcome to Hiking-Patches.com</h2>
  <p className="text-gray-700">
    I created this site as a place for hiking enthusiasts to discover new patches to pursue and 
    celebrate the ones they’ve earned. Whether you’re chasing summits or exploring scenic trails, 
    there’s always a new patch waiting.
  </p>
  <p className="mt-2 text-gray-700">
    By logging in and visiting <strong>My Patches</strong>, you can upload photos of the patches 
    you’ve collected and share your progress with your hiking buddies. It’s a fun way to stay 
    motivated, track your achievements, and connect with others on the trail.
  </p>
</div>
      <div className="font-semibold">Search for patches</div>
      <SearchBar value={searchTerm} onChange={handleSearch} />
      <div className="my-4">
        <label className="mr-2 font-semibold">Filter by State/Province:</label>
        <select value={selectedRegion} onChange={handleRegionChange} className="p-2 border rounded">
          <option value="">All Regions</option>
          <option value="Massachusetts">Massachusetts</option>
          <option value="New Hampshire">New Hampshire</option>
          <option value="Vermont">Vermont</option>
          <option value="New York">New York</option>
        </select>
      </div>
      <PatchGrid patches={filteredPatches} />
    </div>
  );
}

