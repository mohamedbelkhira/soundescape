import React from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { motion } from 'framer-motion';

const CTAContent = () => (
  <motion.div
    className="max-w-3xl mx-auto space-y-8 relative z-10"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
  >
    <h2 className="text-4xl md:text-5xl font-bold text-white">
      Ready to Transform Your
      <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mt-2">
        Listening Experience?
      </span>
    </h2>
    <p className="text-xl text-gray-300">
      Join millions of listeners who've already discovered the magic of Soundscape
    </p>
    <motion.div
      className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3, duration: 0.6 }}
    >
      <Link href="/auth/signup">
        <Button
          size="lg"
          className="relative bg-white text-slate-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden group"
        >
          <span className="relative z-10">Join us for Free</span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 group-hover:from-purple-500/20 group-hover:via-pink-500/20 group-hover:to-purple-500/20 transition-all duration-300"></div>
        </Button>
      </Link>
    </motion.div>
  </motion.div>
);

const CTASection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-pink-900/50 animate-gradient"></div>

      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 glass"></div>

      {/* Floating Orbs */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <CTAContent />
      </div>
    </section>
  );
};

export default CTASection;