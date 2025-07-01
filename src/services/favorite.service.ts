// src/services/favorite.service.ts
import { db } from "@/lib/db";

export class FavoriteService {
  // Toggle favorite status (add/remove)
  static async toggleFavorite(userId: string, audiobookId: string) {
    try {
      // First verify the audiobook exists
      const audiobook = await db.audiobook.findUnique({
        where: { id: audiobookId },
        select: { id: true },
      });

      if (!audiobook) {
        throw new Error("Audiobook not found");
      }

      // Check if favorite already exists
      const existingFavorite = await db.favorite.findUnique({
        where: {
          userId_audiobookId: {
            userId,
            audiobookId,
          },
        },
      });

      if (existingFavorite) {
        // Remove from favorites
        await db.favorite.delete({
          where: {
            id: existingFavorite.id,
          },
        });
        return { isFavorited: false, message: "Removed from favorites" };
      } else {
        // Add to favorites
        await db.favorite.create({
          data: {
            userId,
            audiobookId,
          },
        });
        return { isFavorited: true, message: "Added to favorites" };
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      throw error instanceof Error ? error : new Error("Failed to toggle favorite");
    }
  }

  // Check if audiobook is favorited by user
  static async isFavorited(userId: string, audiobookId: string): Promise<boolean> {
    try {
      const favorite = await db.favorite.findUnique({
        where: {
          userId_audiobookId: {
            userId,
            audiobookId,
          },
        },
      });
      return !!favorite;
    } catch (error) {
      console.error("Error checking favorite status:", error);
      return false;
    }
  }

  // Get user's favorite audiobooks with pagination
  static async getUserFavorites(
    userId: string,
    limit: number = 10,
    offset: number = 0
  ) {
    try {
      const [favorites, total] = await Promise.all([
        db.favorite.findMany({
          where: { userId },
          include: {
            audiobook: {
              include: {
                author: true,
                categories: {
                  include: {
                    category: true,
                  },
                },
                _count: {
                  select: {
                    favorites: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip: offset,
          take: limit,
        }),
        db.favorite.count({
          where: { userId },
        }),
      ]);

      const audiobooks = favorites.map(fav => ({
        ...fav.audiobook,
        isFavorited: true, // Since these are from favorites table
        favoriteCount: fav.audiobook._count.favorites,
      }));

      return { audiobooks, total };
    } catch (error) {
      console.error("Error fetching user favorites:", error);
      throw new Error("Failed to fetch favorites");
    }
  }

  // Get favorite count for an audiobook
  static async getFavoriteCount(audiobookId: string): Promise<number> {
    try {
      const count = await db.favorite.count({
        where: { audiobookId },
      });
      return count;
    } catch (error) {
      console.error("Error getting favorite count:", error);
      return 0;
    }
  }

  // Get user's favorite audiobook IDs for efficient lookup
  static async getUserFavoriteIds(userId: string): Promise<string[]> {
    try {
      const favorites = await db.favorite.findMany({
        where: { userId },
        select: { audiobookId: true },
      });
      return favorites.map(fav => fav.audiobookId);
    } catch (error) {
      console.error("Error fetching user favorite IDs:", error);
      return [];
    }
  }

  // Bulk operations
  static async addMultipleToFavorites(
    userId: string,
    audiobookIds: string[]
  ) {
    try {
      // Verify all audiobooks exist
      const existingAudiobooks = await db.audiobook.findMany({
        where: { id: { in: audiobookIds } },
        select: { id: true },
      });

      const existingAudiobookIds = existingAudiobooks.map(ab => ab.id);
      const notFoundIds = audiobookIds.filter(id => !existingAudiobookIds.includes(id));

      if (notFoundIds.length > 0) {
        throw new Error(`Audiobooks not found: ${notFoundIds.join(", ")}`);
      }

      // Filter out already favorited audiobooks to avoid duplicates
      const existingFavorites = await db.favorite.findMany({
        where: {
          userId,
          audiobookId: { in: audiobookIds },
        },
        select: { audiobookId: true },
      });

      const existingFavoriteIds = existingFavorites.map(fav => fav.audiobookId);
      const newAudiobookIds = audiobookIds.filter(id => !existingFavoriteIds.includes(id));

      if (newAudiobookIds.length === 0) {
        return { added: 0, message: "All audiobooks are already in favorites" };
      }

      await db.favorite.createMany({
        data: newAudiobookIds.map(audiobookId => ({
          userId,
          audiobookId,
        })),
      });

      return { 
        added: newAudiobookIds.length, 
        message: `Added ${newAudiobookIds.length} audiobook${newAudiobookIds.length === 1 ? '' : 's'} to favorites` 
      };
    } catch (error) {
      console.error("Error adding multiple to favorites:", error);
      throw error instanceof Error ? error : new Error("Failed to add audiobooks to favorites");
    }
  }

  static async removeMultipleFromFavorites(
    userId: string,
    audiobookIds: string[]
  ) {
    try {
      const result = await db.favorite.deleteMany({
        where: {
          userId,
          audiobookId: { in: audiobookIds },
        },
      });

      return { 
        removed: result.count, 
        message: `Removed ${result.count} audiobook${result.count === 1 ? '' : 's'} from favorites` 
      };
    } catch (error) {
      console.error("Error removing multiple from favorites:", error);
      throw new Error("Failed to remove audiobooks from favorites");
    }
  }

  // Get most favorited audiobooks (trending by favorites)
  static async getMostFavorited(
    limit: number = 10,
    offset: number = 0,
    onlyPublished: boolean = true
  ) {
    try {
      const whereClause = onlyPublished ? { isPublished: true } : {};

      const [audiobooks, total] = await Promise.all([
        db.audiobook.findMany({
          where: whereClause,
          include: {
            author: true,
            categories: {
              include: {
                category: true,
              },
            },
            _count: {
              select: {
                favorites: true,
              },
            },
          },
          orderBy: {
            favorites: {
              _count: 'desc',
            },
          },
          skip: offset,
          take: limit,
        }),
        db.audiobook.count({ where: whereClause }),
      ]);

      const audiobooksWithCounts = audiobooks.map(audiobook => ({
        ...audiobook,
        favoriteCount: audiobook._count.favorites,
      }));

      return { audiobooks: audiobooksWithCounts, total };
    } catch (error) {
      console.error("Error fetching most favorited audiobooks:", error);
      throw new Error("Failed to fetch most favorited audiobooks");
    }
  }
}