import { PatchCard } from './PatchCard';
import { Patch } from '@/API';
import { UserPatch } from '@/API';

type PatchGridProps = {
  patches: Patch[];
  userPatches?: UserPatch[];
};

export default function PatchGrid({ patches, userPatches = [] }: PatchGridProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {patches.map((patch) => {
        const entry = userPatches.find((e) => e.patchID === patch.id);

        let status: "" | "In Progress" | "Completed" = "";
        if (entry) {
          if (entry.dateCompleted) {
            status = "Completed";
          } else if (entry.inProgress) {
            status = "In Progress";
          }
        }

        return (
          <PatchCard
            key={patch.id}
            patch={patch}
            status={status}
          />
        );
      })}
    </div>
  );
}

