import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NotificationService } from "@/services/notification.service";

// DELETE /api/notifications/bulk-delete - Bulk delete notifications
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { message: "IDs array is required" },
        { status: 400 }
      );
    }

    // Verify all notifications belong to the user
    const notifications = await Promise.all(
      ids.map(id => NotificationService.getById(id))
    );

    const unauthorizedNotifications = notifications.filter(
      (notification, index) => 
        !notification || 
        (notification.userId && notification.userId !== session.user.id)
    );

    if (unauthorizedNotifications.length > 0) {
      return NextResponse.json(
        { message: "Some notifications not found or access denied" },
        { status: 403 }
      );
    }

    const count = await NotificationService.bulkDelete(ids);

    return NextResponse.json({ 
      message: `${count} notifications deleted`,
      count 
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
