// src/app/user/favorites/page.tsx
import { AudiobooksPage } from "../audiobooks/AudiobooksPage"
import { headers } from 'next/headers'    
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

interface AuthorsResponse {
  authors: Author[]
}

interface CategoriesResponse {
  categories: { id: string; title: string }[]
}

// API functions - these will run on the server
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

  // Use full URL for server-side fetching
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL 
  console.log("baseUrl:", baseUrl)
  const res = await fetch(`${baseUrl}/api/favorites?${params}`,{ headers: headers()},   )
  console.log("res:", res)
  if (!res.ok) throw new Error('Failed to fetch audiobooks', { cause: res.statusText })
  return res.json()
}

const fetchAuthors = async (): Promise<Author[]> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL 
    const res = await fetch(`${baseUrl}/api/authors`)
    if (!res.ok) return []
    const data: AuthorsResponse = await res.json()
    return data.authors || []
  } catch (err) {
    console.error('Failed to fetch authors:', err)
    return []
  }
}

const fetchCategories = async (): Promise<Array<{ id: string; title: string }>> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'
    const res = await fetch(`${baseUrl}/api/categories`)
    if (!res.ok) return []
    const data: CategoriesResponse = await res.json()
    return data.categories || []
  } catch (err) {
    console.error('Failed to fetch categories:', err)
    return []
  }
}

export default async function Page() {
  // Fetch initial data server-side
  const [initialAudiobooks, authors, categories] = await Promise.all([
    fetchAudiobooks(),
    fetchAuthors(),
    fetchCategories()
  ])

  console.log('authors:', authors)  
  console.log('categories:', categories)
  console.log('initialAudiobooks:', initialAudiobooks)
  return (
    <AudiobooksPage
      title="favorites audiobooks"
      description="Browse our entire collection of audiobooks"
      initialData={{
        audiobooks: initialAudiobooks.audiobooks,
        pagination: initialAudiobooks.pagination,
        authors,
        categories
      }}
    />
  )
}