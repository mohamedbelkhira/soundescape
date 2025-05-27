import { Card, CardContent } from '@/components/ui/card'
import { formatDuration } from '@/lib/formatters'
import { TrendingUp, Bookmark, Timer } from 'lucide-react'; // Example icons

// Define the structure for _count locally if not importing a global Audiobook type
interface AudiobookCount {
  listeningProgress: number;
  bookmarks: number;
}

interface AudiobookStatsProps {
  stats: AudiobookCount;
  totalTime: number | null;
}

interface StatBoxProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string; // e.g., 'text-blue-500 dark:text-blue-400'
  bgColorClass: string; // e.g., 'bg-blue-50 dark:bg-blue-900/30'
}

const StatBox = ({ label, value, icon, colorClass, bgColorClass }: StatBoxProps) => (
  <div className={`p-4 rounded-lg shadow-sm flex flex-col items-center text-center ${bgColorClass}`}>
    <div className={`mb-2 p-3 rounded-full ${colorClass} ${bgColorClass.replace('bg-', 'bg-opacity-50 dark:bg-opacity-50')}`}>
        {icon}
    </div>
    <div className={`text-2xl sm:text-3xl font-bold ${colorClass} mb-1`}>
      {value}
    </div>
    <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
      {label}
    </div>
  </div>
);


export const AudiobookStats = ({ stats, totalTime }: AudiobookStatsProps) => {
  return (
    <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-lg">
      <CardContent className="p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4 sm:mb-6">
          Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <StatBox
            label="Times Played"
            value={stats.listeningProgress}
            icon={<TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />}
            colorClass="text-blue-600 dark:text-blue-400"
            bgColorClass="bg-blue-100 dark:bg-blue-900/50"
          />
          <StatBox
            label="Bookmarks"
            value={stats.bookmarks}
            icon={<Bookmark className="h-5 w-5 sm:h-6 sm:w-6" />}
            colorClass="text-purple-600 dark:text-purple-400"
            bgColorClass="bg-purple-100 dark:bg-purple-900/50"
          />
          {totalTime !== null && totalTime > 0 && (
            <StatBox
              label="Full Duration"
              value={formatDuration(totalTime)}
              icon={<Timer className="h-5 w-5 sm:h-6 sm:w-6" />}
              colorClass="text-green-600 dark:text-green-400"
              bgColorClass="bg-green-100 dark:bg-green-900/50"
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}