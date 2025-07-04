// src/components/user/UserDropdown.tsx
"use client"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  User,
  LogOut,
  Crown,
  Activity,
  Gift
} from "lucide-react"

export function UserDropdown() {
  const { data: session } = useSession()

  if (!session?.user) return null

  const userInitials = session.user.name
    ?.split(" ")
    .map(name => name[0])
    .join("")
    .toUpperCase() || "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Avatar className="h-9 w-9 ring-2 ring-slate-200 dark:ring-slate-700 hover:ring-blue-300 dark:hover:ring-blue-600 transition-all">
            <AvatarImage 
              src={session.user.image || ""} 
              alt={session.user.name || "User"} 
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-64 mr-4 mt-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm transition-colors"
        align="end"
      >
        <DropdownMenuLabel className="p-4 pb-2">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage 
                  src={session.user.image || ""} 
                  alt={session.user.name || "User"} 
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {session.user.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {session.user.email}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
              >
                <Gift className="h-3 w-3 mr-1" />
                Free
              </Badge>
              <Badge variant="outline" className="text-xs border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                <Activity className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="mx-2 bg-slate-200 dark:bg-slate-700" />
        
        <div className="p-2 space-y-1">
          <DropdownMenuItem asChild>
            <Link 
              href="/user/profile" 
              className="flex items-center gap-3 px-3 py-2 text-sm cursor-pointer rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <span>My Profile</span>
            </Link>
          </DropdownMenuItem>
          
          {/* <DropdownMenuItem asChild>
            <Link 
              href="/user/settings" 
              className="flex items-center gap-3 px-3 py-2 text-sm cursor-pointer rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <Settings className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem> */}
          
          {/* <DropdownMenuItem asChild>
            <Link 
              href="/user/subscription" 
              className="flex items-center gap-3 px-3 py-2 text-sm cursor-pointer rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <CreditCard className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <span>Subscription</span>
            </Link>
          </DropdownMenuItem> */}
          
          {/* <DropdownMenuItem asChild>
            <Link 
              href="/help" 
              className="flex items-center gap-3 px-3 py-2 text-sm cursor-pointer rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <HelpCircle className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <span>Help & Support</span>
            </Link>
          </DropdownMenuItem> */}
        </div>
        
        <DropdownMenuSeparator className="mx-2 bg-slate-200 dark:bg-slate-700" />
        
        <div className="p-2">
          <DropdownMenuItem
            className="flex items-center gap-3 px-3 py-2 text-sm cursor-pointer rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950 focus:text-red-600 dark:focus:text-red-400 transition-colors"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}