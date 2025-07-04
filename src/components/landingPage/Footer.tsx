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
    <h3 className="text-white font-semibold mb-4 text-lg">{section.title}</h3>
    <ul className="space-y-3 text-gray-400">
      {section.links.map((link, j) => (
        <li key={j}>
          <a 
            href={link.href || "#"} 
            className="hover:text-white transition-all duration-300 hover:translate-x-1 inline-block hover:text-transparent hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 hover:bg-clip-text"
          >
            {link.name || link}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const ContactInfo = () => (
  <div>
    <h3 className="text-white font-semibold mb-4 text-lg">Contact Us</h3>
    <div className="space-y-4">
      <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-300">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <a href="mailto:ohmacore@gmail.com" className="hover:text-transparent hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 hover:bg-clip-text transition-all duration-300">
          ohmacore@gmail.com
        </a>
      </div>
      
      <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-300">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </div>
        <a href="tel:0784684955" className="hover:text-transparent hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 hover:bg-clip-text transition-all duration-300">
          0784 684 955
        </a>
      </div>
    </div>
  </div>
);

const SocialLinks = () => (
  <div>
    <h3 className="text-white font-semibold mb-4 text-lg">Follow Us</h3>
    <div className="flex space-x-4">
      <a 
        href="https://instagram.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white hover:scale-110 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 group"
      >
        <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      </a>
      
      {/* <a 
        href="https://twitter.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 group"
      >
        <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      </a>
      
      <a 
        href="https://linkedin.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white hover:scale-110 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-300 group"
      >
        <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </a> */}
    </div>
  </div>
);

const FooterContent = () => {
  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "Mission", href: "#missions" }
        // { name: "About Us", href: "#about" },
        // { name: "Careers", href: "#careers" }
      ]
    }
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
      {/* Company Info */}
      <div className="lg:col-span-2 space-y-4">
        <Logo />
        <p className="text-gray-400 leading-relaxed">
          Immerse yourself in the world of audiobooks with our cutting-edge platform. 
          Experience stories like never before with premium audio quality and innovative features.
        </p>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Available 24/7</span>
        </div>
      </div>

      {/* Navigation Links */}
      {footerSections.map((section, i) => (
        <FooterSection key={i} section={section} />
      ))}

      {/* Contact Info */}
      <ContactInfo />

      {/* Social Links */}
      <SocialLinks />
    </div>
  );
};

const FooterNewsletter = () => (
  <div className="mt-12 p-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl backdrop-blur-sm border border-purple-500/20">
    <div className="text-center">
      <h3 className="text-white font-semibold mb-2 text-lg">Stay Updated</h3>
      <p className="text-gray-400 mb-4">Get the latest updates on new features and audiobook releases</p>
      <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input 
          type="email" 
          placeholder="Enter your email" 
          className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors duration-300"
        />
        <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg">
          Subscribe
        </button>
      </div>
    </div>
  </div>
);

const FooterCopyright = () => (
  <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400">
    <p>&copy; 2025 Soundscape. All rights reserved.</p>
    <div className="flex space-x-6 mt-4 md:mt-0">
      <a href="#" className="hover:text-white transition-colors duration-300">Made by Ohmacore</a>
      {/* <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
      <a href="#" className="hover:text-white transition-colors duration-300">Cookie Policy</a> */}
    </div>
  </div>
);

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-slate-900/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-12">
        <FooterContent />
        {/* <FooterNewsletter /> */}
        <FooterCopyright />
      </div>
    </footer>
  );
};

export default Footer;