type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="text"
      className="w-full p-2 border rounded mb-4"
      placeholder="Search hiking patches..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

