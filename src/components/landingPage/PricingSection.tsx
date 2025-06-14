'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

const plans = [
  {
    name: "Explorer",
    price: "$0",
    period: "forever",
    features: [
      "5 audiobooks per month",
      "Standard audio quality",
      "Mobile app access",
      "Basic soundscapes",
      "Community features"
    ],
    popular: false
  },
  {
    name: "Audiophile",
    price: "$12.99",
    period: "month",
    features: [
      "Unlimited audiobooks",
      "3D spatial audio",
      "Adaptive soundscapes",
      "Offline downloads",
      "AI voice synthesis",
      "Priority support"
    ],
    popular: true
  },
  {
    name: "Studio",
    price: "$24.99",
    period: "month",
    features: [
      "Everything in Audiophile",
      "Up to 6 family members",
      "Custom soundscape creation",
      "Advanced audio processing",
      "Early access to features",
      "Creator collaboration tools"
    ],
    popular: false
  }
]

export default function PricingSection() {
  return (
    <section id="pricing" className="relative py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Choose Your Audio Experience
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            From casual listening to professional audio creation
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${
                plan.popular 
                  ? 'bg-gradient-to-b from-purple-900/50 to-pink-900/50 border-purple-500/50 scale-105' 
                  : 'bg-slate-800/50 border-slate-700/50'
              } backdrop-blur-sm hover:scale-105 transition-all duration-300 group`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center space-y-6 pb-8">
                <div className="space-y-2">
                  <CardTitle className="text-2xl text-white group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {plan.name}
                  </CardTitle>
                  <div className="text-4xl font-bold text-white">
                    {plan.price}
                    <span className="text-lg text-gray-400">/{plan.period}</span>
                  </div>
                </div>
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                      : 'bg-slate-700 hover:bg-slate-600'
                  } text-white border-0 transition-all duration-300 group-hover:shadow-xl`}
                  asChild
                >
                  <Link href="/auth/signup">
                    {plan.popular ? 'Start Premium' : 'Get Started'}
                  </Link>
                </Button>
              </CardHeader>
              <CardHeader className="pt-0">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-300 group-hover:text-white transition-colors">
                      <div className="w-5 h-5 mr-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}