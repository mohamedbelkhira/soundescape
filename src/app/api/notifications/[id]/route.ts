// app/api/notifications/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NotificationService } from "@/services/notification.service";

// GET /api/notifications/[id] - Get specific notification
export async function GET(
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

    const notification = await NotificationService.getByIdForUser(params.id, session.user.id);
    
    if (!notification) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(notification);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications/[id] - Delete notification for current user
export async function DELETE(
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

    await NotificationService.deleteForUser(params.id, session.user.id);
    return NextResponse.json({ message: "Notification deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}