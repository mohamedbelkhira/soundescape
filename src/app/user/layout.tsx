// src/app/user/layout.tsx
import { AuthGuard } from "@/components/auth/AuthGuard"
import { UserSidebar } from "@/components/user/UserSidebar"
import { UserHeader } from "@/components/user/UserHeader"
import { ThemeProvider } from "@/contexts/ThemeContext"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <ThemeProvider>
        <UserLayoutInner>
          {children}
        </UserLayoutInner>
      </ThemeProvider>
    </AuthGuard>
  )
}

// Separate component to ensure proper context usage
function UserLayoutInner({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors">
        <UserSidebar />
        <SidebarInset className="flex flex-col flex-1 w-full min-w-0">
          <UserHeader />
          {/* Main Content Area */}
          <main className="flex-1 w-full overflow-auto">
            <div className="w-full max-w-none px-4 py-6">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}