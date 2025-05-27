import { NextRequest, NextResponse } from "next/server";
import { AudiobookService } from "@/services/audiobook.service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const audiobook = await AudiobookService.togglePublish(params.id);
    
    return NextResponse.json({
      message: `Audiobook ${audiobook.isPublished ? 'published' : 'unpublished'} successfully`,
      audiobook: {
        id: audiobook.id,
        title: audiobook.title,
        isPublished: audiobook.isPublished,
      },
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