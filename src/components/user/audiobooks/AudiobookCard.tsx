// src/app/user/audiobooks/components/AudiobookCard.tsx
import { Clock, User, Tag } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image, { ImageLoaderProps } from 'next/image'

interface Author {
  id: string
  name: string
}

interface Category {
  category: {
    id: string
    title: string
  }
}

interface Audiobook {
  id: string
  title: string
  description: string | null
  coverUrl: string | null
  totalTime: number | null
  author: Author
  categories: Category[]
  _count: {
    listeningProgress: number
    bookmarks: number
  }
}

interface AudiobookCardProps {
  audiobook: Audiobook
}

// Utility functions
const formatDuration = (seconds: number | null) => {
  if (!seconds) return 'Unknown'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
}

// No-op loader so Next/Image uses the raw src
const coverLoader = ({ src }: ImageLoaderProps) => src

// Format cover URL to work with your file serving API
const formatCoverUrl = (raw: string | null) => {
  if (!raw) return ''
  
  // If it's already a full URL (starts with http or /api), return as is
  if (raw.startsWith('http') || raw.startsWith('/api/')) {
    return raw
  }
  
  // Remove any leading slashes and "uploads/" prefix
  const cleanPath = raw.replace(/^\/+/, '').replace(/^uploads\//, '')
  
  // Return the API URL that matches your file serving structure
  return `/api/files/${cleanPath}`
}

export function AudiobookCard({ audiobook }: AudiobookCardProps) {
  const coverUrl = formatCoverUrl(audiobook.coverUrl)
  
  return (
    <Link href={`/user/audiobooks/${audiobook.id}`}>
      <Card className="group overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600 hover:scale-[1.02]">
        <div className="aspect-[3/4] relative overflow-hidden">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={audiobook.title}
              fill
              loader={coverLoader}
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 25vw"
              onError={(e) => {
                console.error('Image failed to load:', coverUrl)
                // Fallback to placeholder
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {audiobook.title.charAt(0)}
              </span>
            </div>
          )}
          
          {/* Fallback div that shows when image fails to load */}
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center absolute inset-0 -z-10">
            <span className="text-white text-2xl font-bold">
              {audiobook.title.charAt(0)}
            </span>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {audiobook.title}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-sm text-slate-600 dark:text-slate-400">
              <User className="h-3 w-3" />
              <span className="truncate">{audiobook.author.name}</span>
            </div>
          </div>

          {audiobook.description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
              {audiobook.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
              <Clock className="h-3 w-3" />
              <span>{formatDuration(audiobook.totalTime)}</span>
            </div>
            {audiobook._count.bookmarks > 0 && (
              <Badge variant="secondary" className="text-xs">
                {audiobook._count.bookmarks} bookmarks
              </Badge>
            )}
          </div>

          {audiobook.categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {audiobook.categories.slice(0, 2).map((cat) => (
                <Badge
                  key={cat.category.id}
                  variant="outline"
                  className="text-xs border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300"
                >
                  <Tag className="h-2 w-2 mr-1" />
                  {cat.category.title}
                </Badge>
              ))}
              {audiobook.categories.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{audiobook.categories.length - 2}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}