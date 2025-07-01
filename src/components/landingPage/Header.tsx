import React from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const Logo = ({ className = "" }) => (
  <div className={`flex items-center space-x-3 ${className}`}>
    <div className="relative">
      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
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
    {['Features', 'Pricing', 'About'].map((item) => (
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
    <Button 
      variant="ghost" 
      className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
    >
     <Link href="/auth/signin">Sign&nbsp;in</Link>
    </Button>
    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105">
    <Link href="/auth/signup">Sign&nbsp;up</Link>
    </Button>
  </div>
);

const Header = () => (
  <header className="relative z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-md sticky top-0">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <Logo />
      <Navigation />
      <AuthButtons />
    </div>
  </header>
);

export default Header;