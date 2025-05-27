// src/app/user/audiobooks/components/SearchFilters.tsx
import { Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Author {
  id: string
  name: string
}

interface SearchFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedAuthor: string
  setSelectedAuthor: (authorId: string) => void
  selectedCategory: string
  setSelectedCategory: (categoryId: string) => void
  authors: Author[]
  categories: Array<{ id: string; title: string }>
  hasFilters: boolean
  clearFilters: () => void
}


export function SearchFilters({
  searchQuery,
  setSearchQuery,
  selectedAuthor,
  setSelectedAuthor,
  selectedCategory,
  setSelectedCategory,
  authors,
  categories,
  hasFilters,
  clearFilters
}: SearchFiltersProps) {
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
        <Input
          placeholder="Search audiobooks…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      
      <div className="flex gap-2 flex-wrap">
        <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
          <SelectTrigger className="w-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
            <SelectValue placeholder="All Authors" />
          </SelectTrigger>
          <SelectContent>
            {authors.map((author) => (
              <SelectItem key={author.id} value={author.id}>
                {author.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {hasFilters && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <Filter className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}