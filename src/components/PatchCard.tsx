// src/components/PatchCard.tsx
import Link from 'next/link';
import { Patch } from '@/API';
import { PatchDisplay } from './PatchDisplay';
import UserProgressOverlay from './UserProgressOverlay'; // optional: lazy % fetch

type Props = {
  patch: Patch;
  status: '' | 'In Progress' | 'Completed';
  showStatusSkeleton?: boolean;
};

export function PatchCard({ patch, status, showStatusSkeleton }: Props) {
  return (
    <Link href={`/patch/${patch.id}`}>
      <div className="relative">
        <PatchDisplay
          imageUrl={patch.imageUrl}
          name={patch.name}
          description={patch.description}
          regions={patch.regions}
          difficulty={patch.difficulty}
          status={status}
          showStatusSkeleton={showStatusSkeleton}
        />
      <UserProgressOverlay
        patchId={patch.id}
        showLabel
        className="absolute left-3 right-3 bottom-3"
      />
      </div>
    </Link>
  );
}

