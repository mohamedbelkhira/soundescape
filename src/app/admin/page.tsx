'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth/AuthGuard';
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAdminStats } from './actions';

/* ---------- helper ---------- */
const StatBox = ({
  value, label, color,
}: { value: number; label: string; color: string }) => (
  <div className={`text-center p-4 rounded-lg ${color}`}>
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
);

export default function AdminPage() {
  const { data: session } = useSession();
  const [stats, setStats]  = useState({ users: 0, audiobooks: 0, categories: 0, authors: 0 });
  const [pending, startTx] = useTransition();

  /* fetch counts once on mount */
  useEffect(() => {
    startTx(async () => setStats(await getAdminStats()));
  }, []);

  return (
    <AuthGuard requireAdmin>
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8 space-y-8">
          {/* Welcome & stats */}
          <Card>
            <CardHeader>
              <CardTitle>Hello Admin, {session?.user?.name || 'Administrator'}! 🛠️</CardTitle>
              <CardDescription>
                Manage your audiobook platform from this admin dashboard. You have full control over
                users, audiobooks, and system settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <StatBox value={stats.users}       label="Total Users"       color="bg-blue-50"   />
                <StatBox value={stats.audiobooks}  label="Total Audiobooks"  color="bg-green-50"  />
                <StatBox value={stats.categories}  label="Total Categories"  color="bg-purple-50" />
                <StatBox value={stats.authors}     label="Total Authors"     color="bg-orange-50" />
              </div>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ActionButton href="/admin/audiobooks"
                  iconPath="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  title="Manage Audiobooks"
                  desc="Add, edit, and organize audiobooks" />

                <ActionButton href="/admin/users"
                  iconPath="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  title="Manage Users"
                  desc="View and manage user accounts" />

                <ActionButton disabled
                  iconPath="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  title="Analytics"
                  desc="View platform statistics" />
              </div>
            </CardContent>
          </Card>

          {/* Recent activity placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system activity and user actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                No recent activity to display. Activity will appear here as users interact with the platform.
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </AuthGuard>
  );
}

/* Quick-action button helper */
const ActionButton = ({
  href, iconPath, title, desc, disabled,
}: {
  href?: string; iconPath: string; title: string; desc: string; disabled?: boolean;
}) => (
  <Button asChild={!disabled} variant="outline" size="lg"
          className="h-auto p-6 flex flex-col space-y-2" disabled={disabled}>
    {disabled ? (
      <div>
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
        </svg>
        <span className="font-semibold">{title}</span>
        <span className="text-sm text-gray-600">{desc}</span>
      </div>
    ) : (
      <Link href={href!}>
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
        </svg>
        <span className="font-semibold">{title}</span>
        <span className="text-sm text-gray-600">{desc}</span>
      </Link>
    )}
  </Button>
);