// src/app/admin/audiobooks/[id]/edit/page.tsx
import React from 'react'
import { AudiobookService } from '@/services/audiobook.service'
import { notFound } from 'next/navigation'
import UpdateAudiobookPage from './UpdateAudiobookPage'

interface PageProps {
  params: {
    id: string
  }
}

export default async function page({ params }: PageProps) {
  try {
    // Fetch the audiobook data
    const audiobook = await AudiobookService.getById(params.id)
    
    if (!audiobook) {
      notFound()
    }

    return (
      <div className="h-full">
        <UpdateAudiobookPage audiobook={audiobook} />
      </div>
    )
  } catch (error) {
    console.error('Failed to fetch audiobook:', error)
    notFound()
  }
}