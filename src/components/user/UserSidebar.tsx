// src/components/user/UserSidebar.tsx
"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Logo from "../common/logo"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"
import {
  Heart,
  TrendingUp,
  Star,
  User,
  Headphones,
  Search,
  ChevronRight
} from "lucide-react"
import { motion } from "framer-motion"

const navigationItems = [
  {
    title: "Discover",
    items: [
      { title: "Browse", url: "/user/audiobooks", icon: Search },
      { title: "Trending", url: "/user/trending", icon: TrendingUp },
      { title: "New Releases", url: "/user/newreleases", icon: Star },
    ]
  },
  {
    title: "My Library",
    items: [
      { title: "Favorites", url: "/user/favorites", icon: Heart },
    ]
  },
  {
    title: "Account",
    items: [
      { title: "Profile", url: "/user/profile", icon: User },
    ]
  }
]

export function UserSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm transition-colors">
      <SidebarHeader className="border-b border-slate-200 dark:border-slate-700 p-6 transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg">
            <Logo className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SoundScape
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Your Sound Library</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        {navigationItems.map((section) => (
          <SidebarGroup key={section.title} className="mb-6">
            <SidebarGroupLabel className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-2">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.url
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={cn(
                          "w-full justify-start gap-3 px-3 py-2.5 text-sm transition-all duration-200 rounded-xl group relative overflow-hidden",
                          isActive
                            ? "text-white shadow-md"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                        )}
                      >
                        <Link href={item.url} className="relative z-10 flex items-center w-full">
                          {isActive && (
                            <motion.div
                              layoutId="activeUserTab"
                              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"
                              initial={false}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                          <item.icon className={cn(
                            "h-5 w-5 mr-3 relative z-10 transition-colors",
                            isActive ? "text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                          )} />
                          <span className={cn(
                            "font-medium relative z-10 transition-colors",
                            isActive ? "text-white" : "text-slate-700 dark:text-slate-300"
                          )}>
                            {item.title}
                          </span>
                          {isActive && <ChevronRight className="ml-auto h-4 w-4 text-white/80 relative z-10" />}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}