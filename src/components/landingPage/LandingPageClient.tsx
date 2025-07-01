'use client'
import React, { useState, useEffect } from 'react';

import AnimatedBackground from './AnimatedBackground';
import Header from './Header';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import PricingSection from './PricingSection';
import CTASection from './CTASection';
import Footer from './Footer';
import AboutSection from './AboutSection';

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
      <AboutSection /> 
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}