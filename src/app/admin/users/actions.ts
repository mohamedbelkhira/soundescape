'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { UserService } from '@/services/user.service';
import { Role } from '@prisma/client';

/* ---------- shared Zod schema ---------- */
const base = z.object({
  name: z.string().trim().optional(),
  email: z.string().email(),
  password: z.string().min(6).optional(),
  role: z.enum(['USER', 'ADMIN']).default('USER'),
  subscriptionType: z.enum(['FREE', 'PREMIUM', 'PREMIUM_PLUS']).default('FREE'),
});

/* ---------- CRUD ---------- */
export async function createUser(form: FormData) {
  await UserService.create(Object.fromEntries(form) as any);
  revalidatePath('/admin/users');
}

export async function updateUser(id: string, form: FormData) {
  await UserService.update(id, Object.fromEntries(form) as any);
  revalidatePath('/admin/users');
}

export async function deleteUser(id: string) {
  await UserService.delete(id);
  revalidatePath('/admin/users');
}

/* ---------- filter (search + role) ---------- */
export async function listUsers(search = '', role: Role | 'ALL' = 'ALL') {
  const { users } = await UserService.getAll({
    search: search || undefined,
    role: role !== 'ALL' ? (role as Role) : undefined,
  });
  return users;
}