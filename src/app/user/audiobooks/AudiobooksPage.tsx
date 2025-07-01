// src/app/user/audiobooks/AudiobooksPage.tsx
'use client'

import { useState, useMemo } from 'react'
import { SearchFilters } from '@/components/user/audiobooks/SearchFilters'
import { AudiobookGrid } from '@/components/user/audiobooks/AudiobookGrid'
import { Pagination } from '@/components/user/audiobooks/Pagination'
import { EmptyState } from '@/components/user/audiobooks/EmptyState'
import { Filter, X } from 'lucide-react'

/* ──────────── Types ──────────────────────────────────────────────────── */
interface Author {
  id: string
  name: string
}

interface CategoryRef {
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
  categories: CategoryRef[]
  _count: { listeningProgress: number; bookmarks: number }
}

interface AudiobooksPageProps {
  initialData: {
    audiobooks: Audiobook[]
    pagination: { page: number; limit: number; total: number; totalPages: number }
    authors: Author[]
    categories: Array<{ id: string; title: string }>
  }
  title?: string
  description?: string
}

const ITEMS_PER_PAGE = 12

/* ──────────── Helper Functions ──────────────────────────────────────── */
const filterAudiobooks = (
  audiobooks: Audiobook[],
  searchQuery: string,
  selectedAuthor: string,
  selectedCategory: string
): Audiobook[] => {
  return audiobooks.filter(book => {
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      const matchesTitle = book.title.toLowerCase().includes(searchLower)
      const matchesAuthor = book.author.name.toLowerCase().includes(searchLower)
      const matchesDescription = book.description?.toLowerCase().includes(searchLower)
      
      if (!matchesTitle && !matchesAuthor && !matchesDescription) {
        return false
      }
    }

    // Author filter
    if (selectedAuthor && book.author.id !== selectedAuthor) {
      return false
    }

    // Category filter
    if (selectedCategory) {
      const hasCategory = book.categories.some(
        catRef => catRef.category.id === selectedCategory
      )
      if (!hasCategory) {
        return false
      }
    }

    return true
  })
}

const paginateResults = (items: Audiobook[], page: number, limit: number) => {
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedItems = items.slice(startIndex, endIndex)
  const totalPages = Math.ceil(items.length / limit)
  
  return {
    items: paginatedItems,
    totalPages,
    total: items.length
  }
}

const ActiveFilters = ({
  searchQuery,
  selectedAuthor,
  selectedCategory,
  authors,
  categories,
  clearFilters,
  clearSearch,
  clearAuthor,
  clearCategory,
}: {
  searchQuery: string
  selectedAuthor: string
  selectedCategory: string
  authors: Author[]
  categories: Array<{ id: string; title: string }>
  clearFilters: () => void
  clearSearch: () => void
  clearAuthor: () => void
  clearCategory: () => void
}) => {
  const hasActive = searchQuery || selectedAuthor || selectedCategory
  if (!hasActive) return null

  const authorName = (id: string) => authors.find(a => a.id === id)?.name || id
  const categoryName = (id: string) =>
    categories.find(c => c.id === id)?.title || id

  return (
    <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Active Filters</span>
        </div>
        <button
          onClick={clearFilters}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm font-medium hover:underline transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {searchQuery && (
          <Chip label={`Search: "${searchQuery}"`} onClear={clearSearch} />
        )}
        {selectedAuthor && (
          <Chip label={`Author: ${authorName(selectedAuthor)}`} onClear={clearAuthor} />
        )}
        {selectedCategory && (
          <Chip
            label={`Category: ${categoryName(selectedCategory)}`}
            onClear={clearCategory}
          />
        )}
      </div>
    </div>
  )
}

/* Tiny reusable chip component */
const Chip = ({ label, onClear }: { label: string; onClear: () => void }) => (
  <div className="inline-flex items-center gap-1 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-full px-3 py-1 text-sm">
    <span className="font-medium text-gray-900 dark:text-gray-100">{label}</span>
    <button
      onClick={onClear}
      className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
    >
      <X className="h-3 w-3" />
    </button>
  </div>
)

/* ──────────── Main Component ─────────────────────────────────────────── */
export function AudiobooksPage({
  initialData,
  title,
  description,
}: AudiobooksPageProps) {
  /* ----- Local state --------------------------------------------------- */
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedAuthor, setSelectedAuthor] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  /* ----- Computed values ----------------------------------------------- */
  const filteredAudiobooks = useMemo(() => {
    return filterAudiobooks(
      initialData.audiobooks,
      searchQuery,
      selectedAuthor,
      selectedCategory
    )
  }, [initialData.audiobooks, searchQuery, selectedAuthor, selectedCategory])

  const paginatedResults = useMemo(() => {
    return paginateResults(filteredAudiobooks, currentPage, ITEMS_PER_PAGE)
  }, [filteredAudiobooks, currentPage])

  /* ----- Event handlers ------------------------------------------------ */
  const clearFilters = () => {
    setSearchQuery('')
    setSelectedAuthor('')
    setSelectedCategory('')
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Reset to page 1 when filters change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleAuthorChange = (authorId: string) => {
    setSelectedAuthor(authorId)
    setCurrentPage(1)
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setCurrentPage(1)
  }

  /* ----- Render -------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        <div className="space-y-8">
          {/* Search & Filters Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6 transition-colors duration-200">
            {title && (
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
                  {title}
                </h1>
                {description && (
                  <p className="mt-1 text-gray-600 dark:text-gray-400">{description}</p>
                )}
              </div>
            )}

            <SearchFilters
              searchQuery={searchQuery}
              setSearchQuery={handleSearchChange}
              selectedAuthor={selectedAuthor}
              setSelectedAuthor={handleAuthorChange}
              selectedCategory={selectedCategory}
              setSelectedCategory={handleCategoryChange}
              authors={initialData.authors}
              categories={initialData.categories}
              hasFilters={!!(searchQuery || selectedAuthor || selectedCategory)}
              clearFilters={clearFilters}
            />
          </div>

          {/* Active filters chips */}
          <ActiveFilters
            searchQuery={searchQuery}
            selectedAuthor={selectedAuthor}
            selectedCategory={selectedCategory}
            authors={initialData.authors}
            categories={initialData.categories}
            clearFilters={clearFilters}
            clearSearch={() => handleSearchChange('')}
            clearAuthor={() => handleAuthorChange('')}
            clearCategory={() => handleCategoryChange('')}
          />

          {/* Results section */}
          <ResultsSection
            audiobooks={paginatedResults.items}
            totalPages={paginatedResults.totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            hasNoResults={filteredAudiobooks.length === 0}
            clearFilters={clearFilters}
          />
        </div>
      </div>
    </div>
  )
}

/* ──────────── Results Section Component ──────────────────────────────── */
const ResultsSection = ({
  audiobooks,
  totalPages,
  currentPage,
  onPageChange,
  hasNoResults,
  clearFilters,
}: {
  audiobooks: Audiobook[]
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
  hasNoResults: boolean
  clearFilters: () => void
}) => {
  if (hasNoResults) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <EmptyState clearFilters={clearFilters} />
      </div>
    )
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
        <AudiobookGrid loading={false} audiobooks={audiobooks} />
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-colors duration-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      )}
    </>
  )
}