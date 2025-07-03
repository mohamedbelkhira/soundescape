'use server';

import { UserService }       from '@/services/user.service';
import { AudiobookService }  from '@/services/audiobook.service';
import { CategoryService }   from '@/services/category.service';
import { AuthorService }     from '@/services/author.service';

/** returns { users, audiobooks, categories, authors } */
export async function getAdminStats() {
  const [
    { total: users },
    { total: audiobooks },
    { total: categories },
    { total: authors },
  ] = await Promise.all([
    UserService.getAll({ limit: 1, offset: 0 }),      // only need the count
    AudiobookService.getAll({ limit: 1, offset: 0 }),
    CategoryService.getAll({ limit: 1, offset: 0 }),
    AuthorService.getAll({ limit: 1, offset: 0 }),
  ]);

  return { users, audiobooks, categories, authors };
}
