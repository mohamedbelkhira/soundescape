import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, AlertCircle } from 'lucide-react'

interface AudiobookErrorStateProps {
  error: string;
}

export const AudiobookErrorState = ({ error }: AudiobookErrorStateProps) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/user/audiobooks" legacyBehavior>
            <a>
                <Button variant="outline" size="sm" className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/80">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Library
                </Button>
            </a>
        </Link>
      </div>

      <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-red-200 dark:border-red-800">
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Audiobook Display Error
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {error || "There was a problem displaying the audiobook details."}
          </p>
          <Link href="/user/audiobooks" legacyBehavior>
            <a>
                <Button>Return to Library</Button>
            </a>
          </Link>
        </CardContent>
      </Card>
    </div>
  </div>
)