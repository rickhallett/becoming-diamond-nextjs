/**
 * Sprint Progress Management (Phase 1 - localStorage)
 *
 * This module handles progress tracking for the 30 Day Sprint using localStorage.
 * In Phase 2, this will be migrated to a database backend.
 */

const STORAGE_KEY = 'sprint_progress_v1';

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
 * Gets the current sprint progress from localStorage
 */
export function getProgress(): SprintProgress {
  if (typeof window === 'undefined') {
    return initializeProgress();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return initializeProgress();
    }

    const progress = JSON.parse(stored) as SprintProgress;

    // Update last access date
    progress.lastAccessDate = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));

    return progress;
  } catch (error) {
    console.error('Error reading sprint progress:', error);
    return initializeProgress();
  }
}

/**
 * Saves sprint progress to localStorage
 */
export function saveProgress(progress: SprintProgress): void {
  if (typeof window === 'undefined') return;

  try {
    progress.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving sprint progress:', error);
  }
}

/**
 * Marks a day as complete and updates progress
 */
export function markDayComplete(dayNumber: number): SprintProgress {
  const progress = getProgress();

  // Don't allow marking days that are not accessible yet
  if (dayNumber > progress.currentDay) {
    throw new Error(`Day ${dayNumber} is not yet accessible. Complete Day ${progress.currentDay} first.`);
  }

  // Don't re-complete already completed days
  if (progress.completedDays.includes(dayNumber)) {
    return progress;
  }

  // Mark as in progress if this is the first day
  if (progress.status === 'not_started') {
    progress.status = 'in_progress';
  }

  // Add to completed days
  progress.completedDays.push(dayNumber);
  progress.completedDays.sort((a, b) => a - b);

  // Update stats
  progress.totalDaysCompleted = progress.completedDays.length;
  progress.completionPercentage = (progress.totalDaysCompleted / 30) * 100;

  // Update current day to next incomplete day
  if (dayNumber === progress.currentDay && dayNumber < 30) {
    progress.currentDay = dayNumber + 1;
  }

  // Mark as completed if all 30 days are done
  if (progress.totalDaysCompleted === 30) {
    progress.status = 'completed';
  }

  saveProgress(progress);
  return progress;
}

/**
 * Checks if a day is accessible (completed previous day or is day 1)
 */
export function isDayAccessible(dayNumber: number): boolean {
  if (dayNumber === 1) return true;

  const progress = getProgress();
  return dayNumber <= progress.currentDay;
}

/**
 * Checks if a day is completed
 */
export function isDayCompleted(dayNumber: number): boolean {
  const progress = getProgress();
  return progress.completedDays.includes(dayNumber);
}

/**
 * Resets all sprint progress (for testing or restart)
 */
export function resetProgress(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error resetting sprint progress:', error);
  }
}

/**
 * Exports progress data for backup
 */
export function exportProgress(): string {
  const progress = getProgress();
  return JSON.stringify(progress, null, 2);
}

/**
 * Imports progress data from backup
 */
export function importProgress(jsonData: string): boolean {
  try {
    const progress = JSON.parse(jsonData) as SprintProgress;

    // Validate the data structure
    if (!progress.sprintId || !Array.isArray(progress.completedDays)) {
      throw new Error('Invalid progress data format');
    }

    saveProgress(progress);
    return true;
  } catch (error) {
    console.error('Error importing sprint progress:', error);
    return false;
  }
}

/**
 * Gets progress statistics
 */
export function getProgressStats() {
  const progress = getProgress();

  return {
    totalDays: 30,
    completedDays: progress.totalDaysCompleted,
    remainingDays: 30 - progress.totalDaysCompleted,
    completionPercentage: progress.completionPercentage,
    currentDay: progress.currentDay,
    status: progress.status,
    daysInProgress: progress.status === 'in_progress'
      ? Math.ceil((new Date().getTime() - new Date(progress.enrollmentDate).getTime()) / (1000 * 60 * 60 * 24))
      : 0,
  };
}
