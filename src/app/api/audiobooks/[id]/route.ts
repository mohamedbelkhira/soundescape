// src/app/api/audiobooks/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { AudiobookService } from "@/services/audiobook.service";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const audiobook = await AudiobookService.getById(params.id);
    
    if (!audiobook) {
      return NextResponse.json(
        { message: "Audiobook not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(audiobook);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Basic validation - at least one field should be provided
    if (!title && !description && coverUrl === undefined && !audioUrl && 
        totalTime === undefined && !authorId && !categoryIds && isPublished === undefined) {
      return NextResponse.json(
        { message: "At least one field must be provided for update" },
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};
    
    if (title) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim();
    if (coverUrl !== undefined) updateData.coverUrl = coverUrl?.trim();
    if (audioUrl) updateData.audioUrl = audioUrl.trim();
    if (totalTime !== undefined) updateData.totalTime = totalTime;
    if (authorId) updateData.authorId = authorId.trim();
    if (categoryIds !== undefined) updateData.categoryIds = categoryIds;
    if (isPublished !== undefined) updateData.isPublished = isPublished;

    const audiobook = await AudiobookService.update(params.id, updateData);

    return NextResponse.json(audiobook);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("already exists")) {
        return NextResponse.json(
          { message: error.message },
          { status: 409 }
        );
      }
      if (error.message.includes("not found")) {
        return NextResponse.json(
          { message: error.message },
          { status: 404 }
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await AudiobookService.delete(params.id);
    
    return NextResponse.json({ 
      message: "Audiobook deleted successfully" 
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { message: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}