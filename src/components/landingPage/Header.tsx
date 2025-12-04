'use client'
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const Logo = ({ className = "" }) => (
  <div className={`flex items-center space-x-3 ${className}`}>
    <div className="relative">
      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition-shadow duration-300">
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
        </svg>
      </div>
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse opacity-60"></div>
    </div>
    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
      Soundscape
    </h1>
  </div>
);

const Navigation = () => (
  <nav className="hidden md:flex items-center space-x-8">
    {['Features', 'Missions', 'Pricing'].map((item) => (
      <a
        key={item}
        href={`#${item.toLowerCase()}`}
        className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 relative group"
      >
        {item}
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
      </a>
    ))}
  </nav>
);

const AuthButtons = () => (
  <div className="flex items-center space-x-4">
    <Link href="/auth/signin">
      <Button
        variant="ghost"
        className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
      >
        Sign in
      </Button>
    </Link>
    <Link href="/auth/signup">
      <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105">
        Sign up
      </Button>
    </Link>
  </div>
);

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-slate-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl'
        : 'bg-slate-900/80 backdrop-blur-md border-b border-white/10'
      }`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Logo />
        <Navigation />
        <AuthButtons />
      </div>
    </header>
  );
};

export default Header;