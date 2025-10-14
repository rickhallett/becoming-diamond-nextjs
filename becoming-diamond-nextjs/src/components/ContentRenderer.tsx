'use client';

import { useEffect, useRef } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { VideoPlayer } from './VideoPlayer';

interface ContentRendererProps {
  html: string;
  className?: string;
}

/**
 * Renders HTML content and hydrates video player placeholders
 * Finds divs with class="video-placeholder" and mounts VideoPlayer components
 */
export function ContentRenderer({ html, className = '' }: ContentRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Find all video placeholder divs
    const placeholderElements = containerRef.current.querySelectorAll<HTMLDivElement>('.video-placeholder');
    const roots: Root[] = [];

    placeholderElements.forEach((element) => {
      const { videoId, autoplay, poster } = element.dataset;

      if (!videoId) return;

      // Mount React component directly into the placeholder div
      const root = createRoot(element);
      roots.push(root);

      root.render(
        <VideoPlayer
          videoId={videoId}
          autoplay={autoplay === 'true'}
          poster={poster || undefined}
        />
      );
    });

    // Cleanup function to unmount all roots when component unmounts or html changes
    return () => {
      roots.forEach((root) => {
        root.unmount();
      });
    };
  }, [html]); // Re-run when html content changes

  return (
    <div
      ref={containerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
