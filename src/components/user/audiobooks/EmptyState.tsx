// src/app/user/audiobooks/components/EmptyState.tsx
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  clearFilters: () => void
}

export function EmptyState({ clearFilters }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
        <Search className="h-12 w-12 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
        No audiobooks found
      </h3>
      <p className="text-slate-600 dark:text-slate-400 mb-4">
        Try adjusting your filters or browse all audiobooks
      </p>
      <Button onClick={clearFilters} variant="outline">
        Clear Filters
      </Button>
    </div>
  )
}