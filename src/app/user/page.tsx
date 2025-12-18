import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Play, Clock, Heart, Star, ChevronRight, Headphones } from "lucide-react"

// Client component wrapper for animations
import { UserDashboardClient } from "@/components/user/UserDashboardClient"

export default async function UserDashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user.role !== "USER") {
    redirect("/admin")
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Simple Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">SoundScape</h1>
              <div className="hidden md:flex space-x-6">
                <Link href="/user" className="text-gray-900 font-medium hover:text-purple-600 transition-colors">Dashboard</Link>
                <span className="text-gray-400 cursor-not-allowed">Audiobooks</span>
                <span className="text-gray-400 cursor-not-allowed">Library</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700 hidden sm:inline-block">Welcome, {session.user.name}</span>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {session.user.name?.charAt(0)}
              </div>
              <form action="/api/auth/signout" method="post">
                <button
                  type="submit"
                  className="text-gray-500 hover:text-red-600 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserDashboardClient session={session} />
      </main>
    </div>
  )
}