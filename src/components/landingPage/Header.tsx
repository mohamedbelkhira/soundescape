'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="relative z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-md sticky top-0">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Soundscape
          </h1>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="#features" className="text-gray-300 hover:text-white transition-colors">Features</Link>
          <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link>
          <Link href="#about" className="text-gray-300 hover:text-white transition-colors">About</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10" asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0" asChild>
            <Link href="/auth/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}