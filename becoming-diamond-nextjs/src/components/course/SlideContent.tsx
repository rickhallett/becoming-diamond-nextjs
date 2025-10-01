"use client";

import type { CourseSlide } from "@/types/course";
import { IconNotes } from "@tabler/icons-react";
import { useState, useEffect } from "react";

interface SlideContentProps {
  slide: CourseSlide;
  chapterTitle: string;
  showNotes: boolean;
  onToggleNotes: () => void;
}

export default function SlideContent({ slide, chapterTitle, showNotes }: SlideContentProps) {
  const [notes, setNotes] = useState("");

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem(`slide-notes-${slide.id}`);
    if (savedNotes) {
      setNotes(savedNotes);
    } else {
      setNotes("");
    }
  }, [slide.id]);

  // Save notes to localStorage
  const handleNotesChange = (value: string) => {
    setNotes(value);
    localStorage.setItem(`slide-notes-${slide.id}`, value);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        {chapterTitle}
      </div>

      {/* Slide Title */}
      <h1 className="text-4xl font-bold mb-8 text-white">{slide.title}</h1>

      {/* Media Player (if slide has media) */}
      {slide.mediaUrl && (
        <div className="mb-12 rounded-xl overflow-hidden border border-white/10 bg-black">
          {slide.mediaType === "video" ? (
            <div className="aspect-video bg-black flex items-center justify-center text-gray-500">
              {/* Placeholder for video player */}
              <div className="text-center space-y-2">
                <IconNotes className="w-12 h-12 mx-auto" />
                <p>Video player integration coming soon</p>
                <p className="text-xs">URL: {slide.mediaUrl}</p>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-black flex items-center justify-center text-gray-500">
              {/* Placeholder for audio player */}
              <div className="text-center space-y-2">
                <IconNotes className="w-12 h-12 mx-auto" />
                <p>Audio player integration coming soon</p>
                <p className="text-xs">URL: {slide.mediaUrl}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Slide Content */}
      <div
        className="prose prose-invert prose-lg max-w-none
          prose-headings:font-light prose-headings:tracking-tight
          prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-12 prose-h2:text-primary prose-h2:font-bold prose-h2:leading-tight
          prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-10 prose-h3:text-primary/90 prose-h3:font-semibold
          prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-8 prose-h4:text-white prose-h4:font-medium
          prose-p:text-lg prose-p:mb-6 prose-p:leading-[1.7] prose-p:text-gray-300 prose-p:font-light
          prose-strong:text-primary prose-strong:font-semibold
          prose-em:text-gray-200 prose-em:italic
          prose-a:text-primary prose-a:no-underline prose-a:font-medium hover:prose-a:underline prose-a:transition-all
          prose-code:text-primary prose-code:bg-primary/10 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
          prose-pre:bg-black prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-pre:p-6 prose-pre:my-8
          prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:my-6 prose-blockquote:italic prose-blockquote:text-gray-300 prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-lg
          prose-ul:mb-6 prose-ul:space-y-2 prose-ul:my-6
          prose-ol:mb-6 prose-ol:space-y-2 prose-ol:my-6
          prose-li:text-lg prose-li:leading-[1.7] prose-li:text-gray-300
          prose-li:marker:text-primary
          prose-img:rounded-xl prose-img:border prose-img:border-white/10 prose-img:my-8
          prose-hr:border-white/10 prose-hr:my-12
        "
        dangerouslySetInnerHTML={{ __html: slide.content }}
      />

      {/* Notes Panel */}
      {showNotes && (
        <div className="mt-12 border-t border-white/10 pt-12">
          <div className="flex items-center gap-2 mb-4">
            <IconNotes className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold text-white">Your Notes</h3>
          </div>
          <textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Write your notes here... (saved automatically to browser)"
            className="w-full h-48 bg-black border border-white/10 rounded-lg p-4 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
          />
          <p className="text-xs text-gray-600 mt-2">
            Notes are saved to your browser&apos;s local storage
          </p>
        </div>
      )}
    </div>
  );
}
