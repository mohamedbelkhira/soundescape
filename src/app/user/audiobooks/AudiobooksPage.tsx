// src/app/user/audiobooks/AudiobooksPage.tsx
"use client"

import { useState, useEffect, useRef } from 'react'
import { SearchFilters } from '@/components/user/audiobooks/SearchFilters'
import { AudiobookGrid } from '@/components/user/audiobooks/AudiobookGrid'
import { Pagination } from '@/components/user/audiobooks/Pagination'
import { EmptyState } from '@/components/user/audiobooks/EmptyState'
import { Loader2, Filter, X } from 'lucide-react'

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

interface AudiobooksResponse {
  audiobooks: Audiobook[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface AudiobooksPageProps {
  initialData: {
    audiobooks: Audiobook[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
    authors: Author[]
    categories: Array<{ id: string; title: string }>
  }
}


const fetchAudiobooks = async (
  page = 1,
  search = '',
  authorId = '',
  categoryId = ''
): Promise<AudiobooksResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: '12',
    isPublished: 'true',
    ...(search && { search }),
    ...(authorId && { authorId }),
    ...(categoryId && { categoryId })
  })

  const res = await fetch(`/api/audiobooks?${params}`)
  if (!res.ok) throw new Error('Failed to fetch audiobooks')
  return res.json()
}


const AudiobookGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
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
  clearCategory
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
  const hasActiveFilters = searchQuery || selectedAuthor || selectedCategory

  if (!hasActiveFilters) return null

  const getAuthorName = (id: string) => authors.find(a => a.id === id)?.name || id
  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.title || id

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
          <div className="inline-flex items-center gap-1 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-full px-3 py-1 text-sm">
            <span className="text-gray-600 dark:text-gray-300">Search:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">&quot;{searchQuery}&quot;</span>
            <button onClick={clearSearch} className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
        
        {selectedAuthor && (
          <div className="inline-flex items-center gap-1 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-full px-3 py-1 text-sm">
            <span className="text-gray-600 dark:text-gray-300">Author:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{getAuthorName(selectedAuthor)}</span>
            <button onClick={clearAuthor} className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
        
        {selectedCategory && (
          <div className="inline-flex items-center gap-1 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-full px-3 py-1 text-sm">
            <span className="text-gray-600 dark:text-gray-300">Category:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{getCategoryName(selectedCategory)}</span>
            <button onClick={clearCategory} className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export function AudiobooksPage({ initialData }: AudiobooksPageProps) {
  const [audiobooks, setAudiobooks] = useState<Audiobook[]>(initialData.audiobooks)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(initialData.pagination.page)
  const [totalPages, setTotalPages] = useState(initialData.pagination.totalPages)
  const [totalItems, setTotalItems] = useState(initialData.pagination.total)
  const [selectedAuthor, setSelectedAuthor] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  
  // Track if this is the initial mount to prevent unnecessary API calls
  const isInitialMount = useRef(true)
  // Track if we have completed at least one fetch (initial or user-triggered)
  const hasFetched = useRef(false)

  const handleFetchAudiobooks = async (page = 1, search = '', authorId = '', categoryId = '') => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchAudiobooks(page, search, authorId, categoryId)
      setAudiobooks(data.audiobooks)
      setTotalPages(data.pagination.totalPages)
      setCurrentPage(data.pagination.page)
      setTotalItems(data.pagination.total)
      hasFetched.current = true
    } catch (err) {
      console.error('Failed to fetch audiobooks:', err)
      setError('Failed to load audiobooks. Please try again.')
      hasFetched.current = true
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // If we have initial data from server, mark as fetched
    if (isInitialMount.current && initialData.audiobooks.length > 0) {
      hasFetched.current = true
      setTotalItems(initialData.pagination.total)
    }

    // Skip the effect on initial mount since we already have server-side data
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    const id = setTimeout(() => {
      handleFetchAudiobooks(1, searchQuery, selectedAuthor, selectedCategory)
    }, 300)
    return () => clearTimeout(id)
  }, [searchQuery, selectedAuthor, selectedCategory])

  const handlePageChange = (page: number) => {
    handleFetchAudiobooks(page, searchQuery, selectedAuthor, selectedCategory)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedAuthor('')
    setSelectedCategory('')
  }

  const clearSearch = () => setSearchQuery('')
  const clearAuthor = () => setSelectedAuthor('')
  const clearCategory = () => setSelectedCategory('')

  const hasFilters = searchQuery || selectedAuthor || selectedCategory

  // Error state
  if (error && !loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
            <div className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">
              Something went wrong
            </div>
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={() => handleFetchAudiobooks(1, searchQuery, selectedAuthor, selectedCategory)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
              </div>
              
              {/* Results count */}
              {hasFetched.current && (
                <div className="hidden sm:block text-sm text-gray-600 dark:text-gray-400">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <span>
                      {totalItems === 0 
                        ? 'No audiobooks found' 
                        : `${totalItems.toLocaleString()} audiobook${totalItems === 1 ? '' : 's'} found`
                      }
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Search and Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
              <SearchFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedAuthor={selectedAuthor}
                setSelectedAuthor={setSelectedAuthor}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                authors={initialData.authors}
                categories={initialData.categories}
                hasFilters={hasFilters}
                clearFilters={clearFilters}
              />
            </div>

            {/* Active Filters */}
            <ActiveFilters
              searchQuery={searchQuery}
              selectedAuthor={selectedAuthor}
              selectedCategory={selectedCategory}
              authors={initialData.authors}
              categories={initialData.categories}
              clearFilters={clearFilters}
              clearSearch={clearSearch}
              clearAuthor={clearAuthor}
              clearCategory={clearCategory}
            />
          </div>

          {/* Content */}
          <div className="space-y-8">
            {loading ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center py-4">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading audiobooks...</span>
                  </div>
                </div>
                <AudiobookGridSkeleton />
              </div>
            ) : audiobooks.length === 0 && hasFetched.current ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                <EmptyState clearFilters={clearFilters} />
              </div>
            ) : (
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
                        onPageChange={handlePageChange}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}