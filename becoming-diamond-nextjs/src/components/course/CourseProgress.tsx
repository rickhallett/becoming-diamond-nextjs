"use client";

import type { ParsedCourse } from "@/types/course";
import { IconMenu2 } from "@tabler/icons-react";
import Link from "next/link";

interface CourseProgressProps {
  course: ParsedCourse;
  currentSlideIndex: number;
  totalSlides: number;
  progress: number;
  onMenuToggle: () => void;
}

export default function CourseProgress({
  course,
  currentSlideIndex,
  totalSlides,
  progress,
  onMenuToggle,
}: CourseProgressProps) {
  return (
    <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-white/10">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            <IconMenu2 className="w-6 h-6" />
          </button>

          {/* Course Title & Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <Link
                href="/app/courses"
                className="text-sm text-gray-500 hover:text-primary transition-colors"
              >
                ← Courses
              </Link>
              <div className="h-4 w-px bg-white/10" />
              <h1 className="text-lg font-semibold text-white truncate">
                {course.title}
              </h1>
            </div>
          </div>

          {/* Progress Info */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="text-sm text-gray-400">
              Slide <span className="text-primary font-medium">{currentSlideIndex + 1}</span> of{" "}
              {totalSlides}
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="text-sm">
              <span className="text-primary font-semibold">{Math.round(progress)}%</span>
              <span className="text-gray-500 ml-1">Complete</span>
            </div>
            {progress === 100 && (
              <>
                <div className="h-4 w-px bg-white/10" />
                <div className="text-sm text-green-500 font-medium">
                  🎉 Course Completed!
                </div>
              </>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary/50 to-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </header>
  );
}
