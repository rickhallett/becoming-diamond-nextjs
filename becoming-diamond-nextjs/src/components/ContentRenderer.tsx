'use client';

import { useEffect, useRef, useMemo } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { VideoPlayer } from './VideoPlayer';

interface ContentRendererProps {
  html: string;
  className?: string;
}

/**
 * Strips first h1 and first p from HTML string to avoid duplicate title/subtitle
 */
function stripDuplicateHeader(html: string): string {
  // Remove first h1 tag and its content
  let processed = html.replace(/<h1[^>]*>.*?<\/h1>/, '');

  // Remove first p tag and its content
  processed = processed.replace(/<p[^>]*>.*?<\/p>/, '');

  return processed;
}

/**
 * Renders HTML content and hydrates video player placeholders
 * Finds divs with class="video-placeholder" and mounts VideoPlayer components
 */
export function ContentRenderer({ html, className = '' }: ContentRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rootsRef = useRef<Root[]>([]);

  // Strip duplicate header before render
  const processedHtml = useMemo(() => stripDuplicateHeader(html), [html]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Delay to ensure dangerouslySetInnerHTML completes DOM insertion
    const timeoutId = setTimeout(() => {
      if (!containerRef.current) return;

      // Cleanup any existing roots first
      rootsRef.current.forEach((root) => {
        try {
          root.unmount();
        } catch (e) {
          // Ignore unmount errors
        }
      });
      rootsRef.current = [];

      // Find all video placeholder divs
      const placeholderElements = containerRef.current?.querySelectorAll<HTMLDivElement>('.video-placeholder');
      if (!placeholderElements) return;

      placeholderElements.forEach((element) => {
        const { videoId, autoplay, poster } = element.dataset;

        if (!videoId) return;

        // Mount React component directly into the placeholder div
        const root = createRoot(element);
        rootsRef.current.push(root);

        root.render(
          <VideoPlayer
            videoId={videoId}
            autoplay={autoplay === 'true'}
            poster={poster || undefined}
          />
        );
      });
    }, 300);

    // Cleanup function to unmount all roots when component unmounts or html changes
    return () => {
      clearTimeout(timeoutId);
      rootsRef.current.forEach((root) => {
        try {
          root.unmount();
        } catch (e) {
          // Ignore unmount errors
        }
      });
      rootsRef.current = [];
    };
  }, [processedHtml]); // Re-run when html content changes

  return (
    <div
      ref={containerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
}
