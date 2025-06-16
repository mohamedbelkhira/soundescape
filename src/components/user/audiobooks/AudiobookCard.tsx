import { Clock, User, Tag } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image, { ImageLoaderProps } from 'next/image'

/* ───────── Types ───────── */
interface Author { id: string; name: string }
interface Category { category: { id: string; title: string } }
interface Audiobook {
  id: string
  title: string
  description: string | null
  coverUrl: string | null
  totalTime: number | null
  author: Author
  categories: Category[]
  _count: { listeningProgress: number; bookmarks: number }
}
interface AudiobookCardProps { audiobook: Audiobook }

/* ───────── Helpers ───────── */
const formatDuration = (sec: number | null) => {
  if (!sec) return 'Unknown'
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  return h ? `${h}h ${m}m` : `${m}m`
}
const coverLoader = ({ src }: ImageLoaderProps) => src
const formatCoverUrl = (raw: string | null) => {
  if (!raw) return ''
  if (raw.startsWith('http') || raw.startsWith('/api/')) return raw
  return `/api/files/${raw.replace(/^\/+|^uploads\//, '')}`
}

/* ───────── Component ───────── */
export function AudiobookCard({ audiobook }: AudiobookCardProps) {
  const coverUrl = formatCoverUrl(audiobook.coverUrl)

  return (
    <Link href={`/user/audiobooks/${audiobook.id}`}>
      <Card className="group overflow-hidden flex flex-col bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600 hover:scale-[1.02]">
        {/* Fixed-height cover area (responsive) */}
        <div className="relative w-full h-56 sm:h-60 lg:h-64 shrink-0 bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={audiobook.title}
              fill
              loader={coverLoader}
              unoptimized
              className="object-contain p-2 group-hover:scale-[1.02] transition-transform duration-300"
              sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 220px"
              onError={(e) =>
                ((e.target as HTMLImageElement).style.display = 'none')
              }
            />
          ) : (
            <span className="text-white text-2xl font-bold">
              {audiobook.title.charAt(0)}
            </span>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4 space-y-3 grow flex flex-col">
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

          <div className="mt-auto flex items-center justify-between">
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