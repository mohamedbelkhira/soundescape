import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

export const AudiobookLoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/user/audiobooks" legacyBehavior>
            <a>
                <Button variant="outline" size="sm" className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/80">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Library
                </Button>
            </a>
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          {/* Cover skeleton */}
          <Card className="overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="aspect-square bg-slate-200 dark:bg-slate-700 animate-pulse" />
            </CardContent>
          </Card>
          
          {/* Controls skeleton */}
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardContent className="p-6 space-y-6">
              <div className="h-2 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Title skeleton */}
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardContent className="p-8 space-y-4">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-3/4" />
              <div className="h-6 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-1/2" />
              <div className="flex gap-2">
                <div className="h-6 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-16" />
                <div className="h-6 bg-slate-200 dark:bg-slate-700 animate-pulse rounded w-20" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
)