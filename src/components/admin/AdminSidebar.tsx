// src/components/admin/AdminSidebar.tsx
"use client"

import * as React from "react"
import {
  AudioLines,
  BookOpen,
  Home,
  Users,
  UsersRound,
  ChevronRight
} from "lucide-react"
import Logo from "../common/logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

// Navigation items
const navigationItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
  },
]

const managementItems = [
  {
    title: "Categories",
    url: "/admin/categories",
    icon: AudioLines,
  },
  {
    title: "Authors",
    url: "/admin/authors",
    icon: UsersRound,
  },
  {
    title: "Audiobooks",
    url: "/admin/audiobooks",
    icon: BookOpen,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar variant="inset" className="border-r border-gray-200 bg-white">
      <SidebarHeader className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg text-white">
            <Logo className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 tracking-tight">SoundScape</h2>
            <p className="text-xs text-gray-500 font-medium">Admin Portal</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2 px-2">
            Overview
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        "w-full justify-start gap-3 px-3 py-2.5 text-sm transition-all duration-200 rounded-xl group relative overflow-hidden",
                        isActive
                          ? "text-white shadow-md"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <Link href={item.url} className="relative z-10 flex items-center w-full">
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"
                            initial={false}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                        <item.icon className={cn("h-5 w-5 mr-3 relative z-10", isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700")} />
                        <span className="font-medium relative z-10">{item.title}</span>
                        {isActive && <ChevronRight className="ml-auto h-4 w-4 text-white/80 relative z-10" />}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2 px-2">
            Content Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {managementItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        "w-full justify-start gap-3 px-3 py-2.5 text-sm transition-all duration-200 rounded-xl group relative overflow-hidden",
                        isActive
                          ? "text-white shadow-md"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <Link href={item.url} className="relative z-10 flex items-center w-full">
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"
                            initial={false}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                        <item.icon className={cn("h-5 w-5 mr-3 relative z-10", isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700")} />
                        <span className="font-medium relative z-10">{item.title}</span>
                        {isActive && <ChevronRight className="ml-auto h-4 w-4 text-white/80 relative z-10" />}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6 border-t border-gray-100 bg-gray-50/50">
        <div className="text-xs text-gray-400 text-center">
          <p className="font-medium text-gray-500">&copy; 2025 SoundScape</p>
          <p>Admin Dashboard v1.0</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}