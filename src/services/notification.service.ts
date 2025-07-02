// src/services/notification.service.ts
import { db as prisma } from '@/lib/db';
import { Notification, Prisma } from '@prisma/client';

export interface NotificationInput {
  title: string;
  message: string;
  type?: string;
  userId?: string;
  actionUrl?: string;
}

export interface NotificationFilters {
  userId?: string;
  type?: string;
  isRead?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export class NotificationService {
  /**
   * Create a new notification
   */
  static async create(data: NotificationInput): Promise<Notification> {
    try {
      return await prisma.notification.create({
        data: {
          title: data.title.trim(),
          message: data.message.trim(),
          type: data.type || 'INFO',
          userId: data.userId,
          actionUrl: data.actionUrl,
          isRead: false,
        },
      });
    } catch (error) {
      throw new Error('Failed to create notification');
    }
  }

  /**
   * Get all notifications with optional filtering and pagination
   */
  static async getAll(filters: NotificationFilters = {}): Promise<{
    notifications: Notification[];
    total: number;
  }> {
    const { userId, type, isRead, search, limit = 10, offset = 0 } = filters;

    const where: Prisma.NotificationWhereInput = {
      ...(userId && { userId }),
      ...(type && { type }),
      ...(isRead !== undefined && { isRead }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { message: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.notification.count({ where }),
    ]);

    return { notifications, total };
  }

  /**
   * Get notification by ID
   */
  static async getById(id: string): Promise<Notification | null> {
    return await prisma.notification.findUnique({
      where: { id },
    });
  }

  /**
   * Get notifications for a specific user
   */
  static async getByUserId(userId: string, filters: NotificationFilters = {}): Promise<{
    notifications: Notification[];
    total: number;
    unreadCount: number;
  }> {
    const { limit = 10, offset = 0, isRead, type } = filters;

    const where: Prisma.NotificationWhereInput = {
      userId,
      ...(isRead !== undefined && { isRead }),
      ...(type && { type }),
    };

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ 
        where: { userId, isRead: false } 
      }),
    ]);

    return { notifications, total, unreadCount };
  }

  /**
   * Update notification
   */
  static async update(id: string, data: Partial<NotificationInput>): Promise<Notification> {
    try {
      return await prisma.notification.update({
        where: { id },
        data: {
          ...(data.title && { title: data.title.trim() }),
          ...(data.message && { message: data.message.trim() }),
          ...(data.type && { type: data.type }),
          ...(data.actionUrl !== undefined && { actionUrl: data.actionUrl }),
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Notification not found');
        }
      }
      throw new Error('Failed to update notification');
    }
  }

  /**
   * Delete notification
   */
  static async delete(id: string): Promise<void> {
    try {
      await prisma.notification.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Notification not found');
        }
      }
      throw new Error('Failed to delete notification');
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(id: string): Promise<Notification> {
    try {
      return await prisma.notification.update({
        where: { id },
        data: { isRead: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Notification not found');
        }
      }
      throw new Error('Failed to mark notification as read');
    }
  }

  /**
   * Mark notification as unread
   */
  static async markAsUnread(id: string): Promise<Notification> {
    try {
      return await prisma.notification.update({
        where: { id },
        data: { isRead: false },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Notification not found');
        }
      }
      throw new Error('Failed to mark notification as unread');
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string): Promise<number> {
    const result = await prisma.notification.updateMany({
      where: { 
        userId,
        isRead: false,
      },
      data: { isRead: true },
    });
    return result.count;
  }

  /**
   * Get unread count for a user
   */
  static async getUnreadCount(userId: string): Promise<number> {
    return await prisma.notification.count({
      where: { 
        userId,
        isRead: false,
      },
    });
  }

  /**
   * Bulk delete notifications
   */
  static async bulkDelete(ids: string[]): Promise<number> {
    const result = await prisma.notification.deleteMany({
      where: { id: { in: ids } },
    });
    return result.count;
  }

  /**
   * Delete all notifications for a user
   */
  static async deleteAllForUser(userId: string): Promise<number> {
    const result = await prisma.notification.deleteMany({
      where: { userId },
    });
    return result.count;
  }

  /**
   * Get notifications for dropdown/select
   */
  static async getForSelect(userId?: string): Promise<Pick<Notification, 'id' | 'title'>[]> {
    return await prisma.notification.findMany({
      where: userId ? { userId } : undefined,
      select: { id: true, title: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}