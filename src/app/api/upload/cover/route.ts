// src/app/api/upload/cover/route.ts
import { NextRequest, NextResponse } from "next/server";
import { processUpload, parseFormData, IMAGE_UPLOAD_OPTIONS, deleteFile } from "@/lib/file-upload";

export async function POST(request: NextRequest) {
  try {
    const formData = await parseFormData(request);
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    // Process the upload
    const result = await processUpload(file, IMAGE_UPLOAD_OPTIONS);
    
    // Ensure the URL starts with a leading slash
    const normalizedUrl = result.url.startsWith('/') ? result.url : `/${result.url}`;

    return NextResponse.json({
      message: "Cover uploaded successfully",
      file: {
        filename: result.filename,
        originalName: result.originalName,
        size: result.size,
        url: normalizedUrl, // Return normalized URL
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('File size exceeds') ||
          error.message.includes('File type not allowed') ||
          error.message.includes('Invalid form data')) {
        return NextResponse.json(
          { message: error.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json(
        { message: "Filename is required" },
        { status: 400 }
      );
    }

    // Validate filename to prevent path traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json(
        { message: "Invalid filename" },
        { status: 400 }
      );
    }

    const filePath = `${process.cwd()}/${IMAGE_UPLOAD_OPTIONS.uploadDir}/${filename}`;
    await deleteFile(filePath);

    return NextResponse.json({
      message: "Cover deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Delete failed" },
      { status: 500 }
    );
  }
}