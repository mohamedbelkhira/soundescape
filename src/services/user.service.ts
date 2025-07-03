import { db as prisma } from '@/lib/db';
import { Prisma, User, Role, SubscriptionType } from '@prisma/client';
import bcrypt from 'bcryptjs';

export interface UserInput {
  name?: string;
  email: string;
  password?: string;          // plaintext coming from API
  role?: Role;                // default "USER"
  subscriptionType?: SubscriptionType;
  subscriptionExpiresAt?: Date | null;
}

/** Helper selection reused throughout */
const defaultSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  subscriptionType: true,
  subscriptionExpiresAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class UserService {
  /* ----------------------- Create -------------------------------- */
  static async create(data: UserInput): Promise<Pick<User, keyof typeof defaultSelect>> {
    try {
      const hashed = data.password ? await bcrypt.hash(data.password, 12) : undefined;

      return await prisma.user.create({
        data: {
          name: data.name?.trim() ?? null,
          email: data.email.toLowerCase().trim(),
          password: hashed,
          role: data.role ?? 'USER',
          subscriptionType: data.subscriptionType ?? 'FREE',
          subscriptionExpiresAt: data.subscriptionExpiresAt ?? null,
        },
        select: defaultSelect,
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      )
        throw new Error('User with this email already exists');
      throw new Error('Failed to create user');
    }
  }

  /* ----------------------- Read ---------------------------------- */
  static async getAll(
    q: { search?: string; role?: Role; limit?: number; offset?: number } = {},
  ): Promise<{ users: Pick<User, keyof typeof defaultSelect>[]; total: number }> {
    const { search, role, limit = 20, offset = 0 } = q;

    const where: Prisma.UserWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(role && { role }),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: defaultSelect,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total };
  }

  static async getById(id: string) {
    return prisma.user.findUnique({ where: { id }, select: defaultSelect });
  }

  /* ----------------------- Update -------------------------------- */
  static async update(
    id: string,
    data: Partial<UserInput>,
  ): Promise<Pick<User, keyof typeof defaultSelect>> {
    try {
      const updateData: Prisma.UserUpdateInput = {
        ...(data.name !== undefined && { name: data.name?.trim() ?? null }),
        ...(data.role && { role: data.role }),
        ...(data.subscriptionType && { subscriptionType: data.subscriptionType }),
        ...(data.subscriptionExpiresAt !== undefined && {
          subscriptionExpiresAt: data.subscriptionExpiresAt,
        }),
      };

      if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 12);
      }

      return await prisma.user.update({
        where: { id },
        data: updateData,
        select: defaultSelect,
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      )
        throw new Error('User not found');
      throw new Error('Failed to update user');
    }
  }

  /* ----------------------- Delete -------------------------------- */
  static async delete(id: string): Promise<void> {
    try {
      await prisma.user.delete({ where: { id } });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      )
        throw new Error('User not found');
      throw new Error('Failed to delete user');
    }
  }
  static async getStats() {
    const [total, admins, paid] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { subscriptionType: { not: 'FREE' } } }),
    ]);
  
    return { total, admins, paid };
  }
}
