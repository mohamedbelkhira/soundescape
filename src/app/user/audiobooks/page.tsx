// src/app/user/audiobooks/page.tsx
import { AudiobooksPage } from "./AudiobooksPage"

export const dynamic = 'force-dynamic'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

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

  const res = await fetch(`${BASE_URL}/api/audiobooks?${params}`, {
    next: { revalidate: 300 },
  })
  
  if (!res.ok) throw new Error('Failed to fetch audiobooks')
  return res.json()
}

const fetchAuthors = async (): Promise<AuthorsResponse> => {
  return fetch(`${BASE_URL}/api/authors`, {
    next: { revalidate: 300 },
  }).then(r => r.ok ? r.json() : { authors: [] })
}

const fetchCategories = async (): Promise<CategoriesResponse> => {
  return fetch(`${BASE_URL}/api/categories`, {
    next: { revalidate: 300 },
  }).then(r => r.ok ? r.json() : { categories: [] })
}

export default async function Page() {
  // Fetch initial data server-side
  const [initialAudiobooks, { authors }, { categories }] = await Promise.all([
    fetchAudiobooks().catch(() => ({
      audiobooks: [],
      pagination: { page: 1, limit: 12, total: 0, totalPages: 0 }
    })),
    fetchAuthors(),
    fetchCategories()
  ])

  console.log('authors:', authors)
  console.log('categories:', categories)
  console.log('initialAudiobooks:', initialAudiobooks)

  return (
    <AudiobooksPage
      title="All Audiobooks"
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