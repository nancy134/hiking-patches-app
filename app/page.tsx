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

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = allPatches.filter(patch =>
      patch.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredPatches(filtered);
  };


  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">🏔️ Hiking Patch Explorer</h1>
      <SearchBar value={searchTerm} onChange={handleSearch} />
      <PatchGrid patches={filteredPatches} />
    </div>
  );
}

