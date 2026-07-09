import { useState, type ChangeEvent } from "react";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  previewUrl?: string;
  className?: string;
}

export function ImageUpload({ onImageSelect, previewUrl, className = "" }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(previewUrl || null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-dark-gray">
        Food Image
      </label>
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 overflow-hidden rounded-lg border-2 border-dashed border-border img-placeholder">
          {preview ? (
            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <svg className="h-6 w-6 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
        </div>
        <div>
          <label className="cursor-pointer">
            <span className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text-secondary hover:bg-warm-50 transition-colors inline-block">
              Choose File
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
            />
          </label>
          <p className="mt-1 text-xs text-text-muted">Upload one food image</p>
        </div>
      </div>
    </div>
  );
}
