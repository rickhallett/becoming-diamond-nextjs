# 30 Day Sprint - Phase 1 PRD (MVP)

**Version:** 1.0
**Last Updated:** 2025-10-03
**Phase:** 1 of 3 (MVP - Core Functionality)
**Status:** Ready for Implementation

---

## Phase 1 Overview

**Goal:** Deliver a functional 30 Day Sprint feature with core functionality, allowing users to access daily content, track basic progress, and complete the sprint using browser-based storage.

**Timeline:** 3-4 weeks development + 2 weeks testing
**Complexity:** Medium
**Priority:** High

---

## Scope Definition

### In Scope (Phase 1)

**Core Features:**
- ✅ Sprint overview/landing page
- ✅ 30 individual day content pages (markdown-based)
- ✅ Manual "Mark Complete" button per day
- ✅ Sequential day unlocking (complete Day X to unlock Day X+1)
- ✅ Basic progress tracking (days completed, percentage)
- ✅ All days dashboard view
- ✅ Navigation between days
- ✅ Browser-based storage (localStorage)
- ✅ Mobile responsive design
- ✅ Integration with existing sidebar navigation

**Content System:**
- ✅ Markdown files with frontmatter (title, subtitle, body)
- ✅ Optional video embeds (YouTube, Vimeo)
- ✅ Optional audio player
- ✅ Optional image gallery
- ✅ Content rendered as HTML from markdown

**UI Components:**
- ✅ Progress bar/ring showing completion percentage
- ✅ Day cards with locked/unlocked/completed states
- ✅ Simple completion confirmation
- ✅ Navigation controls (previous/next day)

### Out of Scope (Phase 1)

**Deferred to Phase 2:**
- ❌ Database integration (API routes)
- ❌ Badge/achievement system
- ❌ Streak tracking beyond basic count
- ❌ Advanced animations and celebrations
- ❌ Email notifications
- ❌ Social sharing
- ❌ Export/import progress
- ❌ Advanced analytics

**Deferred to Phase 3:**
- ❌ Date-locked progression
- ❌ Cohort system
- ❌ Community features
- ❌ Leaderboard
- ❌ Admin panel
- ❌ Multiple sprint variations

---

## User Stories (Phase 1)

### Epic 1: Sprint Enrollment & Overview

**US-1.1: View Sprint Landing Page**
```
As a member
I want to see an overview of the 30 Day Sprint
So that I can understand what it offers and decide to enroll

Acceptance Criteria:
- Page displays sprint title and description
- Shows expected daily time commitment
- Displays "Start Sprint" CTA button
- Responsive on mobile and desktop
- Matches existing member portal design theme
```

**US-1.2: Enroll in Sprint**
```
As a member
I want to enroll in the sprint with one click
So that I can begin my 30-day journey

Acceptance Criteria:
- Click "Start Sprint" button enrolls user
- Day 1 content becomes immediately accessible
- Progress tracker initializes at 0/30
- User is redirected to Day 1 or dashboard
- Enrollment state persists in localStorage
```

**US-1.3: Return to Ongoing Sprint**
```
As an enrolled member
I want to see my current progress when I visit the sprint page
So that I can continue where I left off

Acceptance Criteria:
- Landing page shows "Continue Sprint" instead of "Start Sprint"
- Displays current progress (e.g., "7/30 days complete")
- Shows CTA to go to current active day
- Shows CTA to view dashboard
```

### Epic 2: Daily Content Access

**US-2.1: View Day Content**
```
As an enrolled member
I want to view a day's content
So that I can learn and engage with the material

Acceptance Criteria:
- Day page displays day number (e.g., "Day 7 of 30")
- Shows day title and subtitle
- Renders markdown content as formatted HTML
- Displays video player if video exists in frontmatter
- Displays audio player if audio exists in frontmatter
- Displays image gallery if images exist in frontmatter
- Mobile responsive layout
```

**US-2.2: Mark Day Complete**
```
As a member viewing a day's content
I want to mark the day as complete
So that I can unlock the next day and track my progress

Acceptance Criteria:
- "Mark Day X Complete" button is visible and accessible
- Button is disabled if day is already completed
- Clicking button marks day as completed
- Shows simple confirmation message
- Updates progress tracker immediately
- Unlocks next day (Day X+1)
- Completion persists in localStorage
```

**US-2.3: Navigate Between Days**
```
As a member
I want to navigate between days
So that I can review previous content or move forward

Acceptance Criteria:
- "Previous Day" button navigates to Day X-1 (disabled on Day 1)
- "Next Day" button navigates to Day X+1 (disabled if locked)
- Locked days show lock icon and tooltip
- Can navigate to any completed day from dashboard
- URL updates to reflect current day (/app/sprint/day/7)
```

**US-2.4: View Locked Day State**
```
As a member
I want to see which days are locked
So that I understand I need to complete previous days first

Acceptance Criteria:
- Locked days display lock icon
- Cannot access locked day content
- Tooltip explains: "Complete Day X to unlock"
- Locked days are visually distinct (grayscale or dimmed)
```

### Epic 3: Progress Tracking

**US-3.1: View Overall Progress**
```
As a member
I want to see my overall sprint progress
So that I can understand how far I've come

Acceptance Criteria:
- Progress indicator shows X/30 days complete
- Progress percentage displayed (0-100%)
- Visual progress bar or ring
- Updates in real-time when day completed
- Visible on dashboard and individual day pages
```

**US-3.2: View All Days Dashboard**
```
As a member
I want to see all 30 days at a glance
So that I can navigate quickly and see my progress visually

Acceptance Criteria:
- Dashboard displays all 30 days
- Days organized by weeks (Week 1-4)
- Day cards show status: completed ✓, active (current), or locked 🔒
- Click completed day → navigate to that day
- Click active day → navigate to that day
- Click locked day → show tooltip (no navigation)
- Progress summary displayed at top
```

**US-3.3: Track Completion Timestamps**
```
As a system
I want to store when each day was completed
So that future features can calculate streaks and analytics

Acceptance Criteria:
- Each completed day has timestamp (ISO 8601)
- Timestamps stored in localStorage
- Data structure supports future streak calculations
- Timestamps displayed in user's local timezone
```

### Epic 4: Content Management

**US-4.1: Create Day Content via Markdown**
```
As a content creator
I want to create day content using markdown files
So that I can easily write and update content

Acceptance Criteria:
- Markdown files in content/sprint/ directory
- Frontmatter supports: day, title, subtitle, published, video, audio, images
- Markdown body renders to HTML
- Unpublished days are not accessible
- Content updates require rebuild (static generation)
```

**US-4.2: Embed Video Content**
```
As a content creator
I want to embed videos in day content
So that users can watch video lessons

Acceptance Criteria:
- Support YouTube embed format: "youtube:VIDEO_ID"
- Support Vimeo embed format: "vimeo:VIDEO_ID"
- Support direct URL embed
- Video displays in 16:9 responsive player
- Video is optional (not all days require video)
- Parser handles missing video gracefully
```

**US-4.3: Embed Audio Content**
```
As a content creator
I want to embed audio in day content
So that users can listen to audio content

Acceptance Criteria:
- Support direct audio file URL: "/uploads/day-01.mp3"
- Display HTML5 audio player
- Controls: play, pause, scrub, volume
- Audio is optional
- Parser handles missing audio gracefully
```

**US-4.4: Add Images to Day Content**
```
As a content creator
I want to add images to day content
So that visual learners can benefit from diagrams and photos

Acceptance Criteria:
- Support array of image URLs in frontmatter
- Images display in responsive grid
- Lazy loading for performance
- Images are optional
- Parser handles missing images gracefully
```

---

## Technical Specifications (Phase 1)

### File Structure

```
src/
├── app/
│   └── app/
│       └── sprint/
│           ├── page.tsx                    # Sprint overview/landing
│           ├── dashboard/
│           │   └── page.tsx                # All days view
│           └── day/
│               └── [dayNumber]/
│                   └── page.tsx            # Individual day content
├── components/
│   └── sprint/
│       ├── SprintOverview.tsx              # Landing page components
│       ├── DayContent.tsx                  # Day content renderer
│       ├── ProgressTracker.tsx             # Progress display component
│       ├── DayCard.tsx                     # Individual day card
│       ├── DayNavigation.tsx               # Prev/Next navigation
│       ├── CompletionButton.tsx            # Mark complete button
│       ├── VideoPlayer.tsx                 # Video embed component
│       ├── AudioPlayer.tsx                 # Audio player component
│       └── ImageGallery.tsx                # Image display component
├── contexts/
│   └── SprintContext.tsx                   # Sprint state management
├── lib/
│   ├── content.ts                          # Extended with sprint functions
│   └── sprint-storage.ts                   # localStorage utilities
├── types/
│   └── sprint.ts                           # TypeScript interfaces
└── hooks/
    └── useSprint.ts                        # Custom hook for sprint context

content/
└── sprint/
    ├── day-01.md
    ├── day-02.md
    ├── ...
    └── day-30.md
```

### Data Models (TypeScript Interfaces)

**File:** `src/types/sprint.ts`

```typescript
// Content item for a single sprint day
export interface SprintDay {
  day: number;                              // 1-30
  slug: string;                             // "day-01"
  frontmatter: {
    day: number;
    title: string;
    subtitle: string;
    published: boolean;

    // Optional media
    video?: string;                         // "youtube:ID" or URL
    audio?: string;                         // URL
    images?: string[];                      // Array of URLs

    // Optional metadata
    duration?: string;                      // "15 minutes"
    week?: number;                          // 1-4
    tags?: string[];
    description?: string;
  };
  content: string;                          // Rendered HTML
}

// User's sprint progress (stored in localStorage)
export interface SprintProgress {
  userId: string;
  sprintId: string;                         // "30-day-sprint"
  enrollmentDate: string;                   // ISO 8601

  completedDays: CompletedDay[];
  currentDay: number;                       // 1-30, next day to complete

  totalDaysCompleted: number;               // 0-30
  completionPercentage: number;             // 0-100

  status: "not_started" | "in_progress" | "completed";
  completionDate?: string;                  // ISO 8601 (when Day 30 completed)

  lastAccessDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompletedDay {
  day: number;
  completedAt: string;                      // ISO 8601
}

// Day card state for UI
export type DayCardState = "completed" | "active" | "unlocked" | "locked";
```

### Content Functions

**File:** `src/lib/content.ts` (additions)

```typescript
/**
 * Get all sprint days
 */
export async function getSprintDays(): Promise<SprintDay[]> {
  const sprintDirectory = path.join(contentDirectory, 'sprint');

  if (!fs.existsSync(sprintDirectory)) {
    return [];
  }

  const files = fs.readdirSync(sprintDirectory);
  const days = await Promise.all(
    files
      .filter(file => file.endsWith('.md') && file.startsWith('day-'))
      .map(async (file) => {
        const dayNumber = parseInt(file.match(/day-(\d+)/)?.[1] || '0');
        const fullPath = path.join(sprintDirectory, file);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        const htmlContent = await markdownToHtml(content);

        return {
          day: dayNumber,
          slug: file.replace(/\.md$/, ''),
          frontmatter: data as SprintDay['frontmatter'],
          content: htmlContent,
        };
      })
  );

  return days
    .filter(day => day.frontmatter.published !== false)
    .sort((a, b) => a.day - b.day);
}

/**
 * Get single sprint day by day number
 */
export async function getSprintDay(dayNumber: number): Promise<SprintDay | null> {
  const paddedDay = dayNumber.toString().padStart(2, '0');
  const fullPath = path.join(contentDirectory, 'sprint', `day-${paddedDay}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const htmlContent = await markdownToHtml(content);

  return {
    day: dayNumber,
    slug: `day-${paddedDay}`,
    frontmatter: data as SprintDay['frontmatter'],
    content: htmlContent,
  };
}

/**
 * Generate static params for all sprint days (for static generation)
 */
export async function getSprintDayParams() {
  const days = await getSprintDays();
  return days.map(day => ({
    dayNumber: day.day.toString(),
  }));
}
```

### LocalStorage Utilities

**File:** `src/lib/sprint-storage.ts`

```typescript
import { SprintProgress, CompletedDay } from '@/types/sprint';

const STORAGE_PREFIX = 'sprint_progress_';

/**
 * Get storage key for user's sprint progress
 */
function getStorageKey(userId: string): string {
  return `${STORAGE_PREFIX}${userId}`;
}

/**
 * Load sprint progress from localStorage
 */
export function loadSprintProgress(userId: string): SprintProgress | null {
  if (typeof window === 'undefined') return null;

  const key = getStorageKey(userId);
  const data = localStorage.getItem(key);

  if (!data) return null;

  try {
    return JSON.parse(data) as SprintProgress;
  } catch (error) {
    console.error('Error parsing sprint progress:', error);
    return null;
  }
}

/**
 * Save sprint progress to localStorage
 */
export function saveSprintProgress(userId: string, progress: SprintProgress): void {
  if (typeof window === 'undefined') return;

  const key = getStorageKey(userId);
  localStorage.setItem(key, JSON.stringify(progress));
}

/**
 * Create new sprint progress (enrollment)
 */
export function createSprintProgress(userId: string): SprintProgress {
  const now = new Date().toISOString();

  return {
    userId,
    sprintId: '30-day-sprint',
    enrollmentDate: now,
    completedDays: [],
    currentDay: 1,
    totalDaysCompleted: 0,
    completionPercentage: 0,
    status: 'in_progress',
    lastAccessDate: now,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Mark a day as complete
 */
export function markDayComplete(
  progress: SprintProgress,
  day: number
): SprintProgress {
  // Check if already completed
  if (progress.completedDays.some(d => d.day === day)) {
    return progress;
  }

  const completedDay: CompletedDay = {
    day,
    completedAt: new Date().toISOString(),
  };

  const updatedCompletedDays = [...progress.completedDays, completedDay]
    .sort((a, b) => a.day - b.day);

  const newTotalCompleted = updatedCompletedDays.length;
  const newPercentage = (newTotalCompleted / 30) * 100;
  const newCurrentDay = day < 30 ? day + 1 : 30;
  const newStatus = newTotalCompleted === 30 ? 'completed' : 'in_progress';

  return {
    ...progress,
    completedDays: updatedCompletedDays,
    totalDaysCompleted: newTotalCompleted,
    completionPercentage: newPercentage,
    currentDay: newCurrentDay,
    status: newStatus,
    completionDate: newStatus === 'completed' ? new Date().toISOString() : undefined,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Check if a day is unlocked
 */
export function isDayUnlocked(progress: SprintProgress | null, day: number): boolean {
  if (!progress) return false;
  if (day < 1 || day > 30) return false;

  // Day is unlocked if it's <= current day
  return day <= progress.currentDay;
}

/**
 * Check if a day is completed
 */
export function isDayCompleted(progress: SprintProgress | null, day: number): boolean {
  if (!progress) return false;
  return progress.completedDays.some(d => d.day === day);
}

/**
 * Get day card state for UI
 */
export function getDayCardState(
  progress: SprintProgress | null,
  day: number
): DayCardState {
  if (!progress) return 'locked';

  if (isDayCompleted(progress, day)) return 'completed';
  if (day === progress.currentDay) return 'active';
  if (isDayUnlocked(progress, day)) return 'unlocked';
  return 'locked';
}
```

### React Context Provider

**File:** `src/contexts/SprintContext.tsx`

```typescript
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { SprintProgress } from '@/types/sprint';
import {
  loadSprintProgress,
  saveSprintProgress,
  createSprintProgress,
  markDayComplete as markDayCompleteUtil,
  isDayUnlocked as isDayUnlockedUtil,
  isDayCompleted as isDayCompletedUtil,
  getDayCardState,
} from '@/lib/sprint-storage';

interface SprintContextValue {
  progress: SprintProgress | null;
  isLoading: boolean;
  isEnrolled: boolean;

  enrollInSprint: () => void;
  completeDay: (day: number) => void;

  isDayUnlocked: (day: number) => boolean;
  isDayCompleted: (day: number) => boolean;
  getDayState: (day: number) => DayCardState;
  getNextUncompletedDay: () => number | null;
}

const SprintContext = createContext<SprintContextValue | undefined>(undefined);

export function SprintProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [progress, setProgress] = useState<SprintProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load progress from localStorage on mount
  useEffect(() => {
    if (!session?.user?.id) {
      setIsLoading(false);
      return;
    }

    const savedProgress = loadSprintProgress(session.user.id);
    setProgress(savedProgress);
    setIsLoading(false);
  }, [session?.user?.id]);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (progress && session?.user?.id) {
      saveSprintProgress(session.user.id, progress);
    }
  }, [progress, session?.user?.id]);

  const enrollInSprint = () => {
    if (!session?.user?.id) return;

    const newProgress = createSprintProgress(session.user.id);
    setProgress(newProgress);
  };

  const completeDay = (day: number) => {
    if (!progress) return;

    const updatedProgress = markDayCompleteUtil(progress, day);
    setProgress(updatedProgress);
  };

  const isDayUnlocked = (day: number): boolean => {
    return isDayUnlockedUtil(progress, day);
  };

  const isDayCompleted = (day: number): boolean => {
    return isDayCompletedUtil(progress, day);
  };

  const getDayState = (day: number) => {
    return getDayCardState(progress, day);
  };

  const getNextUncompletedDay = (): number | null => {
    if (!progress) return null;

    for (let day = 1; day <= 30; day++) {
      if (!isDayCompleted(day) && isDayUnlocked(day)) {
        return day;
      }
    }

    return null;
  };

  const value: SprintContextValue = {
    progress,
    isLoading,
    isEnrolled: progress !== null && progress.status !== 'not_started',
    enrollInSprint,
    completeDay,
    isDayUnlocked,
    isDayCompleted,
    getDayState,
    getNextUncompletedDay,
  };

  return (
    <SprintContext.Provider value={value}>
      {children}
    </SprintContext.Provider>
  );
}

export function useSprint() {
  const context = useContext(SprintContext);
  if (!context) {
    throw new Error('useSprint must be used within SprintProvider');
  }
  return context;
}
```

### Component Implementations

#### Sprint Overview Page

**File:** `src/app/app/sprint/page.tsx`

```typescript
'use client';

import { useSprint } from '@/contexts/SprintContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { IconSparkles, IconTrophy, IconClock } from '@tabler/icons-react';

export default function SprintOverviewPage() {
  const { isEnrolled, progress, enrollInSprint, getNextUncompletedDay } = useSprint();

  if (isEnrolled && progress) {
    const nextDay = getNextUncompletedDay();

    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-light mb-4">
          30 Day <span className="text-primary">Transformation Sprint</span>
        </h1>

        {/* Progress Summary */}
        <div className="bg-secondary/30 border border-white/10 rounded-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">Your Progress</p>
              <p className="text-3xl font-light">
                {progress.totalDaysCompleted}<span className="text-gray-500">/30</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm mb-1">Completion</p>
              <p className="text-3xl font-light text-primary">
                {Math.round(progress.completionPercentage)}%
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-6">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress.completionPercentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>

          {/* CTAs */}
          <div className="flex gap-4">
            {nextDay && (
              <Link
                href={`/app/sprint/day/${nextDay}`}
                className="flex-1 bg-primary/20 border border-primary/50 text-primary px-6 py-3 rounded-lg hover:bg-primary/30 transition-all text-center font-medium"
              >
                Continue to Day {nextDay}
              </Link>
            )}
            <Link
              href="/app/sprint/dashboard"
              className="flex-1 bg-white/5 border border-white/10 px-6 py-3 rounded-lg hover:bg-white/10 transition-all text-center"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        {progress.status === 'completed' && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
            <IconTrophy className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <h2 className="text-2xl font-light mb-2">Sprint Completed!</h2>
            <p className="text-gray-400">
              Congratulations on completing your 30-day transformation journey.
            </p>
          </div>
        )}
      </div>
    );
  }

  // Not enrolled - show landing page
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-light mb-4">
            30 Day <span className="text-primary">Transformation Sprint</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            A structured daily journey to build lasting habits and transform your mindset
          </p>
        </motion.div>

        <motion.button
          onClick={enrollInSprint}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-primary text-black px-8 py-4 rounded-lg text-lg font-medium hover:bg-primary/90 transition-all"
        >
          Start Your Sprint
        </motion.button>
      </div>

      {/* What to Expect */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          {
            icon: IconClock,
            title: 'Daily Commitment',
            description: '15-20 minutes per day of focused learning and practice',
          },
          {
            icon: IconSparkles,
            title: 'Multi-Modal Content',
            description: 'Video lessons, audio guidance, and actionable exercises',
          },
          {
            icon: IconTrophy,
            title: 'Track Progress',
            description: 'Visual progress tracking and completion milestones',
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-secondary/30 border border-white/10 rounded-xl p-6 hover:border-primary/30 transition-all"
          >
            <item.icon className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-light mb-2">{item.title}</h3>
            <p className="text-gray-400 text-sm">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

#### Dashboard (All Days View)

**File:** `src/app/app/sprint/dashboard/page.tsx`

```typescript
'use client';

import { useSprint } from '@/contexts/SprintContext';
import { useEffect, useState } from 'react';
import { getSprintDays } from '@/lib/content';
import { SprintDay } from '@/types/sprint';
import Link from 'next/link';
import { IconLock, IconCheck } from '@tabler/icons-react';
import { motion } from 'framer-motion';

export default function SprintDashboard() {
  const { progress, getDayState, isEnrolled } = useSprint();
  const [days, setDays] = useState<SprintDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSprintDays().then((data) => {
      setDays(data);
      setLoading(false);
    });
  }, []);

  if (!isEnrolled) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-gray-400 mb-4">You haven't enrolled in the sprint yet.</p>
        <Link
          href="/app/sprint"
          className="inline-block bg-primary text-black px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-all"
        >
          Enroll Now
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-12">Loading sprint days...</div>;
  }

  // Group days by week
  const weeks = [
    { title: 'Week 1: Foundation', days: days.slice(0, 7) },
    { title: 'Week 2: Momentum', days: days.slice(7, 14) },
    { title: 'Week 3: Integration', days: days.slice(14, 21) },
    { title: 'Week 4: Mastery', days: days.slice(21, 28) },
    { title: 'Final Days', days: days.slice(28, 30) },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-light mb-2">
        Sprint <span className="text-primary">Dashboard</span>
      </h1>
      <p className="text-gray-400 mb-8">Track your progress and navigate between days</p>

      {/* Progress Summary */}
      {progress && (
        <div className="bg-secondary/30 border border-white/10 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Days Complete</p>
              <p className="text-2xl font-light">
                {progress.totalDaysCompleted}<span className="text-gray-500">/30</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Progress</p>
              <p className="text-2xl font-light text-primary">
                {Math.round(progress.completionPercentage)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Current Day</p>
              <p className="text-2xl font-light">{progress.currentDay}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Status</p>
              <p className="text-2xl font-light capitalize">{progress.status.replace('_', ' ')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Weeks */}
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="mb-8">
          <h2 className="text-xl font-light mb-4">{week.title}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {week.days.map((day) => {
              const state = getDayState(day.day);
              const isLocked = state === 'locked';
              const isCompleted = state === 'completed';
              const isActive = state === 'active';

              return (
                <motion.div
                  key={day.day}
                  whileHover={!isLocked ? { scale: 1.05 } : {}}
                  className={`
                    aspect-square rounded-xl border transition-all relative
                    ${isCompleted ? 'bg-green-500/10 border-green-500/30' : ''}
                    ${isActive ? 'bg-primary/10 border-primary' : ''}
                    ${isLocked ? 'bg-secondary/20 border-white/10 opacity-50 cursor-not-allowed' : 'hover:border-primary/50 cursor-pointer'}
                    ${!isLocked && !isCompleted && !isActive ? 'bg-secondary/30 border-white/10' : ''}
                  `}
                >
                  {!isLocked ? (
                    <Link href={`/app/sprint/day/${day.day}`} className="absolute inset-0 flex flex-col items-center justify-center p-2">
                      {isCompleted && (
                        <IconCheck className="w-6 h-6 text-green-400 mb-1" />
                      )}
                      <p className={`text-xl font-light ${isActive ? 'text-primary' : ''}`}>
                        {day.day}
                      </p>
                      <p className="text-xs text-gray-400 text-center mt-1 line-clamp-2">
                        {day.frontmatter.title}
                      </p>
                    </Link>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <IconLock className="w-6 h-6 text-gray-500 mb-1" />
                      <p className="text-xl font-light text-gray-500">{day.day}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
```

#### Individual Day Page

**File:** `src/app/app/sprint/day/[dayNumber]/page.tsx`

```typescript
import { getSprintDay } from '@/lib/content';
import { notFound } from 'next/navigation';
import DayContent from '@/components/sprint/DayContent';

export async function generateStaticParams() {
  // Generate params for all 30 days
  return Array.from({ length: 30 }, (_, i) => ({
    dayNumber: (i + 1).toString(),
  }));
}

interface PageProps {
  params: {
    dayNumber: string;
  };
}

export default async function SprintDayPage({ params }: PageProps) {
  const dayNumber = parseInt(params.dayNumber);

  if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 30) {
    notFound();
  }

  const day = await getSprintDay(dayNumber);

  if (!day) {
    notFound();
  }

  return <DayContent day={day} />;
}
```

**Client Component:** `src/components/sprint/DayContent.tsx`

```typescript
'use client';

import { SprintDay } from '@/types/sprint';
import { useSprint } from '@/contexts/SprintContext';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { IconChevronLeft, IconChevronRight, IconLock, IconCheck } from '@tabler/icons-react';
import VideoPlayer from './VideoPlayer';
import AudioPlayer from './AudioPlayer';
import ImageGallery from './ImageGallery';

interface DayContentProps {
  day: SprintDay;
}

export default function DayContent({ day }: DayContentProps) {
  const { progress, isDayUnlocked, isDayCompleted, completeDay } = useSprint();
  const [isCompleting, setIsCompleting] = useState(false);

  const unlocked = isDayUnlocked(day.day);
  const completed = isDayCompleted(day.day);

  const handleComplete = () => {
    setIsCompleting(true);
    completeDay(day.day);
    setTimeout(() => setIsCompleting(false), 1000);
  };

  if (!unlocked) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <IconLock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <h1 className="text-3xl font-light mb-2">Day {day.day} is Locked</h1>
        <p className="text-gray-400 mb-6">
          Complete Day {day.day - 1} to unlock this content
        </p>
        <Link
          href="/app/sprint/dashboard"
          className="inline-block bg-primary/20 border border-primary/50 text-primary px-6 py-3 rounded-lg hover:bg-primary/30 transition-all"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const progressPercentage = progress ? progress.completionPercentage : 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-400 uppercase tracking-wider">
            Day {day.day} of 30
          </p>
          <p className="text-sm text-primary">{Math.round(progressPercentage)}% Complete</p>
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <h1 className="text-4xl font-light mb-2">{day.frontmatter.title}</h1>
        {day.frontmatter.subtitle && (
          <p className="text-xl text-gray-400">{day.frontmatter.subtitle}</p>
        )}
      </div>

      {/* Video */}
      {day.frontmatter.video && (
        <div className="mb-8">
          <VideoPlayer videoUrl={day.frontmatter.video} />
        </div>
      )}

      {/* Audio */}
      {day.frontmatter.audio && (
        <div className="mb-8">
          <AudioPlayer audioUrl={day.frontmatter.audio} />
        </div>
      )}

      {/* Main Content */}
      <div
        className="prose prose-invert prose-lg max-w-none mb-8"
        dangerouslySetInnerHTML={{ __html: day.content }}
      />

      {/* Images */}
      {day.frontmatter.images && day.frontmatter.images.length > 0 && (
        <div className="mb-8">
          <ImageGallery images={day.frontmatter.images} />
        </div>
      )}

      {/* Completion Button */}
      <div className="mb-8">
        <motion.button
          onClick={handleComplete}
          disabled={completed || isCompleting}
          whileHover={!completed ? { scale: 1.02 } : {}}
          whileTap={!completed ? { scale: 0.98 } : {}}
          className={`
            w-full md:w-auto px-8 py-4 rounded-lg font-medium transition-all
            ${completed
              ? 'bg-green-500/20 border border-green-500/50 text-green-400 cursor-default'
              : 'bg-primary text-black hover:bg-primary/90'
            }
          `}
        >
          {completed ? (
            <>
              <IconCheck className="inline w-5 h-5 mr-2" />
              Day {day.day} Completed
            </>
          ) : isCompleting ? (
            'Marking Complete...'
          ) : (
            `Mark Day ${day.day} Complete`
          )}
        </motion.button>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-8 border-t border-white/10">
        {day.day > 1 ? (
          <Link
            href={`/app/sprint/day/${day.day - 1}`}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <IconChevronLeft className="w-5 h-5 mr-1" />
            Day {day.day - 1}
          </Link>
        ) : (
          <div />
        )}

        {day.day < 30 && isDayUnlocked(day.day + 1) ? (
          <Link
            href={`/app/sprint/day/${day.day + 1}`}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            Day {day.day + 1}
            <IconChevronRight className="w-5 h-5 ml-1" />
          </Link>
        ) : day.day < 30 ? (
          <div className="flex items-center text-gray-500 cursor-not-allowed">
            <IconLock className="w-4 h-4 mr-1" />
            Day {day.day + 1}
          </div>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
```

---

## UI Component Specifications (Phase 1)

### Video Player Component

**File:** `src/components/sprint/VideoPlayer.tsx`

```typescript
'use client';

interface VideoPlayerProps {
  videoUrl: string;
}

export default function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  // Parse video URL
  const getEmbedUrl = (url: string): string => {
    // YouTube
    if (url.startsWith('youtube:')) {
      const videoId = url.replace('youtube:', '');
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Vimeo
    if (url.startsWith('vimeo:')) {
      const videoId = url.replace('vimeo:', '');
      return `https://player.vimeo.com/video/${videoId}`;
    }

    // Direct YouTube URL
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.split('v=')[1] || url.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Direct Vimeo URL
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }

    // Return as-is for direct embeds
    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
      <iframe
        src={embedUrl}
        className="absolute top-0 left-0 w-full h-full rounded-lg"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
```

### Audio Player Component

**File:** `src/components/sprint/AudioPlayer.tsx`

```typescript
'use client';

interface AudioPlayerProps {
  audioUrl: string;
}

export default function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  return (
    <div className="bg-secondary/30 border border-white/10 rounded-lg p-4">
      <audio controls className="w-full">
        <source src={audioUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
```

### Image Gallery Component

**File:** `src/components/sprint/ImageGallery.tsx`

```typescript
'use client';

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  if (images.length === 0) return null;

  return (
    <div className={`grid gap-4 ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Day content image ${index + 1}`}
          className="w-full rounded-lg"
          loading="lazy"
        />
      ))}
    </div>
  );
}
```

---

## Content Requirements (Phase 1)

### Sample Day Markdown Template

**File:** `content/sprint/day-01.md`

```markdown
---
day: 1
title: "Building Your Foundation"
subtitle: "Understanding the Diamond Mindset"
published: true
video: "youtube:dQw4w9WgXcQ"
audio: "/uploads/sprint/day-01-meditation.mp3"
images:
  - "/uploads/sprint/day-01-framework.jpg"
duration: "15 minutes"
week: 1
tags:
  - foundation
  - mindset
  - introduction
description: "Day 1 introduces the core concepts of the Diamond Transformation methodology."
---

# Welcome to Day 1

Today marks the beginning of your 30-day transformation journey. You're about to embark on a path that has changed countless lives...

## What You'll Learn Today

- The three pillars of the Diamond Mindset
- Why consistency beats intensity
- Your daily practice framework

## The Diamond Mindset

The Diamond Mindset is built on three core principles:

1. **Pressure Creates Diamonds** - Embrace challenges as growth opportunities
2. **Clarity Comes from Cutting** - Refinement requires removing what doesn't serve you
3. **Brilliance Through Polish** - Consistent daily practice creates lasting transformation

...

## Daily Reflection

Take 5 minutes to journal on these questions:

1. What brought you to this 30-day sprint?
2. What does becoming "diamond" mean to you personally?
3. What's one area of your life ready for transformation?

## Key Takeaways

- Consistency is the foundation of transformation
- Small daily actions compound into major results
- You're building a new identity, not just changing habits

---

**Congratulations on completing Day 1!** Click "Mark Complete" to unlock Day 2.
```

---

## Navigation Integration

### Update Sidebar Navigation

**File:** `src/app/app/layout.tsx` (modify)

```typescript
const navItems = [
  { name: "Dashboard", href: "/app", icon: IconHome },
  { name: "Courses", href: "/app/courses", icon: IconBooks },
  { name: "30 Day Sprint", href: "/app/sprint", icon: IconCalendar },  // ADD THIS
  { name: "DiamondMindAI", href: "/app/chat", icon: IconBrain },
  { name: "Profile", href: "/app/profile", icon: IconUser },
  { name: "Settings", href: "/app/settings", icon: IconSettings },
  { name: "Support", href: "/app/support", icon: IconHelp },
];
```

---

## Testing Checklist (Phase 1)

### Functional Testing

- [ ] User can view sprint overview page
- [ ] "Start Sprint" button enrolls user and redirects to Day 1
- [ ] User can view Day 1 content (unlocked by default)
- [ ] Days 2-30 are locked initially
- [ ] "Mark Complete" button marks day as completed
- [ ] Completing Day X unlocks Day X+1
- [ ] Progress tracker updates correctly (X/30, percentage)
- [ ] Progress bar animates on page load
- [ ] Completed days show checkmark in dashboard
- [ ] Active day is highlighted in dashboard
- [ ] Locked days show lock icon and cannot be accessed
- [ ] Navigation between days works correctly
- [ ] Previous button disabled on Day 1
- [ ] Next button disabled on locked days
- [ ] Video embeds work (YouTube, Vimeo)
- [ ] Audio player works with controls
- [ ] Images display in grid layout
- [ ] Markdown content renders correctly
- [ ] Progress persists in localStorage
- [ ] Progress loads on page refresh
- [ ] Multiple users have separate progress (different localStorage keys)
- [ ] Can revisit completed days for review
- [ ] Sprint completion shows "Completed" status
- [ ] Mobile responsive on all pages

### Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### Performance

- [ ] Page loads in < 2 seconds
- [ ] Videos lazy load (don't block initial render)
- [ ] Images lazy load
- [ ] Smooth animations (60fps)
- [ ] No layout shifts during load

### Accessibility

- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] ARIA labels on buttons
- [ ] Alt text on images
- [ ] Screen reader compatible
- [ ] Color contrast meets WCAG AA

---

## Launch Plan (Phase 1)

### Pre-Launch (Week 0)

- [ ] Complete all 30 markdown files with content
- [ ] Review and approve all content
- [ ] Create video content (or finalize embeds)
- [ ] Create audio content (optional)
- [ ] Source or create images
- [ ] QA testing complete
- [ ] Beta testing with 5-10 users
- [ ] Fix any critical bugs
- [ ] Prepare launch announcement email

### Launch Day

- [ ] Deploy to production
- [ ] Update sidebar navigation
- [ ] Send launch email to all members
- [ ] Post announcement on landing page
- [ ] Monitor for errors/issues
- [ ] Be ready for support questions

### Post-Launch (Week 1-2)

- [ ] Collect user feedback
- [ ] Monitor completion rates
- [ ] Track engagement metrics
- [ ] Fix any reported bugs
- [ ] Plan Phase 2 enhancements based on feedback

---

## Success Metrics (Phase 1)

**Week 1 Targets:**
- 20%+ of active members enroll
- <5% error rate
- 80%+ Day 1 completion rate (of enrolled users)
- 60%+ Day 7 completion rate

**Month 1 Targets:**
- 40%+ enrollment rate
- 50%+ Week 1 completion rate (Days 1-7)
- Average 4+ days per user
- 80%+ user satisfaction (informal feedback)

---

## Known Limitations (Phase 1)

1. **Data Loss Risk:** localStorage can be cleared, losing all progress
2. **No Cross-Device Sync:** Progress tied to single browser
3. **No Analytics:** Can't track detailed engagement metrics
4. **No Notifications:** Users must remember to come back daily
5. **No Badge System:** Limited gamification in MVP
6. **No Export:** Can't backup or transfer progress
7. **Manual Progression:** No date-locking or automatic unlocking
8. **Single Sprint:** Can't restart or run multiple sprints

**Mitigation:** These are addressed in Phase 2 and 3.

---

## Next Steps After Phase 1

1. **Gather Feedback:**
   - User surveys
   - Analytics review (manual if needed)
   - Identify pain points

2. **Prioritize Phase 2 Features:**
   - Database integration (high priority)
   - Badge system
   - Streak tracking
   - Basic email notifications

3. **Content Iteration:**
   - Update content based on feedback
   - Add variations or improvements
   - Consider A/B testing different approaches

4. **Technical Debt:**
   - Refactor components if needed
   - Optimize performance
   - Improve error handling

---

## Appendix

### Recommended Aceternity Components (Phase 1)

**Used:**
- None (keeping Phase 1 simple with basic components)

**Consider for Phase 2:**
- `Timeline` - Visual representation of 30-day journey
- `TracingBeam` - Progress indicator along content
- `AnimatedModal` - Celebration on completion
- `CardHoverEffect` - Day cards with better hover states
- `GlowingStarsBackgroundCard` - Badge cards
- `TextGenerateEffect` - Animated text reveals

### Development Timeline Estimate

**Week 1-2: Core Implementation**
- Content functions
- React context
- localStorage utilities
- Basic components

**Week 3-4: UI & Pages**
- Sprint overview page
- Dashboard page
- Day content page
- Video/audio/image components
- Navigation components

**Week 5: Polish & Testing**
- Mobile responsiveness
- Animations
- Error handling
- QA testing

**Week 6: Beta & Launch Prep**
- Beta testing
- Bug fixes
- Launch materials
- Deployment

---

**End of Phase 1 PRD**
