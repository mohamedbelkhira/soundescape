
// src/services/author.service.ts
import { db as prisma } from '@/lib/db';
import { Author, Prisma } from '@prisma/client';

export interface AuthorInput {
  name: string;
  isActive?: boolean;
}

export interface AuthorFilters {
  search?: string;
  isActive?: boolean;
  limit?: number;
  offset?: number;
}

export interface AuthorWithCount extends Author {
  _count: {
    audiobooks: number;
  };
}

export class AuthorService {
  /**
   * Create a new author
   */
  static async create(data: AuthorInput): Promise<Author> {
    try {
      return await prisma.author.create({
        data: {
          name: data.name.trim(),
          isActive: data.isActive ?? true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('An author with this name already exists');
        }
      }
      throw new Error('Failed to create author');
    }
  }

  /**
   * Get all authors with optional filtering and pagination
   */
  static async getAll(filters: AuthorFilters = {}): Promise<{
    authors: AuthorWithCount[];
    total: number;
  }> {
    const { search, isActive, limit = 10, offset = 0 } = filters;

    const where: Prisma.AuthorWhereInput = {
      ...(search && {
        name: { contains: search, mode: 'insensitive' },
      }),
      ...(isActive !== undefined && { isActive }),
    };

    const [authors, total] = await Promise.all([
      prisma.author.findMany({
        where,
        include: {
          _count: {
            select: {
              audiobooks: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.author.count({ where }),
    ]);

    return { authors, total };
  }

  /**
   * Get author by ID
   */
  static async getById(id: string): Promise<AuthorWithCount | null> {
    return await prisma.author.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            audiobooks: true,
          },
        },
      },
    });
  }

  /**
   * Update author
   */
  static async update(id: string, data: Partial<AuthorInput>): Promise<Author> {
    try {
      return await prisma.author.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name.trim() }),
          ...(data.isActive !== undefined && { isActive: data.isActive }),
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('An author with this name already exists');
        }
        if (error.code === 'P2025') {
          throw new Error('Author not found');
        }
      }
      throw new Error('Failed to update author');
    }
  }

  /**
   * Delete author
   */
  static async delete(id: string): Promise<void> {
    try {
      await prisma.author.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Author not found');
        }
        if (error.code === 'P2003') {
          throw new Error('Cannot delete author with associated audiobooks');
        }
      }
      throw new Error('Failed to delete author');
    }
  }

  /**
   * Check if author exists by name
   */
  static async existsByName(name: string, excludeId?: string): Promise<boolean> {
    const author = await prisma.author.findFirst({
      where: {
        name: { equals: name.trim(), mode: 'insensitive' },
        ...(excludeId && { id: { not: excludeId } }),
      },
    });
    return !!author;
  }

  /**
   * Get authors for dropdown/select
   */
  static async getForSelect(activeOnly: boolean = true): Promise<Pick<Author, 'id' | 'name'>[]> {
    return await prisma.author.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Bulk delete authors
   */
  static async bulkDelete(ids: string[]): Promise<number> {
    const result = await prisma.author.deleteMany({
      where: { id: { in: ids } },
    });
    return result.count;
  }

  /**
   * Toggle author active status
   */
  static async toggleActive(id: string): Promise<Author> {
    try {
      const author = await prisma.author.findUnique({ where: { id } });
      if (!author) {
        throw new Error('Author not found');
      }

      return await prisma.author.update({
        where: { id },
        data: { isActive: !author.isActive },
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Author not found') {
        throw error;
      }
      throw new Error('Failed to toggle author status');
    }
  }

  /**
   * Get author with audiobooks to fix later 
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async getWithAudiobooks(id: string): Promise<Author & { audiobooks: any[] } | null> {
    return await prisma.author.findUnique({
      where: { id },
      include: {
        audiobooks: {
          select: {
            id: true,
            title: true,
            coverUrl: true,
            isPublished: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }
}