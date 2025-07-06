import { UserPatch } from '@/API';
import { PatchDisplay } from './PatchDisplay';
import Link from 'next/link';

type Props = {
  patch: UserPatch;
};

export const UserPatchCard: React.FC<Props> = ({ patch }) => {
  const image = patch.imageUrl ?? patch.patch?.imageUrl;
  const name = patch.patch?.name ?? 'Unknown';
  const difficulty = patch.patch?.difficulty;

  return (
    <Link href={`/patch/${patch.patch?.id}`}>

    <PatchDisplay
      imageUrl={image}
      name={name}
      difficulty={difficulty}
      status={patch.dateCompleted ? 'Completed' : 'In Progress'}
      dateCompleted={patch.dateCompleted ?? undefined}
    />
    </Link>
  );
};

