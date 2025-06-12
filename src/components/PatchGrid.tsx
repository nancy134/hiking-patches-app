import { PatchCard } from './PatchCard';
import { Patch } from '@/API';

type PatchGridProps = {
  patches: Patch[];
  completedPatchIds?: string[];
};

export default function PatchGrid({ patches, completedPatchIds = [] }: PatchGridProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {patches.map((patch) => (
        <PatchCard
          key={patch.id}
          patch={patch}
          isCompleted={completedPatchIds.includes(patch.id)}
        />
      ))}
    </div>
  );
}

