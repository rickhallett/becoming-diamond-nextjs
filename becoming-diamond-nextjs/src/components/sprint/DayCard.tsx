'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { IconLock, IconCheck, IconClock } from '@tabler/icons-react';

interface DayCardProps {
  day: number;
  title: string;
  subtitle: string;
  duration: string;
  isCompleted: boolean;
  isAccessible: boolean;
  index: number;
}

export default function DayCard({
  day,
  title,
  subtitle,
  duration,
  isCompleted,
  isAccessible,
  index,
}: DayCardProps) {
  const cardClassName = `
    group relative bg-secondary/30 border rounded-lg overflow-hidden transition-all
    ${isAccessible
      ? 'border-white/10 hover:border-primary/30 cursor-pointer'
      : 'border-white/5 cursor-not-allowed opacity-60'
    }
    ${isCompleted ? 'border-primary/30' : ''}
  `;

  const cardContent = (
    <div className="p-4">
      {/* Header with Day Number and Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`
              w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border
              ${isCompleted
                ? 'bg-primary/20 text-primary border-primary/50'
                : isAccessible
                  ? 'bg-gray-800 text-gray-300 border-gray-700'
                  : 'bg-gray-900 text-gray-600 border-gray-800'
              }
            `}
          >
            {isCompleted ? (
              <IconCheck size={18} />
            ) : isAccessible ? (
              day
            ) : (
              <IconLock size={16} />
            )}
          </div>
          <div>
            <h3 className={`text-sm font-medium ${isAccessible ? 'text-white' : 'text-gray-600'}`}>
              Day {day}
            </h3>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <IconClock size={12} />
              <span>{duration}</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        {isCompleted && (
          <div className="bg-primary/20 border border-primary/50 text-primary px-2 py-1 rounded-full text-xs font-medium">
            Complete
          </div>
        )}
      </div>

      {/* Title and Subtitle */}
      <h4 className={`text-base font-light mb-1 group-hover:text-primary transition-colors ${isAccessible ? 'text-white' : 'text-gray-600'}`}>
        {title}
      </h4>
      <p className="text-xs text-gray-500 line-clamp-2">{subtitle}</p>

      {/* Locked State Message */}
      {!isAccessible && !isCompleted && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <p className="text-xs text-gray-600 flex items-center gap-1">
            <IconLock size={12} />
            Complete Day {day - 1} to unlock
          </p>
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      whileHover={isAccessible ? { scale: 1.02 } : {}}
    >
      {isAccessible ? (
        <Link href={`/app/sprint/day/${day}`} className={cardClassName}>
          {cardContent}
        </Link>
      ) : (
        <div className={cardClassName}>
          {cardContent}
        </div>
      )}
    </motion.div>
  );
}
