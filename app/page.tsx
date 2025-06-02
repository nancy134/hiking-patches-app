// app/page.tsx
'use client';
import { useState } from 'react';
import { PatchCard } from '@/components/PatchCard';
import { SearchBar } from '@/components/SearchBar';
import { PatchGrid } from '@/components/PatchGrid';

const mockPatches = [
  {
    id: '1',
    name: 'White Mountains 4000 Footers',
    region: 'NH',
    description: '48 peaks over 4000 feet.',
    imageUrl: '/patches/48-4k.jpeg',
  },
  {
    id: '2',
    name: 'NH 52 With a View',
    region: 'NH',
    description: 'Scenic hikes in NH under 4000 feet.',
    imageUrl: '/patches/52-wav.jpeg',
  },
  {
    id: '3',
    name: 'New England Hundred Highest',
    region: 'NE',
    description: 'The top 100 peaks in NE.',
    imageUrl: '/patches/patch-ne-100.jpeg',
  },
];

export default function HomePage() {
  const [query, setQuery] = useState('');

  const filteredPatches = mockPatches.filter((patch) =>
    patch.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Find Your Next Hiking Patch</h1>
      <SearchBar query={query} setQuery={setQuery} />
      <PatchGrid patches={filteredPatches} />
    </main>
  );
}

