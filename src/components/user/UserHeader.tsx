// src/components/user/UserHeader.tsx
"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Search, Bell, Moon, Sun, X, Clock, User, BookOpen, AlertCircle, Info, Star, Shield, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserDropdown } from "@/components/user/UserDropdown"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/contexts/ThemeContext"
import { toast } from "@/hooks/use-toast"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

interface UserNotification {
  id: string
  userId: string
  notificationId: string
  isRead: boolean
  readAt: string | null
  createdAt: string
}

interface Notification {
  id: string
  title: string
  message: string
  type: 'INFO' | 'NEW_AUDIOBOOK' | 'AUTHOR_UPDATE' | 'SYSTEM' | 'PROMOTION' | 'WARNING'
  audiobookId: string | null
  authorId: string | null
  metadata: any
  isActive: boolean
  createdAt: string
  updatedAt: string
  userNotifications: UserNotification[]
}

interface NotificationResponse {
  notifications: Notification[]
  total: number
  unreadCount: number
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'NEW_AUDIOBOOK':
      return <BookOpen className="h-4 w-4" />
    case 'AUTHOR_UPDATE':
      return <User className="h-4 w-4" />
    case 'SYSTEM':
      return <Shield className="h-4 w-4" />
    case 'PROMOTION':
      return <Star className="h-4 w-4" />
    case 'WARNING':
      return <AlertTriangle className="h-4 w-4" />
    case 'INFO':
    default:
      return <Info className="h-4 w-4" />
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'NEW_AUDIOBOOK':
      return 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
    case 'AUTHOR_UPDATE':
      return 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
    case 'SYSTEM':
      return 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
    case 'PROMOTION':
      return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
    case 'WARNING':
      return 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
    case 'INFO':
    default:
      return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
  }
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return date.toLocaleDateString()
}

export function UserHeader() {
  const { data: session } = useSession()
  const { theme, toggleTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)
  const limit = 10

  // Fetch notifications
  const fetchNotifications = async (reset = false) => {
    if (!session?.user?.id || isLoading) return
    
    setIsLoading(true)
    try {
      const currentOffset = reset ? 0 : offset
      const response = await fetch(
        `/api/notifications?limit=${limit}&offset=${currentOffset}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) throw new Error('Failed to fetch notifications')

      const data: NotificationResponse = await response.json()
      
      if (reset) {
        setNotifications(data.notifications)
        setOffset(limit)
      } else {
        setNotifications(prev => [...prev, ...data.notifications])
        setOffset(prev => prev + limit)
      }
      
      setUnreadCount(data.unreadCount)
      setHasMore(data.notifications.length === limit)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Load more notifications
  const loadMore = () => {
    if (hasMore && !isLoading) {
      fetchNotifications(false)
    }
  }

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/mark-read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) throw new Error('Failed to mark notification as read')

      // Update local state
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? {
                ...notification,
                userNotifications: notification.userNotifications.map(un => ({
                  ...un,
                  isRead: true,
                  readAt: new Date().toISOString()
                }))
              }
            : notification
        )
      )
      
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive"
      })
    }
  }

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) throw new Error('Failed to mark all notifications as read')

      const data = await response.json()
      
      // Update local state
      setNotifications(prev =>
        prev.map(notification => ({
          ...notification,
          userNotifications: notification.userNotifications.map(un => ({
            ...un,
            isRead: true,
            readAt: new Date().toISOString()
          }))
        }))
      )
      
      setUnreadCount(0)
      
      toast({
        title: "Success",
        description: data.message,
      })
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive"
      })
    }
  }

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) throw new Error('Failed to delete notification')

      // Remove from local state
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      
      // Update unread count if notification was unread
      const notification = notifications.find(n => n.id === notificationId)
      if (notification && !notification.userNotifications[0]?.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
      
      toast({
        title: "Success",
        description: "Notification deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting notification:', error)
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive"
      })
    }
  }

  // Delete all notifications
  const deleteAllNotifications = async () => {
    try {
      const response = await fetch('/api/notifications/delete-all', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) throw new Error('Failed to delete all notifications')

      const data = await response.json()
      
      // Clear local state
      setNotifications([])
      setUnreadCount(0)
      setOffset(0)
      setHasMore(false)
      
      toast({
        title: "Success",
        description: data.message,
      })
    } catch (error) {
      console.error('Error deleting all notifications:', error)
      toast({
        title: "Error",
        description: "Failed to delete all notifications",
        variant: "destructive"
      })
    }
  }

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    const isRead = notification.userNotifications[0]?.isRead
    if (!isRead) {
      markAsRead(notification.id)
    }
  }

  // Fetch notifications when component mounts or drawer opens
  useEffect(() => {
    if (session?.user?.id && isDrawerOpen) {
      fetchNotifications(true)
    }
  }, [session?.user?.id, isDrawerOpen])

  // Fetch unread count on mount
  useEffect(() => {
    if (session?.user?.id) {
      fetchNotifications(true)
    }
  }, [session?.user?.id])

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
                    {unreadCount > 99 ? '99+' : unreadCount}
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

                {/* Action Buttons */}
                {notifications.length > 0 && (
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex gap-2">
                      {unreadCount > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={markAllAsRead}
                          className="flex-1"
                        >
                          Mark all read
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={deleteAllNotifications}
                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        Delete all
                      </Button>
                    </div>
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
                      {notifications.map((notification) => {
                        const isRead = notification.userNotifications[0]?.isRead
                        return (
                          <div
                            key={notification.id}
                            className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                              !isRead ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h3 className={`text-sm font-medium ${
                                    !isRead 
                                      ? 'text-slate-900 dark:text-slate-100' 
                                      : 'text-slate-700 dark:text-slate-300'
                                  }`}>
                                    {notification.title}
                                  </h3>
                                  <div className="flex items-center gap-1">
                                    {!isRead && (
                                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        deleteNotification(notification.id)
                                      }}
                                      className="h-6 w-6 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-500">
                                    <Clock className="h-3 w-3" />
                                    {formatTimeAgo(notification.createdAt)}
                                  </div>
                                  <div className="flex gap-1">
                                    {!isRead && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          markAsRead(notification.id)
                                        }}
                                        className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                                      >
                                        Mark read
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      
                      {/* Load More Button */}
                      {hasMore && (
                        <div className="p-4 text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={loadMore}
                            disabled={isLoading}
                            className="w-full"
                          >
                            {isLoading ? 'Loading...' : 'Load More'}
                          </Button>
                        </div>
                      )}
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