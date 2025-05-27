// src/app/api/files/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { lookup } from 'mime-types';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Join the path segments
    const filePath = params.path.join('/');
    
    // Validate path to prevent directory traversal
    if (filePath.includes('..') || filePath.includes('\\')) {
      return new NextResponse('Invalid path', { status: 400 });
    }
    
    // Construct full file path - this points to your uploads directory
    const fullPath = path.join(process.cwd(), 'uploads', filePath);
    
    // Check if file exists
    try {
      await fs.access(fullPath);
    } catch {
      return new NextResponse('File not found', { status: 404 });
    }
    
    // Read file
    const file = await fs.readFile(fullPath);
    
    // Get MIME type
    const mimeType = lookup(fullPath) || 'application/octet-stream';
    
    // Return file with appropriate headers
    return new NextResponse(file, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Content-Length': file.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}