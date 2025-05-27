'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Search } from 'lucide-react'
import AddCategoryDialog from '@/components/admin/categories/AddCategoryDialog'
// import AddButton from '@/components/common/add-button'
import CategoriesTable from '@/components/admin/categories/categories-table'
import CustomPagination from '@/components/common/custom-pagination'
import { toast } from 'sonner'
import { useDebounce } from '@/hooks/use-debounce'
import type { CategoryWithCount } from '@/services/category.service'

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface CategoriesData {
  categories: CategoryWithCount[]
  pagination: Pagination
}

interface CategoriesPageProps {
  initialData: CategoriesData
}

export default function CategoriesPage({ initialData }: CategoriesPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [data, setData] = useState<CategoriesData>(initialData)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [currentPage, setCurrentPage] = useState(initialData.pagination.page)

  const debouncedSearch = useDebounce(search, 500)

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: initialData.pagination.limit.toString(),
      })
      if (debouncedSearch) params.set('search', debouncedSearch)

      const res = await fetch(`/api/categories?${params}`)
      if (!res.ok) throw new Error('Failed to fetch categories')

      const result: CategoriesData = await res.json()
      setData(result)
    } catch (err) {
      toast.error('Failed to fetch categories')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [currentPage, debouncedSearch])

  useEffect(() => {
    const params = new URLSearchParams()
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (currentPage > 1) params.set('page', currentPage.toString())

    const base = '/admin/categories'
    const url = params.toString() ? `${base}?${params}` : base
    router.replace(url, { scroll: false })
  }, [currentPage, debouncedSearch, router])

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="space-y-6">
      {/* Header + Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">
            Manage audiobook categories and organization
          </p>
        </div>
        <AddCategoryDialog onSuccess={fetchCategories} />
      </div>

      {/* Stats Cards */}
      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.pagination.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Categories with Audiobooks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.categories.filter(c => c._count.audiobooks > 0).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Empty Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.categories.filter(c => c._count.audiobooks === 0).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.categories.reduce((sum, c) => sum + c._count.audiobooks, 0)}
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* Search Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={search}
              onChange={e => handleSearchChange(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table + Pagination */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-12 text-muted-foreground">
              Loading categories...
            </div>
          ) : data.categories.length ? (
            <>
              <CategoriesTable categories={data.categories} onUpdate={fetchCategories} />
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
              No categories found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}