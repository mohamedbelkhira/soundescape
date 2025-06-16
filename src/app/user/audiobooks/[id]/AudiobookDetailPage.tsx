'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { AudiobookCover } from '@/components/user/audiobooks/detailpage/AudiobookCover';
import { AudioPlayerControls } from '@/components/user/audiobooks/detailpage/AudioPlayerControls';
import { AudiobookInfo } from '@/components/user/audiobooks/detailpage/AudiobookInfo';
import { AudiobookDescription } from '@/components/user/audiobooks/detailpage/AudiobookDescription';
import { AudiobookErrorState } from '@/components/user/audiobooks/detailpage/AudiobookErrorState';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { SKIP_INTERVAL } from '@/components/constants';

/* ------------- types that come from your backend -------------- */
interface Author { id: string; name: string; }
interface CategoryItem { category: { id: string; title: string } }

export interface Audiobook {
  id: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  audioUrl: string | null;
  totalTime: number | null;
  author: Author;
  categories: CategoryItem[];
  _count: { listeningProgress: number; bookmarks: number };
  createdAt: string;
  updatedAt: string;
}

interface Props { audiobook: Audiobook | null }

export function AudiobookDetailPage({ audiobook }: Props) {
  /* ------------ hook (initialised before any early-return) ---- */
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoading: audioLoading,
    error: audioError,
    play,
    pause,
    seek,
    setVolume,
    toggleMute,
  } = useAudioPlayer(audiobook?.audioUrl || null);

  if (!audiobook) {
    return <AudiobookErrorState error="Audiobook data could not be loaded." />;
  }

  /* ------------ callbacks passed to the controls -------------- */
  const handlePlayPause = () => (isPlaying ? pause() : play());
  const handleSeek      = (sec: number) => seek(sec);

  const handleSkipBack  = () => seek(Math.max(currentTime - SKIP_INTERVAL, 0));
  const handleSkipFwd   = () => seek(Math.min(currentTime + SKIP_INTERVAL, duration));

  const handleVolume    = (v: number) => setVolume(v);

  /* ------------ UI -------------------------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Back button */}
        <div className="flex items-center">
          <Link href="/user/audiobooks">
            <Button
              variant="outline"
              size="sm"
              className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 hover:bg-white/90 dark:hover:bg-slate-700/90"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Library
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <AudiobookCover title={audiobook.title} coverUrl={audiobook.coverUrl} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <AudiobookInfo audiobook={audiobook} />
            <AudiobookDescription description={audiobook.description} />
          </div>
        </div>

        {/* Player */}
        <AudioPlayerControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          audioLoading={audioLoading}
          audioError={audioError}
          onPlayPause={handlePlayPause}
          onSeek={handleSeek}
          onSkipBack={handleSkipBack}
          onSkipForward={handleSkipFwd}
          onVolumeChange={handleVolume}
          onToggleMute={toggleMute}
        />
      </div>
    </div>
  );
}
