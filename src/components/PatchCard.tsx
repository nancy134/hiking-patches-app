// src/components/PatchCard.tsx
import Link from 'next/link';
import { Patch } from '@/API';
import { PatchDisplay } from './PatchDisplay';
import UserProgressOverlay from '@/components/UserProgressOverlay';
import WishHeartButton from '@/components/WishHeartButton';

type Props = {
  patch: Patch;
  status?: '' | 'In Progress' | 'Completed';
  wishlisted?: boolean;
  onWishlistChange?: (patchId: string, next: boolean) => void;
};

export function PatchCard({ patch, status = '', wishlisted = false, onWishlistChange }: Props) {
  const topRight = (
    <div className="inline-flex items-center gap-2">
      <WishHeartButton
        patchId={patch.id}
        initial={wishlisted}
        onChange={(next) => onWishlistChange?.(patch.id, next)}
      />
      {status ? (
        <span className={`${status === 'Completed' ? 'bg-green-600' : 'bg-yellow-400 text-black'} text-xs px-2 py-1 rounded-full shadow`}>
          {status}
        </span>
      ) : null}
    </div>
  );
  return (
    <Link href={`/patch/${patch.id}`} className="block">
      <PatchDisplay
        imageUrl={patch.imageUrl}
        name={patch.name as string}
        description={patch.description}
        regions={patch.regions}
        difficulty={patch.difficulty}
        status={status}
        topRight={topRight}
        extraFooter={
          !!patch.hasPeaks ? (
            <UserProgressOverlay patchId={patch.id} showLabel />
          ) : null
        }
      />
    </Link>
  );
}

