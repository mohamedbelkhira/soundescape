'use client';

import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { formatTime } from '@/lib/formatters';
import { SKIP_INTERVAL } from '@/components/constants';

interface Props {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  audioLoading: boolean;
  audioError: string | null;
  onPlayPause: () => void;
  onSeek: (sec: number) => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  onVolumeChange: (v: number) => void;
  onToggleMute: () => void;
}

export const AudioPlayerControls = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  audioLoading,
  audioError,
  onPlayPause,
  onSeek,
  onSkipBack,
  onSkipForward,
  onVolumeChange,
  onToggleMute,
}: Props) => {
  const [isUserSeeking, setUserSeeking] = useState(false);
  const [seekPct, setSeekPct] = useState(0); // 0-100 %

  /* keep slider synced when the user is NOT dragging it */
  useEffect(() => {
    if (!isUserSeeking && duration) {
      setSeekPct((currentTime / duration) * 100);
    }
  }, [currentTime, duration, isUserSeeking]);

  const disableTransport =
    !duration || isNaN(duration) || audioLoading || !!audioError;

  /* ───────── Render ───────── */
  return (
    <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-lg">
      <CardContent className="p-6 space-y-6">
        {audioError ? (
          <div className="text-center py-4 space-y-2">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto" />
            <p className="text-red-500 text-sm font-medium">Audio Error</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs">{audioError}</p>
          </div>
        ) : (
          <>
            {/* Progress ───────────────────────────────────────── */}
            <div className="space-y-2">
              <Slider
                value={[seekPct]}
                max={100}
                step={0.1}
                disabled={disableTransport}
                onValueChange={(v) => {
                  setUserSeeking(true);
                  setSeekPct(v[0]);
                }}
                onValueCommit={(v) => {
                  const newTime = (v[0] / 100) * duration;
                  onSeek(newTime);
                  setUserSeeking(false);
                }}
                aria-label="Seek"
                className="w-full [&>span:first-child]:h-2 [&>span:first-child>span]:h-2"
              />
              <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Transport ─────────────────────────────────────── */}
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={onSkipBack}
                disabled={disableTransport}
                aria-label={`Back ${SKIP_INTERVAL} seconds`}
                className="rounded-full w-10 h-10 sm:w-12 sm:h-12 hover:scale-105 active:scale-95 transition-transform"
              >
                <SkipBack className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>

              <Button
                size="lg"
                onClick={onPlayPause}
                disabled={audioLoading || !!audioError || isNaN(duration)}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="rounded-full w-14 h-14 sm:w-16 sm:h-16 hover:scale-105 active:scale-95 transition-transform shadow-lg"
              >
                {audioLoading ? (
                  <Loader2 className="h-6 w-6 sm:h-7 sm:w-7 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="h-6 w-6 sm:h-7 sm:w-7" />
                ) : (
                  <Play className="h-6 w-6 sm:h-7 sm:w-7 ml-0.5" />
                )}
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={onSkipForward}
                disabled={disableTransport}
                aria-label={`Forward ${SKIP_INTERVAL} seconds`}
                className="rounded-full w-10 h-10 sm:w-12 sm:h-12 hover:scale-105 active:scale-95 transition-transform"
              >
                <SkipForward className="h-6 w-6 sm:h-7 sm:w-7" />
              </Button>
            </div>

            {/* Volume ────────────────────────────────────────── */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleMute}
                aria-label={isMuted || volume === 0 ? 'Unmute' : 'Mute'}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                aria-label="Volume"
                onValueChange={(v) => onVolumeChange(v[0] / 100)}
                className="flex-1 [&>span:first-child]:h-2 [&>span:first-child>span]:h-2"
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
