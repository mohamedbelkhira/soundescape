import { z } from 'zod';
export const audiobookFormSchema = z.object({
  title: z.string().min(1),
  description: z.string().max(500).optional(),
  authorId: z.string().min(1),
  categoryIds: z.string().array(),
  totalTime: z.string().optional(),     // parseInt later
  isPublished: z.boolean(),
  isPremium: z.boolean(),
});
