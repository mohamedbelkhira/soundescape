import { Card, CardContent } from '@/components/ui/card'

interface AudiobookDescriptionProps {
  description: string | null
}

export const AudiobookDescription = ({ description }: AudiobookDescriptionProps) => {
  if (!description) {
    return null; // Or render a placeholder like <p>No description available.</p>
  }

  return (
    <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-lg">
      <CardContent className="p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3 sm:mb-4">
          About this Audiobook
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base">
          {/* Using a div with whitespace-pre-wrap for better control over raw text formatting from DB */}
          <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
            {description}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}