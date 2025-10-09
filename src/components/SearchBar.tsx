// components/SearchBar.tsx
type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string; // ✅ allow custom width/sizing
};

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search hiking patches…',
  className = '',
}: SearchBarProps) {
  return (
    <input
      type="text"
      aria-label="Search patches"
      className={`p-2 text-sm border rounded ${className}`} // ✅ smaller text & padding
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

