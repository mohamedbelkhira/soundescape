import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { motion } from 'framer-motion';

const PopularBadge = () => (
  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-glow">
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
    <Link href="/auth/signup">
      <Button
        className={`w-full ${plan.popular ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/50 animate-glow' : 'bg-slate-700 hover:bg-slate-600 hover:shadow-lg'} text-white border-0 transition-all duration-300 hover:scale-105`}
      >
        Get Started
      </Button>
    </Link>
  </CardHeader>
);

const FeatureList = ({ features }) => (
  <CardHeader className="pt-0">
    <ul className="space-y-3">
      {features.map((feature, i) => (
        <motion.li
          key={i}
          className="flex items-center text-gray-300"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
        >
          <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{feature}</span>
        </motion.li>
      ))}
    </ul>
  </CardHeader>
);

const PricingCard = ({ plan, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.6 }}
  >
    <Card className={`relative h-full ${plan.popular ? 'glass-card border-purple-500/50 scale-105 shadow-premium' : 'glass-card border-slate-700/50'} hover:scale-105 transition-all duration-300 overflow-hidden`}>
      {/* Gradient overlay for popular plan */}
      {plan.popular && (
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 to-pink-900/30 pointer-events-none" />
      )}

      {plan.popular && <PopularBadge />}
      <div className="relative z-10">
        <PlanHeader plan={plan} />
        <FeatureList features={plan.features} />
      </div>
    </Card>
  </motion.div>
);

const PricingGrid = ({ plans }) => (
  <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
    {plans.map((plan, index) => (
      <PricingCard key={index} plan={plan} index={index} />
    ))}
  </div>
);

const SectionHeader = ({ title, subtitle }) => (
  <motion.div
    className="text-center mb-16"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    <h2 className="text-4xl md:text-5xl font-bold mb-4">
      <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        {title}
      </span>
    </h2>
    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
      {subtitle}
    </p>
  </motion.div>
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
      price: "$5.99",
      period: "month",
      features: ["Unlimited audiobooks", "Premium audio quality", "Offline downloads", "Advanced bookmarks", "Priority support"],
      popular: true
    },
    {
      name: "Family",
      price: "$9.99",
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

export default PricingSection;