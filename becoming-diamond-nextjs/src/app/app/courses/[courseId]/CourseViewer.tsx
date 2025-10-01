"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { ParsedCourse, CourseSlide } from "@/types/course";
import type { CourseProgress as CourseProgressType } from "@/types/progress";
import ChapterNav from "@/components/course/ChapterNav";
import SlideContent from "@/components/course/SlideContent";
import CourseProgress from "@/components/course/CourseProgress";
import { IconChevronLeft, IconChevronRight, IconNotes, IconCircleCheck } from "@tabler/icons-react";
import {
  getCourseProgress,
  updateCurrentSlide,
  markSlideComplete,
  isSlideCompleted,
} from "@/lib/progress";

interface CourseViewerProps {
  course: ParsedCourse;
}

export default function CourseViewer({ course }: CourseViewerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [progressData, setProgressData] = useState<CourseProgressType | null>(null);

  // Flatten all slides for easy navigation
  const allSlides = useMemo(() => {
    const slides: (CourseSlide & { chapterTitle: string })[] = [];
    course.chapters.forEach((chapter) => {
      chapter.slides.forEach((slide) => {
        slides.push({
          ...slide,
          chapterTitle: chapter.title,
        });
      });
    });
    return slides;
  }, [course]);

  // Initialize progress on mount
  useEffect(() => {
    const progress = getCourseProgress(course);
    setProgressData(progress);

    // Resume from last position if available
    if (progress.currentSlideId) {
      const slideIndex = allSlides.findIndex(s => s.id === progress.currentSlideId);
      if (slideIndex !== -1) {
        setCurrentSlideIndex(slideIndex);
      }
    }
  }, [course, allSlides]);

  const currentSlide = allSlides[currentSlideIndex];
  const currentChapter = course.chapters.find(
    (ch) => ch.id === currentSlide?.chapterId
  );

  // Update progress when slide changes
  useEffect(() => {
    if (currentSlide) {
      setProgressData(prev => {
        if (!prev) return prev;
        return updateCurrentSlide(prev, currentSlide.id);
      });
    }
  }, [currentSlideIndex, currentSlide]);

  const goToNextSlide = useCallback(() => {
    if (currentSlideIndex < allSlides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentSlideIndex, allSlides.length]);

  const goToPrevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentSlideIndex]);

  const goToSlide = useCallback((slideId: string) => {
    const index = allSlides.findIndex((slide) => slide.id === slideId);
    if (index !== -1) {
      setCurrentSlideIndex(index);
      setMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [allSlides]);

  // Mark current slide as complete
  const handleMarkComplete = useCallback(() => {
    if (currentSlide && progressData) {
      const updated = markSlideComplete(progressData, currentSlide.id);
      setProgressData(updated);
    }
  }, [currentSlide, progressData]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
        case " ": // Space bar
          e.preventDefault();
          goToNextSlide();
          break;
        case "ArrowLeft":
          e.preventDefault();
          goToPrevSlide();
          break;
        case "n":
        case "N":
          e.preventDefault();
          setShowNotes(!showNotes);
          break;
        case "Escape":
          setMobileMenuOpen(false);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNextSlide, goToPrevSlide, showNotes]);

  if (!currentSlide) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading course...</p>
      </div>
    );
  }

  const progress = progressData?.overallProgress || ((currentSlideIndex + 1) / allSlides.length) * 100;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with Progress */}
      <CourseProgress
        course={course}
        currentSlideIndex={currentSlideIndex}
        totalSlides={allSlides.length}
        progress={progress}
        onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      <div className="flex relative">
        {/* Chapter Navigation Sidebar (Desktop) */}
        <aside className="hidden lg:block w-80 border-r border-white/10 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto bg-black">
          <ChapterNav
            chapters={course.chapters}
            currentSlideId={currentSlide.id}
            onSlideSelect={goToSlide}
            progressData={progressData}
          />
        </aside>

        {/* Mobile Chapter Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/80"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="absolute top-16 left-0 right-0 bottom-0 bg-black border-t border-white/10 overflow-y-auto">
              <ChapterNav
                chapters={course.chapters}
                currentSlideId={currentSlide.id}
                onSlideSelect={goToSlide}
                progressData={progressData}
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          {/* Slide Content */}
          <SlideContent
            slide={currentSlide}
            chapterTitle={currentChapter?.title || ""}
            showNotes={showNotes}
            onToggleNotes={() => setShowNotes(!showNotes)}
          />

          {/* Navigation Controls */}
          <div className="border-t border-white/10 bg-black/50 backdrop-blur-sm sticky bottom-0">
            <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
              {/* Previous Button */}
              <button
                onClick={goToPrevSlide}
                disabled={currentSlideIndex === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-white/10 disabled:hover:bg-transparent"
              >
                <IconChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Center Controls */}
              <div className="flex items-center gap-2">
                {/* Mark Complete Button */}
                {progressData && !isSlideCompleted(progressData, currentSlide.id) ? (
                  <button
                    onClick={handleMarkComplete}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/50 bg-primary/10 hover:bg-primary/20 text-primary transition-all"
                  >
                    <IconCircleCheck className="w-5 h-5" />
                    <span className="hidden sm:inline">Mark Complete</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 text-green-500">
                    <IconCircleCheck className="w-5 h-5" />
                    <span className="hidden sm:inline text-sm">Completed</span>
                  </div>
                )}

                {/* Notes Toggle */}
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                    showNotes
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-white/10 hover:border-primary/50 hover:bg-primary/10"
                  }`}
                >
                  <IconNotes className="w-5 h-5" />
                  <span className="hidden sm:inline">Notes</span>
                </button>
              </div>

              {/* Next Button */}
              <button
                onClick={goToNextSlide}
                disabled={currentSlideIndex === allSlides.length - 1}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-white/10 disabled:hover:bg-transparent"
              >
                <span className="hidden sm:inline">Next</span>
                <IconChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Keyboard Hints */}
            <div className="max-w-4xl mx-auto px-6 pb-2 text-center text-xs text-gray-500">
              Use arrow keys to navigate • Press N for notes
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
