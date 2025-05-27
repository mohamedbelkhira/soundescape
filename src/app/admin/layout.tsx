// src/app/admin/layout.tsx
import { AuthGuard } from "@/components/auth/AuthGuard"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AdminUserDropdown } from "@/components/admin/AdminUserDropDown"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requireAdmin>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex flex-1 justify-between items-center gap-2 px-4">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="hover:bg-gray-100" />
                <div className="flex flex-col">
                  <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
                  <p className="text-xs text-gray-500">Audiobook Platform Management</p>
                </div>
              </div>
              <AdminUserDropdown />
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-gray-50">
            <div className="p-6">
              {children}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
}