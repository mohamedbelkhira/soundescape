// src/services/chapter.service.ts
import { db as prisma } from '@/lib/db';
import { Chapter, Prisma } from '@prisma/client';
import { AudiobookService } from './audiobook.service';

export interface ChapterInput {
  title: string;
  audioUrl: string;
  duration: number;
  order: number;
  audiobookId: string;
}

export interface ChapterFilters {
  audiobookId?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ChapterWithAudiobook extends Chapter {
  audiobook: {
    id: string;
    title: string;
  };
}

export class ChapterService {
  /**
   * Create a new chapter
   */
  static async create(data: ChapterInput): Promise<Chapter> {
    try {
      // Verify audiobook exists
      const audiobook = await prisma.audiobook.findUnique({
        where: { id: data.audiobookId },
      });
      
      if (!audiobook) {
        throw new Error('Audiobook not found');
      }

      // Check if order already exists for this audiobook
      const existingChapter = await prisma.chapter.findFirst({
        where: {
          audiobookId: data.audiobookId,
          order: data.order,
        },
      });

      if (existingChapter) {
        throw new Error(`Chapter with order ${data.order} already exists for this audiobook`);
      }

      const chapter = await prisma.chapter.create({
        data: {
          title: data.title.trim(),
          audioUrl: data.audioUrl.trim(),
          duration: data.duration,
          order: data.order,
          audiobookId: data.audiobookId,
        },
      });

      // Update audiobook total time
      await AudiobookService.updateTotalTime(data.audiobookId);

      return chapter;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create chapter');
    }
  }

  /**
   * Get all chapters with optional filtering and pagination
   */
  static async getAll(filters: ChapterFilters = {}): Promise<{
    chapters: ChapterWithAudiobook[];
    total: number;
  }> {
    const { audiobookId, search, limit = 50, offset = 0 } = filters;

    const where: Prisma.ChapterWhereInput = {
      ...(audiobookId && { audiobookId }),
      ...(search && {
        title: { contains: search, mode: 'insensitive' },
      }),
    };

    const [chapters, total] = await Promise.all([
      prisma.chapter.findMany({
        where,
        include: {
          audiobook: {
            select: { id: true, title: true },
          },
        },
        orderBy: [
          { audiobookId: 'asc' },
          { order: 'asc' },
        ],
        take: limit,
        skip: offset,
      }),
      prisma.chapter.count({ where }),
    ]);

    return { chapters, total };
  }

  /**
   * Get chapter by ID
   */
  static async getById(id: string): Promise<ChapterWithAudiobook | null> {
    return await prisma.chapter.findUnique({
      where: { id },
      include: {
        audiobook: {
          select: { id: true, title: true },
        },
      },
    });
  }

  /**
   * Get chapters by audiobook ID
   */
  static async getByAudiobookId(audiobookId: string): Promise<Chapter[]> {
    return await prisma.chapter.findMany({
      where: { audiobookId },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * Update chapter
   */
  static async update(id: string, data: Partial<ChapterInput>): Promise<Chapter> {
    try {
      const existingChapter = await prisma.chapter.findUnique({
        where: { id },
      });

      if (!existingChapter) {
        throw new Error('Chapter not found');
      }

      // If order is being updated, check for conflicts
      if (data.order !== undefined && data.order !== existingChapter.order) {
        const conflictingChapter = await prisma.chapter.findFirst({
          where: {
            audiobookId: existingChapter.audiobookId,
            order: data.order,
            id: { not: id },
          },
        });

        if (conflictingChapter) {
          throw new Error(`Chapter with order ${data.order} already exists for this audiobook`);
        }
      }

      const chapter = await prisma.chapter.update({
        where: { id },
        data: {
          ...(data.title && { title: data.title.trim() }),
          ...(data.audioUrl && { audioUrl: data.audioUrl.trim() }),
          ...(data.duration !== undefined && { duration: data.duration }),
          ...(data.order !== undefined && { order: data.order }),
        },
      });

      // Update audiobook total time if duration changed
      if (data.duration !== undefined) {
        await AudiobookService.updateTotalTime(existingChapter.audiobookId);
      }

      return chapter;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update chapter');
    }
  }

  /**
   * Delete chapter
   */
  static async delete(id: string): Promise<void> {
    try {
      const chapter = await prisma.chapter.findUnique({
        where: { id },
        select: { audiobookId: true },
      });

      if (!chapter) {
        throw new Error('Chapter not found');
      }

      await prisma.chapter.delete({
        where: { id },
      });

      // Update audiobook total time
      await AudiobookService.updateTotalTime(chapter.audiobookId);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Chapter not found');
        }
      }
      throw new Error('Failed to delete chapter');
    }
  }

  /**
   * Reorder chapters
   */
  static async reorder(audiobookId: string, chapterOrders: { id: string; order: number }[]): Promise<void> {
    try {
      // Verify audiobook exists
      const audiobook = await prisma.audiobook.findUnique({
        where: { id: audiobookId },
      });
      
      if (!audiobook) {
        throw new Error('Audiobook not found');
      }

      // Verify all chapters belong to the audiobook
      const chapterIds = chapterOrders.map(co => co.id);
      const chapters = await prisma.chapter.findMany({
        where: {
          id: { in: chapterIds },
          audiobookId,
        },
      });

      if (chapters.length !== chapterIds.length) {
        throw new Error('One or more chapters not found or do not belong to this audiobook');
      }

      // Check for duplicate orders
      const orders = chapterOrders.map(co => co.order);
      const uniqueOrders = [...new Set(orders)];
      if (orders.length !== uniqueOrders.length) {
        throw new Error('Duplicate order numbers provided');
      }

      // Update each chapter's order
      await prisma.$transaction(
        chapterOrders.map(({ id, order }) =>
          prisma.chapter.update({
            where: { id },
            data: { order },
          })
        )
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to reorder chapters');
    }
  }

  /**
   * Get next available order number for audiobook
   */
  static async getNextOrder(audiobookId: string): Promise<number> {
    const maxOrder = await prisma.chapter.aggregate({
      where: { audiobookId },
      _max: { order: true },
    });

    return (maxOrder._max.order || 0) + 1;
  }

  /**
   * Bulk delete chapters
   */
  static async bulkDelete(ids: string[]): Promise<number> {
    // Get audiobook IDs for updating total times
    const chapters = await prisma.chapter.findMany({
      where: { id: { in: ids } },
      select: { audiobookId: true },
    });

    const audiobookIds = [...new Set(chapters.map(c => c.audiobookId))];

    const result = await prisma.chapter.deleteMany({
      where: { id: { in: ids } },
    });

    // Update total times for affected audiobooks
    await Promise.all(
      audiobookIds.map(audiobookId => 
        AudiobookService.updateTotalTime(audiobookId)
      )
    );

    return result.count;
  }

  /**
   * Get chapter statistics for an audiobook
   */
  static async getAudiobookStats(audiobookId: string): Promise<{
    totalChapters: number;
    totalDuration: number;
    averageDuration: number;
  }> {
    const stats = await prisma.chapter.aggregate({
      where: { audiobookId },
      _count: { id: true },
      _sum: { duration: true },
      _avg: { duration: true },
    });

    return {
      totalChapters: stats._count.id,
      totalDuration: stats._sum.duration || 0,
      averageDuration: Math.round(stats._avg.duration || 0),
    };
  }
}