'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  videoId: string;
  autoplay?: boolean;
  poster?: string;
  onProgress?: (percent: number) => void;
}

export function VideoPlayer({
  videoId,
  autoplay = false,
  poster,
  onProgress,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let hls: Hls | null = null;
    let cleanup: (() => void) | null = null;

    async function initPlayer() {
      try {
        // Fetch signed stream URL (authentication is handled server-side via NextAuth session)
        const response = await fetch(`/api/video/${videoId}/token`);
        if (!response.ok) throw new Error('Failed to load video');

        const { streamUrl } = await response.json();
        const video = videoRef.current;
        if (!video) return;

        // Initialize HLS
        if (Hls.isSupported()) {
          hls = new Hls();
          hls.loadSource(streamUrl);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setLoading(false);
            if (autoplay) video.play();
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // Safari native HLS
          video.src = streamUrl;
          const handler = () => {
            setLoading(false);
            if (autoplay) video.play();
          };
          video.addEventListener('loadedmetadata', handler);
          cleanup = () => video.removeEventListener('loadedmetadata', handler);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    }

    initPlayer();

    return () => {
      // Cleanup HLS instance to prevent memory leak
      if (hls) {
        hls.destroy();
      }
      // Cleanup Safari event listener
      if (cleanup) {
        cleanup();
      }
    };
  }, [videoId, autoplay]);

  // Track progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !onProgress) return;

    const handleTimeUpdate = () => {
      const percent = (video.currentTime / video.duration) * 100;
      onProgress(percent);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [onProgress]);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded p-4 text-red-800">
        Failed to load video: {error}
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
      )}
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        playsInline
        poster={poster}
      />
    </div>
  );
}
