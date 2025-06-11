// components/PatchCard.tsx
import Link from 'next/link';
import { Patch } from '@/API';

type Props = {
  patch: Patch;
};

export function PatchCard({ patch }: Props) {
  return (
    <Link href={`/patch/${patch.id}`}>
      <div className="border rounded shadow hover:shadow-lg transition p-4 cursor-pointer flex flex-col items-center">
        {patch.imageUrl && (
          <img src={patch.imageUrl} alt={patch.name} className="w-32 h-32 object-cover mb-2 rounded" />
        )}
        <h2 className="text-xl font-semibold">{patch.name}</h2>
        <p className="text-sm text-gray-600 line-clamp-2">{patch.description}</p>
      </div>
    </Link>
  );
}

