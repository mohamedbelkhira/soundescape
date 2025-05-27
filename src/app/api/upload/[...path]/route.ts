// src/app/api/uploads/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { headers } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Get the file path from the URL parameters
    const filePath = params.path.join('/')
    
    // Validate path to prevent directory traversal
    if (filePath.includes('..') || filePath.includes('//')) {
      return new NextResponse('Invalid path', { status: 400 })
    }
    
    // Construct the full file path
    const fullPath = path.join(process.cwd(), 'uploads', filePath)
    
    // Check if file exists
    try {
      await fs.access(fullPath)
    } catch {
      return new NextResponse('File not found', { status: 404 })
    }
    
    // Read the file
    const fileBuffer = await fs.readFile(fullPath)
    
    // Determine content type based on file extension
    const ext = path.extname(fullPath).toLowerCase()
    let contentType = 'application/octet-stream'
    
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg'
        break
      case '.png':
        contentType = 'image/png'
        break
      case '.webp':
        contentType = 'image/webp'
        break
      case '.gif':
        contentType = 'image/gif'
        break
      case '.mp3':
        contentType = 'audio/mpeg'
        break
      case '.wav':
        contentType = 'audio/wav'
        break
      case '.m4a':
        contentType = 'audio/mp4'
        break
      case '.aac':
        contentType = 'audio/aac'
        break
    }
    
    // Return the file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving file:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}