// src/services/category.service.ts
import { db as prisma } from '@/lib/db';
import { Category, Prisma } from '@prisma/client';

export interface CategoryInput {
  title: string;
  description?: string;
}

export interface CategoryFilters {
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CategoryWithCount extends Category {
  _count: {
    audiobooks: number;
  };
}

export class CategoryService {
  /**
   * Create a new category
   */
  static async create(data: CategoryInput): Promise<Category> {
    try {
      return await prisma.category.create({
        data: {
          title: data.title.trim(),
          description: data.description?.trim() || null,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('A category with this title already exists');
        }
      }
      throw new Error('Failed to create category');
    }
  }

  /**
   * Get all categories with optional filtering and pagination
   */
  static async getAll(filters: CategoryFilters = {}): Promise<{
    categories: CategoryWithCount[];
    total: number;
  }> {
    const { search, limit = 10, offset = 0 } = filters;

    const where: Prisma.CategoryWhereInput = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
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
      prisma.category.count({ where }),
    ]);

    return { categories, total };
  }

  /**
   * Get category by ID
   */
  static async getById(id: string): Promise<CategoryWithCount | null> {
    return await prisma.category.findUnique({
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
   * Update category
   */
  static async update(id: string, data: Partial<CategoryInput>): Promise<Category> {
    try {
      return await prisma.category.update({
        where: { id },
        data: {
          ...(data.title && { title: data.title.trim() }),
          ...(data.description !== undefined && { 
            description: data.description?.trim() || null 
          }),
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('A category with this title already exists');
        }
        if (error.code === 'P2025') {
          throw new Error('Category not found');
        }
      }
      throw new Error('Failed to update category');
    }
  }

  /**
   * Delete category
   */
  static async delete(id: string): Promise<void> {
    try {
      await prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Category not found');
        }
      }
      throw new Error('Failed to delete category');
    }
  }

  /**
   * Check if category exists by title
   */
  static async existsByTitle(title: string, excludeId?: string): Promise<boolean> {
    const category = await prisma.category.findFirst({
      where: {
        title: { equals: title.trim(), mode: 'insensitive' },
        ...(excludeId && { id: { not: excludeId } }),
      },
    });
    return !!category;
  }

  /**
   * Get categories for dropdown/select
   */
  static async getForSelect(): Promise<Pick<Category, 'id' | 'title'>[]> {
    return await prisma.category.findMany({
      select: { id: true, title: true },
      orderBy: { title: 'asc' },
    });
  }

  /**
   * Bulk delete categories
   */
  static async bulkDelete(ids: string[]): Promise<number> {
    const result = await prisma.category.deleteMany({
      where: { id: { in: ids } },
    });
    return result.count;
  }
}