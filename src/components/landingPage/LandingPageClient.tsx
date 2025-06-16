'use client'
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
// ==================== BACKGROUND COMPONENTS ====================

const AnimatedBackground = ({ scrollY }) => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    {/* Gradient Blobs */}
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
    <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
    
    {/* Floating Sound Particles */}
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-30"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${2 + Math.random() * 2}s`
        }}
      />
    ))}
  </div>
);

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

// ==================== NAVIGATION COMPONENTS ====================

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

// ==================== HERO SECTION COMPONENTS ====================

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
    <Button 
      size="lg" 
      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 border-0 group hover:scale-105"
    >
      Start Your Journey
      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </Button>
    <Button 
      size="lg" 
      variant="outline" 
      className="border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
    >
      Watch Demo
    </Button>
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

// ==================== FEATURES SECTION COMPONENTS ====================

const FeatureIcon = ({ icon, gradient }) => (
  <div className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
    {icon}
  </div>
);

const FeatureCard = ({ feature, index }) => (
  <Card className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 transition-all duration-500 group hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 backdrop-blur-sm">
    <CardHeader className="space-y-4">
      <FeatureIcon icon={feature.icon} gradient={feature.gradient} />
      <CardTitle className="text-xl text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
        {feature.title}
      </CardTitle>
      <CardDescription className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
        {feature.description}
      </CardDescription>
    </CardHeader>
  </Card>
);

const FeaturesGrid = ({ features }) => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
    {features.map((feature, index) => (
      <FeatureCard key={index} feature={feature} index={index} />
    ))}
  </div>
);

const SectionHeader = ({ title, subtitle }) => (
  <div className="text-center mb-16">
    <h2 className="text-4xl md:text-5xl font-bold mb-4">
      <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        {title}
      </span>
    </h2>
    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
      {subtitle}
    </p>
  </div>
);

const FeaturesSection = () => {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
      title: "Premium Audio Quality",
      description: "Crystal-clear, high-fidelity audio with advanced noise reduction and optimal bitrates for the best listening experience.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: "Smart Offline Mode",
      description: "Download your favorites and listen anywhere. Our intelligent sync keeps your progress updated across all devices.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "AI-Powered Recommendations",
      description: "Discover your next favorite audiobook with our machine learning algorithms that understand your taste perfectly.",
      gradient: "from-green-500 to-teal-500"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      ),
      title: "Interactive Bookmarks",
      description: "Create rich bookmarks with notes, timestamps, and even voice memos. Share insights with the community.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Advanced Analytics",
      description: "Track your listening habits, reading speed, and progress with beautiful visualizations and insights.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Social Features",
      description: "Join book clubs, share reviews, and connect with fellow audiobook enthusiasts in our vibrant community.",
      gradient: "from-pink-500 to-rose-500"
    }
  ];

  return (
    <section id="features" className="relative py-24 bg-slate-800/50">
      <div className="container mx-auto px-4">
        <SectionHeader 
          title="Powerful Features" 
          subtitle="Everything you need for the perfect audiobook experience"
        />
        <FeaturesGrid features={features} />
      </div>
    </section>
  );
};

// ==================== PRICING SECTION COMPONENTS ====================

const PopularBadge = () => (
  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
      Most Popular
    </span>
  </div>
);

const PlanHeader = ({ plan }) => (
  <CardHeader className="text-center space-y-4 pb-8">
    <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
    <div className="space-y-2">
      <div className="text-4xl font-bold text-white">
        {plan.price}
        <span className="text-lg text-gray-400">/{plan.period}</span>
      </div>
    </div>
    <Button 
      className={`w-full ${plan.popular ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg' : 'bg-slate-700 hover:bg-slate-600'} text-white border-0 transition-all duration-300 hover:scale-105`}
    >
      Get Started
    </Button>
  </CardHeader>
);

const FeatureList = ({ features }) => (
  <CardHeader className="pt-0">
    <ul className="space-y-3">
      {features.map((feature, i) => (
        <li key={i} className="flex items-center text-gray-300">
          <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {feature}
        </li>
      ))}
    </ul>
  </CardHeader>
);

const PricingCard = ({ plan, index }) => (
  <Card className={`relative ${plan.popular ? 'bg-gradient-to-b from-purple-900/50 to-pink-900/50 border-purple-500/50 scale-105 shadow-2xl shadow-purple-500/20' : 'bg-slate-800/50 border-slate-700/50'} backdrop-blur-sm hover:scale-105 transition-all duration-300`}>
    {plan.popular && <PopularBadge />}
    <PlanHeader plan={plan} />
    <FeatureList features={plan.features} />
  </Card>
);

const PricingGrid = ({ plans }) => (
  <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
    {plans.map((plan, index) => (
      <PricingCard key={index} plan={plan} index={index} />
    ))}
  </div>
);

const PricingSection = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: ["5 audiobooks per month", "Basic audio quality", "Mobile app access", "Community features"],
      popular: false
    },
    {
      name: "Premium",
      price: "$9.99",
      period: "month",
      features: ["Unlimited audiobooks", "Premium audio quality", "Offline downloads", "Advanced bookmarks", "Priority support"],
      popular: true
    },
    {
      name: "Family",
      price: "$16.99",
      period: "month",
      features: ["Everything in Premium", "Up to 6 family members", "Individual profiles", "Parental controls", "Family sharing"],
      popular: false
    }
  ];

  return (
    <section id="pricing" className="relative py-24">
      <div className="container mx-auto px-4">
        <SectionHeader 
          title="Choose Your Plan" 
          subtitle="Flexible pricing for every type of listener"
        />
        <PricingGrid plans={plans} />
      </div>
    </section>
  );
};

// ==================== CTA SECTION COMPONENT ====================

const CTAContent = () => (
  <div className="max-w-3xl mx-auto space-y-8">
    <h2 className="text-4xl md:text-5xl font-bold text-white">
      Ready to Transform Your
      <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        Listening Experience?
      </span>
    </h2>
    <p className="text-xl text-gray-300">
      Join millions of listeners who've already discovered the magic of Soundscape
    </p>
    <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
      <Button 
        size="lg" 
        className="bg-white text-slate-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl transition-all duration-300 hover:scale-105"
      >
        Start Free Trial
      </Button>
      <Button 
        size="lg" 
        variant="outline" 
        className="border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
      >
        Learn More
      </Button>
    </div>
  </div>
);

const CTASection = () => (
  <section className="relative py-24 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
    <div className="container mx-auto px-4 text-center">
      <CTAContent />
    </div>
  </section>
);

// ==================== FOOTER COMPONENTS ====================

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
      links: ["Features", "Pricing", "API", "Integrations"]
    },
    {
      title: "Company", 
      links: ["About", "Blog", "Careers", "Contact"]
    },
    {
      title: "Support",
      links: ["Help Center", "Community", "Privacy", "Terms"]
    }
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

const Footer = () => (
  <footer className="border-t border-white/10 bg-slate-900/80 backdrop-blur-md">
    <div className="container mx-auto px-4 py-12">
      <FooterContent />
      <FooterCopyright />
    </div>
  </footer>
);

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