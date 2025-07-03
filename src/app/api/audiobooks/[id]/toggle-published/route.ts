import { NextRequest, NextResponse } from "next/server";
import { AudiobookService } from "@/services/audiobook.service";
import { createNotificationForEvent } from "@/app/api/notifications/create-for-all/route";
import { NotificationType } from "@prisma/client";
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  
  try {
   
    const audiobook = await AudiobookService.togglePublish(params.id);
    // Create notification for all users if audiobook is published
       if (audiobook.isPublished === true) {
         try {
           await createNotificationForEvent(
             NotificationType.NEW_AUDIOBOOK, // Adjust this based on your NotificationType enum
             `New Audiobook: ${audiobook.title.trim()}`,
             `A new audiobook "${audiobook.title.trim()}" has been published! Check it out now.`,
             audiobook.id, // Assuming the created audiobook has an id
             audiobook.authorId.trim(),
             {
               audiobookTitle: audiobook.title.trim(),
               audiobookCover: audiobook.coverUrl?.trim(),
               publishedAt: new Date().toISOString()
             }
           );
         } catch (notificationError) {
           // Log the error but don't fail the audiobook creation
           console.error('Failed to create notification for new audiobook:', notificationError);
         }
       }
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