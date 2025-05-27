// src/components/user/AudioPlayer.tsx
"use client"
import { useState, useRef } from "react"
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Repeat,
  Shuffle,
  BookOpen,
  ChevronUp,
  MoreHorizontal,
  Heart,
  Share,
  Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface AudioPlayerProps {
  currentBook?: {
    id: string
    title: string
    author: string
    cover: string
    duration: number
    currentChapter: number
    totalChapters: number
  }
}

export function AudioPlayer({ currentBook }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(75)
  const [isMuted, setIsMuted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Mock data for demo
  const mockBook = currentBook || {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover: "/api/placeholder/60/60",
    duration: 7200, // 2 hours
    currentChapter: 3,
    totalChapters: 12
  }

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    setIsMuted(value[0] === 0)
  }

  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
  }

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2]

  if (!mockBook) return null

  return (
    <>
      {/* Compact Player */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-slate-200 shadow-lg transition-all duration-300",
        isExpanded && "h-32"
      )}>
        <div className="h-20 flex items-center justify-between px-6">
          
          {/* Book Info */}
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="relative">
              <img
                src={mockBook.cover}
                alt={mockBook.title}
                className="w-12 h-12 rounded-lg object-cover shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                <BookOpen className="h-3 w-3" />
              </div>
            </div>
            
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-sm text-slate-900 truncate">
                {mockBook.title}
              </h4>
              <p className="text-xs text-slate-500 truncate">
                {mockBook.author}
              </p>
              <Badge variant="secondary" className="text-xs mt-1">
                Chapter {mockBook.currentChapter} of {mockBook.totalChapters}
              </Badge>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 mx-8">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-slate-100 rounded-full"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={handlePlayPause}
              className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-white" />
              ) : (
                <Play className="h-5 w-5 text-white ml-0.5" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-slate-100 rounded-full"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            
            {/* Volume Control */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMuteToggle}
                className="hover:bg-slate-100 rounded-lg"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              
              <Slider
                value={[isMuted ? 0 : volume]}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="w-20"
              />
            </div>

            {/* More Options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-slate-100 rounded-lg"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Heart className="h-4 w-4 mr-2" />
                  Add to Favorites
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Expand Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="hover:bg-slate-100 rounded-lg"
            >
              <ChevronUp className={cn(
                "h-4 w-4 transition-transform",
                isExpanded && "rotate-180"
              )} />
            </Button>
          </div>
        </div>

        {/* Expanded Controls */}
        {isExpanded && (
          <div className="px-6 pb-4 space-y-3 border-t border-slate-100">
            
            {/* Progress Bar */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 w-12 text-right">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[currentTime]}
                max={mockBook.duration}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-slate-500 w-12">
                {formatTime(mockBook.duration)}
              </span>
            </div>

            {/* Additional Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="hover:bg-slate-100 rounded-lg">
                  <Shuffle className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="hover:bg-slate-100 rounded-lg">
                  <Repeat className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Speed:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs">
                      {playbackSpeed}x
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {speeds.map((speed) => (
                      <DropdownMenuItem
                        key={speed}
                        onClick={() => setPlaybackSpeed(speed)}
                        className={speed === playbackSpeed ? "bg-slate-100" : ""}
                      >
                        {speed}x
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Spacer to prevent content overlap */}
      <div className="h-20" />
    </>
  )
}