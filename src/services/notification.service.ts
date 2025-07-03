// src/services/notification.service.ts
import { db as prisma } from '@/lib/db';
import { Notification, UserNotification, Prisma, NotificationType } from '@prisma/client';

export interface NotificationInput {
  title: string;
  message: string;
  type?: NotificationType;
  audiobookId?: string;
  authorId?: string;
  metadata?: any;
}

export interface NotificationFilters {
  userId?: string;
  type?: NotificationType;
  isRead?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export type NotificationWithUserData = Notification & {
  userNotifications: UserNotification[];
};

export class NotificationService {
  /**
   * Create a notification for all users
   */
  static async createForAllUsers(data: NotificationInput): Promise<Notification> {
    try {
      // Get all user IDs
      const users = await prisma.user.findMany({
        select: { id: true },
        where: { role: 'USER' } // Only send to regular users, not admins
      });

      const notification = await prisma.notification.create({
        data: {
          title: data.title.trim(),
          message: data.message.trim(),
          type: data.type || 'INFO',
          audiobookId: data.audiobookId,
          authorId: data.authorId,
          metadata: data.metadata,
          userNotifications: {
            create: users.map(user => ({
              userId: user.id,
              isRead: false,
            }))
          }
        },
        include: {
          userNotifications: true
        }
      });

      return notification;
    } catch (error) {
      throw new Error('Failed to create notification for all users');
    }
  }

  /**
   * Create a notification for specific users
   */
  static async createForUsers(data: NotificationInput, userIds: string[]): Promise<Notification> {
    try {
      const notification = await prisma.notification.create({
        data: {
          title: data.title.trim(),
          message: data.message.trim(),
          type: data.type || 'INFO',
          audiobookId: data.audiobookId,
          authorId: data.authorId,
          metadata: data.metadata,
          userNotifications: {
            create: userIds.map(userId => ({
              userId,
              isRead: false,
            }))
          }
        },
        include: {
          userNotifications: true
        }
      });

      return notification;
    } catch (error) {
      throw new Error('Failed to create notification for users');
    }
  }

  /**
   * Get notifications for a specific user
   */
  static async getByUserId(userId: string, filters: NotificationFilters = {}): Promise<{
    notifications: NotificationWithUserData[];
    total: number;
    unreadCount: number;
  }> {
    const { limit = 10, offset = 0, isRead, type, search } = filters;

    const whereClause: Prisma.NotificationWhereInput = {
      isActive: true,
      userNotifications: {
        some: {
          userId,
          ...(isRead !== undefined && { isRead })
        }
      },
      ...(type && { type }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { message: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: whereClause,
        include: {
          userNotifications: {
            where: { userId }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.notification.count({ where: whereClause }),
      prisma.userNotification.count({ 
        where: { 
          userId, 
          isRead: false,
          notification: { isActive: true }
        } 
      }),
    ]);

    return { notifications, total, unreadCount };
  }

  /**
   * Get notification by ID for a specific user
   */
  static async getByIdForUser(notificationId: string, userId: string): Promise<NotificationWithUserData | null> {
    return await prisma.notification.findFirst({
      where: {
        id: notificationId,
        isActive: true,
        userNotifications: {
          some: { userId }
        }
      },
      include: {
        userNotifications: {
          where: { userId }
        }
      }
    });
  }

  /**
   * Mark notification as read for a user
   */
  static async markAsRead(notificationId: string, userId: string): Promise<UserNotification> {
    try {
      const userNotification = await prisma.userNotification.findFirst({
        where: {
          notificationId,
          userId
        }
      });

      if (!userNotification) {
        throw new Error('Notification not found for user');
      }

      return await prisma.userNotification.update({
        where: {
          id: userNotification.id
        },
        data: {
          isRead: true,
          readAt: new Date()
        }
      });
    } catch (error) {
      throw new Error('Failed to mark notification as read');
    }
  }

  /**
   * Mark notification as unread for a user
   */
  static async markAsUnread(notificationId: string, userId: string): Promise<UserNotification> {
    try {
      const userNotification = await prisma.userNotification.findFirst({
        where: {
          notificationId,
          userId
        }
      });

      if (!userNotification) {
        throw new Error('Notification not found for user');
      }

      return await prisma.userNotification.update({
        where: {
          id: userNotification.id
        },
        data: {
          isRead: false,
          readAt: null
        }
      });
    } catch (error) {
      throw new Error('Failed to mark notification as unread');
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string): Promise<number> {
    const result = await prisma.userNotification.updateMany({
      where: { 
        userId,
        isRead: false,
        notification: { isActive: true }
      },
      data: { 
        isRead: true,
        readAt: new Date()
      },
    });
    return result.count;
  }

  /**
   * Delete notification for a user (soft delete - just removes the user notification)
   */
  static async deleteForUser(notificationId: string, userId: string): Promise<void> {
    try {
      await prisma.userNotification.deleteMany({
        where: {
          notificationId,
          userId
        }
      });
    } catch (error) {
      throw new Error('Failed to delete notification for user');
    }
  }

  /**
   * Delete all notifications for a user
   */
  static async deleteAllForUser(userId: string): Promise<number> {
    const result = await prisma.userNotification.deleteMany({
      where: { 
        userId,
        notification: { isActive: true }
      },
    });
    return result.count;
  }

  /**
   * Get unread count for a user
   */
  static async getUnreadCount(userId: string): Promise<number> {
    return await prisma.userNotification.count({
      where: { 
        userId,
        isRead: false,
        notification: { isActive: true }
      },
    });
  }

  /**
   * Bulk delete notifications for a user
   */
  static async bulkDeleteForUser(notificationIds: string[], userId: string): Promise<number> {
    const result = await prisma.userNotification.deleteMany({
      where: { 
        notificationId: { in: notificationIds },
        userId 
      },
    });
    return result.count;
  }

  /**
   * Admin: Get all notifications with stats
   */
  static async getAllForAdmin(filters: NotificationFilters = {}): Promise<{
    notifications: (Notification & { _count: { userNotifications: number } })[];
    total: number;
  }> {
    const { limit = 10, offset = 0, type, search } = filters;

    const whereClause: Prisma.NotificationWhereInput = {
      isActive: true,
      ...(type && { type }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { message: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: whereClause,
        include: {
          _count: {
            select: { userNotifications: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.notification.count({ where: whereClause }),
    ]);

    return { notifications, total };
  }

  /**
   * Admin: Delete notification completely (hard delete)
   */
  static async deleteCompletely(notificationId: string): Promise<void> {
    try {
      await prisma.notification.update({
        where: { id: notificationId },
        data: { isActive: false }
      });
    } catch (error) {
      throw new Error('Failed to delete notification');
    }
  }
}