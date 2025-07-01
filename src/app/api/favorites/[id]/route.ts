import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Adjust path to your auth config
import { FavoriteService } from "@/services/favorite.service";

export async function GET(
  request: NextRequest,
  { params }: { params: { audiobookId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!params.audiobookId?.trim()) {
      return NextResponse.json(
        { message: "Audiobook ID is required" },
        { status: 400 }
      );
    }

    const isFavorited = await FavoriteService.isFavorited(session.user.id, params.audiobookId);
    return NextResponse.json({ isFavorited });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { audiobookId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!params.audiobookId?.trim()) {
      return NextResponse.json(
        { message: "Audiobook ID is required" },
        { status: 400 }
      );
    }

    const result = await FavoriteService.toggleFavorite(session.user.id, params.audiobookId);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        return NextResponse.json(
          { message: error.message },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}