'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  isDayAccessible,
  isDayCompleted,
  markDayComplete,
  calculateStreak,
} from '@/lib/sprint-progress';
import { logSync as log } from '@/lib/logger';
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
} from '@tabler/icons-react';
import { ContentRenderer } from '@/components/ContentRenderer';
import CelebrationModal from '@/components/sprint/celebration-modal';

interface DayData {
  slug: string;
  frontmatter: {
    day: number;
    title: string;
    subtitle: string;
    duration: string;
    difficulty: string;
    [key: string]: unknown;
  };
  content: string;
}

export default function SprintDayPage() {
  const params = useParams();
  const router = useRouter();
  const dayNumber = parseInt(params.dayNumber as string, 10);

  const [day, setDay] = useState<DayData | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [_isAccessible, setIsAccessible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [streakCount, setStreakCount] = useState(0);

  useEffect(() => {
    async function loadDay() {
      try {
        // Check accessibility first
        const accessible = isDayAccessible(dayNumber);
        const completed = isDayCompleted(dayNumber);

        setIsAccessible(accessible);
        setIsCompleted(completed);

        if (!accessible) {
          // Redirect to overview if not accessible
          router.push('/app/sprint');
          return;
        }

        const response = await fetch(`/api/sprint/${dayNumber}`);
        const data = await response.json();

        if (!data.day) {
          router.push('/app/sprint/dashboard');
          return;
        }

        setDay(data.day);
      } catch (error) {
        log.error('Error loading day:', 'App', error);
      } finally {
        setLoading(false);
      }
    }

    if (dayNumber && !isNaN(dayNumber)) {
      loadDay();
    }
  }, [dayNumber, router]);

  const handleMarkComplete = () => {
    try {
      setCompleting(true);
      markDayComplete(dayNumber);
      setIsCompleted(true);

      // Calculate streak and show celebration modal
      const streak = calculateStreak();
      setStreakCount(streak);
      setShowModal(true);
      setCompleting(false);
    } catch (error) {
      log.error('Error marking day complete:', 'App', error);
      setCompleting(false);
    }
  };

  const handleContinue = () => {
    setShowModal(false);
    if (dayNumber < 30) {
      router.push(`/app/sprint/day/${dayNumber + 1}`);
    } else {
      router.push('/app/sprint');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!day) {
    return null;
  }

  const hasPrevious = dayNumber > 1;
  const hasNext = dayNumber < 30;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Navigation Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <Link
          href="/app/sprint/dashboard"
          className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors"
        >
          <IconArrowLeft size={20} />
          All Days
        </Link>

        <div className="flex items-center gap-2">
          {hasPrevious && (
            <Link
              href={`/app/sprint/day/${dayNumber - 1}`}
              className="p-2 text-gray-400 hover:text-primary transition-colors"
            >
              <IconArrowLeft size={20} />
            </Link>
          )}
          <span className="text-sm text-gray-500 px-3">
            Day {dayNumber} of 30
          </span>
          {hasNext && isDayCompleted(dayNumber) && (
            <Link
              href={`/app/sprint/day/${dayNumber + 1}`}
              className="p-2 text-gray-400 hover:text-primary transition-colors"
            >
              <IconArrowRight size={20} />
            </Link>
          )}
        </div>
      </motion.div>

      {/* Day Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary flex items-center justify-center text-primary font-medium">
            {dayNumber}
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">
              {day.frontmatter.duration} · {day.frontmatter.difficulty}
            </p>
            <h1 className="text-2xl font-light">{day.frontmatter.title}</h1>
          </div>
        </div>
        <p className="text-base text-gray-400">{day.frontmatter.subtitle}</p>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ContentRenderer
          html={day.content}
          className="prose prose-sm prose-invert prose-primary max-w-none mb-10 leading-relaxed"
        />
      </motion.div>

      {/* Mark Complete Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="sticky bottom-8 bg-black/80 backdrop-blur-sm border border-gray-800 rounded-lg p-4"
      >
        <div className="flex items-center justify-between">
          <div>
            {isCompleted ? (
              <div className="flex items-center gap-2 text-primary text-sm">
                <IconCheck size={16} />
                <span className="font-medium">Day {dayNumber} Complete!</span>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">
                Finished this day&apos;s content?
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!isCompleted && (
              <button
                onClick={handleMarkComplete}
                disabled={completing}
                className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                <IconCheck size={16} />
                Mark Complete
              </button>
            )}

            {isCompleted && hasNext && (
              <Link
                href={`/app/sprint/day/${dayNumber + 1}`}
                className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all"
              >
                Next Day
                <IconArrowRight size={16} />
              </Link>
            )}

            {isCompleted && !hasNext && (
              <Link
                href="/app/sprint"
                className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all"
              >
                View Overview
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={showModal}
        onClose={handleCloseModal}
        dayNumber={dayNumber}
        streakCount={streakCount}
        onContinue={handleContinue}
      />
    </div>
  );
}
