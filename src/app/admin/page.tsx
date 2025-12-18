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
import { motion } from 'framer-motion';
import { Users, BookOpen, Layers, Mic2, Activity, ArrowRight } from 'lucide-react';

/* ---------- helper ---------- */
const StatBox = ({
  value, label, color, icon: Icon, delay
}: { value: number; label: string; color: string; icon: any; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`relative overflow-hidden p-6 rounded-2xl ${color} border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group`}
  >
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
      <Icon size={100} />
    </div>
    <div className="relative z-10">
      <div className="p-3 bg-white/30 w-fit rounded-xl mb-4 backdrop-blur-sm">
        <Icon size={24} className="text-gray-800" />
      </div>
      <div className="text-4xl font-black text-gray-900 mb-1 tracking-tight">{value}</div>
      <div className="text-sm font-medium text-gray-700 uppercase tracking-wider">{label}</div>
    </div>
  </motion.div>
);

const ActivityItem = ({ text, time, delay }: { text: string; time: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
    className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
  >
    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
      <Activity size={18} />
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-900">{text}</p>
      <p className="text-xs text-gray-500">{time}</p>
    </div>
  </motion.div>
);

export default function AdminPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({ users: 0, audiobooks: 0, categories: 0, authors: 0 });
  const [pending, startTx] = useTransition();

  /* fetch counts once on mount */
  useEffect(() => {
    startTx(async () => setStats(await getAdminStats()));
  }, []);

  return (
    <AuthGuard requireAdmin>
      <div className="min-h-screen bg-gray-50/50">
        <main className="container mx-auto px-6 py-8 space-y-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {session?.user?.name || 'Admin'} 👋
              </h1>
              <p className="text-gray-500 mt-1">Here's what's happening with your platform today.</p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all">
                Download Report
              </Button>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatBox value={stats.users} label="Total Users" color="bg-gradient-to-br from-blue-100 to-blue-200" icon={Users} delay={0.1} />
            <StatBox value={stats.audiobooks} label="Audiobooks" color="bg-gradient-to-br from-purple-100 to-purple-200" icon={BookOpen} delay={0.2} />
            <StatBox value={stats.categories} label="Categories" color="bg-gradient-to-br from-pink-100 to-pink-200" icon={Layers} delay={0.3} />
            <StatBox value={stats.authors} label="Authors" color="bg-gradient-to-br from-orange-100 to-orange-200" icon={Mic2} delay={0.4} />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-2"
            >
              <Card className="border-none shadow-premium overflow-hidden">
                <CardHeader className="bg-white border-b border-gray-100">
                  <CardTitle className="text-xl">Quick Actions</CardTitle>
                  <CardDescription>Manage your content efficiently</CardDescription>
                </CardHeader>
                <CardContent className="p-6 bg-white">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <ActionButton href="/admin/audiobooks"
                      iconPath="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      title="Manage Audiobooks"
                      desc="Add & edit books"
                      color="text-purple-600"
                      bgColor="bg-purple-50"
                    />

                    <ActionButton href="/admin/users"
                      iconPath="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                      title="Manage Users"
                      desc="User accounts"
                      color="text-blue-600"
                      bgColor="bg-blue-50"
                    />

                    <ActionButton disabled
                      iconPath="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      title="Analytics"
                      desc="Coming soon"
                      color="text-gray-400"
                      bgColor="bg-gray-50"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="border-none shadow-premium h-full">
                <CardHeader className="bg-white border-b border-gray-100">
                  <CardTitle className="text-xl">Recent Activity</CardTitle>
                  <CardDescription>Latest system events</CardDescription>
                </CardHeader>
                <CardContent className="p-0 bg-white">
                  <div className="flex flex-col">
                    <ActivityItem text="New user registered: Sarah J." time="2 mins ago" delay={0.7} />
                    <ActivityItem text="Audiobook added: 'The Great Gatsby'" time="1 hour ago" delay={0.8} />
                    <ActivityItem text="System backup completed" time="4 hours ago" delay={0.9} />
                    <ActivityItem text="New review posted" time="5 hours ago" delay={1.0} />
                  </div>
                  <div className="p-4 border-t border-gray-100">
                    <Button variant="ghost" className="w-full text-sm text-gray-500 hover:text-gray-900">
                      View All Activity
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

/* Quick-action button helper */
const ActionButton = ({
  href, iconPath, title, desc, disabled, color, bgColor
}: {
  href?: string; iconPath: string; title: string; desc: string; disabled?: boolean; color: string; bgColor: string;
}) => (
  <Button asChild={!disabled} variant="ghost" className={`h-auto p-4 flex flex-col items-start space-y-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer group'}`} disabled={disabled}>
    {disabled ? (
      <div className="w-full">
        <div className={`p-3 rounded-lg w-fit mb-2 ${bgColor} ${color}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
          </svg>
        </div>
        <div className="text-left">
          <span className="font-bold text-gray-900 block">{title}</span>
          <span className="text-sm text-gray-500">{desc}</span>
        </div>
      </div>
    ) : (
      <Link href={href!} className="w-full">
        <div className="flex justify-between w-full items-start">
          <div className={`p-3 rounded-lg w-fit mb-2 ${bgColor} ${color} group-hover:scale-110 transition-transform duration-300`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
            </svg>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-gray-600 transition-colors" />
        </div>
        <div className="text-left">
          <span className="font-bold text-gray-900 block group-hover:text-purple-600 transition-colors">{title}</span>
          <span className="text-sm text-gray-500">{desc}</span>
        </div>
      </Link>
    )}
  </Button>
);