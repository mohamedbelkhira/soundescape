// src/app/admin/audiobooks/page.tsx
import React from 'react'
import { AudiobookService } from '@/services/audiobook.service'
import AudiobooksPage from './audiobooksPage'

interface PageProps {
  searchParams: {
    search?: string
    page?: string
    authorId?: string
    categoryId?: string
    isPublished?: string
  }
}

export default async function page({ searchParams }: PageProps) {
  const pageNum = searchParams.page ? parseInt(searchParams.page, 10) : 1
  const search = searchParams.search ?? undefined
  const authorId = searchParams.authorId ?? undefined
  const categoryId = searchParams.categoryId ?? undefined
  const isPublished = searchParams.isPublished === 'true' ? true : 
                     searchParams.isPublished === 'false' ? false : undefined
  const limit = 10
  const offset = (pageNum - 1) * limit

  // Fetch initial data on the server
  const { audiobooks, total } = await AudiobookService.getAll({ 
    search, 
    authorId, 
    categoryId, 
    isPublished, 
    limit, 
    offset 
  })
  
  const totalPages = Math.ceil(total / limit)

  const initialData = {
    audiobooks,
    pagination: {
      page: pageNum,
      limit,
      total,
      totalPages,
    },
  }

  return (
    <div className="h-full space-y-6">
      <AudiobooksPage initialData={initialData} />
    </div>
  )
}