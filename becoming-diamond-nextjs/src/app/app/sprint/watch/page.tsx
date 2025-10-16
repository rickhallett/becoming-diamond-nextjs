'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PlaylistVideoPlayer } from '@/components/PlaylistVideoPlayer';
import {
  IconPlayerPlay,
  IconCheck,
  IconChevronRight,
  IconArrowLeft,
} from '@tabler/icons-react';
import Link from 'next/link';
import { isDayCompleted } from '@/lib/sprint-progress';

interface VideoItem {
  day: number;
  videoId: string;
  title: string;
  duration: string;
}

const VIDEO_PLAYLIST: VideoItem[] = [
  { day: 1, videoId: '4a151e6b-7911-41b9-b1ef-c6fa00bafaa5', title: 'Day 1: Welcome and Baseline', duration: '5:54' },
  { day: 2, videoId: 'daf70a49-4110-4f52-a2de-7f273a8475c1', title: 'Day 2: Stand Strong Be Strong', duration: '4:03' },
  { day: 3, videoId: 'a2aea625-4738-46f2-b341-46ca7f7dc060', title: 'Day 3: Swiss Army Knife Breath', duration: '3:37' },
  { day: 4, videoId: 'c5a735ac-9c1e-45d0-a19c-80028e59da35', title: 'Day 4: Swiss Army Knife The Brain', duration: '3:30' },
  { day: 5, videoId: 'df89060d-213c-431e-8d77-90b0d756e275', title: 'Day 5: Pattern Interrupts', duration: '3:38' },
  { day: 6, videoId: '83af77c8-a9dd-4519-8ef3-0ac4b5734e7b', title: 'Day 6: Grounding in The Present Moment', duration: '4:29' },
  { day: 7, videoId: 'df982ffb-df9a-4755-9fe2-366594e0e2b8', title: 'Day 7: Congratulations', duration: '2:10' },
  { day: 8, videoId: 'bb119231-068b-485a-9104-1a7603e4d8f5', title: 'Day 8: Introduction to The Boss', duration: '2:47' },
  { day: 9, videoId: '0e8b5da3-4312-466e-b500-5fe34dab888f', title: 'Day 9: Identity Awareness', duration: '3:34' },
  { day: 10, videoId: 'd33ba1bf-d0d3-4e02-bb51-a29d46bfc9f2', title: 'Day 10: ART Accept Release Transform', duration: '3:36' },
  { day: 11, videoId: 'ed4d0b12-2a21-4d41-b102-6c3ac51ad19c', title: 'Day 11: Triggers Are Teachers', duration: '2:08' },
  { day: 12, videoId: 'fe8c2939-7e6c-4863-8538-d98ec5d9fdc0', title: 'Day 12: Break The Default Loop', duration: '1:53' },
  { day: 13, videoId: 'ecf0a25a-8df9-42e7-b62a-82118b555406', title: 'Day 13: Run Your Breath, Run Your Life', duration: '2:40' },
  { day: 14, videoId: '2fa0592e-cc84-489f-818a-1897ebcbb5aa', title: 'Day 14: Discipline Plus Consistency', duration: '1:54' },
  { day: 15, videoId: 'ff25ddf2-0576-417d-a861-985f548fa788', title: 'Day 15: The Pressure Room', duration: '1:47' },
  { day: 16, videoId: '78607971-138c-4f4e-85f9-072833822fe1', title: 'Day 16: ART Squared', duration: '2:15' },
  { day: 17, videoId: '332ea0f7-36f8-4a54-b8fb-7286a9498019', title: 'Day 17: Leading the Field', duration: '5:15' },
  { day: 18, videoId: '19706b3e-6a5f-44aa-b473-7fe7d18d7e79', title: 'Day 18: Calmness is the New Currency', duration: '1:24' },
  { day: 19, videoId: 'f19e972a-04d6-46bd-9fa3-40a72e8938f6', title: 'Day 19: Rewire Through Presence', duration: '3:22' },
  { day: 20, videoId: '649a2a38-db81-4912-94da-c70c6bc1e709', title: 'Day 20: Upgrade Your Capacity', duration: '2:04' },
  { day: 21, videoId: '411a4444-0be6-48c0-9f71-825858bf247d', title: 'Day 21: Week Three Strengthen Summation', duration: '3:39' },
  { day: 22, videoId: '49903bed-23fd-4f88-89b2-ab258e98f77a', title: 'Day 22: Week Four Shine Proximity Prime', duration: '3:42' },
];

export default function SprintWatchPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());

  useEffect(() => {
    setMounted(true);
    // Load completed days
    const completed = new Set<number>();
    for (let day = 1; day <= 22; day++) {
      if (isDayCompleted(day)) {
        completed.add(day);
      }
    }
    setCompletedDays(completed);
  }, []);

  const handleVideoEnded = () => {
    // Auto-advance to next video
    if (currentIndex < VIDEO_PLAYLIST.length - 1) {
      setCurrentIndex(currentIndex + 1);
      // Scroll playlist to show current video
      setTimeout(() => {
        const element = document.getElementById(`video-${currentIndex + 1}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  };

  const handleSelectVideo = (index: number) => {
    setCurrentIndex(index);
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  const currentVideo = VIDEO_PLAYLIST[currentIndex];

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/app/sprint"
                className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-2"
              >
                <IconArrowLeft size={20} />
                Back to Sprint
              </Link>
              <h1 className="text-3xl font-light mb-2">
                Watch <span className="text-primary">Full Sprint</span>
              </h1>
              <p className="text-gray-400">
                Continuous playlist mode • {VIDEO_PLAYLIST.length} videos
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Now Playing</div>
              <div className="text-lg font-medium text-primary">
                {currentIndex + 1} of {VIDEO_PLAYLIST.length}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <PlaylistVideoPlayer
              key={currentVideo.videoId}
              videoId={currentVideo.videoId}
              title={currentVideo.title}
              autoplay={true}
              onEnded={handleVideoEnded}
            />

            {/* Video Info */}
            <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-medium text-white mb-2">
                    {currentVideo.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>Day {currentVideo.day} of 30</span>
                    <span>•</span>
                    <span>{currentVideo.duration}</span>
                    {completedDays.has(currentVideo.day) && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-primary">
                          <IconCheck size={16} />
                          Completed
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <Link
                  href={`/app/sprint/day/${currentVideo.day}`}
                  className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                >
                  View Lesson
                  <IconChevronRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Playlist Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <h3 className="text-lg font-medium text-white">Playlist</h3>
                <p className="text-sm text-gray-400 mt-1">
                  Videos will play automatically
                </p>
              </div>

              <div className="max-h-[600px] overflow-y-auto">
                {VIDEO_PLAYLIST.map((video, index) => (
                  <button
                    key={video.videoId}
                    id={`video-${index}`}
                    onClick={() => handleSelectVideo(index)}
                    className={`w-full p-4 text-left transition-all border-b border-white/5 hover:bg-white/5 ${
                      index === currentIndex
                        ? 'bg-primary/20 border-l-4 border-l-primary'
                        : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {index === currentIndex ? (
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <IconPlayerPlay size={14} className="text-black" />
                          </div>
                        ) : completedDays.has(video.day) ? (
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                            <IconCheck size={14} className="text-primary" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-gray-400 text-xs">
                            {video.day}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-sm font-medium mb-1 ${
                            index === currentIndex ? 'text-primary' : 'text-white'
                          }`}
                        >
                          Day {video.day}
                        </div>
                        <div className="text-xs text-gray-400 mb-1 line-clamp-2">
                          {video.title.replace(`Day ${video.day}: `, '')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {video.duration}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Playlist Footer */}
              <div className="p-4 border-t border-white/10 bg-black/50">
                <div className="text-xs text-gray-500 text-center">
                  {completedDays.size} of {VIDEO_PLAYLIST.length} videos watched
                </div>
                <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{
                      width: `${(completedDays.size / VIDEO_PLAYLIST.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
