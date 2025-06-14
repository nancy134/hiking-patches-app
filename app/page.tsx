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
  //const [user, setUser] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [completedPatchIds, setCompletedPatchIds] = useState<string[]>([]);
  const { user } = useAuth();

//  useEffect(() => {
//    const checkUser = async () => {
//      try {
//        const currentUser = await getCurrentUser();
//      setUser(currentUser);

//        const session = await fetchAuthSession();
//        const idToken = session.tokens?.idToken?.toString();
//        const payload = idToken ? JSON.parse(atob(idToken.split('.')[1])) : {};
//        const groups = payload["cognito:groups"] || [];

//        setIsAdmin(groups.includes("Admin"));
//      } catch {
//        setUser(null);
//        setIsAdmin(false);
//      }
//    };

//    checkUser();
//  }, []);

  useEffect(() => {
    const fetchCompletedPatches = async () => {
      if (!user){
        setCompletedPatchIds([]);
        return;
      }

      try {
        const result = await client.graphql({
          query: listUserPatches,
          variables: { filter: { userID: { eq: user.userId } } },
          authMode: 'userPool',
        });

        const items = result.data?.listUserPatches?.items ?? [];
        const completedIds = items.map((p: any) => p.patchID);
        setCompletedPatchIds(completedIds);
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
    <Header />
    <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Welcome to Hiking-Patches.com</h2>
      <p className="text-gray-700">
      This site is a place for hiking enthusiasts to discover new patches to pursue and 
      celebrate the ones they’ve earned. Whether you’re chasing summits or exploring scenic trails, 
      there’s always a new patch waiting.
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
    <PatchGrid patches={filteredPatches} completedPatchIds={completedPatchIds} />
  </div>
  );
}

