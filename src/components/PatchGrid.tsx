// src/components/PatchGrid.tsx
import { Patch } from '@/API';
import { PatchCard } from '@/components/PatchCard';

type UserPatchLite = { dateCompleted: string | null; inProgress: boolean; wishlisted?: boolean };

type PatchGridProps = {
  patches: Patch[];
  userPatchMap?: Map<string, UserPatchLite>;
  userDataReady?: boolean;
  onWishlistChange?: (patchId: string, wishlisted: boolean) => void;
};

export default function PatchGrid({
  patches,
  userPatchMap = new Map(),
  userDataReady = false,
  onWishlistChange,
}: PatchGridProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {patches.map((patch) => {
        const entry = userPatchMap.get(patch.id);
        let status: '' | 'In Progress' | 'Completed' = '';

        if (entry) {
          if (entry.dateCompleted) status = 'Completed';
          else if (entry.inProgress) status = 'In Progress';
        }
        const wishlisted = !!entry?.wishlisted;
        return (
          <PatchCard
            key={patch.id}
            patch={patch}
            status={status}
            wishlisted={wishlisted}
            onWishlistChange={onWishlistChange}
          />
        );
      })}
    </div>
  );
}

