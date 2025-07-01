import Link from "next/link"
import { SignUpForm } from "@/components/auth/SignUpForm"
import { Suspense } from "react"
// Background animation component similar to your hero section
const LoginBackground = () => (
  <div className="absolute inset-0">
    {/* Animated gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
    
    {/* Floating orbs */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
    </div>

    {/* Sound wave visualization */}
    <div className="absolute inset-0 flex items-center justify-center opacity-30">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute bg-gradient-to-t from-purple-500/40 via-pink-500/40 to-transparent rounded-full animate-pulse"
          style={{
            width: `${2 + i * 0.5}px`,
            height: `${60 + i * 20}px`,
            left: `${40 + i * 4}%`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${2 + Math.random() * 1}s`,
          }}
        />
      ))}
    </div>
  </div>
)

// Left side image section
const ImageSection = () => (
  <div className="hidden lg:flex lg:w-1/2 relative">
    <LoginBackground />
    
    {/* Main Image */}
    <div className="absolute inset-0 z-5">
      <img 
        src="/image_login.png" 
        alt="Soundscape Audio Experience" 
        className="w-full h-full object-cover opacity-60"
      />
      {/* Gradient overlay to blend with background */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-purple-900/60 to-slate-900/80" />
    </div>
    
    {/* Content overlay */}
    <div className="relative z-10 flex flex-col justify-center items-center text-center px-12 w-full">
      <div className="max-w-md space-y-8">
        {/* Logo/Brand */}
        <div className="space-y-4">
          <h1 className="text-5xl font-black drop-shadow-lg">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Soundscape
            </span>
          </h1>
          <p className="text-lg text-gray-200 leading-relaxed drop-shadow-md">
            Immerse yourself in worlds of knowledge and adventure with our revolutionary audiobook platform.
          </p>
        </div>

        {/* Features highlight */}
        {/* <div className="space-y-4">
          <div className="flex items-center space-x-3 text-gray-200 drop-shadow-sm">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse" />
            <span>50,000+ Premium Audiobooks</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-200 drop-shadow-sm">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            <span>AI-Powered Recommendations</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-200 drop-shadow-sm">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            <span>Offline Listening Experience</span>
          </div>
        </div> */}

        {/* Decorative audio visualization */}
        <div className="flex justify-center space-x-1 mt-8">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full animate-pulse drop-shadow-sm"
              style={{
                height: `${20 + Math.random() * 30}px`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${1 + Math.random() * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
)

// Right side form section
const FormSection = () => (
  <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-8 xl:px-12 bg-white">
    <div className="max-w-md mx-auto w-full space-y-8">
      {/* Mobile header (hidden on desktop) */}
      <div className="lg:hidden text-center space-y-4">
        <Link href="/" className="inline-block">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Soundscape
          </h1>
        </Link>
        <p className="text-gray-600">Start your audio journey</p>
      </div>

      {/* Desktop header */}
      <div className="hidden lg:block text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Welcome</h2>
        <p className="text-gray-600">Start audio journey</p>
      </div>

      {/* Sign in form */}
      <div className="space-y-6">
        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        }>
          <SignUpForm />
        </Suspense>
      </div>

      {/* Back to home link */}
      <div className="text-center">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to home
        </Link>
      </div>
    </div>
  </div>
)

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex">
      <ImageSection />
      <FormSection />
    </div>
  )
}

