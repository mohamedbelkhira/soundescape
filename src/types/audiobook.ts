import { Audiobook, Chapter, ListeningProgress, Bookmark } from "@prisma/client"

// Extended types with relations
export interface AudiobookWithChapters extends Audiobook {
  chapters: Chapter[]
  _count?: {
    chapters: number
  }
}

export interface AudiobookWithProgress extends Audiobook {
  chapters: Chapter[]
  listeningProgress?: ListeningProgress[]
}

export interface ChapterWithProgress extends Chapter {
  listeningProgress?: ListeningProgress[]
  bookmarks?: Bookmark[]
}

// Player state types
export interface PlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  playbackRate: number
  currentChapter?: Chapter
  currentAudiobook?: Audiobook
}

// Progress tracking types
export interface ProgressUpdate {
  audiobookId: string
  chapterId: string
  position: number
  completed?: boolean
}

export interface BookmarkCreate {
  chapterId: string
  position: number
  title: string
  note?: string
}