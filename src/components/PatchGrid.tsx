import { PatchCard } from './PatchCard';

type Patch = {
  id: string;
  name: string;
  region: string;
  description: string;
  imageUrl: string;
};

export const PatchGrid: React.FC<{ patches: Patch[] }> = ({ patches }) => (
  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
    {patches.map((patch) => (
      <PatchCard key={patch.id} patch={patch} />
    ))}
  </div>
);

