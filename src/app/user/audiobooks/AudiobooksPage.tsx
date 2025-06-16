// src/app/user/audiobooks/AudiobooksPage.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { SearchFilters } from '@/components/user/audiobooks/SearchFilters'
import { AudiobookGrid } from '@/components/user/audiobooks/AudiobookGrid'
import { Pagination } from '@/components/user/audiobooks/Pagination'
import { EmptyState } from '@/components/user/audiobooks/EmptyState'
import { Loader2, Filter, X } from 'lucide-react'

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

interface AudiobooksResponse {
  audiobooks: Audiobook[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
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

/* ──────────── Helpers ────────────────────────────────────────────────── */
const fetchAudiobooks = async (
  page = 1,
  search = '',
  authorId = '',
  categoryId = '',
): Promise<AudiobooksResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: '12',
    isPublished: 'true',
    ...(search && { search }),
    ...(authorId && { authorId }),
    ...(categoryId && { categoryId }),
  })

  const res = await fetch(`/api/audiobooks?${params}`)
  if (!res.ok) throw new Error('Failed to fetch audiobooks')
  return res.json()
}

const AudiobookGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 animate-pulse"
      >
        <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
)

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
          <Chip label={`Search: “${searchQuery}”`} onClear={clearSearch} />
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
  const [audiobooks, setAudiobooks] = useState(initialData.audiobooks)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(initialData.pagination.page)
  const [totalPages, setTotalPages] = useState(initialData.pagination.totalPages)
  const [totalItems, setTotalItems] = useState(initialData.pagination.total)
  const [selectedAuthor, setSelectedAuthor] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const isInitialMount = useRef(true)
  const hasFetched = useRef(false)

  /* ----- Fetch helper -------------------------------------------------- */
  const handleFetch = async (
    page = 1,
    search = '',
    authorId = '',
    categoryId = '',
  ) => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchAudiobooks(page, search, authorId, categoryId)
      setAudiobooks(data.audiobooks)
      setTotalPages(data.pagination.totalPages)
      setCurrentPage(data.pagination.page)
      setTotalItems(data.pagination.total)
      hasFetched.current = true
    } catch {
      setError('Failed to load audiobooks. Please try again.')
      hasFetched.current = true
    } finally {
      setLoading(false)
    }
  }

  /* ----- Debounced refetch on filter change --------------------------- */
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    const id = setTimeout(
      () => handleFetch(1, searchQuery, selectedAuthor, selectedCategory),
      300,
    )
    return () => clearTimeout(id)
  }, [searchQuery, selectedAuthor, selectedCategory])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedAuthor('')
    setSelectedCategory('')
  }

  /* ----- Error state --------------------------------------------------- */
  if (error && !loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <ErrorCard message={error} retry={() => handleFetch()} />
      </div>
    )
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
              setSearchQuery={setSearchQuery}
              selectedAuthor={selectedAuthor}
              setSelectedAuthor={setSelectedAuthor}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
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
            clearSearch={() => setSearchQuery('')}
            clearAuthor={() => setSelectedAuthor('')}
            clearCategory={() => setSelectedCategory('')}
          />

          {/* Results grid / skeleton / empty -- same logic you had ---------- */}
          <ResultsSection
            loading={loading}
            audiobooks={audiobooks}
            hasFetched={hasFetched.current}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={page =>
              handleFetch(page, searchQuery, selectedAuthor, selectedCategory)
            }
          />
        </div>
      </div>
    </div>
  )
}

/* ──────────── Small sub-components to keep render tidy ───────────────── */

const ErrorCard = ({ message, retry }: { message: string; retry: () => void }) => (
  <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md text-center">
    <div className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">
      Something went wrong
    </div>
    <p className="text-red-600 dark:text-red-400 mb-4">{message}</p>
    <button
      onClick={retry}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
    >
      Try Again
    </button>
  </div>
)

const ResultsSection = ({
  loading,
  audiobooks,
  hasFetched,
  totalPages,
  currentPage,
  onPageChange,
}: {
  loading: boolean
  audiobooks: Audiobook[]
  hasFetched: boolean
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-4 text-gray-600 dark:text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Loading audiobooks…
        </div>
        <AudiobookGridSkeleton />
      </div>
    )
  }

  if (audiobooks.length === 0 && hasFetched) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <EmptyState clearFilters={() => {}} />
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
