'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, BookOpen, Users, Eye, EyeOff } from 'lucide-react'
import AudiobooksTable from '@/components/admin/audiobooks/audiobooks-table'
import CustomPagination from '@/components/common/custom-pagination'
import { toast } from 'sonner'
import { useDebounce } from '@/hooks/use-debounce'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { AudiobookWithDetails } from '@/services/audiobook.service'
import AddButton from '@/components/common/add-button'


interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface AudiobooksData {
  audiobooks: AudiobookWithDetails[]
  pagination: Pagination
}

interface AudiobooksPageProps {
  initialData: AudiobooksData
}

export default function AudiobooksPage({ initialData }: AudiobooksPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [data, setData] = useState<AudiobooksData>(initialData)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [authorFilter, setAuthorFilter] = useState(searchParams.get('authorId') || '')
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('categoryId') || '')
  const [publishedFilter, setPublishedFilter] = useState(searchParams.get('isPublished') || '')
  const [currentPage, setCurrentPage] = useState(initialData.pagination.page)

  const debouncedSearch = useDebounce(search, 500)

  const fetchAudiobooks = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: initialData.pagination.limit.toString(),
      })
      if (debouncedSearch) params.set('search', debouncedSearch)
      if (authorFilter) params.set('authorId', authorFilter)
      if (categoryFilter) params.set('categoryId', categoryFilter)
      if (publishedFilter) params.set('isPublished', publishedFilter)

      const res = await fetch(`/api/audiobooks?${params}`)
      if (!res.ok) throw new Error('Failed to fetch audiobooks')

      const result: AudiobooksData = await res.json()
      setData(result)
    } catch (err) {
      toast.error('Failed to fetch audiobooks')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAudiobooks()
  }, [currentPage, debouncedSearch, authorFilter, categoryFilter, publishedFilter])

  useEffect(() => {
    const params = new URLSearchParams()
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (authorFilter) params.set('authorId', authorFilter)
    if (categoryFilter) params.set('categoryId', categoryFilter)
    if (publishedFilter) params.set('isPublished', publishedFilter)
    if (currentPage > 1) params.set('page', currentPage.toString())

    const base = '/admin/audiobooks'
    const url = params.toString() ? `${base}?${params}` : base
    router.replace(url, { scroll: false })
  }, [currentPage, debouncedSearch, authorFilter, categoryFilter, publishedFilter, router])

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }

  const handleAuthorFilterChange = (value: string) => {
    setAuthorFilter(value === 'all' ? '' : value)
    setCurrentPage(1)
  }

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value === 'all' ? '' : value)
    setCurrentPage(1)
  }

  const handlePublishedFilterChange = (value: string) => {
    setPublishedFilter(value === 'all' ? '' : value)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Calculate stats from current data
  const publishedCount = data.audiobooks.filter(a => a.isPublished).length
  const unpublishedCount = data.audiobooks.filter(a => !a.isPublished).length
//   const uniqueAuthors = new Set(data.audiobooks.map(a => a.author.id)).size
  const totalListeners = data.audiobooks.reduce((sum, a) => sum + a._count.listeningProgress, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Audiobooks</h1>
          <p className="text-muted-foreground">
            Manage your audiobook library and content
          </p>
        </div>
        <AddButton label="Add Audiobook" href='/admin/audiobooks/add' />
        {/* Add Audiobook Button would go here */}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Total Audiobooks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.pagination.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Published
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{publishedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <EyeOff className="h-4 w-4" />
              Unpublished
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{unpublishedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Listeners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalListeners}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search audiobooks..."
                value={search}
                onChange={e => handleSearchChange(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={publishedFilter || 'all'} onValueChange={handlePublishedFilterChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="true">Published</SelectItem>
                  <SelectItem value="false">Unpublished</SelectItem>
                </SelectContent>
              </Select>

              {/* Author and Category filters would need additional API calls to get options */}
              {/* For now, leaving them as placeholders */}
              <Select value={authorFilter || 'all'} onValueChange={handleAuthorFilterChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Author" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Authors</SelectItem>
                  {/* Would need to fetch authors list */}
                </SelectContent>
              </Select>

              <Select value={categoryFilter || 'all'} onValueChange={handleCategoryFilterChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {/* Would need to fetch categories list */}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table + Pagination */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-12 text-muted-foreground">
              Loading audiobooks...
            </div>
          ) : data.audiobooks.length ? (
            <>
              <AudiobooksTable audiobooks={data.audiobooks} onUpdate={fetchAudiobooks} />
              {data.pagination.totalPages > 1 && (
                <div className="mt-6">
                  <CustomPagination
                    currentPage={data.pagination.page}
                    totalPages={data.pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No audiobooks found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}