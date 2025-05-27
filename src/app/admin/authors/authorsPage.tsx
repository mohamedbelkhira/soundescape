'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Users, UserCheck, UserX, BookOpen } from 'lucide-react'
import AddAuthorDialog from '@/components/admin/authors/AddAuthorDialog'
import AuthorsTable from '@/components/admin/authors/authors-table'
import CustomPagination from '@/components/common/custom-pagination'
import { toast } from 'sonner'
import { useDebounce } from '@/hooks/use-debounce'
import type { AuthorWithCount } from '@/services/author.service'

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface AuthorsData {
  authors: AuthorWithCount[]
  pagination: Pagination
}

interface AuthorsPageProps {
  initialData: AuthorsData
}

export default function AuthorsPage({ initialData }: AuthorsPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [data, setData] = useState<AuthorsData>(initialData)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [isActiveFilter, setIsActiveFilter] = useState<string>(searchParams.get('isActive') || 'all')
  const [currentPage, setCurrentPage] = useState(initialData.pagination.page)

  const debouncedSearch = useDebounce(search, 500)

  const fetchAuthors = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: initialData.pagination.limit.toString(),
      })
      if (debouncedSearch) params.set('search', debouncedSearch)
      if (isActiveFilter !== 'all') params.set('isActive', isActiveFilter)

      const res = await fetch(`/api/authors?${params}`)
      if (!res.ok) throw new Error('Failed to fetch authors')

      const result: AuthorsData = await res.json()
      setData(result)
    } catch (err) {
      toast.error('Failed to fetch authors')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAuthors()
  }, [currentPage, debouncedSearch, isActiveFilter])

  useEffect(() => {
    const params = new URLSearchParams()
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (currentPage > 1) params.set('page', currentPage.toString())
    if (isActiveFilter !== 'all') params.set('isActive', isActiveFilter)

    const base = '/admin/authors'
    const url = params.toString() ? `${base}?${params}` : base
    router.replace(url, { scroll: false })
  }, [currentPage, debouncedSearch, isActiveFilter, router])

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }

  const handleActiveFilterChange = (value: string) => {
    setIsActiveFilter(value)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Calculate stats
  // const totalAuthors = data.pagination.total
  // const activeAuthors = data.authors.filter(a => a.isActive).length
  // const inactiveAuthors = data.authors.filter(a => !a.isActive).length
  // const authorsWithBooks = data.authors.filter(a => a._count.audiobooks > 0).length
  // const totalAudiobooks = data.authors.reduce((sum, a) => sum + a._count.audiobooks, 0)

  return (
    <div className="space-y-6">
      {/* Header + Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Authors</h1>
          <p className="text-muted-foreground">
            Manage audiobook authors and their information
          </p>
        </div>
        {/* Uncomment when AddAuthorDialog is implemented */}
        <AddAuthorDialog onSuccess={fetchAuthors} />
      </div>

      {/* Stats Cards */}
      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Authors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAuthors}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Authors</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeAuthors}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Authors</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{inactiveAuthors}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Authors with Books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{authorsWithBooks}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Audiobooks</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAudiobooks}</div>
          </CardContent>
        </Card>
      </div> */}

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search authors..."
                value={search}
                onChange={e => handleSearchChange(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={isActiveFilter} onValueChange={handleActiveFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Authors</SelectItem>
                <SelectItem value="true">Active Only</SelectItem>
                <SelectItem value="false">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table + Pagination */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-12 text-muted-foreground">
              Loading authors...
            </div>
          ) : data.authors.length ? (
            <>
              <AuthorsTable authors={data.authors} onUpdate={fetchAuthors} />
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
              No authors found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}