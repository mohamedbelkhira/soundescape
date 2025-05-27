// src/app/admin/authors/page.tsx
import React from 'react'
import { AuthorService } from '@/services/author.service'
import AuthorsPage from './authorsPage'

interface PageProps {
  searchParams: {
    search?: string
    page?: string
    isActive?: string
  }
}

export default async function page({ searchParams }: PageProps) {
  const pageNum = searchParams.page ? parseInt(searchParams.page, 10) : 1
  const search = searchParams.search ?? undefined
  const limit = 10
  const offset = (pageNum - 1) * limit
  
  // Parse isActive filter
  let isActiveFilter: boolean | undefined
  if (searchParams.isActive === 'true') isActiveFilter = true
  else if (searchParams.isActive === 'false') isActiveFilter = false

  // Fetch initial data on the server
  const { authors, total } = await AuthorService.getAll({ 
    search, 
    isActive: isActiveFilter,
    limit, 
    offset 
  })
  
  const totalPages = Math.ceil(total / limit)
  
  const initialData = {
    authors,
    pagination: {
      page: pageNum,
      limit,
      total,
      totalPages,
    },
  }

  return (
    <div className="h-full space-y-6">
      <AuthorsPage initialData={initialData} />
    </div>
  )
}