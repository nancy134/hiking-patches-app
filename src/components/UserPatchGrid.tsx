import { UserPatchCard } from './UserPatchCard';
import { UserPatch } from '@/API';

type UserPatchGridProps = {
  patches: UserPatch[];
};

export default function UserPatchGrid({ patches }: UserPatchGridProps) {
  return(
  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {patches.map((patch) => (
      <UserPatchCard key={patch.id} patch={patch} />
    ))}
  </div>
  );
}

