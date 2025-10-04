'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  completed: number;
  total: number;
  showLabel?: boolean;
  className?: string;
}

export default function ProgressBar({
  completed,
  total,
  showLabel = true,
  className = '',
}: ProgressBarProps) {
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm font-medium text-primary">
            {completed}/{total} days ({percentage}%)
          </span>
        </div>
      )}

      <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-blue-400 rounded-full"
        />
      </div>
    </div>
  );
}
