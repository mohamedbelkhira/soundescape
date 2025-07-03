import React from 'react';

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
  
  </div>
);

export default Logo;