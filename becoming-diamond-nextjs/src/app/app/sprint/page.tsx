'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getProgressStats } from '@/lib/sprint-progress';
import ProgressBar from '@/components/sprint/ProgressBar';
import StatsCard from '@/components/sprint/StatsCard';
import {
  IconTrophy,
  IconFlame,
  IconTarget,
  IconCalendar,
  IconArrowRight,
  IconPlayerPlay,
} from '@tabler/icons-react';

export default function SprintOverviewPage() {
  const [stats, setStats] = useState<ReturnType<typeof getProgressStats> | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStats(getProgressStats());
  }, []);

  if (!mounted || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  const isNotStarted = stats.status === 'not_started';
  const isCompleted = stats.status === 'completed';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-light mb-4">
          30 Day <span className="text-primary">Transformation</span> Sprint
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Transform into your diamond self through 30 days of focused, intentional growth.
        </p>

        {isNotStarted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/app/sprint/day/1"
              className="inline-flex items-center gap-2 bg-primary text-black px-8 py-4 rounded-lg font-medium hover:bg-primary/90 transition-all text-lg"
            >
              Start Your Journey
              <IconArrowRight size={20} />
            </Link>
          </motion.div>
        )}

        {!isNotStarted && !isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href={`/app/sprint/day/${stats.currentDay}`}
              className="inline-flex items-center gap-2 bg-primary text-black px-8 py-4 rounded-lg font-medium hover:bg-primary/90 transition-all text-lg"
            >
              Continue to Day {stats.currentDay}
              <IconArrowRight size={20} />
            </Link>
          </motion.div>
        )}

        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-3 bg-primary/20 border border-primary px-8 py-4 rounded-lg text-primary text-lg"
          >
            <IconTrophy size={24} />
            Sprint Completed!
          </motion.div>
        )}
      </motion.div>

      {/* Progress Section */}
      {!isNotStarted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-black border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-light mb-6">Your Progress</h2>

            <ProgressBar
              completed={stats.completedDays}
              total={stats.totalDays}
              className="mb-8"
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatsCard
                title="Days Completed"
                value={stats.completedDays}
                subtitle={`${stats.remainingDays} remaining`}
                icon={<IconCheck size={32} />}
                delay={0.3}
              />
              <StatsCard
                title="Current Day"
                value={stats.currentDay}
                subtitle="of 30 days"
                icon={<IconTarget size={32} />}
                delay={0.4}
              />
              <StatsCard
                title="Completion"
                value={`${Math.round(stats.completionPercentage)}%`}
                subtitle="overall progress"
                icon={<IconTrophy size={32} />}
                delay={0.5}
              />
              <StatsCard
                title="Days Active"
                value={stats.daysInProgress}
                subtitle="since enrollment"
                icon={<IconCalendar size={32} />}
                delay={0.6}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Link
          href="/app/sprint/dashboard"
          className="block p-6 bg-black border border-gray-800 rounded-lg hover:border-primary transition-all group"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-light mb-2 group-hover:text-primary transition-colors">
                View All Days
              </h3>
              <p className="text-sm text-gray-400">
                See your complete 30-day journey and track which days you&apos;ve completed
              </p>
            </div>
            <IconArrowRight className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
          </div>
        </Link>

        <Link
          href="/app/sprint/watch"
          className="block p-6 bg-black border border-gray-800 rounded-lg hover:border-primary transition-all group"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-light mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                <IconPlayerPlay size={20} className="text-primary" />
                Watch Playlist
              </h3>
              <p className="text-sm text-gray-400">
                Watch all videos continuously with auto-play. Perfect for binge-watching your transformation.
              </p>
            </div>
            <IconArrowRight className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
          </div>
        </Link>
      </motion.div>

      {/* Info Section */}
      {isNotStarted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 p-6 bg-primary/5 border border-primary/20 rounded-lg"
        >
          <h3 className="text-lg font-medium mb-3 text-primary">Before You Begin</h3>
          <p className="text-gray-300 mb-4">
            This is a 30-day commitment to your transformation. Each day builds on the previous one,
            so consistency is key. You&apos;ll need 15-20 minutes per day.
          </p>
          <p className="text-gray-400 text-sm">
            Days unlock progressively—you must complete each day before moving to the next.
            This ensures you build a solid foundation for lasting change.
          </p>
        </motion.div>
      )}
    </div>
  );
}

function IconCheck({ size = 32 }: { size?: number }) {
  return <IconTrophy size={size} />;
}
