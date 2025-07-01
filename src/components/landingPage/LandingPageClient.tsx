'use client'
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import AnimatedBackground from './AnimatedBackground';
import Header from './Header';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import PricingSection from './PricingSection';
import CTASection from './CTASection';
import Footer from './Footer';
// ==================== FOOTER COMPONENTS ====================

// const FooterSection = ({ section }) => (
//   <div>
//     <h3 className="text-white font-semibold mb-4">{section.title}</h3>
//     <ul className="space-y-2 text-gray-400">
//       {section.links.map((link, j) => (
//         <li key={j}>
//           <a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
//             {link}
//           </a>
//         </li>
//       ))}
//     </ul>
//   </div>
// );

// const FooterContent = () => {
//   const footerSections = [
//     {
//       title: "Product",
//       links: ["Features", "Pricing", "API", "Integrations"]
//     },
//     {
//       title: "Company", 
//       links: ["About", "Blog", "Careers", "Contact"]
//     },
//     {
//       title: "Support",
//       links: ["Help Center", "Community", "Privacy", "Terms"]
//     }
//   ];

//   return (
//     <div className="grid md:grid-cols-4 gap-8">
//       <div className="space-y-4">
//         <Logo />
//         <p className="text-gray-400">
//           Immerse yourself in the world of audiobooks with our cutting-edge platform.
//         </p>
//       </div>
      
//       {footerSections.map((section, i) => (
//         <FooterSection key={i} section={section} />
//       ))}
//     </div>
//   );
// };

// const FooterCopyright = () => (
//   <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
//     <p>&copy; 2025 Soundscape. All rights reserved.</p>
//   </div>
// );

// const Footer = () => (
//   <footer className="border-t border-white/10 bg-slate-900/80 backdrop-blur-md">
//     <div className="container mx-auto px-4 py-12">
//       <FooterContent />
//       <FooterCopyright />
//     </div>
//   </footer>
// );

// ==================== MAIN COMPONENT ====================

export default function SoundscapeLanding() {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-x-hidden">
      <AnimatedBackground scrollY={scrollY} />
      <Header />
      <HeroSection scrollY={scrollY} />
      <FeaturesSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}