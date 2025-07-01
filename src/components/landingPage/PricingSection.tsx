import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

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

export default PricingSection;