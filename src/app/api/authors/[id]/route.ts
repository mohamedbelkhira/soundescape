// src/app/api/authors/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { AuthorService } from "@/services/author.service";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const author = await AuthorService.getById(params.id);

    if (!author) {
      return NextResponse.json(
        { message: "Author not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(author);
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
    const { name, isActive } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    const author = await AuthorService.update(params.id, {
      name: name.trim(),
      isActive: isActive !== undefined ? Boolean(isActive) : undefined,
    });

    return NextResponse.json(author);
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
    await AuthorService.delete(params.id);
    return NextResponse.json({ message: "Author deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        return NextResponse.json(
          { message: error.message },
          { status: 404 }
        );
      }
      if (error.message.includes("associated audiobooks")) {
        return NextResponse.json(
          { message: error.message },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}