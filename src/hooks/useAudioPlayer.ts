'use client'

import { useState, useEffect, useRef } from 'react'
import { formatAudioUrl } from '@/lib/client-utils'

export const useAudioPlayer = (audioUrl: string | null) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // Start true if URL might be present
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!audioUrl) {
      setIsLoading(false);
      setError(null);
      setDuration(0);
      setCurrentTime(0);
      setIsPlaying(false);
      if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = ''; // Clear source
      }
      return;
    }

    // Ensure loading is true when a new URL is provided
    setIsLoading(true);
    setError(null); // Clear previous errors

    const audio = new Audio()
    audio.preload = 'metadata' // 'auto' or 'metadata'
    audio.src = formatAudioUrl(audioUrl)
    audioRef.current = audio

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0) // Reset to beginning
    }

    const handleError = (e: Event) => {
      console.error("Audio Error Event:", e);
      let specificError = 'Failed to load audio.';
      if (audio.error) {
        switch (audio.error.code) {
          case MediaError.MEDIA_ERR_ABORTED: specificError = 'Audio playback aborted by user or script.'; break;
          case MediaError.MEDIA_ERR_NETWORK: specificError = 'A network error caused audio download to fail.'; break;
          case MediaError.MEDIA_ERR_DECODE: specificError = 'Audio decoding error.'; break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED: specificError = 'Audio source format not supported.'; break;
          default: specificError = 'An unknown audio error occurred.';
        }
      }
      setError(specificError);
      setIsLoading(false);
    }

    const handleLoadStart = () => {
      setIsLoading(true)
      setError(null)
    }

    const handleCanPlay = () => {
        setIsLoading(false); // Audio is ready enough to play
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)
    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('canplay', handleCanPlay); // Good for knowing when loading is truly done for playback

    audio.load(); // Explicitly call load

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('canplay', handleCanPlay);
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = '' // Important for cleanup
      }
      audioRef.current = null;
    }
  }, [audioUrl])

  const play = async () => {
    if (!audioRef.current || !audioRef.current.src || audioRef.current.src === window.location.href ) { // Check if src is set and valid
        setError("No audio source to play.");
        return;
    }
    if (audioRef.current.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA && !error) {
        setIsLoading(true); // Show loading if trying to play but not ready
    }
    try {
      await audioRef.current.play()
      setIsPlaying(true)
      setError(null); // Clear previous errors
    } catch (err) {
      console.error('Audio play error:', err)
      // More specific error message might be helpful here
      const playError = err instanceof Error ? err.message : 'Failed to play audio.';
      setError(`Play Error: ${playError}. Ensure user interaction has occurred or check browser console.`);
      setIsPlaying(false);
    }
  }

  const pause = () => {
    if (!audioRef.current) return
    audioRef.current.pause()
    setIsPlaying(false)
  }

  const seek = (time: number) => {
    if (!audioRef.current || isNaN(time) || time < 0) return
    // Ensure seek time is within bounds
    const newTime = Math.min(time, audioRef.current.duration || 0);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime); // Optimistic update
  }

  const setVol = (vol: number) => {
    if (!audioRef.current) return
    const newVolume = Math.max(0, Math.min(1, vol)); // Clamp volume
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if(audioRef.current.muted && newVolume > 0) {
        audioRef.current.muted = false; // Unmute if setting volume > 0
    }
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    const currentlyMuted = audioRef.current.muted;
    audioRef.current.muted = !currentlyMuted;
    setIsMuted(!currentlyMuted);
    // If unmuting and volume was 0, set to a default, e.g., 0.5
    if (currentlyMuted && audioRef.current.volume === 0) {
        setVol(0.5);
    }
  }
  
  // Sync with external volume changes
  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      const handleVolumeChange = () => {
        setVolume(audioElement.volume);
        setIsMuted(audioElement.muted);
      };
      audioElement.addEventListener('volumechange', handleVolumeChange);
      return () => {
        audioElement.removeEventListener('volumechange', handleVolumeChange);
      };
    }
  }, [audioRef.current]);


  return {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoading,
    error,
    play,
    pause,
    seek,
    setVolume: setVol,
    toggleMute
  }
}