import { Patch } from '@/API';
export const PatchCard: React.FC<{ patch: Patch }> = ({ patch }) => (
  <div className="border rounded shadow p-4 flex flex-col items-center">
    <img src={patch.imageUrl ?? ''} alt={patch.name ?? 'Patch image'} className="h-32 w-32 object-cover mb-2 rounded" />
    <h2 className="text-xl font-semibold">{patch.name}</h2>
    <p className="text-sm text-gray-600">{patch.description}</p>
  </div>
);

