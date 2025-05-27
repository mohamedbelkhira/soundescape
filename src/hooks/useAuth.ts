"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useAuth(requireAuth = true, requireAdmin = false) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (requireAuth && !session) {
      router.push("/auth/signin")
      return
    }

    if (requireAdmin && session?.user?.role !== "ADMIN") {
      router.push("/library")
      return
    }
  }, [session, status, router, requireAuth, requireAdmin])

  return {
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: !!session,
    isAdmin: session?.user?.role === "ADMIN",
  }
}