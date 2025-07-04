import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs'
import path from 'node:path'
import { lookup } from 'mime-types'

/** We need Node APIs → opt‑out of the edge runtime. */
export const runtime = 'nodejs'

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  /* ───── 1. Build & validate the file path ───────────────────────────── */
  const relativePath = params.path.join('/')                     // audio/The_48_….mp3
  if (relativePath.includes('..') || relativePath.includes('\\')) {
    return new NextResponse('Invalid path', { status: 400 })
  }

  const fullPath = path.join(process.cwd(), 'uploads', relativePath)
  const stat = await fs.promises.stat(fullPath).catch(() => null)
  if (!stat || !stat.isFile()) {
    return new NextResponse('File not found', { status: 404 })
  }
  const fileSize = stat.size
  const mimeType = lookup(fullPath) || 'application/octet-stream'

  /* ───── 2. Check for a Range header ─────────────────────────────────── */
  const range = req.headers.get('range')
  if (!range) {
    /* First request (no seeking yet) */
    const stream = fs.createReadStream(fullPath)
    return new NextResponse(stream as any, {
      status: 200,
      headers: {
        'Content-Type'  : mimeType,
        'Content-Length': fileSize.toString(),
        'Accept-Ranges' : 'bytes'
      }
    })
  }

  /* ───── 3. Parse "bytes=start-end" ──────────────────────────────────── */
  const [startStr, endStr] = range.replace(/bytes=/, '').split('-')
  const start = Number(startStr)
  const end   = endStr ? Number(endStr) : fileSize - 1

  if (isNaN(start) || isNaN(end) || start > end || end >= fileSize) {
    return new NextResponse(null, { status: 416 })          // Range Not Satisfiable
  }

  const chunkSize = end - start + 1
  const stream    = fs.createReadStream(fullPath, { start, end })

  /* ───── 4. Partial content response ─────────────────────────────────── */
  return new NextResponse(stream as any, {
    status: 206,
    headers: {
      'Content-Type'  : mimeType,
      'Content-Length': chunkSize.toString(),
      'Content-Range' : `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges' : 'bytes',
      // enable aggressive CDN/browser caching if you like:
      // 'Cache-Control': 'public, max-age=31536000, immutable'
    }
  })
}