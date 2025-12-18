"use client"

import { motion } from "framer-motion"
import { Play, Clock, Heart, Star, ChevronRight, Headphones, BookOpen, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function UserDashboardClient({ session }: { session: any }) {
    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-2xl"
            >
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>

                <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-6 max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium"
                        >
                            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                            <span>Premium Member</span>
                        </motion.div>

                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Ready to continue your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">audio journey?</span>
                        </h1>

                        <p className="text-lg text-indigo-100 max-w-lg">
                            Discover thousands of premium audiobooks. From bestsellers to hidden gems, your next adventure awaits.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold">
                                <Play className="w-5 h-5 mr-2 fill-current" />
                                Resume Listening
                            </Button>
                            <Button size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 rounded-xl backdrop-blur-sm">
                                Explore Library
                            </Button>
                        </div>
                    </div>

                    <div className="hidden md:block relative">
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="relative z-10 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl max-w-xs"
                        >
                            <div className="aspect-square rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 mb-4 shadow-inner flex items-center justify-center">
                                <Headphones className="w-20 h-20 text-white/50" />
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 bg-white/20 rounded w-3/4"></div>
                                <div className="h-3 bg-white/10 rounded w-1/2"></div>
                            </div>
                            <div className="mt-6 flex items-center justify-between">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-indigo-500"></div>
                                    ))}
                                </div>
                                <span className="text-xs text-indigo-200">1.2k listening</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Stats / Info Section */}
            <div className="grid md:grid-cols-3 gap-6">
                <InfoCard
                    icon={User}
                    title="Your Profile"
                    value={session.user.name}
                    subtext={session.user.email}
                    color="bg-blue-50 text-blue-600"
                    delay={0.3}
                />
                <InfoCard
                    icon={Clock}
                    title="Listening Time"
                    value="0h 0m"
                    subtext="Start listening to track stats"
                    color="bg-purple-50 text-purple-600"
                    delay={0.4}
                />
                <InfoCard
                    icon={Heart}
                    title="Favorites"
                    value="0 Books"
                    subtext="Save books you love"
                    color="bg-pink-50 text-pink-600"
                    delay={0.5}
                />
            </div>

            {/* Coming Soon Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Coming Soon</h2>
                    <Button variant="ghost" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                        View Roadmap <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <FeatureCard
                        icon={BookOpen}
                        title="Browse Collection"
                        desc="Explore our vast library of premium audiobooks with advanced filtering."
                        delay={0.6}
                    />
                    <FeatureCard
                        icon={Headphones}
                        title="Immersive Player"
                        desc="Experience sound like never before with our spatial audio player."
                        delay={0.7}
                    />
                    <FeatureCard
                        icon={Star}
                        title="Personal Library"
                        desc="Curate your own collection and track your listening progress."
                        delay={0.8}
                    />
                </div>
            </div>
        </div>
    )
}

function InfoCard({ icon: Icon, title, value, subtext, color, delay }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
                    <p className="text-xs text-gray-400">{subtext}</p>
                </div>
                <div className={`p-3 rounded-xl ${color}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </motion.div>
    )
}

function FeatureCard({ icon: Icon, title, desc, delay }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
            <div className="w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-purple-50 text-gray-600 group-hover:text-purple-600 flex items-center justify-center mb-4 transition-colors">
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
        </motion.div>
    )
}
