import Link from 'next/link';
import { Patch } from '@/API';
import { PatchDisplay } from './PatchDisplay';

type Props = {
  patch: Patch;
  status: string;
};

export function PatchCard({ patch, status }: Props) {
  return (
    <Link href={`/patch/${patch.id}`}>
      <PatchDisplay
        imageUrl={patch.imageUrl}
        name={patch.name}
        description={patch.description}
        regions={patch.regions}
        difficulty={patch.difficulty}
        status={status}
      />
    </Link>
  );
}

