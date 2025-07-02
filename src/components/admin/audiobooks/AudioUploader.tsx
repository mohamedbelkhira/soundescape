// components/audiobooks/AudioUploader.tsx
'use client';
import { useRef, useState } from 'react';
import { useAddAudiobook } from './AddAudiobookProvider';
import FileUploader from './FileUploader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, Pause, Play, Volume2, X, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDuration } from '@/lib/utils';   // make sure path is correct
import { toast } from 'sonner';

export default function AudioUploader() {
  const { audioUpload, setAudioUpload, errors, setErrors, setField } = useAddAudiobook();

  const audioRef                = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration]   = useState<number | null>(null);
  const [progress, setProgress]   = useState<number | null>(null);   // NEW

  /* ---------- upload with progress ---------- */
  const upload = () => {
    if (!audioUpload.file) return;

    setAudioUpload(u => ({ ...u, uploading: true }));
    setProgress(0);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload/audio');

    xhr.upload.onprogress = e => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onerror = () => {
      toast.error('Upload failed');
      setAudioUpload(u => ({ ...u, uploading: false }));
      setProgress(null);
    };

    xhr.onload = () => {
      setAudioUpload(u => ({ ...u, uploading: false }));
      setProgress(null);

      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          setAudioUpload({
            file: null,
            url: res.file.url,
            uploading: false,
            filename: res.file.filename,
          });
          toast.success('Audio uploaded');
          if (errors.audioUrl) setErrors(e => ({ ...e, audioUrl: undefined }));
        } catch {
          toast.error('Unexpected server response');
        }
      } else {
        toast.error('Upload failed');
      }
    };

    const body = new FormData();
    body.append('file', audioUpload.file);
    xhr.send(body);
  };

  /* ---------- remove ---------- */
  const remove = async () => {
    if (audioUpload.filename) {
      await fetch(`/api/upload/audio?filename=${audioUpload.filename}`, { method: 'DELETE' });
    }
    setAudioUpload({ file: null, url: null, uploading: false });
    setField('totalTime', '');
    setDuration(null);
    setIsPlaying(false);
  };

  /* ---------- file select ---------- */
  const select = (file: File) => {
    setAudioUpload({ ...audioUpload, file });
    const url = URL.createObjectURL(file);
    const a   = new Audio(url);
    a.addEventListener('loadedmetadata', () => {
      setDuration(a.duration);
      setField('totalTime', Math.round(a.duration).toString());
    });
    audioRef.current = a;
    if (errors.audioUrl) setErrors(e => ({ ...e, audioUrl: undefined }));
  };

  /* ---------- preview ---------- */
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      audioRef.current.onended = () => setIsPlaying(false);
    }
  };

  return (
    <Card className="border-2">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Audio File <span className="text-red-500">*</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* BEFORE UPLOAD -------------------------------------------------- */}
        {!audioUpload.url ? (
          <>
            <FileUploader
              id="audio-upload"
              accept="audio/*"
              icon={<Volume2 className="h-full w-full" />}
              instructions="Click to upload audio file"
              maxSizeMb={100}
              file={audioUpload.file}
              uploading={audioUpload.uploading}
              progress={progress}           /* NEW */
              onSelect={select}
              onUpload={upload}
            />

            {errors.audioUrl && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" /> {errors.audioUrl}
              </p>
            )}
          </>
        ) : (
          /* AFTER UPLOAD ------------------------------------------------- */
          <div className="p-4 bg-green-50 rounded-lg border border-green-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">Audio file uploaded</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={remove}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={togglePlay} className="gap-2">
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? 'Pause' : 'Preview'}
              </Button>

              {duration && (
                <Badge variant="secondary" className="gap-1">
                  <Clock className="h-3 w-3" /> {formatDuration(duration)}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
