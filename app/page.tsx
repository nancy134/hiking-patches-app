// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import SearchBar from '@/components/SearchBar';
import PatchGrid from '@/components/PatchGrid';
import { generateClient } from 'aws-amplify/api';
import { listPatches } from '@/graphql/queries';
import { Patch } from '@/models';

const client = generateClient();

export default function HomePage() {
  const [allPatches, setAllPatches] = useState<Patch[]>([]);
  const [filteredPatches, setFilteredPatches] = useState<Patch[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');

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
      <h1 className="text-3xl font-bold mb-4">🏔️ Hiking Patch Explorer</h1>
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

