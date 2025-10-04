// src/components/PatchCard.tsx
import Link from 'next/link';
import { Patch } from '@/API';
import { PatchDisplay } from './PatchDisplay';
import UserProgressOverlay from '@/components/UserProgressOverlay';

type Props = {
  patch: Patch;
  status?: '' | 'In Progress' | 'Completed';
};

export function PatchCard({ patch, status = '' }: Props) {
  return (
    <Link href={`/patch/${patch.id}`} className="block">
      <PatchDisplay
        imageUrl={patch.imageUrl}
        name={patch.name as string}
        description={patch.description}
        regions={patch.regions}
        difficulty={patch.difficulty}
        status={status}
        extraFooter={
          !!patch.hasPeaks ? (
            <UserProgressOverlay patchId={patch.id} showLabel />
          ) : null
        }
      />
    </Link>
  );
}

