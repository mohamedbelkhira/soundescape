'use client'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { formatCoverUrl } from '@/lib/client-utils'

interface AudiobookCoverProps {
  title: string
  coverUrl: string | null
}

export const AudiobookCover = ({
  title,
  coverUrl: rawCoverUrl,
}: AudiobookCoverProps) => {
  const coverUrl = formatCoverUrl(rawCoverUrl);

  return (
    <Card className="overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-2xl">
      <CardContent className="p-0">
        <div className="aspect-square relative group">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={`Cover art for ${title}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority // Good for LCP
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white text-6xl font-bold drop-shadow-lg">
                {title?.charAt(0)?.toUpperCase() || '?'}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}