/**
 * Course Progress Management
 * Handles localStorage persistence and progress calculations
 */

import type { CourseProgress, ChapterProgress, SlideProgress } from "@/types/progress";
import type { ParsedCourse } from "@/types/course";

const PROGRESS_KEY_PREFIX = "course-progress-";

/**
 * Initialize progress for a new course
 */
export function initializeCourseProgress(course: ParsedCourse): CourseProgress {
  const now = new Date().toISOString();

  const chapters: ChapterProgress[] = course.chapters.map((chapter) => ({
    chapterId: chapter.id,
    slides: chapter.slides.map((slide) => ({
      slideId: slide.id,
      completed: false,
    })),
    completedSlides: 0,
    totalSlides: chapter.slides.length,
    isComplete: false,
  }));

  return {
    courseId: course.id,
    currentSlideId: course.chapters[0]?.slides[0]?.id || "",
    lastAccessedAt: now,
    startedAt: now,
    chapters,
    overallProgress: 0,
    totalSlidesCompleted: 0,
    totalSlides: course.totalSlides,
  };
}

/**
 * Load progress from localStorage
 */
export function loadCourseProgress(courseId: string): CourseProgress | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(`${PROGRESS_KEY_PREFIX}${courseId}`);
    if (!stored) return null;

    const progress = JSON.parse(stored) as CourseProgress;
    return progress;
  } catch (error) {
    console.error("Error loading course progress:", error);
    return null;
  }
}

/**
 * Save progress to localStorage
 */
export function saveCourseProgress(progress: CourseProgress): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(
      `${PROGRESS_KEY_PREFIX}${progress.courseId}`,
      JSON.stringify(progress)
    );
  } catch (error) {
    console.error("Error saving course progress:", error);
  }
}

/**
 * Get or initialize progress for a course
 */
export function getCourseProgress(course: ParsedCourse): CourseProgress {
  const existing = loadCourseProgress(course.id);
  if (existing) return existing;

  const newProgress = initializeCourseProgress(course);
  saveCourseProgress(newProgress);
  return newProgress;
}

/**
 * Mark a slide as completed
 */
export function markSlideComplete(
  progress: CourseProgress,
  slideId: string
): CourseProgress {
  const now = new Date().toISOString();
  let slideFound = false;

  const updatedChapters = progress.chapters.map((chapter) => {
    const updatedSlides = chapter.slides.map((slide) => {
      if (slide.slideId === slideId && !slide.completed) {
        slideFound = true;
        return {
          ...slide,
          completed: true,
          completedAt: now,
        };
      }
      return slide;
    });

    const completedSlides = updatedSlides.filter((s) => s.completed).length;
    const isComplete = completedSlides === chapter.totalSlides;

    return {
      ...chapter,
      slides: updatedSlides,
      completedSlides,
      isComplete,
    };
  });

  if (!slideFound) return progress;

  const totalSlidesCompleted = updatedChapters.reduce(
    (sum, ch) => sum + ch.completedSlides,
    0
  );
  const overallProgress = (totalSlidesCompleted / progress.totalSlides) * 100;
  const allComplete = totalSlidesCompleted === progress.totalSlides;

  const updated: CourseProgress = {
    ...progress,
    chapters: updatedChapters,
    totalSlidesCompleted,
    overallProgress,
    lastAccessedAt: now,
    ...(allComplete && !progress.completedAt ? { completedAt: now } : {}),
  };

  saveCourseProgress(updated);
  return updated;
}

/**
 * Update current slide position
 */
export function updateCurrentSlide(
  progress: CourseProgress,
  slideId: string
): CourseProgress {
  const now = new Date().toISOString();

  // Update last visited timestamp for the slide
  const updatedChapters = progress.chapters.map((chapter) => ({
    ...chapter,
    slides: chapter.slides.map((slide) =>
      slide.slideId === slideId
        ? { ...slide, lastVisited: now }
        : slide
    ),
  }));

  const updated: CourseProgress = {
    ...progress,
    currentSlideId: slideId,
    lastAccessedAt: now,
    chapters: updatedChapters,
  };

  saveCourseProgress(updated);
  return updated;
}

/**
 * Check if a slide is completed
 */
export function isSlideCompleted(
  progress: CourseProgress,
  slideId: string
): boolean {
  for (const chapter of progress.chapters) {
    const slide = chapter.slides.find((s) => s.slideId === slideId);
    if (slide) return slide.completed;
  }
  return false;
}

/**
 * Check if a chapter is completed
 */
export function isChapterCompleted(
  progress: CourseProgress,
  chapterId: string
): boolean {
  const chapter = progress.chapters.find((ch) => ch.chapterId === chapterId);
  return chapter?.isComplete || false;
}

/**
 * Get progress for a specific chapter
 */
export function getChapterProgress(
  progress: CourseProgress,
  chapterId: string
): ChapterProgress | undefined {
  return progress.chapters.find((ch) => ch.chapterId === chapterId);
}

/**
 * Reset course progress
 */
export function resetCourseProgress(course: ParsedCourse): CourseProgress {
  const newProgress = initializeCourseProgress(course);
  saveCourseProgress(newProgress);
  return newProgress;
}
