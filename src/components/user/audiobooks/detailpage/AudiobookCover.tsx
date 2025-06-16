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
  const coverUrl = formatCoverUrl(rawCoverUrl)

  return (
    <Card className="overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-2xl">
      <CardContent className="p-0">
        {/* Fixed but responsive square area; Image scales IN without cropping */}
        <div className="relative w-full aspect-square sm:aspect-[3/4] bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={`Cover art for ${title}`}
              fill
              className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 280px"
              priority /* good for LCP */
              onError={(e) =>
                ((e.target as HTMLImageElement).style.display = 'none')
              }
            />
          ) : (
            <span className="text-white text-6xl font-bold drop-shadow-lg">
              {title.charAt(0).toUpperCase() || '?'}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}