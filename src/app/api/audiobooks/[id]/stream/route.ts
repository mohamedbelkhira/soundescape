import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs'
import path from 'node:path'

/** Use the Node.js runtime, not the Edge runtime */
export const runtime = 'nodejs'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  /* 1. Locate the file ---------------------------------------------------- */
  const filePath = path.join(process.cwd(), 'uploads', `${params.id}.mp3`) // adapt
  const stat     = await fs.promises.stat(filePath).catch(() => null)
  if (!stat) return new NextResponse('Not Found', { status: 404 })
  const fileSize = stat.size

  /* 2. Handle first request (no Range header) ----------------------------- */
  const range = req.headers.get('range')
  if (!range) {
    const stream = fs.createReadStream(filePath)
    return new NextResponse(stream as any, {
      status: 200,
      headers: {
        'Content-Type'  : 'audio/mpeg',
        'Content-Length': fileSize.toString(),
        'Accept-Ranges' : 'bytes'
      }
    })
  }

  /* 3. Parse "bytes=start-end" ------------------------------------------- */
  const [startStr, endStr] = range.replace(/bytes=/, '').split('-')
  const start = Number(startStr)
  const end   = endStr ? Number(endStr) : fileSize - 1
  if (isNaN(start) || isNaN(end) || start > end || end >= fileSize) {
    return new NextResponse(null, { status: 416 }) // Range Not Satisfiable
  }

  const chunkSize = end - start + 1
  const stream    = fs.createReadStream(filePath, { start, end })

  /* 4. Partial content ---------------------------------------------------- */
  return new NextResponse(stream as any, {
    status: 206,
    headers: {
      'Content-Type'  : 'audio/mpeg',
      'Content-Length': chunkSize.toString(),
      'Content-Range' : `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges' : 'bytes',
      'Cache-Control' : 'public, max-age=31536000, immutable'
    }
  })
}
