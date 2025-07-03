// src/services/audiobook.service.ts
import { db as prisma } from '@/lib/db';
import { Audiobook, Prisma } from '@prisma/client';
import { deleteFile } from '@/lib/file-upload';
import path from 'path';


export interface AudiobookInput {
  title: string;
  description?: string;
  coverUrl?: string;
  audioUrl: string;
  totalTime?: number;
  authorId: string;
  categoryIds?: string[];
  isPublished?: boolean;
}

export interface AudiobookFilters {
  search?: string;
  authorId?: string;
  categoryId?: string;
  isPublished?: boolean;
  limit?: number;
  offset?: number;
}

export interface AudiobookWithDetails extends Audiobook {
  author: {
    id: string;
    name: string;
  };
  categories: Array<{
    category: {
      id: string;
      title: string;
    };
  }>;
  _count: {
    favorites: number;
  };
}

export interface AudiobookSummary extends Pick<Audiobook, 'id' | 'title' | 'coverUrl' | 'totalTime' | 'isPublished'> {
  author: {
    id: string;
    name: string;
  };
}
const defaultAudiobookSelect = {
  author:  { select: { id: true, name: true } },
  categories: {
    include: { category: { select: { id: true, title: true } } },
  },
  _count:  { select: { favorites: true } },
} as const;

export class AudiobookService {
  /**
   * Create a new audiobook
   */
  static async getLatest(
    limit = 10,
    offset = 0,
    /** pass false to also return drafts */
    onlyPublished = true,
  ): Promise<{ audiobooks: AudiobookWithDetails[]; total: number }> {

    const where: Prisma.AudiobookWhereInput = onlyPublished
      ? { isPublished: true }
      : {};

    const [audiobooks, total] = await Promise.all([
      prisma.audiobook.findMany({
        where,
        include: defaultAudiobookSelect,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.audiobook.count({ where }),
    ]);

    return { audiobooks, total };
  }
    static async getTrending(
    limit = 10,
    offset = 0,
  
    windowInDays = 0,
  ): Promise<{ audiobooks: AudiobookWithDetails[]; total: number }> {

    const windowFilter =
      windowInDays > 0
        ? {
            updatedAt: {
              gte: new Date(Date.now() - windowInDays * 86_400_000),
            },
          }
        : {};

    const where: Prisma.AudiobookWhereInput = {
      ...windowFilter,
      isPublished: true,
    };

    const [audiobooks, total] = await Promise.all([
      prisma.audiobook.findMany({
        where,
        include: defaultAudiobookSelect,
        orderBy: [
          { playCount: 'desc' },                 
          { viewCount: 'desc' },                 
          { favorites: { _count: 'desc' } },   
        ],
        take: limit,
        skip: offset,
      }),
      prisma.audiobook.count({ where }),
    ]);

    return { audiobooks, total };
  }

  static async create(data: AudiobookInput): Promise<AudiobookWithDetails> {
    try {
      const audiobook = await prisma.audiobook.create({
        data: {
          title: data.title.trim(),
          description: data.description?.trim() || null,
          coverUrl: data.coverUrl || null,
          audioUrl: data.audioUrl,
          totalTime: data.totalTime || null,
          authorId: data.authorId,
          isPublished: data.isPublished || false,
          categories: data.categoryIds?.length ? {
            create: data.categoryIds.map(categoryId => ({
              categoryId,
            })),
          } : undefined,
        },
        include: {
          author: {
            select: { id: true, name: true },
          },
          categories: {
            include: {
              category: {
                select: { id: true, title: true },
              },
            },
          },
          _count: {
            select: {
              favorites: true,
            },
          },
        },
      });

      return audiobook;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('An audiobook with this title already exists');
        }
        if (error.code === 'P2003') {
          throw new Error('Invalid author or category ID provided');
        }
      }
      throw new Error('Failed to create audiobook');
    }
  }

  /**
   * Get all audiobooks with optional filtering and pagination
   */
  static async getAll(filters: AudiobookFilters = {}): Promise<{
    audiobooks: AudiobookWithDetails[];
    total: number;
  }> {
    const { search, authorId, categoryId, isPublished, limit = 10, offset = 0 } = filters;

    const where: Prisma.AudiobookWhereInput = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { author: { name: { contains: search, mode: 'insensitive' } } },
        ],
      }),
      ...(authorId && { authorId }),
      ...(categoryId && {
        categories: {
          some: { categoryId },
        },
      }),
      ...(isPublished !== undefined && { isPublished }),
    };

    const [audiobooks, total] = await Promise.all([
      prisma.audiobook.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true },
          },
          categories: {
            include: {
              category: {
                select: { id: true, title: true },
              },
            },
          },
          _count: {
            select: {
              favorites: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.audiobook.count({ where }),
    ]);

    return { audiobooks, total };
  }

  /**
   * Get audiobook by ID
   */
  static async getById(id: string): Promise<AudiobookWithDetails | null> {
    return await prisma.audiobook.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true },
        },
        categories: {
          include: {
            category: {
              select: { id: true, title: true },
            },
          },
        },
        _count: {
          select: {
            favorites: true,
          },
        },
      },
    });
  }

  /**
   * Update audiobook
   */
  static async update(id: string, data: Partial<AudiobookInput>): Promise<AudiobookWithDetails> {
    try {
      // If categoryIds are provided, we need to handle the many-to-many relationship
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = {
        ...(data.title && { title: data.title.trim() }),
        ...(data.description !== undefined && { 
          description: data.description?.trim() || null 
        }),
        ...(data.coverUrl !== undefined && { coverUrl: data.coverUrl || null }),
        ...(data.audioUrl && { audioUrl: data.audioUrl }),
        ...(data.totalTime !== undefined && { totalTime: data.totalTime || null }),
        ...(data.authorId && { authorId: data.authorId }),
        ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
      };

      // Handle categories update separately if provided
      if (data.categoryIds !== undefined) {
        // First, delete existing categories
        await prisma.audiobookCategory.deleteMany({
          where: { audiobookId: id },
        });

        // Then create new ones if any
        if (data.categoryIds.length > 0) {
          updateData.categories = {
            create: data.categoryIds.map(categoryId => ({
              categoryId,
            })),
          };
        }
      }

      const audiobook = await prisma.audiobook.update({
        where: { id },
        data: updateData,
        include: {
          author: {
            select: { id: true, name: true },
          },
          categories: {
            include: {
              category: {
                select: { id: true, title: true },
              },
            },
          },
          _count: {
            select: {
              favorites: true,
            },
          },
        },
      });

      return audiobook;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('An audiobook with this title already exists');
        }
        if (error.code === 'P2003') {
          throw new Error('Invalid author or category ID provided');
        }
        if (error.code === 'P2025') {
          throw new Error('Audiobook not found');
        }
      }
      throw new Error('Failed to update audiobook');
    }
  }

  /**
   * Delete audiobook
   */
  static async delete(id: string): Promise<void> {
    try {
      // Get audiobook first to retrieve file paths for cleanup
      const audiobook = await prisma.audiobook.findUnique({
        where: { id },
        select: { coverUrl: true, audioUrl: true },
      });

      if (!audiobook) {
        throw new Error('Audiobook not found');
      }

      // Delete the audiobook (cascading will handle related records)
      await prisma.audiobook.delete({
        where: { id },
      });

      // Clean up files
      if (audiobook.coverUrl) {
        const coverPath = path.join(process.cwd(), 'public', audiobook.coverUrl);
        await deleteFile(coverPath);
      }

      if (audiobook.audioUrl) {
        const audioPath = path.join(process.cwd(), 'public', audiobook.audioUrl);
        await deleteFile(audioPath);
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Audiobook not found');
        }
      }
      if (error instanceof Error && error.message === 'Audiobook not found') {
        throw error;
      }
      throw new Error('Failed to delete audiobook');
    }
  }

  /**
   * Get audiobooks for dropdown/select
   */
  static async getForSelect(): Promise<AudiobookSummary[]> {
    return await prisma.audiobook.findMany({
      select: { 
        id: true, 
        title: true, 
        coverUrl: true, 
        totalTime: true,
        isPublished: true,
        author: {
          select: { id: true, name: true },
        },
      },
      where: { isPublished: true },
      orderBy: { title: 'asc' },
    });
  }

  /**
   * Toggle publish status
   */
  static async togglePublish(id: string): Promise<Audiobook> {
    try {
      const audiobook = await prisma.audiobook.findUnique({
        where: { id },
      });

      if (!audiobook) {
        throw new Error('Audiobook not found');
      }

      return await prisma.audiobook.update({
        where: { id },
        data: { isPublished: !audiobook.isPublished },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Audiobook not found');
        }
      }
      if (error instanceof Error && error.message === 'Audiobook not found') {
        throw error;
      }
      throw new Error('Failed to toggle publish status');
    }
  }

  /**
   * Get audiobooks by author
   */
  static async getByAuthor(authorId: string, limit = 10, offset = 0): Promise<{
    audiobooks: AudiobookWithDetails[];
    total: number;
  }> {
    return this.getAll({ authorId, limit, offset });
  }

  /**
   * Get audiobooks by category
   */
  static async getByCategory(categoryId: string, limit = 10, offset = 0): Promise<{
    audiobooks: AudiobookWithDetails[];
    total: number;
  }> {
    return this.getAll({ categoryId, limit, offset });
  }

  /**
   * Bulk delete audiobooks
   */
  static async bulkDelete(ids: string[]): Promise<number> {
    // Get audiobooks first to retrieve file paths for cleanup
    const audiobooks = await prisma.audiobook.findMany({
      where: { id: { in: ids } },
      select: { id: true, coverUrl: true, audioUrl: true },
    });

    // Delete audiobooks
    const result = await prisma.audiobook.deleteMany({
      where: { id: { in: ids } },
    });

    // Clean up files
    for (const audiobook of audiobooks) {
      if (audiobook.coverUrl) {
        const coverPath = path.join(process.cwd(), 'public', audiobook.coverUrl);
        await deleteFile(coverPath);
      }
      
      if (audiobook.audioUrl) {
        const audioPath = path.join(process.cwd(), 'public', audiobook.audioUrl);
        await deleteFile(audioPath);
      }
    }

    return result.count;
  }

  /**
   * Search audiobooks
   */
  static async search(query: string, limit = 10, offset = 0): Promise<{
    audiobooks: AudiobookWithDetails[];
    total: number;
  }> {
    return this.getAll({ search: query, limit, offset });
  }
  /** Increase the view counter (opened in UI, not necessarily played) */
static async incrementView(id: string): Promise<Audiobook> {
  try {
    return await prisma.audiobook.update({
      where: { id },
      data: { viewCount: { increment: 1 } },   // atomic, race-safe
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new Error('Audiobook not found');
    }
    throw new Error('Failed to increment view counter');
  }
}

/** Increase the play counter (user hit “Play”) */
static async incrementPlay(id: string): Promise<Audiobook> {
  try {
    return await prisma.audiobook.update({
      where: { id },
      data: { playCount: { increment: 1 } },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new Error('Audiobook not found');
    }
    throw new Error('Failed to increment play counter');
  }
}

}