// app/api/notifications/[id]/mark-read/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NotificationService } from "@/services/notification.service";

// PATCH /api/notifications/[id]/mark-read - Mark notification as read
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if notification exists for this user
    const notification = await NotificationService.getByIdForUser(params.id, session.user.id);
    if (!notification) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 }
      );
    }

    const userNotification = await NotificationService.markAsRead(params.id, session.user.id);
    return NextResponse.json(userNotification);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}