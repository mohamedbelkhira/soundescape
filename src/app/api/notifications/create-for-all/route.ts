// app/api/notifications/create-for-all/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NotificationService } from "@/services/notification.service";
import { NotificationType } from "@prisma/client";

// POST /api/notifications/create-for-all - Create notification for all users (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, message, type, audiobookId, authorId, metadata } = body;

    // Validate required fields
    if (!title || !message) {
      return NextResponse.json(
        { message: "Title and message are required" },
        { status: 400 }
      );
    }

    // Validate type if provided
    if (type && !Object.values(NotificationType).includes(type)) {
      return NextResponse.json(
        { message: "Invalid notification type" },
        { status: 400 }
      );
    }

    const notification = await NotificationService.createForAllUsers({
      title,
      message,
      type: type as NotificationType,
      audiobookId,
      authorId,
      metadata
    });

    return NextResponse.json({
      message: "Notification created for all users",
      notification
    });

  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to create notifications for specific events
export async function createNotificationForEvent(
  type: NotificationType,
  title: string,
  message: string,
  audiobookId?: string,
  authorId?: string,
  metadata?: any
) {
  try {
    return await NotificationService.createForAllUsers({
      title,
      message,
      type,
      audiobookId,
      authorId,
      metadata
    });
  } catch (error) {
    console.error('Error creating event notification:', error);
    throw error;
  }
}