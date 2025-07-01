import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

export default FeaturesSection;