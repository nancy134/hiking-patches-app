import Link from 'next/link';
import { Patch } from '@/API';

type Props = {
  patch: Patch;
  status: string;
};

export function PatchCard({ patch, status }: Props) {
  // Determine badge color based on status
  let badgeColor = '';
  if (status === 'Completed') {
    badgeColor = 'bg-green-600';
  } else if (status === 'In Progress') {
    badgeColor = 'bg-yellow-400 text-black';
  }

  return (
    <Link href={`/patch/${patch.id}`}>
      <div className="relative border rounded shadow hover:shadow-lg transition p-4 cursor-pointer flex flex-col items-center bg-white">
        {badgeColor && (
          <span className={`absolute top-2 right-2 ${badgeColor} text-xs px-2 py-1 rounded-full shadow`}>
            {status}
          </span>
        )}
        {patch.imageUrl && (
          <img
            src={patch.imageUrl}
            alt={patch.name}
            className="w-32 h-32 object-cover mb-2 rounded"
          />
        )}
        <h2 className="text-xl font-semibold text-center">{patch.name}</h2>
        <p className="text-sm text-gray-600 line-clamp-2 text-center">{patch.description}</p>
      </div>
    </Link>
  );
}

