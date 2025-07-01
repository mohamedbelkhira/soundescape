import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Adjust path to your auth config
import { FavoriteService } from "@/services/favorite.service";

const safePositiveInt = (value: string | null, fallback: number) => {
  const n = Number.parseInt(value ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching user favorites...");
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    
    /* ---------------- Pagination ---------------------------------------- */
    const page = safePositiveInt(searchParams.get("page"), 1);
    const limit = safePositiveInt(searchParams.get("limit"), 10);
    const offset = (page - 1) * limit;

    const { audiobooks, total } = await FavoriteService.getUserFavorites(
      session.user.id,
      limit,
      offset
    );

    return NextResponse.json({
      audiobooks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
