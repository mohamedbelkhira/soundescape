// src/components/user/UserHeader.tsx
"use client"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { Search, Bell, Moon, Sun, X, Clock, User, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserDropdown } from "@/components/user/UserDropdown"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/contexts/ThemeContext"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

interface Notification {
  id: string
  type: 'system' | 'audiobook' | 'user'
  title: string
  message: string
  timestamp: string
  read: boolean
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'audiobook',
    title: 'New Chapter Available',
    message: 'Chapter 12 of "The Psychology of Money" is now available',
    timestamp: '2 minutes ago',
    read: false
  },
  {
    id: '2',
    type: 'system',
    title: 'Download Complete',
    message: 'Your audiobook "Atomic Habits" has finished downloading',
    timestamp: '1 hour ago',
    read: false
  },
  {
    id: '3',
    type: 'user',
    title: 'Friend Activity',
    message: 'Sarah finished reading "Dune" and left a review',
    timestamp: '3 hours ago',
    read: false
  },
  {
    id: '4',
    type: 'audiobook',
    title: 'Weekly Progress',
    message: 'You\'ve completed 4 hours of listening this week!',
    timestamp: '1 day ago',
    read: true
  },
  {
    id: '5',
    type: 'system',
    title: 'Sync Complete',
    message: 'Your library has been synced across all devices',
    timestamp: '2 days ago',
    read: true
  }
]

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'audiobook':
      return <BookOpen className="h-4 w-4" />
    case 'user':
      return <User className="h-4 w-4" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

export function UserHeader() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session } = useSession()
  const { theme, toggleTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  const handleNotificationClick = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-slate-900/80 transition-colors">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Notifications Drawer */}
          <Drawer direction="right" open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-full w-96 ml-auto">
              <div className="flex flex-col h-full">
                <DrawerHeader className="border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                      <DrawerTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Notifications
                      </DrawerTitle>
                      {unreadCount > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {unreadCount}
                        </Badge>
                      )}
                    </div>
                    <DrawerClose asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </DrawerClose>
                  </div>
                  <DrawerDescription className="text-left">
                    Stay updated with your latest audiobook activity
                  </DrawerDescription>
                </DrawerHeader>

                {/* Mark All as Read Button */}
                {unreadCount > 0 && (
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={markAllAsRead}
                      className="w-full"
                    >
                      Mark all as read
                    </Button>
                  </div>
                )}

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <Bell className="h-12 w-12 text-slate-400 dark:text-slate-500 mb-4" />
                      <p className="text-slate-500 dark:text-slate-400">
                        No notifications yet
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification.id)}
                          className={`p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                            !notification.read ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full ${
                              notification.type === 'audiobook' 
                                ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                                : notification.type === 'user'
                                ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}>
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className={`text-sm font-medium ${
                                  !notification.read 
                                    ? 'text-slate-900 dark:text-slate-100' 
                                    : 'text-slate-700 dark:text-slate-300'
                                }`}>
                                  {notification.title}
                                </h3>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-500">
                                <Clock className="h-3 w-3" />
                                {notification.timestamp}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </DrawerContent>
          </Drawer>

          {/* User Dropdown */}
          <UserDropdown />
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-6 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <Input
            type="search"
            placeholder="Search audiobooks..."
            className="w-full pl-10 pr-4 h-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-colors rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </header>
  )
}