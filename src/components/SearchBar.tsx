import React from 'react';

type Props = {
  query: string;
  setQuery: (q: string) => void;
};

export const SearchBar: React.FC<Props> = ({ query, setQuery }) => (
  <input
    type="text"
    placeholder="Search patches..."
    className="w-full p-2 border rounded mb-4"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
  />
);

