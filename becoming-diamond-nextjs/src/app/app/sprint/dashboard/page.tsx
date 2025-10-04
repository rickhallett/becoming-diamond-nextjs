'use client';

import { useEffect, useState } from 'react';
import { isDayAccessible, isDayCompleted, getProgressStats } from '@/lib/sprint-progress';
import ProgressBar from '@/components/sprint/ProgressBar';
import DayCard from '@/components/sprint/DayCard';
import { motion } from 'framer-motion';

interface DayData {
  slug: string;
  frontmatter: {
    day: number;
    title: string;
    subtitle: string;
    duration: string;
    [key: string]: unknown;
  };
  content: string;
}

export default function SprintDashboardPage() {
  const [days, setDays] = useState<DayData[]>([]);
  const [stats, setStats] = useState<ReturnType<typeof getProgressStats> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/sprint/days');
        const data = await response.json();
        setDays(data.days || []);
        setStats(getProgressStats());
      } catch (error) {
        console.error('Error loading sprint days:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400">Loading your sprint...</div>
      </div>
    );
  }

  // Group days by week
  const weeks = [
    { name: 'Week 1: Foundation', days: days.slice(0, 7) },
    { name: 'Week 2: Momentum', days: days.slice(7, 14) },
    { name: 'Week 3: Acceleration', days: days.slice(14, 21) },
    { name: 'Week 4: Mastery', days: days.slice(21, 28) },
    { name: 'Final Push', days: days.slice(28, 30) },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-light mb-2">
          Your <span className="text-primary">30 Day Sprint</span>
        </h1>
        <p className="text-gray-400">
          Track your progress through all 30 days of transformation
        </p>
      </motion.div>

      {/* Progress Overview */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 bg-black border border-gray-800 rounded-lg p-6"
        >
          <ProgressBar
            completed={stats.completedDays}
            total={stats.totalDays}
          />
        </motion.div>
      )}

      {/* Weeks */}
      {weeks.map((week, weekIndex) => (
        <motion.div
          key={week.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + weekIndex * 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-light mb-6 pb-2 border-b border-gray-800">
            {week.name}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {week.days.map((day, dayIndex) => {
              const dayNumber = (day.frontmatter.day as number) || 0;
              return (
                <DayCard
                  key={day.slug}
                  day={dayNumber}
                  title={day.frontmatter.title}
                  subtitle={day.frontmatter.subtitle as string}
                  duration={(day.frontmatter.duration as string) || '15 minutes'}
                  isCompleted={isDayCompleted(dayNumber)}
                  isAccessible={isDayAccessible(dayNumber)}
                  index={dayIndex}
                />
              );
            })}
          </div>
        </motion.div>
      ))}

      {/* Empty State */}
      {days.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">No sprint content available yet</p>
          <p className="text-sm text-gray-500">
            Content will be added soon. Check back later!
          </p>
        </div>
      )}
    </div>
  );
}
