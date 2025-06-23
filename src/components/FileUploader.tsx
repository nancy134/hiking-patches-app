import { useRef, useState } from 'react';

type FileUploaderProps = {
  onFileSelected: (file: File) => void;
  label?: string;
  accept?: string;
};

export default function FileUploader({
  onFileSelected,
  label = 'Upload File',
  accept = 'image/*',
}: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelected(file);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {label}
      </button>
      <span className="text-sm text-gray-600">
        {fileName || 'No file selected'}
      </span>
      <input
        type="file"
        accept={accept}
        ref={fileInputRef}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}

