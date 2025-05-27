'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { AudiobookCover } from '@/components/user/audiobooks/detailpage/AudiobookCover'
import { AudioPlayerControls } from '@/components/user/audiobooks/detailpage/AudioPlayerControls'
import { AudiobookInfo } from '@/components/user/audiobooks/detailpage/AudiobookInfo'
import { AudiobookDescription } from '@/components/user/audiobooks/detailpage/AudiobookDescription'
import { AudiobookErrorState } from '@/components/user/audiobooks/detailpage/AudiobookErrorState'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'

interface Author {
  id: string;
  name: string;
}

interface CategoryItem { 
  category: {
    id: string;
    title: string;
  };
}

export interface Audiobook { 
  id: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  audioUrl: string | null;
  totalTime: number | null;
  author: Author;
  categories: CategoryItem[];
  _count: {
    listeningProgress: number;
    bookmarks: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface AudiobookDetailPageProps {
  audiobook: Audiobook | null; 
}

export function AudiobookDetailPage({ audiobook }: AudiobookDetailPageProps) {
  // Call the hook BEFORE any conditional returns
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
    setVolume: setAudioVolume, 
    toggleMute,
  } = useAudioPlayer(audiobook?.audioUrl || null);

  // Now it's safe to do conditional returns
  if (!audiobook) {
    return <AudiobookErrorState error="Audiobook data could not be loaded." />;
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleSeek = (value: number[]) => {
    if (duration > 0 && !isNaN(duration)) {
      const time = (value[0] / 100) * duration;
      seek(time);
    }
  };

  const handleSkipBack = () => {
    const newTime = Math.max(0, currentTime - 15);
    seek(newTime);
  };

  const handleSkipForward = () => {
    if (duration > 0 && !isNaN(duration)) {
      const newTime = Math.min(duration, currentTime + 15);
      seek(newTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setAudioVolume(value[0] / 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Header - Back Button */}
        <div className="flex items-center">
          <Link href="/user/audiobooks" legacyBehavior>
            <a>
              <Button
                variant="outline"
                size="sm"
                className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 hover:bg-white/90 dark:hover:bg-slate-700/90"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Library
              </Button>
            </a>
          </Link>
        </div>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
          {/* Left Column: Cover only */}
          <div className="lg:col-span-1">
          <AudiobookCover
            title={audiobook.title}
            coverUrl={audiobook.coverUrl}
          />
          </div>

          {/* Right Column: Info, Description, Stats */}
          <div className="lg:col-span-2 space-y-6">
            <AudiobookInfo audiobook={audiobook} />
            <AudiobookDescription description={audiobook.description} />
          </div>
        </div>

        {/* Full Width Audio Player Controls */}
        <div className="w-full">
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
            onSkipForward={handleSkipForward}
            onVolumeChange={handleVolumeChange}
            onToggleMute={toggleMute}
          />
        </div>
      </div>
    </div>
  );
}