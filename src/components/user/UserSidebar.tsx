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
  Search
} from "lucide-react"

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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl  text-white shadow-lg">
            <Logo className="h-10 w-10" />
          </div>
          <div>
            <h2 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SoundScape
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Your Sound Library</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4 py-6">
        {navigationItems.map((section) => (
          <SidebarGroup key={section.title} className="mb-6">
            <SidebarGroupLabel className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
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
                        className={cn(
                          "h-11 rounded-xl transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-sm",
                          isActive && "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border border-blue-200 dark:border-blue-800 shadow-sm text-blue-700 dark:text-blue-300"
                        )}
                      >
                        <Link href={item.url} className="flex items-center gap-3 px-3">
                          <item.icon className={cn(
                            "h-5 w-5 transition-colors",
                            isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"
                          )} />
                          <span className={cn(
                            "font-medium transition-colors",
                            isActive ? "text-blue-700 dark:text-blue-300" : "text-slate-700 dark:text-slate-300"
                          )}>
                            {item.title}
                          </span>
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