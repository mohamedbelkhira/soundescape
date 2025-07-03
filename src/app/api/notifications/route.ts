// app/api/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NotificationService } from "@/services/notification.service";

// GET /api/notifications - Get notifications for current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const isRead = searchParams.get('isRead') === 'true' ? true : 
                   searchParams.get('isRead') === 'false' ? false : undefined;
    const type = searchParams.get('type') || undefined;
    const search = searchParams.get('search') || undefined;

    const result = await NotificationService.getByUserId(session.user.id, {
      limit,
      offset,
      isRead,
      type: type as any,
      search
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}