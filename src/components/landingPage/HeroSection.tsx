import React from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
const SoundWaveAnimation = ({ scrollY }) => (
  <div className="absolute inset-0 flex items-center justify-center">
    {/* Main Sound Waves */}
    {[...Array(7)].map((_, i) => (
      <div
        key={i}
        className="absolute bg-gradient-to-t from-purple-500 via-pink-500 to-transparent rounded-full animate-pulse"
        style={{
          width: `${2 + Math.sin(scrollY * 0.01 + i) * 0.5}px`,
          height: `${80 + Math.sin(scrollY * 0.02 + i * 0.8) * 60 + Math.random() * 100}px`,
          left: `${42 + i * 2.5}%`,
          animationDelay: `${i * 0.2}s`,
          animationDuration: `${1 + Math.random() * 0.8}s`,
          opacity: 0.6 + Math.sin(scrollY * 0.01 + i) * 0.2
        }}
      />
    ))}
    
    {/* Ripple Effects */}
    {[...Array(3)].map((_, i) => (
      <div
        key={`ripple-${i}`}
        className="absolute border border-purple-400/20 rounded-full animate-ping"
        style={{
          width: `${200 + i * 100}px`,
          height: `${200 + i * 100}px`,
          animationDelay: `${i * 1.5}s`,
          animationDuration: '4s'
        }}
      />
    ))}
  </div>
);

const ScrollIndicator = () => (
  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
    <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center">
      <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
    </div>
  </div>
);

const HeroTitle = () => (
  <div className="space-y-6">
    <h1 className="text-6xl md:text-8xl font-black tracking-tight">
      <span className="block bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent animate-pulse">
        Immerse
      </span>
      <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
        Yourself
      </span>
    </h1>
    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
      Step into worlds of knowledge and adventure with our revolutionary audiobook platform. 
      <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-semibold"> Experience stories like never before.</span>
    </p>
  </div>
);

const HeroButtons = () => (
  <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
    <Link href="/auth/signup">
    <Button 
      size="lg" 
      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 border-0 group hover:scale-105"
    >
      Start Your Journey
      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </Button>
    </Link>
  </div>
);

const Stats = () => {
  const stats = [
    { value: '50K+', label: 'Audiobooks' },
    { value: '1M+', label: 'Happy Listeners' },
    { value: '4.9★', label: 'Rating' }
  ];

  return (
    <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16 pt-8 border-t border-white/10">
      {stats.map((stat, i) => (
        <div key={i} className="text-center group">
          <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
            {stat.value}
          </div>
          <div className="text-gray-400 text-sm">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

const HeroBackground = ({ scrollY }) => (
  <div className="absolute inset-0">
    <div 
      className="absolute inset-0 opacity-30 transition-all duration-1000"
      style={{
        background: `radial-gradient(circle at ${20 + scrollY * 0.02}% ${30 + scrollY * 0.01}%, rgba(147, 51, 234, 0.4) 0%, transparent 70%), 
                    radial-gradient(circle at ${80 - scrollY * 0.02}% ${70 - scrollY * 0.01}%, rgba(236, 72, 153, 0.4) 0%, transparent 70%),
                    radial-gradient(circle at ${50 + Math.sin(scrollY * 0.01) * 10}% ${50 + Math.cos(scrollY * 0.01) * 10}%, rgba(59, 130, 246, 0.2) 0%, transparent 70%)`,
      }}
    />
    <SoundWaveAnimation scrollY={scrollY} />
  </div>
);

const HeroSection = ({ scrollY }) => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    <HeroBackground scrollY={scrollY} />
    <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
      <div className="space-y-8">
        <HeroTitle />
        <HeroButtons />
        <Stats />
      </div>
    </div>
    <ScrollIndicator />
  </section>
);

export default HeroSection;