'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface PlaylistVideoPlayerProps {
  videoId: string;
  title: string;
  autoplay?: boolean;
  onEnded?: () => void;
  onProgress?: (percent: number) => void;
}

export function PlaylistVideoPlayer({
  videoId,
  title,
  autoplay = false,
  onEnded,
  onProgress,
}: PlaylistVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    async function initPlayer() {
      try {
        setLoading(true);
        setError(null);

        // Check for test auth in localStorage
        const testAuth = typeof window !== 'undefined'
          ? localStorage.getItem('bd_user_auth')
          : null;

        // Fetch signed stream URL
        const headers: HeadersInit = {};
        if (testAuth) {
          headers['x-test-auth'] = 'true';
        }

        const response = await fetch(`/api/video/${videoId}/token`, { headers });
        if (!response.ok) throw new Error('Failed to load video');

        const { streamUrl } = await response.json();
        const video = videoRef.current;
        if (!video) return;

        // Clean up previous HLS instance
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }

        // Initialize HLS
        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
          });
          hlsRef.current = hls;

          hls.loadSource(streamUrl);
          hls.attachMedia(video);

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setLoading(false);
            if (autoplay) {
              video.play().catch(err => {
                console.error('Autoplay failed:', err);
              });
            }
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              setError('Video playback error');
              setLoading(false);
            }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // Safari native HLS
          video.src = streamUrl;
          video.addEventListener('loadedmetadata', () => {
            setLoading(false);
            if (autoplay) {
              video.play().catch(err => {
                console.error('Autoplay failed:', err);
              });
            }
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    }

    initPlayer();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [videoId, autoplay]);

  // Track progress and ended event
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (onProgress) {
        const percent = (video.currentTime / video.duration) * 100;
        onProgress(percent);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      if (onEnded) {
        onEnded();
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onProgress, onEnded]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded p-4 text-red-800">
        Failed to load video: {error}
      </div>
    );
  }

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
      )}

      {/* Video Title Overlay */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 z-20">
        <h3 className="text-white text-lg font-medium">{title}</h3>
      </div>

      {/* Video Player */}
      <div className="relative aspect-video">
        <video
          ref={videoRef}
          className="w-full h-full"
          controls
          playsInline
        />
      </div>

      {/* Progress Bar */}
      {duration > 0 && (
        <div className="px-4 py-2 bg-black/90 text-white text-sm">
          <div className="flex items-center justify-between mb-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
