// components/audiobooks/CoverUploader.tsx
'use client';
import { useAddAudiobook } from './AddAudiobookProvider';
import FileUploader from './FileUploader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CoverUploader() {
  const { coverUpload, setCoverUpload } = useAddAudiobook();

  const upload = async () => {
    if (!coverUpload.file) return;
    setCoverUpload(u => ({ ...u, uploading: true }));
    try {
      const body = new FormData();
      body.append('file', coverUpload.file);
      const r = await fetch('/api/upload/cover', { method: 'POST', body });
      if (!r.ok) throw new Error((await r.json()).message);
      const res = await r.json();
      setCoverUpload({ file: null, url: res.file.url, uploading: false, filename: res.file.filename });
      toast.success('Cover uploaded');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Upload failed');
      setCoverUpload(u => ({ ...u, uploading: false }));
    }
  };

  const remove = async () => {
    if (coverUpload.filename) {
      await fetch(`/api/upload/cover?filename=${coverUpload.filename}`, { method: 'DELETE' });
    }
    setCoverUpload({ file: null, url: null, uploading: false });
  };

  return (
    <Card className="border-2">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2"><Image className="h-5 w-5" /> Cover Image</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!coverUpload.url ? (
          <FileUploader
            id="cover-upload"
            accept="image/*"
            icon={<Image className="h-full w-full" />}
            instructions="Click to upload cover image"
            maxSizeMb={5}
            file={coverUpload.file}
            uploading={coverUpload.uploading}
            onSelect={file => setCoverUpload({ ...coverUpload, file })}
            onUpload={upload}
          />
        ) : (
          <div className="space-y-4">
            <div className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverUpload.url} alt="Cover" className="w-full h-64 object-cover rounded-lg" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <Button variant="destructive" size="sm" onClick={remove} className="gap-2">
                  <X className="h-4 w-4" /> Remove
                </Button>
              </div>
            </div>
            <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
              Cover image uploaded successfully
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
