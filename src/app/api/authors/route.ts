// src/app/api/authors/route.ts
import { NextRequest, NextResponse } from "next/server";
import { AuthorService } from "@/services/author.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const isActive = searchParams.get("isActive");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Parse isActive filter
    let isActiveFilter: boolean | undefined;
    if (isActive === "true") isActiveFilter = true;
    else if (isActive === "false") isActiveFilter = false;

    const result = await AuthorService.getAll({
      search,
      isActive: isActiveFilter,
      limit,
      offset,
    });

    return NextResponse.json({
      authors: result.authors,
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
    const { name, isActive } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    const author = await AuthorService.create({
      name: name.trim(),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    return NextResponse.json(author, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json(
        { message: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}