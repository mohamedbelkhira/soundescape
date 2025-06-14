'use client'

import { useEffect, useState } from 'react'

export default function AnimatedBackground() {
  const [audioWaves, setAudioWaves] = useState<number[]>([])

  useEffect(() => {
    // Generate random wave heights
    const generateWaves = () => {
      return Array.from({ length: 50 }, () => Math.random() * 100 + 20)
    }

    setAudioWaves(generateWaves())

    // Update waves periodically to simulate audio
    const interval = setInterval(() => {
      setAudioWaves(generateWaves())
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Floating Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Animated Sound Waves */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="flex items-end space-x-1">
            {audioWaves.map((height, i) => (
              <div
                key={i}
                className="bg-gradient-to-t from-purple-500 via-pink-500 to-transparent rounded-full transition-all duration-1000 ease-in-out"
                style={{
                  height: `${height}px`,
                  width: '3px',
                  animationDelay: `${i * 50}ms`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Floating Sound Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-30 animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Circular Sound Ripples */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute border border-purple-500/20 rounded-full animate-ping"
              style={{
                width: `${(i + 1) * 200}px`,
                height: `${(i + 1) * 200}px`,
                left: `${-(i + 1) * 100}px`,
                top: `${-(i + 1) * 100}px`,
                animationDelay: `${i * 1.5}s`,
                animationDuration: '4s',
              }}
            />
          ))}
        </div>
      </div>
    </>
  )
}