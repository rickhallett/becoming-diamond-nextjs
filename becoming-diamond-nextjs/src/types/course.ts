/**
 * Course Type Definitions
 * Defines the structure for parsed course content, slides, chapters, and notes
 */

export interface CourseMetadata {
  id: string;
  title: string;
  pressureRoom: number;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor: string;
  thumbnail: string;
  published: boolean;
  description?: string;
  estimatedHours?: number;
}

export interface CourseSlide {
  id: string;
  chapterId: string;
  title: string;
  content: string; // HTML rendered from markdown
  order: number;
  mediaUrl?: string;
  mediaType?: 'video' | 'audio';
  estimatedMinutes?: number;
}

export interface CourseChapter {
  id: string;
  title: string;
  order: number;
  part: number; // Part 1-4 from the book structure
  slides: CourseSlide[];
  estimatedMinutes?: number;
}

export interface ParsedCourse {
  id: string;
  title: string;
  metadata: CourseMetadata;
  chapters: CourseChapter[];
  totalSlides: number;
  totalChapters: number;
  estimatedHours?: number;
}

export interface SlideNote {
  id: string;
  courseId: string;
  slideId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseProgress {
  courseId: string;
  viewedSlides: string[];
  lastViewedSlide: string | null;
  totalTimeSpent: number; // seconds
  completedChapters: string[];
  progressPercentage: number;
  lastAccessedAt: string;
}

export interface MediaReference {
  type: 'video' | 'audio';
  placeholder: string;
  url?: string;
}

// Utility type for parser internal use
export interface MarkdownSection {
  level: number; // 1 = #, 2 = ##, 3 = ###
  title: string;
  content: string;
  order: number;
}
