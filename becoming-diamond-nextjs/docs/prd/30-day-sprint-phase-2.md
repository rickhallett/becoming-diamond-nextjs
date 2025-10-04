# 30 Day Sprint - Phase 2 PRD (Enhanced Features)

**Version:** 1.0
**Last Updated:** 2025-10-03
**Phase:** 2 of 3 (Gamification & Database Integration)
**Status:** Planning
**Prerequisites:** Phase 1 MVP completed and deployed

---

## Phase 2 Overview

**Goal:** Transform the basic sprint feature into an engaging, persistent experience with full gamification, database-backed storage, and enhanced UI/UX.

**Timeline:** 4-6 weeks development + 2 weeks testing
**Complexity:** High
**Priority:** High (required for long-term viability)

---

## Problem Statement

Phase 1 limitations that Phase 2 addresses:

1. **Data Persistence:** localStorage is unreliable and doesn't sync across devices
2. **Limited Engagement:** No badges, achievements, or celebration moments
3. **No Streak Tracking:** Missing key gamification element for habit formation
4. **Poor Re-Engagement:** No notifications or reminders
5. **Limited Analytics:** Can't measure or optimize engagement
6. **Single Device Lock-in:** Users can't access progress from multiple devices

---

## Scope Definition

### In Scope (Phase 2)

**Database Integration:**
- ✅ Turso (LibSQL) database with direct SQL queries
- ✅ API routes for progress management
- ✅ User data migration from localStorage to database
- ✅ Cross-device sync
- ✅ Data backup and recovery

**Gamification System:**
- ✅ Full badge/achievement system (12+ badges)
- ✅ Streak tracking (current and best streak)
- ✅ Milestone celebrations with animations
- ✅ Achievement showcase page
- ✅ Progress toward next badge/milestone

**Enhanced UI/UX:**
- ✅ Aceternity UI component integration
- ✅ Celebration modals with confetti effects
- ✅ Enhanced animations and transitions
- ✅ Progress statistics dashboard
- ✅ Visual badge collection display

**Notifications:**
- ✅ Basic email notifications (day unlock, milestones)
- ✅ Optional email reminders (daily or every 3 days)
- ✅ Re-engagement emails (if inactive 3+ days)

**Additional Features:**
- ✅ Export progress (JSON download)
- ✅ Sprint restart capability
- ✅ User feedback mechanism per day
- ✅ Enhanced analytics tracking

### Out of Scope (Phase 2)

**Deferred to Phase 3:**
- ❌ Date-locked progression
- ❌ Cohort system / community features
- ❌ Leaderboard
- ❌ Social sharing integration
- ❌ Admin dashboard
- ❌ Multiple sprint variations
- ❌ Push notifications (mobile)
- ❌ Advanced analytics reporting

---

## User Stories (Phase 2)

### Epic 1: Database Integration

**US-P2-1.1: Seamless Data Migration**
```
As an existing Phase 1 user
I want my progress automatically migrated to the database
So that I don't lose my completed days

Acceptance Criteria:
- On first load after Phase 2 deployment, detect localStorage data
- Automatically migrate progress to database
- Confirm migration success to user
- Clear localStorage after successful migration
- Handle migration errors gracefully
```

**US-P2-1.2: Cross-Device Access**
```
As a user with multiple devices
I want to access my sprint progress from any device
So that I can continue my journey wherever I am

Acceptance Criteria:
- Progress syncs across all logged-in devices
- Changes on one device reflect on others within seconds
- Dashboard shows "Last synced" timestamp
- Handle offline state gracefully (show cached data)
```

**US-P2-1.3: Progress Recovery**
```
As a user
I want to recover my progress if I accidentally clear my browser
So that I don't lose my hard-earned achievement

Acceptance Criteria:
- Progress stored securely in database
- Survives browser cache clear
- Accessible after re-login
- Export/import functionality available as backup
```

### Epic 2: Badge System

**US-P2-2.1: Earn Milestone Badges**
```
As a user
I want to earn badges for completing milestones
So that I feel rewarded for my progress

Acceptance Criteria:
- First Step badge on Day 1 completion
- Week 1 Warrior on Day 7 completion
- Halfway Hero on Day 15 completion
- Week 3 Champion on Day 21 completion
- Diamond Achiever on Day 30 completion
- Badge automatically awarded upon meeting requirement
- Celebration modal displays earned badge
```

**US-P2-2.2: Earn Streak Badges**
```
As a user
I want to earn badges for maintaining streaks
So that I'm motivated to come back daily

Acceptance Criteria:
- Consistent badge at 3-day streak
- Committed badge at 7-day streak
- Unstoppable badge at 14-day streak
- Legendary badge at 21-day streak
- Flawless badge at 30-day perfect streak
- Streak badge awarded immediately upon achieving streak
```

**US-P2-2.3: View Badge Collection**
```
As a user
I want to see all available badges and my progress
So that I know what to work toward

Acceptance Criteria:
- Achievements page shows all badges
- Locked badges display in grayscale with unlock requirement
- Earned badges display in full color with earned date
- Progress bars for in-progress badges (e.g., "4/7 days for Week 1")
- Badge details on hover or click
```

**US-P2-2.4: Celebrate Badge Unlocks**
```
As a user
I want a special celebration when I unlock a badge
So that I feel accomplished and motivated

Acceptance Criteria:
- Animated modal appears immediately on badge unlock
- Confetti or meteor effect plays
- Badge icon animates (scale in with bounce)
- Congratulatory message specific to badge
- Option to share achievement (Phase 3)
- Can dismiss or view badge collection
```

### Epic 3: Streak Tracking

**US-P2-3.1: Track Current Streak**
```
As a user
I want to see my current consecutive day streak
So that I'm motivated to maintain it

Acceptance Criteria:
- Streak counter visible on dashboard
- Increments by 1 for each consecutive day completed
- Resets to 0 if day skipped
- Visual indicator (flame icon)
- Color codes: 1-3 days (gray), 4-7 (blue), 8-14 (green), 15+ (gold)
```

**US-P2-3.2: Track Best Streak**
```
As a user
I want to see my best streak ever
So that I can try to beat my personal record

Acceptance Criteria:
- "Best Streak" displayed alongside current streak
- Updates only when current streak exceeds best
- Persists across sprint restarts
- Motivational message when beating best streak
```

**US-P2-3.3: Understand Streak Breaks**
```
As a user
I want to understand when and why my streak broke
So that I can avoid it in the future

Acceptance Criteria:
- Dashboard shows "Streak broken on [date]" if applicable
- Clear explanation: "You missed Day X"
- Encouragement to start new streak
- Streak history visible (Phase 3)
```

### Epic 4: Email Notifications

**US-P2-4.1: Receive Day Unlock Notifications**
```
As a user
I want an email when a new day unlocks
So that I remember to come back

Acceptance Criteria:
- Email sent when user completes a day (next day unlocked)
- Subject: "Day X is now unlocked!"
- Email includes day title and teaser
- Link directly to day content
- Unsubscribe option included
- Opt-in during enrollment (default: yes)
```

**US-P2-4.2: Receive Milestone Celebration Emails**
```
As a user
I want a special email when I complete major milestones
So that I can celebrate my achievement

Acceptance Criteria:
- Email on Week 1 completion (Day 7)
- Email on Halfway point (Day 15)
- Email on Week 3 completion (Day 21)
- Email on sprint completion (Day 30)
- Includes badge image
- Personalized congratulations message
- Social share links (Phase 3)
```

**US-P2-4.3: Receive Re-Engagement Emails**
```
As a user who hasn't accessed the sprint in 3 days
I want a gentle reminder email
So that I can get back on track

Acceptance Criteria:
- Email sent if no activity for 3 days
- Subject: "We miss you! Your sprint is waiting"
- Encouraging tone (not guilt-inducing)
- Shows current progress and next day
- Link to resume
- Only sent once per inactivity period
- Opt-out option
```

**US-P2-4.4: Configure Email Preferences**
```
As a user
I want to control which emails I receive
So that I'm not overwhelmed

Acceptance Criteria:
- Email preferences in settings
- Toggles for: Daily unlock, Milestones, Re-engagement
- Frequency options: Every day, Every 3 days, Weekly, Never
- Save preferences and reflect immediately
- Unsubscribe link in every email
```

### Epic 5: Enhanced UI/UX

**US-P2-5.1: Celebration Modal on Completion**
```
As a user completing a milestone day
I want an exciting celebration modal
So that I feel rewarded

Acceptance Criteria:
- Modal appears on Days 1, 7, 14, 15, 21, 28, 30
- Aceternity AnimatedModal component
- Meteors or confetti background effect
- Badge reveal animation (if badge earned)
- Encouraging message personalized to milestone
- "Continue" button to dismiss
```

**US-P2-5.2: Enhanced Progress Visualization**
```
As a user
I want beautiful visual progress indicators
So that I can see my journey at a glance

Acceptance Criteria:
- Circular progress ring using animation
- Timeline view showing completed vs. remaining days
- Week-by-week breakdown with progress bars
- Visual milestone markers on timeline
- Aceternity Timeline or TracingBeam component
```

**US-P2-5.3: Animated Badge Cards**
```
As a user viewing achievements
I want visually appealing badge cards
So that collecting them feels rewarding

Acceptance Criteria:
- GlowingStarsBackgroundCard for each badge
- Hover effect shows badge details
- Locked badges have mysterious appearance
- Unlocking animation when earned
- Rarity tiers (common, rare, epic, legendary) with different visual effects
```

**US-P2-5.4: Smooth Page Transitions**
```
As a user navigating the sprint
I want smooth transitions between pages
So that the experience feels polished

Acceptance Criteria:
- Fade transitions between day pages
- Slide-in animations for modals
- Skeleton loading states
- No jarring layout shifts
- Respect prefers-reduced-motion
```

### Epic 6: Progress Export & Management

**US-P2-6.1: Export Progress Data**
```
As a user
I want to download my sprint progress
So that I have a personal backup

Acceptance Criteria:
- "Export Progress" button on dashboard
- Downloads JSON file with all progress data
- Includes: completed days, timestamps, badges, streaks
- Human-readable format
- Filename: "sprint-progress-YYYY-MM-DD.json"
```

**US-P2-6.2: Restart Sprint**
```
As a completed user
I want to restart the sprint from Day 1
So that I can reinforce the lessons

Acceptance Criteria:
- "Restart Sprint" button on completion screen
- Confirmation modal: "This will start a new sprint. Previous progress will be archived."
- Previous sprint data archived (not deleted)
- New sprint starts fresh at Day 1
- Badge progress carries over (cumulative)
```

**US-P2-6.3: View Sprint History**
```
As a user who has completed multiple sprints
I want to see my history
So that I can reflect on my journey

Acceptance Criteria:
- "Sprint History" page showing all attempts
- Each sprint shows: Start date, End date, Completion %, Days completed
- Can view archived sprint progress
- Shows total sprints completed
- Cumulative stats across all sprints
```

### Epic 7: Analytics & Insights

**US-P2-7.1: Personal Stats Dashboard**
```
As a user
I want detailed statistics about my progress
So that I can understand my patterns

Acceptance Criteria:
- Total time invested (estimated)
- Average completion time per day
- Most productive time of day (if tracked)
- Days of week with highest completion rate
- Streak analytics (average, best, current)
- Displayed on dashboard as cards or charts
```

**US-P2-7.2: Completion Funnel Tracking**
```
As a product team
We want to track user progression through the sprint
So that we can optimize content and engagement

Acceptance Criteria:
- Track: Enrollment, Day 1 completion, Day 7, Day 15, Day 30
- Identify dropout points
- A/B test different content approaches
- Measure impact of emails on re-engagement
- Admin view (Phase 3)
```

---

## Technical Architecture (Phase 2)

### Database Schema (Turso/LibSQL)

**File:** `migrations/002_create_sprint_tables.sql`

```sql
-- Sprint Progress Table
CREATE TABLE IF NOT EXISTS sprint_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  sprint_id TEXT NOT NULL DEFAULT '30-day-sprint',
  enrollment_date INTEGER NOT NULL,

  current_day INTEGER DEFAULT 1,
  total_days_completed INTEGER DEFAULT 0,
  completion_percentage REAL DEFAULT 0,

  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,

  status TEXT DEFAULT 'in_progress',
  completion_date INTEGER,

  last_access_date INTEGER DEFAULT (unixepoch()),
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS sprint_progress_user_sprint_idx
  ON sprint_progress(user_id, sprint_id);

CREATE INDEX IF NOT EXISTS sprint_progress_user_id_idx
  ON sprint_progress(user_id);

CREATE INDEX IF NOT EXISTS sprint_progress_status_idx
  ON sprint_progress(status);

-- Completed Days Table
CREATE TABLE IF NOT EXISTS completed_days (
  id TEXT PRIMARY KEY,
  sprint_progress_id TEXT NOT NULL,
  day INTEGER NOT NULL,
  completed_at INTEGER DEFAULT (unixepoch()),
  time_spent INTEGER,

  FOREIGN KEY (sprint_progress_id) REFERENCES sprint_progress(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS completed_days_sprint_day_idx
  ON completed_days(sprint_progress_id, day);

CREATE INDEX IF NOT EXISTS completed_days_sprint_progress_idx
  ON completed_days(sprint_progress_id);

-- Badges Table
CREATE TABLE IF NOT EXISTS badges (
  id TEXT PRIMARY KEY,
  badge_id TEXT UNIQUE NOT NULL,

  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  rarity TEXT NOT NULL,
  category TEXT NOT NULL,

  requirement TEXT NOT NULL,

  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS badges_category_idx ON badges(category);

-- User Badges Table
CREATE TABLE IF NOT EXISTS user_badges (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  badge_id TEXT NOT NULL,
  earned_at INTEGER DEFAULT (unixepoch()),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS user_badges_user_badge_idx
  ON user_badges(user_id, badge_id);

CREATE INDEX IF NOT EXISTS user_badges_user_id_idx
  ON user_badges(user_id);

-- Email Preferences Table
CREATE TABLE IF NOT EXISTS email_preferences (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,

  daily_unlock INTEGER DEFAULT 1,
  milestones INTEGER DEFAULT 1,
  re_engagement INTEGER DEFAULT 1,
  frequency TEXT DEFAULT 'daily',

  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### API Routes (Phase 2)

**1. GET `/api/sprint/progress`**

```typescript
// src/app/api/sprint/progress/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Lazy import turso to avoid build-time initialization
    const { turso } = await import('@/lib/turso');

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get sprint progress
    const progressResult = await turso.execute({
      sql: `SELECT * FROM sprint_progress
            WHERE user_id = ? AND sprint_id = ?`,
      args: [session.user.id, '30-day-sprint']
    });

    if (progressResult.rows.length === 0) {
      return NextResponse.json({ progress: null });
    }

    const progress = progressResult.rows[0];

    // Get completed days
    const completedDaysResult = await turso.execute({
      sql: `SELECT * FROM completed_days
            WHERE sprint_progress_id = ?
            ORDER BY day ASC`,
      args: [progress.id]
    });

    return NextResponse.json({
      progress: {
        ...progress,
        completedDays: completedDaysResult.rows
      }
    });
  } catch (error) {
    console.error('Error fetching sprint progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

**2. POST `/api/sprint/enroll`**

```typescript
// src/app/api/sprint/enroll/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { nanoid } from 'nanoid';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { turso } = await import('@/lib/turso');
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sprintId } = await req.json();
    const actualSprintId = sprintId || '30-day-sprint';

    // Check if already enrolled
    const existingResult = await turso.execute({
      sql: `SELECT * FROM sprint_progress
            WHERE user_id = ? AND sprint_id = ?`,
      args: [session.user.id, actualSprintId]
    });

    if (existingResult.rows.length > 0 && existingResult.rows[0].status === 'in_progress') {
      return NextResponse.json({ error: 'Already enrolled' }, { status: 400 });
    }

    // Create new sprint progress
    const id = `sprint_${nanoid()}`;
    const now = Math.floor(Date.now() / 1000);

    await turso.execute({
      sql: `INSERT INTO sprint_progress (
        id, user_id, sprint_id, enrollment_date,
        current_day, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, session.user.id, actualSprintId, now, 1, 'in_progress', now, now]
    });

    // Fetch created progress
    const progressResult = await turso.execute({
      sql: 'SELECT * FROM sprint_progress WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({
      message: 'Enrolled successfully',
      progress: {
        ...progressResult.rows[0],
        completedDays: []
      }
    });
  } catch (error) {
    console.error('Error enrolling in sprint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

**3. POST `/api/sprint/complete`**

```typescript
// src/app/api/sprint/complete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { nanoid } from 'nanoid';
import { checkAndAwardBadges } from '@/lib/badges';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { turso } = await import('@/lib/turso');
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { day } = await req.json();

    if (!day || day < 1 || day > 30) {
      return NextResponse.json({ error: 'Invalid day' }, { status: 400 });
    }

    // Get current progress
    const progressResult = await turso.execute({
      sql: `SELECT * FROM sprint_progress
            WHERE user_id = ? AND sprint_id = ?`,
      args: [session.user.id, '30-day-sprint']
    });

    if (progressResult.rows.length === 0) {
      return NextResponse.json({ error: 'Not enrolled' }, { status: 400 });
    }

    const progress = progressResult.rows[0];

    // Get completed days
    const completedDaysResult = await turso.execute({
      sql: `SELECT * FROM completed_days
            WHERE sprint_progress_id = ?
            ORDER BY day ASC`,
      args: [progress.id]
    });

    const completedDays = completedDaysResult.rows;

    // Check if already completed
    const alreadyCompleted = completedDays.some((d: any) => d.day === day);
    if (alreadyCompleted) {
      return NextResponse.json({ error: 'Day already completed' }, { status: 400 });
    }

    // Mark day complete
    const completedDayId = `day_${nanoid()}`;
    const now = Math.floor(Date.now() / 1000);

    await turso.execute({
      sql: `INSERT INTO completed_days (id, sprint_progress_id, day, completed_at)
            VALUES (?, ?, ?, ?)`,
      args: [completedDayId, progress.id, day, now]
    });

    // Calculate new stats
    const newTotalCompleted = Number(progress.total_days_completed) + 1;
    const newPercentage = (newTotalCompleted / 30) * 100;
    const newCurrentDay = day < 30 ? day + 1 : 30;
    const newStatus = newTotalCompleted === 30 ? 'completed' : 'in_progress';

    // Calculate streak
    const allCompletedDays = [...completedDays, { day }]
      .sort((a: any, b: any) => a.day - b.day);
    const newStreak = calculateStreak(allCompletedDays);

    // Update progress
    await turso.execute({
      sql: `UPDATE sprint_progress SET
            total_days_completed = ?,
            completion_percentage = ?,
            current_day = ?,
            status = ?,
            completion_date = ?,
            current_streak = ?,
            best_streak = ?,
            updated_at = ?
            WHERE id = ?`,
      args: [
        newTotalCompleted,
        newPercentage,
        newCurrentDay,
        newStatus,
        newStatus === 'completed' ? now : null,
        newStreak,
        Math.max(newStreak, Number(progress.best_streak)),
        now,
        progress.id
      ]
    });

    // Fetch updated progress
    const updatedProgressResult = await turso.execute({
      sql: 'SELECT * FROM sprint_progress WHERE id = ?',
      args: [progress.id]
    });

    const updatedCompletedDaysResult = await turso.execute({
      sql: `SELECT * FROM completed_days
            WHERE sprint_progress_id = ?
            ORDER BY day ASC`,
      args: [progress.id]
    });

    const updatedProgress = {
      ...updatedProgressResult.rows[0],
      completedDays: updatedCompletedDaysResult.rows
    };

    // Check for new badges
    const newBadges = await checkAndAwardBadges(session.user.id, updatedProgress);

    return NextResponse.json({
      message: 'Day marked complete',
      progress: updatedProgress,
      completedDay: { id: completedDayId, day, completedAt: now },
      newBadges,
    });
  } catch (error) {
    console.error('Error completing day:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateStreak(completedDays: { day: number }[]): number {
  if (completedDays.length === 0) return 0;

  let streak = 1;
  for (let i = completedDays.length - 1; i > 0; i--) {
    if (completedDays[i].day - completedDays[i - 1].day === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
```

**4. GET `/api/sprint/badges`**

```typescript
// src/app/api/sprint/badges/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { turso } = await import('@/lib/turso');
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all badges
    const allBadgesResult = await turso.execute({
      sql: `SELECT * FROM badges
            ORDER BY category ASC, badge_id ASC`
    });

    // Get user's earned badges
    const userBadgesResult = await turso.execute({
      sql: `SELECT ub.*, b.* FROM user_badges ub
            JOIN badges b ON ub.badge_id = b.id
            WHERE ub.user_id = ?`,
      args: [session.user.id]
    });

    // Get user's progress for badge progress calculation
    const progressResult = await turso.execute({
      sql: `SELECT * FROM sprint_progress
            WHERE user_id = ? AND sprint_id = ?`,
      args: [session.user.id, '30-day-sprint']
    });

    let completedDays = [];
    let progress = null;

    if (progressResult.rows.length > 0) {
      progress = progressResult.rows[0];
      const completedDaysResult = await turso.execute({
        sql: 'SELECT * FROM completed_days WHERE sprint_progress_id = ?',
        args: [progress.id]
      });
      completedDays = completedDaysResult.rows;
    }

    // Map badges with earned status
    const badgesWithStatus = allBadgesResult.rows.map((badge: any) => {
      const userBadge = userBadgesResult.rows.find((ub: any) => ub.badge_id === badge.id);

      return {
        ...badge,
        earned: !!userBadge,
        earnedAt: userBadge?.earned_at || null,
        progress: calculateBadgeProgress(badge, progress, completedDays),
      };
    });

    return NextResponse.json({ badges: badgesWithStatus });
  } catch (error) {
    console.error('Error fetching badges:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateBadgeProgress(badge: any, progress: any, completedDays: any[]): string | null {
  if (!progress) return null;

  const requirement = JSON.parse(badge.requirement);

  switch (requirement.type) {
    case 'day':
      return completedDays.some((d: any) => d.day === requirement.value)
        ? 'Completed'
        : `Complete Day ${requirement.value}`;

    case 'days_range':
      const [start, end] = requirement.value.split('-').map(Number);
      const completedInRange = completedDays.filter(
        (d: any) => d.day >= start && d.day <= end
      ).length;
      const total = end - start + 1;
      return `${completedInRange}/${total} days`;

    case 'streak':
      return Number(progress.current_streak) >= requirement.value
        ? 'Achieved'
        : `${progress.current_streak}/${requirement.value} days`;

    default:
      return null;
  }
}
```

---

## UI Component Enhancements (Phase 2)

### Celebration Modal

**File:** `src/components/sprint/CelebrationModal.tsx`

```typescript
'use client';

import { Modal, ModalTrigger, ModalBody } from '@/components/ui/animated-modal';
import { Meteors } from '@/components/ui/meteors';
import { motion } from 'framer-motion';
import { Badge } from '@/types/sprint';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: number;
  badges?: Badge[];
  milestone?: string;
}

export default function CelebrationModal({
  isOpen,
  onClose,
  day,
  badges = [],
  milestone,
}: CelebrationModalProps) {
  return (
    <Modal>
      <ModalBody className="relative overflow-hidden">
        <Meteors number={20} />

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
          className="text-center z-10 relative"
        >
          <h2 className="text-4xl font-light mb-4">
            <span className="text-primary">Congratulations!</span>
          </h2>

          {milestone ? (
            <p className="text-xl mb-6 text-gray-300">{milestone}</p>
          ) : (
            <p className="text-xl mb-6 text-gray-300">
              Day {day} Complete!
            </p>
          )}

          {badges.length > 0 && (
            <div className="my-8">
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-4">
                Badges Earned
              </p>
              <div className="flex justify-center gap-4">
                {badges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: 'spring',
                      delay: 0.3 + (index * 0.1),
                      duration: 0.8,
                    }}
                  >
                    <img
                      src={badge.icon}
                      alt={badge.title}
                      className="w-20 h-20"
                    />
                    <p className="text-xs text-gray-300 mt-2">{badge.title}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="bg-primary text-black px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-all mt-6"
          >
            Continue
          </button>
        </motion.div>
      </ModalBody>
    </Modal>
  );
}
```

### Achievements Page

**File:** `src/app/app/sprint/achievements/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { GlowingStarsBackgroundCard, GlowingStarsTitle, GlowingStarsDescription } from '@/components/ui/glowing-stars';
import { Badge } from '@/types/sprint';

export default function AchievementsPage() {
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sprint/badges')
      .then(res => res.json())
      .then(data => {
        setBadges(data.badges || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading achievements...</div>;
  }

  const categories = ['milestone', 'streak', 'special'];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-light mb-2">
        Your <span className="text-primary">Achievements</span>
      </h1>
      <p className="text-gray-400 mb-8">Collect badges as you progress through your journey</p>

      {categories.map(category => {
        const categoryBadges = badges.filter(b => b.category === category);

        return (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-light capitalize mb-6">{category} Badges</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryBadges.map(badge => (
                <GlowingStarsBackgroundCard
                  key={badge.id}
                  className={badge.earned ? '' : 'opacity-50 grayscale'}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={badge.icon}
                      alt={badge.title}
                      className="w-16 h-16"
                    />
                    <div>
                      <GlowingStarsTitle>{badge.title}</GlowingStarsTitle>
                      {badge.earned && badge.earnedAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          Earned {new Date(badge.earnedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <GlowingStarsDescription>
                    {badge.description}
                  </GlowingStarsDescription>
                  {!badge.earned && badge.progress && (
                    <div className="mt-4">
                      <p className="text-xs text-gray-400">Progress: {badge.progress}</p>
                    </div>
                  )}
                </GlowingStarsBackgroundCard>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

---

## Email Templates (Phase 2)

### Daily Unlock Email

```html
Subject: Day {{day}} is Now Unlocked! 🔓

Hi {{userName}},

Great work completing Day {{previousDay}}! You're making progress on your 30-day transformation journey.

Day {{day}} is now unlocked and ready for you:
📘 {{dayTitle}}

{{daySubtitle}}

[Continue Your Sprint →]

Keep up the momentum!

---
Your progress: {{completedDays}}/30 days ({{percentage}}%)
Current streak: {{streak}} days 🔥

[Unsubscribe from these emails]
```

### Milestone Email

```html
Subject: 🎉 You Completed Week 1!

Hi {{userName}},

Incredible achievement! You've completed your first week of the 30-Day Transformation Sprint.

You earned: {{badgeName}} badge! 🏆

This is a major milestone. Most people don't make it this far. You're building real momentum.

[View Your Badge Collection →]

What's next?
Week 2: Momentum - You'll dive deeper into the practices and start seeing real changes.

[Continue to Day 8 →]

We're proud of you!

---
[View Dashboard] | [Unsubscribe]
```

---

## Testing Checklist (Phase 2)

### Database Integration
- [ ] Progress migrates from localStorage to database
- [ ] Progress syncs across multiple devices
- [ ] Concurrent updates handled correctly
- [ ] Database rollback on errors

### Badge System
- [ ] All badges defined in database
- [ ] Badges awarded correctly based on requirements
- [ ] Celebration modal appears on badge unlock
- [ ] Badge collection page displays correctly
- [ ] Progress toward badges calculated correctly

### Streak Tracking
- [ ] Streak increments on consecutive days
- [ ] Streak resets when day skipped
- [ ] Best streak updates correctly
- [ ] Streak colors change based on length

### Email Notifications
- [ ] Day unlock emails sent
- [ ] Milestone emails sent with correct badge
- [ ] Re-engagement emails sent after 3 days inactive
- [ ] Email preferences save and apply
- [ ] Unsubscribe works

### UI Enhancements
- [ ] Celebration modals animate correctly
- [ ] Confetti/meteor effects work
- [ ] Progress visualizations accurate
- [ ] Badge cards display properly
- [ ] Smooth transitions between pages

---

## Migration Plan

### Phase 1 to Phase 2 Migration

**Week 1: Database Setup**
- Create Turso database tables (migration SQL file)
- Run migration: `npm run db:migrate`
- Seed badge data into `badges` table
- Verify table structure and indexes

**Week 2: API Development**
- Build API routes using Turso client
- Implement lazy imports for `@/lib/turso`
- Test endpoints with Postman/curl
- Add error handling for all database operations

**Week 3: Frontend Updates**
- Update components to use API
- Add badge UI components (GlowingStarsBackgroundCard)
- Add celebration modals (AnimatedModal + Meteors)
- Implement client-side caching with SWR or React Query

**Week 4: Email Setup**
- Configure email service (Resend)
- Create HTML email templates
- Test email sending (day unlock, milestones, re-engagement)
- Implement email preference management

**Week 5: Migration Script**
- Build localStorage → Turso migration utility
- Add migration UI prompt on first login after Phase 2 deployment
- Test with sample localStorage data
- Handle edge cases and errors gracefully

**Week 6: Testing & Launch**
- QA testing across all features
- Beta test with 10-20 select users
- Monitor database performance and query speeds
- Full deployment with rollback plan

---

## Success Metrics (Phase 2)

**Technical:**
- 99.9% uptime for database
- <200ms API response time
- Email delivery rate >95%

**User Engagement:**
- 80%+ users have badges
- Average streak: 6+ days
- Email open rate: 30%+
- Email click rate: 15%+

**Business:**
- 60%+ completion rate (up from 50% in Phase 1)
- 20%+ sprint restart rate
- 85%+ user satisfaction

---

**End of Phase 2 PRD**
