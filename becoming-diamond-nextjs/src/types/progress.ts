/**
 * Course Progress Tracking Types
 * Used for localStorage persistence and future backend sync
 */

export interface SlideProgress {
  slideId: string;
  completed: boolean;
  completedAt?: string; // ISO timestamp
  timeSpent?: number; // seconds
  lastVisited?: string; // ISO timestamp
}

export interface ChapterProgress {
  chapterId: string;
  slides: SlideProgress[];
  completedSlides: number;
  totalSlides: number;
  isComplete: boolean;
}

export interface CourseProgress {
  courseId: string;
  userId?: string; // For future backend sync
  currentSlideId: string;
  lastAccessedAt: string; // ISO timestamp
  chapters: ChapterProgress[];
  overallProgress: number; // 0-100 percentage
  totalSlidesCompleted: number;
  totalSlides: number;
  startedAt: string; // ISO timestamp
  completedAt?: string; // ISO timestamp when course 100% complete
}

export interface ProgressStats {
  totalTimeSpent: number; // seconds
  averageTimePerSlide: number; // seconds
  completionRate: number; // 0-100 percentage
  currentStreak: number; // consecutive days
  lastStudyDate: string; // ISO timestamp
}
