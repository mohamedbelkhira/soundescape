// src/app/user/audiobooks/AudiobooksPage.tsx
"use client"

import { useState, useEffect, useRef } from 'react'
import { SearchFilters } from '@/components/user/audiobooks/SearchFilters'
import { AudiobookGrid } from '@/components/user/audiobooks/AudiobookGrid'
import { Pagination } from '@/components/user/audiobooks/Pagination'
import { EmptyState } from '@/components/user/audiobooks/EmptyState'

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

// Client-side fetch function
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

export function AudiobooksPage({ initialData }: AudiobooksPageProps) {
  const [audiobooks, setAudiobooks] = useState<Audiobook[]>(initialData.audiobooks)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(initialData.pagination.page)
  const [totalPages, setTotalPages] = useState(initialData.pagination.totalPages)
  const [selectedAuthor, setSelectedAuthor] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  
  // Track if this is the initial mount to prevent unnecessary API calls
  const isInitialMount = useRef(true)
  // Track if we have completed at least one fetch (initial or user-triggered)
  const hasFetched = useRef(false)

  const handleFetchAudiobooks = async (page = 1, search = '', authorId = '', categoryId = '') => {
    try {
      setLoading(true)
      const data = await fetchAudiobooks(page, search, authorId, categoryId)
      setAudiobooks(data.audiobooks)
      setTotalPages(data.pagination.totalPages)
      setCurrentPage(data.pagination.page)
      hasFetched.current = true
    } catch (err) {
      console.error('Failed to fetch audiobooks:', err)
      hasFetched.current = true
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // If we have initial data from server, mark as fetched
    if (isInitialMount.current && initialData.audiobooks.length > 0) {
      hasFetched.current = true
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

  const hasFilters = searchQuery || selectedAuthor || selectedCategory

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Audio Library
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Discover and listen to amazing audiobooks
            </p>
          </div>
        </div>

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

      {/* Content */}
      {loading ? (
        <AudiobookGrid loading={true} audiobooks={[]} />
      ) : audiobooks.length === 0 && hasFetched.current ? (
        <EmptyState clearFilters={clearFilters} />
      ) : (
        <>
          <AudiobookGrid loading={false} audiobooks={audiobooks} />
          
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  )
}