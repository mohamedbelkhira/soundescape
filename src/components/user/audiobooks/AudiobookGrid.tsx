// src/app/user/audiobooks/components/AudiobookGrid.tsx
import { AudiobookCard } from "./AudiobookCard"
import { Card, CardContent } from '@/components/ui/card'

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

interface AudiobookGridProps {
  loading: boolean
  audiobooks: Audiobook[]
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <Card key={i} className="overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
          <div className="aspect-[3/4] bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <CardContent className="p-4 space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4 animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function AudiobookGrid({ loading, audiobooks }: AudiobookGridProps) {
  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {audiobooks.map((audiobook) => (
        <AudiobookCard key={audiobook.id} audiobook={audiobook} />
      ))}
    </div>
  )
}