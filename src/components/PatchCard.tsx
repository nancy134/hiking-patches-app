import Link from 'next/link';
import { Patch } from '@/API';

type Props = {
  patch: Patch;
  isCompleted?: boolean;
};

export function PatchCard({ patch, isCompleted = false }: Props) {
  return (
    <Link href={`/patch/${patch.id}`}>
      <div className="relative border rounded shadow hover:shadow-lg transition p-4 cursor-pointer flex flex-col items-center bg-white">
        {isCompleted && (
          <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full shadow">
            Completed
          </span>
        )}
        {patch.imageUrl && (
          <img src={patch.imageUrl} alt={patch.name} className="w-32 h-32 object-cover mb-2 rounded" />
        )}
        <h2 className="text-xl font-semibold text-center">{patch.name}</h2>
        <p className="text-sm text-gray-600 line-clamp-2 text-center">{patch.description}</p>
      </div>
    </Link>
  );
}

