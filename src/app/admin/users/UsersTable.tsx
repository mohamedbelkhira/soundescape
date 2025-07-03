'use client';

import { useState, useTransition, useEffect } from 'react';
import { Role, SubscriptionType } from '@prisma/client';
import {
  listUsers, createUser, updateUser, deleteUser,
} from './actions';

import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Pencil, Users2, ShieldCheck, DollarSign } from 'lucide-react';

/* ---------- props ---------- */
interface Stats { total: number; admins: number; paid: number }
interface User {
  id: string; name: string | null; email: string;
  role: Role; subscriptionType: SubscriptionType;
}
export default function UsersTable({ initialUsers, stats }: {
  initialUsers: User[]; stats: Stats;
}) {
  /* ---------- state ---------- */
  const [users, setUsers]   = useState(initialUsers);
  const [pending, startTx]  = useTransition();

  /* dialog */
  const [open, setOpen]     = useState(false);
  const [editing, setEdit]  = useState<User | null>(null);
  const [form, setForm]     = useState<Record<string, string>>({
    name: '', email: '', password: '', role: 'USER', subscriptionType: 'FREE',
  });

  /* filters */
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'USER'>('ALL');

  /* debounce search */
  useEffect(() => {
    const t = setTimeout(() => {
      startTx(async () => {
        setUsers(await listUsers(search, roleFilter));
      });
    }, 300);
    return () => clearTimeout(t);
  }, [search, roleFilter]);

  /* ---------- CRUD helpers ---------- */
  const openForm = (u?: User) => {
    setEdit(u ?? null);
    setForm(u ? { ...u, password: '' } as any
            : { name: '', email: '', password: '', role: 'USER', subscriptionType: 'FREE' });
    setOpen(true);
  };
  const submit = () => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
    startTx(async () => {
      editing ? await updateUser(editing.id, fd) : await createUser(fd);
      setOpen(false);
    });
  };
  const remove = (id: string) =>
    confirm('Delete user?') &&
    startTx(async () => { await deleteUser(id); });

  /* ---------- UI ---------- */
  return (
    <>
      {/* --- stats bar --- */}
      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={<Users2 className="w-5 h-5" />} label="Total users"    value={stats.total} />
        <StatCard icon={<ShieldCheck className="w-5 h-5" />} label="Admins"     value={stats.admins} />
        <StatCard icon={<DollarSign className="w-5 h-5" />} label="Paid plans"  value={stats.paid} />
      </section>

      {/* --- filters + add button --- */}
      <section className="flex flex-wrap items-center gap-3 mt-6">
        <Input
          placeholder="Search name / email"
          className="max-w-xs"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Select value={roleFilter} onValueChange={v => setRoleFilter(v as any)}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All roles</SelectItem>
            <SelectItem value="ADMIN">Admins</SelectItem>
            <SelectItem value="USER">Users</SelectItem>
          </SelectContent>
        </Select>
        <Button className="ml-auto" onClick={() => openForm()}>
          <Plus className="mr-2 w-4 h-4" /> New
        </Button>
      </section>

      {/* --- table --- */}
      <div className="border rounded-lg overflow-x-auto mt-4">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Plan</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.name ?? '—'}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3"><Badge>{u.role}</Badge></td>
                <td className="p-3">{u.subscriptionType}</td>
                <td className="p-3 text-right space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => openForm(u)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(u.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {!users.length && (
              <tr><td colSpan={5} className="p-3 text-center text-slate-500">No users</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- dialog --- */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit user' : 'Create user'}</DialogTitle></DialogHeader>
          <form
            onSubmit={e => { e.preventDefault(); submit(); }}
            className="space-y-4 max-h-[70vh] overflow-y-auto"
          >
            <Input placeholder="Name"  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            {!editing && (
              <Input type="password" placeholder="Password"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            )}
            <Select value={form.role} onValueChange={v => setForm({ ...form, role: v })}>
              <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">USER</SelectItem>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
              </SelectContent>
            </Select>
            <Select value={form.subscriptionType}
              onValueChange={v => setForm({ ...form, subscriptionType: v })}>
              <SelectTrigger><SelectValue placeholder="Plan" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="FREE">FREE</SelectItem>
                <SelectItem value="PREMIUM">PREMIUM</SelectItem>
                <SelectItem value="PREMIUM_PLUS">PREMIUM_PLUS</SelectItem>
              </SelectContent>
            </Select>
            <DialogFooter><Button type="submit" disabled={pending}>Save</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* small helper */
const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) => (
  <Card className="bg-gradient-to-br from-blue-50/50 dark:from-slate-800/30">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{label}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent className="text-2xl font-bold">{value}</CardContent>
  </Card>
);