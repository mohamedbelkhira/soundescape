import { UserService } from '@/services/user.service';
import UsersTable from './UsersTable';

export default async function Page() {
  const [{ users }, stats] = await Promise.all([
    UserService.getAll(),
    UserService.getStats(),
  ]);

  return (
    <main className="space-y-8 p-6">
      <UsersTable initialUsers={users} stats={stats} />
    </main>
  );
}
