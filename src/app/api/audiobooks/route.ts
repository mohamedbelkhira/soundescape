// src/app/api/audiobooks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { AudiobookService } from "@/services/audiobook.service";

const safePositiveInt = (value: string | null, fallback: number) => {
  const n = Number.parseInt(value ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    /* ---------------- Pagination ---------------------------------------- */
    const page  = safePositiveInt(searchParams.get("page"), 1);
    const limit = safePositiveInt(searchParams.get("limit"), 10);
    const offset = (page - 1) * limit;

    /* ---------------- Decide which list to return ----------------------- */
    const rawView = (searchParams.get("view") ?? "all").toLowerCase();
    const view = rawView === "latest" || rawView === "trending" ? rawView : "all";

    /* ---------------- 1. LATEST ---------------------------------------- */
    if (view === "latest") {
      const includeDrafts = searchParams.get("includeDrafts") === "true";
      const { audiobooks, total } = await AudiobookService.getLatest(
        limit,
        offset,
        !includeDrafts,
      );

      return NextResponse.json({
        audiobooks,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    }

    /* ---------------- 2. TRENDING -------------------------------------- */
    if (view === "trending") {
      const windowInDays = safePositiveInt(searchParams.get("windowInDays"), 0);

      const { audiobooks, total } = await AudiobookService.getTrending(
        limit,
        offset,
        windowInDays,
      );

      return NextResponse.json({
        audiobooks,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    }

    /* ---------------- 3. ALL (default) --------------------------------- */
    const filters = {
      search:      searchParams.get("search")     || undefined,
      authorId:    searchParams.get("authorId")   || undefined,
      categoryId:  searchParams.get("categoryId") || undefined,
      limit,
      offset,
    };
    const isPublished = searchParams.get("isPublished");
    if (isPublished !== null) filters.isPublished = isPublished === "true";

    const { audiobooks, total } = await AudiobookService.getAll(filters);

    return NextResponse.json({
      audiobooks,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, 
      description, 
      coverUrl, 
      audioUrl, 
      totalTime, 
      authorId, 
      categoryIds,
      isPublished 
    } = body;

    // Validation
    if (!title?.trim()) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );
    }

    if (!audioUrl?.trim()) {
      return NextResponse.json(
        { message: "Audio URL is required" },
        { status: 400 }
      );
    }

    if (!authorId?.trim()) {
      return NextResponse.json(
        { message: "Author ID is required" },
        { status: 400 }
      );
    }

    // Validate totalTime if provided
    if (totalTime !== undefined && (typeof totalTime !== "number" || totalTime < 0)) {
      return NextResponse.json(
        { message: "Total time must be a positive number" },
        { status: 400 }
      );
    }

    // Validate categoryIds if provided
    if (categoryIds && (!Array.isArray(categoryIds) || !categoryIds.every(id => typeof id === "string"))) {
      return NextResponse.json(
        { message: "Category IDs must be an array of strings" },
        { status: 400 }
      );
    }

    const audiobook = await AudiobookService.create({
      title: title.trim(),
      description: description?.trim(),
      coverUrl: coverUrl?.trim(),
      audioUrl: audioUrl.trim(),
      totalTime,
      authorId: authorId.trim(),
      categoryIds: categoryIds || [],
      isPublished: isPublished || false,
    });

    return NextResponse.json(audiobook, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("already exists")) {
        return NextResponse.json(
          { message: error.message },
          { status: 409 }
        );
      }
      if (error.message.includes("Invalid author or category ID")) {
        return NextResponse.json(
          { message: error.message },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}