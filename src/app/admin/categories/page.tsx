import React from 'react'
import { CategoryService } from '@/services/category.service'
import CategoriesPage from './categoriesPage'

interface PageProps {
  searchParams: {
    search?: string
    page?: string
  }
}

export default async function page({ searchParams }: PageProps) {
  const pageNum = searchParams.page ? parseInt(searchParams.page, 10) : 1
  const search = searchParams.search ?? undefined
  const limit = 10
  const offset = (pageNum - 1) * limit

  // Fetch initial data on the server
  const { categories, total } = await CategoryService.getAll({ search, limit, offset })
  const totalPages = Math.ceil(total / limit)

  const initialData = {
    categories,
    pagination: {
      page: pageNum,
      limit,
      total,
      totalPages,
    },
  }

  return (
    <div className="h-full space-y-6">
      <CategoriesPage initialData={initialData} />
    </div>
  )
}