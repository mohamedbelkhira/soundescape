import { z } from "zod"

// Auth schemas
export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})
export const serverSignUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
})

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

// Audiobook schemas
export const audiobookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  description: z.string().optional(),
  isPublished: z.boolean().default(false)
})

export const chapterSchema = z.object({
  title: z.string().min(1, "Chapter title is required"),
  order: z.number().min(1, "Chapter order must be at least 1"),
  audiobookId: z.string().min(1, "Audiobook ID is required")
})

export const bookmarkSchema = z.object({
  chapterId: z.string().min(1, "Chapter ID is required"),
  position: z.number().min(0, "Position must be positive"),
  title: z.string().min(1, "Bookmark title is required"),
  note: z.string().optional()
})

export const progressSchema = z.object({
  audiobookId: z.string().min(1, "Audiobook ID is required"),
  chapterId: z.string().min(1, "Chapter ID is required"),
  position: z.number().min(0, "Position must be positive"),
  completed: z.boolean().default(false)
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type ServerSignUpInput = z.infer<typeof serverSignUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type AudiobookInput = z.infer<typeof audiobookSchema>
export type ChapterInput = z.infer<typeof chapterSchema>
export type BookmarkInput = z.infer<typeof bookmarkSchema>
export type ProgressInput = z.infer<typeof progressSchema>