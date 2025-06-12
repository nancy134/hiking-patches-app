import { UserPatch } from '@/API';

export const UserPatchCard: React.FC<{ patch: UserPatch }> = ({ patch }) => {
  const fallbackImage = patch.imageUrl ?? patch.patch?.imageUrl ?? '';
  
  return (
    <div className="border rounded shadow p-4 flex flex-col items-center">
      <img src={fallbackImage} alt="Patch image" className="h-32 w-32 object-cover mb-2 rounded" />
      <h2 className="text-xl font-semibold">{patch.dateCompleted}</h2>
      <p className="text-sm text-gray-600">{patch.notes}</p>
    </div>
  );
};
