import { AudiobooksPage } from "../audiobooks/AudiobooksPage"
export const dynamic = 'force-dynamic'
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001"

// ———————————————————————————————————————————————————————————
// Helper fetchers (run on the server)
// ———————————————————————————————————————————————————————————
const fetchAudiobooks = async (page = 1) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: "12",
    view: "trending",         
  })

  const res = await fetch(`${BASE_URL}/api/audiobooks?${params}`, {
    next: { revalidate: 300 },
  })
  if (!res.ok) throw new Error("Failed to fetch latest audiobooks")
  return res.json()
}

const fetchAuthors     = async () => fetch(`${BASE_URL}/api/authors`).then(r => r.ok ? r.json() : { authors: [] })
const fetchCategories  = async () => fetch(`${BASE_URL}/api/categories`).then(r => r.ok ? r.json() : { categories: [] })

export default async function Page() {
  const [{ audiobooks, pagination }, { authors }, { categories }] = await Promise.all([
    fetchAudiobooks().catch(() => ({ audiobooks: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 0 } })),
    fetchAuthors(),
    fetchCategories(),
  ])

  return (
    <AudiobooksPage
    title="Trending Hits"
    description="The audiobooks everyone is talking about right now — ranked by plays, views and favorites. Dive in and see what’s hot!"
      initialData={{ audiobooks, pagination, authors, categories }}
    />
  )
}