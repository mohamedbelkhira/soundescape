

// src/app/api/favorites/bulk/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { FavoriteService } from "@/services/favorite.service";

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const body = await request.json();
    const { audiobookIds, action } = body;

    // Validation
    if (!Array.isArray(audiobookIds) || audiobookIds.length === 0) {
      return NextResponse.json(
        { message: "audiobookIds must be a non-empty array" },
        { status: 400 }
      );
    }

    if (!audiobookIds.every(id => typeof id === "string" && id.trim())) {
      return NextResponse.json(
        { message: "All audiobook IDs must be valid strings" },
        { status: 400 }
      );
    }

    if (!["add", "remove"].includes(action)) {
      return NextResponse.json(
        { message: "action must be 'add' or 'remove'" },
        { status: 400 }
      );
    }

    let result;
    if (action === "add") {
      result = await FavoriteService.addMultipleToFavorites(userId, audiobookIds);
    } else {
      result = await FavoriteService.removeMultipleFromFavorites(userId, audiobookIds);
    }
    
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