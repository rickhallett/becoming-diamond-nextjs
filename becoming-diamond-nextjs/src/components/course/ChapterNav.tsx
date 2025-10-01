"use client";

import { useState } from "react";
import type { CourseChapter } from "@/types/course";
import type { CourseProgress } from "@/types/progress";
import { IconChevronDown, IconChevronRight, IconCircleCheck, IconCircle, IconCircleDashed } from "@tabler/icons-react";
import { isSlideCompleted, isChapterCompleted } from "@/lib/progress";

interface ChapterNavProps {
  chapters: CourseChapter[];
  currentSlideId: string;
  onSlideSelect: (slideId: string) => void;
  progressData?: CourseProgress | null;
}

export default function ChapterNav({ chapters, currentSlideId, onSlideSelect, progressData }: ChapterNavProps) {
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set(chapters.map(ch => ch.id))
  );

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  // Group chapters by part
  const partGroups = chapters.reduce((acc, chapter) => {
    if (!acc[chapter.part]) {
      acc[chapter.part] = [];
    }
    acc[chapter.part].push(chapter);
    return acc;
  }, {} as Record<number, CourseChapter[]>);

  return (
    <nav className="p-6 space-y-8">
      {Object.entries(partGroups).map(([part, partChapters]) => (
        <div key={part} className="space-y-2">
          {/* Part Header */}
          <div className="text-xs font-semibold text-primary/70 uppercase tracking-wider mb-4">
            Part {part}
          </div>

          {/* Chapters in this part */}
          {partChapters.map((chapter) => {
            const isExpanded = expandedChapters.has(chapter.id);
            const hasCurrentSlide = chapter.slides.some(s => s.id === currentSlideId);
            const chapterComplete = progressData ? isChapterCompleted(progressData, chapter.id) : false;

            return (
              <div key={chapter.id} className="space-y-1">
                {/* Chapter Header */}
                <button
                  onClick={() => toggleChapter(chapter.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${
                    hasCurrentSlide
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : chapterComplete
                      ? "bg-green-500/10 text-green-500 border border-green-500/20"
                      : "hover:bg-white/5 text-gray-300"
                  }`}
                >
                  {isExpanded ? (
                    <IconChevronDown className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <IconChevronRight className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span className="text-sm font-medium flex-1">{chapter.title}</span>
                  <div className="flex items-center gap-2">
                    {chapterComplete && <IconCircleCheck className="w-4 h-4 text-green-500" />}
                    <span className="text-xs text-gray-500">{chapter.slides.length}</span>
                  </div>
                </button>

                {/* Slides in this chapter */}
                {isExpanded && (
                  <div className="ml-6 space-y-1 mt-1">
                    {chapter.slides.map((slide) => {
                      const isCurrent = slide.id === currentSlideId;
                      const slideComplete = progressData ? isSlideCompleted(progressData, slide.id) : false;

                      return (
                        <button
                          key={slide.id}
                          onClick={() => onSlideSelect(slide.id)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${
                            isCurrent
                              ? "bg-primary/30 text-primary border border-primary/50"
                              : slideComplete
                              ? "text-green-500/80 hover:bg-white/5 hover:text-green-500"
                              : "hover:bg-white/5 text-gray-400 hover:text-gray-200"
                          }`}
                        >
                          {slideComplete ? (
                            <IconCircleCheck className="w-4 h-4 flex-shrink-0 text-green-500" />
                          ) : isCurrent ? (
                            <IconCircleDashed className="w-4 h-4 flex-shrink-0 text-primary" />
                          ) : (
                            <IconCircle className="w-4 h-4 flex-shrink-0 text-gray-600" />
                          )}
                          <span className="text-sm flex-1 line-clamp-2">{slide.title}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
