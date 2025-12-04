
import React from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { motion } from 'framer-motion';

const HeroBackground = ({ scrollY }: { scrollY: any }) => {
  // SSR-safe window dimensions
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 animate-gradient" />

      {/* Animated Circles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Sound wave visualization */}
      <SoundWaveAnimation />

      {/* R

ipple Effects */}
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

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-purple-400/40 rounded-full"
          initial={{
            x: Math.random() * windowWidth,
            y: Math.random() * windowHeight,
            scale: Math.random()
          }}
          animate={{
            y: [null, Math.random() * windowHeight],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  );
};

const SoundWaveAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-purple-400/40 rounded-full"
          initial={{
            x: Math.random() * 1920,
            y: Math.random() * 1080,
            scale: Math.random()
          }}
          animate={{
            y: [null, Math.random() * 1080],
            scale: [null, Math.random() * 2]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      ))}
    </div>
  );
};

const ScrollIndicator = () => (
  <motion.div
    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.5, duration: 0.8 }}
  >
    <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center">
      <motion.div
        className="w-1 h-3 bg-white/60 rounded-full mt-2"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  </motion.div>
);

const HeroTitle = () => (
  <motion.div
    className="space-y-6"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.2 }}
  >
    <h1 className="text-6xl md:text-8xl font-black tracking-tight">
      <motion.span
        className="block bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent"
        animate={{ opacity: [1, 0.8, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        Immerse
      </motion.span>
      <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
        Yourself
      </span>
    </h1>
    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
      Experience premium audiobooks with immersive sound design and AI-powered recommendations
    </p>
  </motion.div>
);

const HeroButtons = () => (
  <motion.div
    className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.6 }}
  >
    <Link href="/auth/signup">
      <Button
        size="lg"
        className="relative bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 border-0 group hover:scale-105 animate-glow overflow-hidden"
      >
        <span className="relative z-10 flex items-center">
          Start Your Journey
          <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer" />
      </Button>
    </Link>
    <Link href="/#features">
      <Button
        size="lg"
        variant="outline"
        className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-purple-400/50"
      >
        Explore Features
      </Button>
    </Link>
  </motion.div>
);

const Stats = () => {
  const stats = [
    { value: "50K+", label: "Audiobooks" },
    { value: "1M+", label: "Listeners" },
    { value: "4.9", label: "Rating" }
  ];

  return (
    <motion.div
      className="grid grid-cols-3 gap-8 pt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.8 }}
    >
      {stats.map((stat, i) => (
        <div key={i} className="text-center">
          <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {stat.value}
          </div>
          <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
        </div>
      ))}
    </motion.div>
  );
};

const HeroSection = ({ scrollY }: { scrollY: any }) => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    <HeroBackground scrollY={scrollY} />

    {/* Main Content with Glassmorphism */}
    <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
      <div className="glass-card rounded-3xl p-12 space-y-8 shadow-premium hover-lift">
        <HeroTitle />
        <HeroButtons />
        <Stats />
      </div>
    </div>

    <ScrollIndicator />
  </section>
);

export default HeroSection;