'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic Gradient Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${20 + scrollY * 0.02}% ${30 + scrollY * 0.01}%, rgba(147, 51, 234, 0.3) 0%, transparent 70%), 
                        radial-gradient(circle at ${80 - scrollY * 0.02}% ${70 - scrollY * 0.01}%, rgba(236, 72, 153, 0.3) 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <div className="space-y-8">
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-black tracking-tight">
              <span className="block bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Enter the
              </span>
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                Soundscape
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Immerse yourself in a world where stories come alive through premium audio experiences. 
              <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-semibold"> Your journey into sound begins here.</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 border-0 group"
              asChild
            >
              <Link href="/auth/signup">
                Begin Your Journey
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300"
              asChild
            >
              <Link href="#demo">Experience Demo</Link>
            </Button>
          </div>

          {/* Enhanced Stats with Sound Theme */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16 pt-8 border-t border-white/10">
            <div className="text-center group">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform">50K+</div>
              <div className="text-gray-400 text-sm">Audio Stories</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform">1M+</div>
              <div className="text-gray-400 text-sm">Active Listeners</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform">∞</div>
              <div className="text-gray-400 text-sm">Immersive Hours</div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center space-y-2">
          <svg className="w-6 h-6 text-white/60 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          <span className="text-white/40 text-xs">Scroll to explore</span>
        </div>
      </div>
    </section>
  )
}