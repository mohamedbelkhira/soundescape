'use client';
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  id: string;
  accept: string;
  icon: ReactNode;
  instructions: string;
  maxSizeMb: number;
  file?: File | null;
  uploading: boolean;
  /** 0‑100 – if provided, a progress bar is shown */
  progress?: number | null;
  onSelect: (file: File) => void;
  onUpload: () => void;
}

export default function FileUploader({
  id, accept, icon, instructions, maxSizeMb,
  file, uploading, progress, onSelect, onUpload,
}: Props) {
  return (
    <>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
        <div className="mx-auto mb-4 w-16 h-16 text-gray-400">{icon}</div>
        <label htmlFor={id} className="cursor-pointer space-y-2">
          <p className="text-lg font-medium text-primary hover:text-primary/80">{instructions}</p>
          <input
            id={id}
            type="file"
            accept={accept}
            onChange={e => {
              const f = e.target.files?.[0];
              if (f) {
                if (f.size > maxSizeMb * 1024 * 1024) {
                  alert(`File must be smaller than ${maxSizeMb} MB`);
                  return;
                }
                onSelect(f);
              }
            }}
            className="hidden"
          />
          <p className="text-sm text-gray-500">
            {accept.split(',')[0].toUpperCase()} up&nbsp;to&nbsp;{maxSizeMb} MB
          </p>
        </label>
      </div>

      {file && (
        <div className="flex flex-col gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="truncate text-sm font-medium">{file.name}</span>
            <Button size="sm" onClick={onUpload} disabled={uploading}>
              {uploading ? 'Uploading…' : 'Upload'}
            </Button>
          </div>

          {typeof progress === 'number' && (
            <>
              {/* simple progress bar – replace with your shadcn <Progress> if you have one */}
              <div className="w-full h-2 bg-gray-200 rounded">
                <div
                  className="h-2 bg-primary rounded transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{progress}%</p>
            </>
          )}
        </div>
      )}
    </>
  );
}