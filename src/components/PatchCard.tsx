import Link from 'next/link';
import { Patch } from '@/API';
import { PatchDisplay } from './PatchDisplay';
import UserProgressOverlay from '@/components/UserProgressOverlay';
import WishHeartButton from '@/components/WishHeartButton';

type Props = {
  patch: Patch;
  status?: '' | 'In Progress' | 'Completed';
  wishInit?: boolean;
  onWishlistChange?: (patchId: string, next: boolean) => void;
};

export function PatchCard({ patch, status = '', wishInit = false, onWishlistChange }: Props) {
  // Show overlay if the patch tracks EITHER peaks or trails
  const hasProgress =
    Boolean((patch as any).hasPeaks) || Boolean((patch as any).hasTrails);

  const topRight = (
    <div className="inline-flex items-center gap-2">
      <WishHeartButton
        patchId={patch.id}
        initial={wishInit}
        onChange={(next) => onWishlistChange?.(patch.id, next)}
      />
      {status ? (
        <span
          className={`${
            status === 'Completed' ? 'bg-green-600 text-white' : 'bg-yellow-400 text-black'
          } text-xs px-2 py-1 rounded-full shadow`}
        >
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
        extraFooter={hasProgress ? <UserProgressOverlay patchId={patch.id} showLabel /> : null}
      />
    </Link>
  );
}

