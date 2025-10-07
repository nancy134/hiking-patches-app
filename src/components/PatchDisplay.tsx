// src/components/PatchDisplay.tsx
import { Difficulty } from '@/API';

type PatchDisplayProps = {
  imageUrl?: string | null;
  name: string;
  description?: string | null;
  regions?: (string | null)[] | null;
  difficulty?: Difficulty | null;
  status?: '' | 'In Progress' | 'Completed';
  progressPct?: number | null;
  extraFooter?: React.ReactNode;
  topRight?: React.ReactNode; 
};

function StatusSkeleton() {
  return (
    <span className="absolute top-2 right-2 rounded-full px-2 py-1 text-xs shadow bg-gray-200 animate-pulse">
      &nbsp;&nbsp;&nbsp;&nbsp;
    </span>
  );
}

type DiamondProps = {
  num: number;
};

function GreenCircleIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="green" /></svg>;
}

function BlueSquareIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16"><rect x="2" y="2" width="12" height="12" fill="blue" /></svg>;
}

function Diamonds({ num }: DiamondProps) {
  return (
    <div className="flex">
      {Array.from({ length: num }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="w-4 h-5 text-black fill-current">
          <polygon points="12,0 19,12 12,24 5,12" />
        </svg>
      ))}
    </div>
  );
}

const renderDifficultyIcon = (difficulty: Difficulty | null | undefined) => {
  switch (difficulty) {
    case 'EASY':
      return <GreenCircleIcon />;
    case 'MODERATE':
      return <BlueSquareIcon />;
    case 'HARD':
      return <Diamonds num={1} />;
    case 'EXTRA_HARD':
      return <Diamonds num={2} />;
    case 'EXTRA_EXTRA_HARD':
      return <Diamonds num={3} />;
    default:
      return null;
  }
};

export const PatchDisplay: React.FC<PatchDisplayProps> = ({
  imageUrl,
  name,
  description,
  regions,
  difficulty,
  status = '',
  progressPct = null,
  extraFooter,
  topRight,
}) => {
  let badgeColor = '';
  if (status === 'Completed') badgeColor = 'bg-green-600';
  else if (status === 'In Progress') badgeColor = 'bg-yellow-400 text-black';

  return (
    <div className="relative border rounded shadow hover:shadow-lg transition p-4 cursor-pointer flex flex-col items-center bg-white">
      {/* Difficulty icon – top left */}
      <div className="absolute top-2 left-2">
        {renderDifficultyIcon(difficulty)}
      </div>

      {/* Status badge – top right */}
      <div className="absolute top-2 right-2 flex items-center gap-2">
        {status
          ? <span className={`${badgeColor} text-xs px-2 py-1 rounded-full shadow`}>{status}</span>
          : (topRight ?? null)}
      </div>

      {/* Image */}
      {imageUrl && (
        <div className="w-32 h-32 flex items-center justify-center mb-2">
          <img
            src={imageUrl}
            alt={name}
            className="max-w-full max-h-full object-contain rounded"
          />
        </div>
      )}

      {/* Name */}
      <h2 className="text-xl font-semibold text-center">{name}</h2>

      {description && (
        <p className="text-sm text-gray-600 line-clamp-2 text-center">{description}</p>
      )}

      {regions && regions.length > 0 && (
        <p className="text-sm text-gray-600 line-clamp-2 text-center">
          {regions.join(', ')}
        </p>
      )}

      {/* NEW: reserved footer area for progress, sits below text */}
      {extraFooter ? <div className="mt-3 w-full">{extraFooter}</div> : null}
    </div>
  );
};

