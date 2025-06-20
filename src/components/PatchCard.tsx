import Link from 'next/link';
import { Patch } from '@/API';

type Props = {
  patch: Patch;
  status: string;
};

type DiamonProps = {
  number: int;
}

function GreenCircleIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="green" /></svg>;
}
function BlueSquareIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16"><rect x="2" y="2" width="12" height="12" fill="blue" /></svg>;
}

function Diamonds({number} : DiamondProps){
  return (
    <div className="flex">
    {Array.from({ length: number}).map((_, i) => (
      <svg key={i} viewBox="0 0 24 24" className="w-4 h-5 text-black fill-current">
        <polygon points="12,0 19,12 12,24 5,12" />
      </svg>
    ))}
  </div>
  );
}

const renderDifficultyIcon = (difficulty?: string) => {
  const diamond = (
    <svg viewBox="0 0 24 24" className="w-3 h-5 text-black fill-current">
      <polygon points="12,0 19,12 12,24 5,12" />
    </svg>
  );
  switch (difficulty) {
    case 'Easy':
      return <GreenCircleIcon />;
    case 'Moderate':
      return <BlueSquareIcon />;
    case 'Hard':
      return <Diamonds number="1" />;
    case 'Extra Hard':
      return <Diamonds number="2" />;
    case 'Extra Extra Hard':
      return <Diamonds number="3" />;
    default:
      return null;
  }
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
      {/* Difficulty icon – top left */}
      <div className="absolute top-2 left-2">
        {renderDifficultyIcon(patch.difficulty)}
      </div>

      {/* Status badge – top right */}
      {badgeColor && (
        <span className={`absolute top-2 right-2 ${badgeColor} text-xs px-2 py-1 rounded-full shadow`}>
          {status}
        </span>
      )}

      {/* Image */}
      {patch.imageUrl && (
        <div className="w-32 h-32 flex items-center justify-center mb-2">
          <img
            src={patch.imageUrl}
            alt={patch.name}
            className="max-w-full max-h-full object-contain rounded"
          />
        </div>
      )}

      {/* Title and description */}
      <h2 className="text-xl font-semibold text-center">{patch.name}</h2>
      <p className="text-sm text-gray-600 line-clamp-2 text-center">{patch.description}</p>
      <p className="text-sm text-gray-600 line-clamp-2 text-center">{(patch.regions ?? []).join(', ')}</p>

    </div>
  </Link>
);

}

