import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
    const isUserRoute = req.nextUrl.pathname.startsWith("/library") || 
                       req.nextUrl.pathname.startsWith("/player") ||
                       req.nextUrl.pathname.startsWith("/audiobooks")

    // Redirect to signin if not authenticated and trying to access protected routes
    if (!token && (isAdminRoute || isUserRoute)) {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }

    // Redirect non-admin users trying to access admin routes
    if (token && isAdminRoute && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/library", req.url))
    }

    // Redirect unauthenticated users from auth pages if already signed in
    if (token && (req.nextUrl.pathname.startsWith("/auth/"))) {
      const redirectUrl = token.role === "ADMIN" ? "/admin" : "/library"
      return NextResponse.redirect(new URL(redirectUrl, req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        const publicRoutes = ["/", "/auth/signin", "/auth/signup", "/auth/admin"]
        if (publicRoutes.includes(req.nextUrl.pathname)) {
          return true
        }

        // For protected routes, check if user is authenticated
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    "/admin/:path*",
    "/library/:path*", 
    "/player/:path*",
    "/audiobooks/:path*",
    "/auth/:path*"
  ]
}