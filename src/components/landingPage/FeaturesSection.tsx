'use client'

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12h.01M15 12h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
      </svg>
    ),
    title: "3D Spatial Audio",
    description: "Experience audiobooks in immersive 3D sound that places you right in the story. Feel every whisper, every dramatic moment.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: "Adaptive Soundscapes",
    description: "Dynamic background ambience that adapts to story scenes. Ocean waves for beach scenes, forest sounds for adventures.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "AI Voice Synthesis",
    description: "Transform any text into natural-sounding speech with our advanced AI. Multiple voices, accents, and emotional tones.",
    gradient: "from-green-500 to-teal-500"
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        // eslint-disable-next-line react/jsx-no-duplicate-props
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" strokeWidth="2" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
      </svg>
    ),
    title: "Smart Audio Processing",
    description: "Intelligent noise reduction, volume normalization, and audio enhancement that adapts to your environment.",
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Neural Recommendations",
    description: "Deep learning algorithms analyze your listening patterns, mood, and preferences to suggest perfect audio experiences.",
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Community Soundscapes",
    description: "Share custom audio environments with the community. Discover listener-created ambiences and sound effects.",
    gradient: "from-pink-500 to-rose-500"
  }
]

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 bg-slate-800/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Revolutionary Audio Features
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Technology that transforms how you experience audio content
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 transition-all duration-300 group hover:scale-105 hover:shadow-2xl backdrop-blur-sm"
            >
              <CardHeader className="space-y-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 group-hover:shadow-xl`}>
                  {feature.icon}
                </div>
                <CardTitle className="text-xl text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-gray-300 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}