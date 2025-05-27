// src/app/user/audiobooks/[id]/page.tsx
import { AudiobookDetailPage } from "./AudiobookDetailPage"
import { notFound } from 'next/navigation'

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
  audioUrl: string | null
  totalTime: number | null
  author: Author
  categories: Category[]
  _count: {
    listeningProgress: number
    bookmarks: number
  }
  createdAt: string
  updatedAt: string
}

const fetchAudiobook = async (id: string): Promise<Audiobook | null> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'
    const res = await fetch(`${baseUrl}/api/audiobooks/${id}`, {
      cache: 'no-store' // Ensure fresh data
    })
    
    if (!res.ok) {
      if (res.status === 404) return null
      throw new Error('Failed to fetch audiobook')
    }
    
    // The API returns the audiobook directly, not wrapped in an object
    const audiobook: Audiobook = await res.json()
    return audiobook
  } catch (error) {
    console.error('Failed to fetch audiobook:', error)
    return null
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  const audiobook = await fetchAudiobook(params.id)
  
  if (!audiobook) {
    notFound()
  }
  
  return <AudiobookDetailPage audiobook={audiobook} />
}