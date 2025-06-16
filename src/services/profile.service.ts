// src/services/profile.service.ts
import { db as prisma } from '@/lib/db';
import { User, UserProfile, Prisma } from '@prisma/client';

export interface ProfileInput {
  bio?: string;
  avatar?: string;
  dateOfBirth?: Date;
  country?: string;
  language?: string;
  preferredGenres?: string[];
}

export interface UserInput {
  name?: string;
  email?: string;
  password?: string;
}

export interface CompleteProfileData extends User {
  profile: UserProfile | null;
}

export interface ProfileUpdateData {
  user?: UserInput;
  profile?: ProfileInput;
}

export class ProfileService {
  /**
   * Get user profile by user ID
   */
  static async getByUserId(userId: string): Promise<CompleteProfileData | null> {
    try {
      return await prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
        },
      });
    } catch (error) {
      throw new Error('Failed to fetch user profile');
    }       
  }

  /**
   * Create or update user profile
   */
  static async upsertProfile(userId: string, data: ProfileInput): Promise<UserProfile> {
    try {
      return await prisma.userProfile.upsert({
        where: { userId },
        update: {
          ...(data.bio !== undefined && { bio: data.bio }),
          ...(data.avatar !== undefined && { avatar: data.avatar }),
          ...(data.dateOfBirth !== undefined && { dateOfBirth: data.dateOfBirth }),
          ...(data.country !== undefined && { country: data.country }),
          ...(data.language !== undefined && { language: data.language }),
        },
        create: {
          userId,
          bio: data.bio,
          avatar: data.avatar,
          dateOfBirth: data.dateOfBirth,
          country: data.country,
          language: data.language || 'en',
        },
      });
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  }

  /**
   * Update user basic information
   */
  static async updateUser(userId: string, data: UserInput): Promise<User> {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data: {
          ...(data.name !== undefined && { name: data.name.trim() }),
          ...(data.email !== undefined && { email: data.email.toLowerCase().trim() }),
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('Email already exists');
        }
        if (error.code === 'P2025') {
          throw new Error('User not found');
        }
      }
      throw new Error('Failed to update user information');
    }
  }

  /**
   * Update complete profile (user + profile data)
   */
  static async updateCompleteProfile(
    userId: string, 
    data: ProfileUpdateData
  ): Promise<CompleteProfileData> {
    try {
      return await prisma.$transaction(async (tx) => {
        // Update user data if provided
        let updatedUser: User;
        if (data.user) {
          updatedUser = await tx.user.update({
            where: { id: userId },
            data: {
              ...(data.user.name !== undefined && { name: data.user.name.trim() }),
              ...(data.user.email !== undefined && { email: data.user.email.toLowerCase().trim() }),
            },
          });
        } else {
          updatedUser = await tx.user.findUniqueOrThrow({
            where: { id: userId },
          });
        }

        // Update profile data if provided
        let updatedProfile: UserProfile | null = null;
        if (data.profile) {
          updatedProfile = await tx.userProfile.upsert({
            where: { userId },
            update: {
              ...(data.profile.bio !== undefined && { bio: data.profile.bio }),
              ...(data.profile.avatar !== undefined && { avatar: data.profile.avatar }),
              ...(data.profile.dateOfBirth !== undefined && { dateOfBirth: data.profile.dateOfBirth }),
              ...(data.profile.country !== undefined && { country: data.profile.country }),
              ...(data.profile.language !== undefined && { language: data.profile.language }),
            },
            create: {
              userId,
              bio: data.profile.bio,
              avatar: data.profile.avatar,
              dateOfBirth: data.profile.dateOfBirth,
              country: data.profile.country,
              language: data.profile.language || 'en',
            },
          });
        } else {
          updatedProfile = await tx.userProfile.findUnique({
            where: { userId },
          });
        }

        return {
          ...updatedUser,
          profile: updatedProfile,
        };
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('Email already exists');
        }
        if (error.code === 'P2025') {
          throw new Error('User not found');
        }
      }
      throw new Error('Failed to update profile');
    }
  }

  /**
   * Delete user profile (keeps user account)
   */
  static async deleteProfile(userId: string): Promise<void> {
    try {
      await prisma.userProfile.delete({
        where: { userId },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Profile not found');
        }
      }
      throw new Error('Failed to delete profile');
    }
  }

  /**
   * Update avatar URL
   */
  static async updateAvatar(userId: string, avatarUrl: string): Promise<UserProfile> {
    try {
      return await prisma.userProfile.upsert({
        where: { userId },
        update: { avatar: avatarUrl },
        create: {
          userId,
          avatar: avatarUrl,
          language: 'en',
        },
      });
    } catch (error) {
      throw new Error('Failed to update avatar');
    }
  }

 

  /**
   * Check if email exists (for validation)
   */
  static async emailExists(email: string, excludeUserId?: string): Promise<boolean> {
    try {
      const user = await prisma.user.findFirst({
        where: {
          email: { equals: email.toLowerCase().trim(), mode: 'insensitive' },
          ...(excludeUserId && { id: { not: excludeUserId } }),
        },
      });
      return !!user;
    } catch (error) {
      throw new Error('Failed to check email availability');
    }
  }

  /**
   * Get user favorites with audiobooks
   */
  static async getUserFavorites(userId: string) {
    try {
      return await prisma.favorite.findMany({
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
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw new Error('Failed to fetch user favorites');
    }
  }

  /**
   * Get user subscription info
   */
  static async getSubscriptionInfo(userId: string) {
    try {
      return await prisma.user.findUnique({
        where: { id: userId },
        select: {
          subscriptionType: true,
          subscriptionExpiresAt: true,
        },
      });
    } catch (error) {
      throw new Error('Failed to fetch subscription info');
    }
  }
}