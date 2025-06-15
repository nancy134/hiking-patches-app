import { PatchCard } from './PatchCard';
import { Patch } from '@/API';

type PatchEntry = {
  patchID: string;
  completedDate: string | null;
};

type PatchGridProps = {
  patches: Patch[];
  userPatchEntries?: PatchEntry[];
};

export default function PatchGrid({ patches, userPatchEntries = [] }: PatchGridProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {patches.map((patch) => {
        const entry = userPatchEntries.find((e) => e.patchID === patch.id);

        let status: "Not Started" | "In Progress" | "Completed" = "Not Started";
        if (entry) {
          console.log("entry.completedDate: "+entry.completedDate);
          status = entry.completedDate ? "Completed" : "In Progress";
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

