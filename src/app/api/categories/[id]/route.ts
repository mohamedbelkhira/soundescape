
// src/app/api/categories/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { CategoryService } from "@/services/category.service";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await CategoryService.getById(params.id);

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
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
    const { title, description } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );
    }

    const category = await CategoryService.update(params.id, {
      title: title.trim(),
      description: description?.trim(),
    });

    return NextResponse.json(category);
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
    await CategoryService.delete(params.id);
    return NextResponse.json({ message: "Category deleted successfully" });
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