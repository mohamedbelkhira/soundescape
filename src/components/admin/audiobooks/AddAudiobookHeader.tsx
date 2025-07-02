// components/audiobooks/AddAudiobookHeader.tsx
'use client';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AddAudiobookHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">Add New Audiobook</h1>
        </div>
        <p className="text-xl text-muted-foreground">
          Create and publish a new audiobook to your library
        </p>
      </div>
      <Link href="/admin/audiobooks">
        <Button variant="outline" size="lg" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Library
        </Button>
      </Link>
    </div>
  );
}
