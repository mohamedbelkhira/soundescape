import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
// import { signOut } from "next-auth/react"
import Link from "next/link"

export default async function UserDashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user.role !== "USER") {
    redirect("/admin")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-blue-600">AudioBook Platform</h1>
              <div className="flex space-x-4">
                <Link href="/user" className="text-gray-900 font-medium">Dashboard</Link>
                <span className="text-gray-400">Audiobooks (Coming Soon)</span>
                <span className="text-gray-400">Library (Coming Soon)</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {session.user.name}</span>
              <form action="/api/auth/signout" method="post">
                <button
                  type="submit"
                  className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md text-sm"
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
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold text-gray-900">
              Hello Client! 👋
            </h1>
            <p className="text-xl text-gray-600">
              Welcome to your personal audiobook space, {session.user.name}!
            </p>
            
            {/* User Info Card */}
            <div className="max-w-md mx-auto bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
              <h2 className="text-lg font-semibold text-blue-800 mb-4">Your Account</h2>
              <div className="space-y-2 text-left">
                <p><span className="font-medium">Name:</span> {session.user.name}</p>
                <p><span className="font-medium">Email:</span> {session.user.email}</p>
                <p><span className="font-medium">Role:</span> {session.user.role}</p>
                <p><span className="font-medium">User ID:</span> {session.user.id}</p>
              </div>
            </div>

            {/* Coming Soon Features */}
            <div className="mt-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Coming Soon</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-100 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">📚 Browse Audiobooks</h4>
                  <p className="text-gray-600 text-sm">Discover and explore our vast collection</p>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">🎧 Audio Player</h4>
                  <p className="text-gray-600 text-sm">Listen to your favorite audiobooks</p>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">📖 Personal Library</h4>
                  <p className="text-gray-600 text-sm">Manage your audiobook collection</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}