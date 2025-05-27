// src/app/user/audiobooks/[id]/not-found.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Audiobook Not Found
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              The audiobook you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
          </div>
          
          <div className="space-y-3">
            <Link href="/user/audiobooks">
              <Button className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Audio Library
              </Button>
            </Link>
            
           
          </div>
        </CardContent>
      </Card>
    </div>
  )
}