/**
 * Sprint Progress Management (Phase 2 - API-based)
 *
 * This module handles progress tracking for the 30 Day Sprint using API calls.
 * All functions are async and interact with the database via API endpoints.
 */

import { logSync as log } from '@/lib/logger';

export interface SprintProgress {
  sprintId: string;
  enrollmentDate: string;
  completedDays: number[];
  currentDay: number;
  totalDaysCompleted: number;
  completionPercentage: number;
  status: 'not_started' | 'in_progress' | 'completed';
  lastAccessDate: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory cache for performance
let cachedProgress: SprintProgress | null = null;

/**
 * Initializes a new sprint progress object
 */
function initializeProgress(): SprintProgress {
  const now = new Date().toISOString();
  return {
    sprintId: '30-day-sprint',
    enrollmentDate: now,
    completedDays: [],
    currentDay: 1,
    totalDaysCompleted: 0,
    completionPercentage: 0,
    status: 'not_started',
    lastAccessDate: now,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Gets the current sprint progress from API
 */
export async function getProgress(): Promise<SprintProgress> {
  try {
    const response = await fetch('/api/sprint/progress', {
      credentials: 'include'
    });

    if (!response.ok) {
      if (response.status === 401) {
        log.error('Unauthorized - user not logged in', 'Lib');
        return initializeProgress();
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.progress) {
      cachedProgress = data.progress;
      return data.progress;
    }

    // Initialize new progress for first-time users
    const initialized = initializeProgress();
    cachedProgress = initialized;
    return initialized;
  } catch (error) {
    log.error('Failed to fetch progress from server', 'Lib', error);

    // Return cached version if available
    if (cachedProgress) {
      return cachedProgress;
    }

    // Last resort: return initialized progress
    return initializeProgress();
  }
}

/**
 * Marks a day as complete and updates progress
 */
export async function markDayComplete(dayNumber: number): Promise<SprintProgress> {
  try {
    const response = await fetch('/api/sprint/progress/complete-day', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ dayNumber })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to complete day');
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to complete day');
    }

    // Update cache
    cachedProgress = data.progress;
    return data.progress;
  } catch (error) {
    log.error('Failed to mark day complete', 'Lib', error);
    throw error; // Re-throw so UI can handle
  }
}

/**
 * Checks if a day is accessible (completed previous day or is day 1)
 */
export async function isDayAccessible(dayNumber: number): Promise<boolean> {
  if (dayNumber === 1) return true;

  const progress = await getProgress();
  return dayNumber <= progress.currentDay;
}

/**
 * Checks if a day is completed
 */
export async function isDayCompleted(dayNumber: number): Promise<boolean> {
  const progress = await getProgress();
  return progress.completedDays.includes(dayNumber);
}

/**
 * Resets all sprint progress
 */
export async function resetProgress(): Promise<void> {
  try {
    const response = await fetch('/api/sprint/progress/reset', {
      method: 'POST',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to reset progress');
    }

    cachedProgress = null;
  } catch (error) {
    log.error('Failed to reset progress', 'Lib', error);
    throw error;
  }
}

/**
 * Calculates the current streak (consecutive days completed)
 */
export function calculateStreak(completedDays: number[]): number {
  if (completedDays.length === 0) {
    return 0;
  }

  const sortedDays = [...completedDays].sort((a, b) => a - b);
  let streak = 1;

  // Count consecutive days from the end
  for (let i = sortedDays.length - 1; i > 0; i--) {
    if (sortedDays[i] - sortedDays[i - 1] === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Gets progress statistics
 */
export async function getProgressStats() {
  const progress = await getProgress();

  return {
    totalDays: 30,
    completedDays: progress.totalDaysCompleted,
    remainingDays: 30 - progress.totalDaysCompleted,
    completionPercentage: progress.completionPercentage,
    currentDay: progress.currentDay,
    status: progress.status,
    streak: calculateStreak(progress.completedDays),
    daysInProgress: progress.status === 'in_progress'
      ? Math.ceil((new Date().getTime() - new Date(progress.enrollmentDate).getTime()) / (1000 * 60 * 60 * 24))
      : 0,
  };
}

/**
 * Clears the in-memory cache (useful for logout)
 */
export function clearCache(): void {
  cachedProgress = null;
}
