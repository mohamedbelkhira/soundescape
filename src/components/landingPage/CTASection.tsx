import React from 'react';
import { Button } from "@/components/ui/button";

const CTAContent = () => (
  <div className="max-w-3xl mx-auto space-y-8">
    <h2 className="text-4xl md:text-5xl font-bold text-white">
      Ready to Transform Your
      <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        Listening Experience?
      </span>
    </h2>
    <p className="text-xl text-gray-300">
      Join millions of listeners who&apos;ve already discovered the magic of Soundscape
    </p>
    <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
      <Button 
        size="lg" 
        className="bg-white text-slate-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl transition-all duration-300 hover:scale-105"
      >
        Join us for Free 
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

export default CTASection;