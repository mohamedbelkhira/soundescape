import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Clock, Calendar, Tag } from 'lucide-react'
import { formatDuration, formatDistanceToNow } from '@/lib/formatters'

// Define the structure for Author and Category locally if not importing a global Audiobook type
interface Author {
  id: string;
  name: string;
}

interface CategoryItem {
  category: {
    id: string;
    title: string;
  };
}

interface AudiobookInfoProps {
  // Select only the fields needed from the main Audiobook type
  audiobook: {
    title: string;
    author: Author;
    totalTime: number | null;
    createdAt: string; // Assuming string from API, Date object if transformed
    categories: CategoryItem[];
  };
}

export const AudiobookInfo = ({ audiobook }: AudiobookInfoProps) => {
  return (
    <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-lg">
      <CardContent className="p-6 sm:p-8">
        <div className="space-y-4 sm:space-y-6">
          {/* Title and Author */}
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2 sm:mb-3 leading-tight">
              {audiobook.title}
            </h1>
            <div className="flex items-center gap-2 text-md sm:text-lg md:text-xl text-slate-600 dark:text-slate-400">
              <User className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>by {audiobook.author.name}</span>
            </div>
          </div>

          {/* Metadata Badges */}
          <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {audiobook.totalTime !== null && audiobook.totalTime > 0 && (
              <Badge variant="outline" className="border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
                <span className="font-medium">{formatDuration(audiobook.totalTime)}</span>
              </Badge>
            )}
            
            <Badge variant="outline" className="border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
              <span>Added {formatDistanceToNow(audiobook.createdAt)}</span>
            </Badge>
          </div>

          {/* Categories */}
          {audiobook.categories.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Categories:</h3>
              <div className="flex flex-wrap gap-2">
                {audiobook.categories.map((cat) => (
                  <Badge
                    key={cat.category.id}
                    variant="secondary" // Uses your theme's secondary badge style
                    className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700/50 px-2.5 py-1 text-xs sm:text-sm"
                  >
                    <Tag className="h-3 w-3 mr-1 sm:mr-1.5" />
                    {cat.category.title}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}