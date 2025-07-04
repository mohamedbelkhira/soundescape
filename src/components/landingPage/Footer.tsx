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
      <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        Soundscape
      </h1>
    </div>
  );
const FooterSection = ({ section }) => (
  <div>
    <h3 className="text-white font-semibold mb-4">{section.title}</h3>
    <ul className="space-y-2 text-gray-400">
      {section.links.map((link, j) => (
        <li key={j}>
          <a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
            {link}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const FooterContent = () => {
  const footerSections = [
    {
      title: "Product",
      links: ["Features", "Pricing"]
    },
    {
      title: "Company", 
      links: ["Missions", "Contact"]
    },
    
  ];

  return (
    <div className="grid md:grid-cols-4 gap-8">
      <div className="space-y-4">
        <Logo />
        <p className="text-gray-400">
          Immerse yourself in the world of audiobooks with our cutting-edge platform.
        </p>
      </div>
      
      {footerSections.map((section, i) => (
        <FooterSection key={i} section={section} />
      ))}
    </div>
  );
};

const FooterCopyright = () => (
  <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
    <p>&copy; 2025 Soundscape. All rights reserved.</p>
  </div>
);

const Footer = () => {



return (
    <footer className="border-t border-white/10 bg-slate-900/80 backdrop-blur-md">
    <div className="container mx-auto px-4 py-12">
      <FooterContent />
      <FooterCopyright />
    </div>
  </footer>
  );
  
};

export default Footer;