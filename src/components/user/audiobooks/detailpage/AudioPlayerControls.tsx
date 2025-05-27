'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Loader2, AlertTriangle } from 'lucide-react'
import { formatTime } from '@/lib/formatters'

interface AudioPlayerControlsProps {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  audioLoading: boolean
  audioError: string | null
  onPlayPause: () => void
  onSeek: (value: number[]) => void
  onSkipBack: () => void
  onSkipForward: () => void
  onVolumeChange: (value: number[]) => void
  onToggleMute: () => void
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
}: AudioPlayerControlsProps) => {
  const progress = duration > 0 && !isNaN(duration) ? (currentTime / duration) * 100 : 0

  return (
    <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-lg">
      <CardContent className="p-6 space-y-6">
        {audioError ? (
          <div className="text-center py-4 px-2 space-y-2">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto" />
            <p className="text-red-500 text-sm font-medium">Audio Error</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs">{audioError}</p>
          </div>
        ) : (
          <>
            {/* Progress Bar */}
            <div className="space-y-2">
              <Slider
                value={[progress]}
                onValueChange={onSeek}
                max={100}
                step={0.1} // For smoother seeking if desired
                className="w-full [&>span:first-child]:h-2 [&>span:first-child>span]:h-2" // Make slider thicker
                disabled={!duration || audioLoading || !!audioError || isNaN(duration)}
                aria-label="Audio seek control"
              />
              <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={onSkipBack}
                disabled={!duration || audioLoading || !!audioError || isNaN(duration)}
                className="rounded-full w-10 h-10 sm:w-12 sm:h-12 hover:scale-105 active:scale-95 transition-transform"
                aria-label="Skip back 15 seconds"
              >
                <SkipBack className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              
              <Button
                size="lg"
                onClick={onPlayPause}
                disabled={audioLoading || !!audioError || isNaN(duration)} // also disable if duration is NaN (not loaded)
                className="rounded-full w-14 h-14 sm:w-16 sm:h-16 hover:scale-105 active:scale-95 transition-transform shadow-lg"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {audioLoading ? (
                  <Loader2 className="h-6 w-6 sm:h-7 sm:w-7 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="h-6 w-6 sm:h-7 sm:w-7" />
                ) : (
                  <Play className="h-6 w-6 sm:h-7 sm:w-7 ml-0.5" /> // Slight offset for visual balance
                )}
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={onSkipForward}
                disabled={!duration || audioLoading || !!audioError || isNaN(duration)}
                className="rounded-full w-10 h-10 sm:w-12 sm:h-12 hover:scale-105 active:scale-95 transition-transform"
                aria-label="Skip forward 15 seconds"
              >
                <SkipForward className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleMute}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"
                aria-label={isMuted || volume === 0 ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume * 100]}
                onValueChange={onVolumeChange}
                max={100}
                step={1}
                className="flex-1 [&>span:first-child]:h-2 [&>span:first-child>span]:h-2" // Make slider thicker
                aria-label="Volume control"
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}