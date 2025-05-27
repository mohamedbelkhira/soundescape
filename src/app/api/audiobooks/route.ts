// src/app/api/audiobooks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { AudiobookService } from "@/services/audiobook.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const authorId = searchParams.get("authorId") || undefined;
    const categoryId = searchParams.get("categoryId") || undefined;
    const isPublished = searchParams.get("isPublished");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    const filters = {
      search,
      authorId,
      categoryId,
      ...(isPublished !== null && { isPublished: isPublished === "true" }),
      limit,
      offset,
    };

    const result = await AudiobookService.getAll(filters);

    return NextResponse.json({
      audiobooks: result.audiobooks,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
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