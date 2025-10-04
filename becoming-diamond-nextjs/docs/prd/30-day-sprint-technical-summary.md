# 30 Day Sprint - Technical Summary & Design Guide

**Version:** 1.0
**Last Updated:** 2025-10-03
**Purpose:** Technical reference for implementation teams
**Related Documents:** Phase 1, 2, and 3 PRDs

---

## Table of Contents

1. [Recommended Aceternity UI Components](#recommended-aceternity-ui-components)
2. [Content Schema Specification](#content-schema-specification)
3. [Data Models Overview](#data-models-overview)
4. [Key Design Decisions](#key-design-decisions)
5. [Implementation Patterns](#implementation-patterns)
6. [Performance Considerations](#performance-considerations)

---

## Recommended Aceternity UI Components

### Phase 1: MVP Components

**Core Navigation & Layout:**
- **None required initially** - Use basic Tailwind components
- Reason: Keep MVP simple, focus on functionality over visual effects

**Consider for Polish:**
- Basic motion components from Framer Motion (already included)
- Standard Tailwind cards and layouts

### Phase 2: Enhanced UI Components

**Progress Visualization:**

1. **`Timeline`** (`src/components/ui/timeline.tsx`)
   - **Use Case:** Display 30-day journey with scroll-based animation
   - **Implementation:**
     ```tsx
     import { Timeline } from '@/components/ui/timeline';

     const timelineData = weeks.map(week => ({
       title: week.title,
       content: <WeekContent days={week.days} />
     }));

     <Timeline data={timelineData} />
     ```
   - **Benefits:** Built-in scroll animations, visual progress line
   - **Where:** Dashboard page, sprint overview

2. **`TracingBeam`** (`src/components/ui/tracing-beam.tsx`)
   - **Use Case:** Wrap day content with animated progress beam
   - **Implementation:**
     ```tsx
     import { TracingBeam } from '@/components/ui/tracing-beam';

     <TracingBeam>
       <DayContent day={currentDay} />
     </TracingBeam>
     ```
   - **Benefits:** Visual indicator of reading progress, subtle animation
   - **Where:** Individual day pages

**Gamification Components:**

3. **`AnimatedModal`** (`src/components/ui/animated-modal.tsx`)
   - **Use Case:** Celebration modals for completions and badge unlocks
   - **Implementation:**
     ```tsx
     import { Modal, ModalBody, ModalTrigger } from '@/components/ui/animated-modal';

     <Modal>
       <ModalBody>
         <CelebrationContent badge={newBadge} />
       </ModalBody>
     </Modal>
     ```
   - **Benefits:** Smooth enter/exit animations, backdrop blur
   - **Where:** Day completion, badge unlocks, milestones

4. **`GlowingStarsBackgroundCard`** (`src/components/ui/glowing-stars.tsx`)
   - **Use Case:** Achievement/badge cards with animated star effect
   - **Implementation:**
     ```tsx
     import {
       GlowingStarsBackgroundCard,
       GlowingStarsTitle,
       GlowingStarsDescription
     } from '@/components/ui/glowing-stars';

     <GlowingStarsBackgroundCard>
       <GlowingStarsTitle>{badge.title}</GlowingStarsTitle>
       <GlowingStarsDescription>{badge.description}</GlowingStarsDescription>
     </GlowingStarsBackgroundCard>
     ```
   - **Benefits:** Engaging hover effects, premium feel
   - **Where:** Achievements page, badge collection

5. **`Meteors`** (`src/components/ui/meteors.tsx`)
   - **Use Case:** Celebration particle effects
   - **Implementation:**
     ```tsx
     import { Meteors } from '@/components/ui/meteors';

     <div className="relative">
       <Meteors number={20} />
       <CelebrationMessage />
     </div>
     ```
   - **Benefits:** Festive, eye-catching animation
   - **Where:** Completion celebrations, milestone achievements

**Card Components:**

6. **`FocusCards`** (`src/components/ui/focus-cards.tsx`)
   - **Use Case:** Day cards in dashboard grid
   - **Implementation:**
     ```tsx
     import { FocusCards } from '@/components/ui/focus-cards';

     const dayCards = days.map(day => ({
       title: day.frontmatter.title,
       src: day.frontmatter.thumbnail || '/default-day.jpg'
     }));

     <FocusCards cards={dayCards} />
     ```
   - **Benefits:** Hover effects, responsive grid
   - **Where:** Dashboard all-days view

7. **`CardHoverEffect`** (`src/components/ui/card-hover-effect.tsx`)
   - **Use Case:** Enhanced day cards with 3D tilt effect
   - **Implementation:**
     ```tsx
     import { HoverEffect } from '@/components/ui/card-hover-effect';

     <HoverEffect items={dayItems} />
     ```
   - **Benefits:** Sophisticated interaction, depth perception
   - **Where:** Week breakdown, featured days

**Text Effects:**

8. **`TextGenerateEffect`** (`src/components/ui/text-generate-effect.tsx`)
   - **Use Case:** Animated text reveals for titles
   - **Implementation:**
     ```tsx
     import { TextGenerateEffect } from '@/components/ui/text-generate-effect';

     <TextGenerateEffect words={day.frontmatter.title} />
     ```
   - **Benefits:** Attention-grabbing entrance, professional feel
   - **Where:** Day titles, milestone announcements

**Navigation:**

9. **`Tabs`** (`src/components/ui/tabs.tsx`)
   - **Use Case:** Organize content views (e.g., Daily Content, Reflection, Resources)
   - **Implementation:**
     ```tsx
     import { Tabs } from '@/components/ui/tabs';

     const tabs = [
       { title: 'Content', value: 'content', content: <DayContent /> },
       { title: 'Reflection', value: 'reflection', content: <Reflection /> },
       { title: 'Resources', value: 'resources', content: <Resources /> }
     ];

     <Tabs tabs={tabs} />
     ```
   - **Benefits:** Smooth transitions, clean organization
   - **Where:** Day pages with multiple sections

### Phase 3: Advanced Components

10. **`BentoGrid`** (`src/components/ui/bento-grid.tsx`)
    - **Use Case:** Dashboard stats overview, feature highlights
    - **Implementation:**
      ```tsx
      import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';

      <BentoGrid>
        <BentoGridItem title="Progress" description="75% complete" />
        <BentoGridItem title="Streak" description="15 days" />
        {/* ... */}
      </BentoGrid>
      ```
    - **Benefits:** Masonry-style layout, responsive
    - **Where:** Dashboard, admin analytics

11. **`InfiniteMovingCards`** (`src/components/ui/infinite-moving-cards.tsx`)
    - **Use Case:** Testimonials, celebration wall posts
    - **Implementation:**
      ```tsx
      import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';

      <InfiniteMovingCards items={testimonials} speed="slow" />
      ```
    - **Benefits:** Auto-scrolling, attention-grabbing
    - **Where:** Landing page, celebration wall

12. **`Spotlight`** (`src/components/ui/spotlight.tsx`)
    - **Use Case:** Hero section emphasis
    - **Implementation:**
      ```tsx
      import { Spotlight } from '@/components/ui/spotlight';

      <div className="relative">
        <Spotlight fill="var(--primary)" />
        <HeroContent />
      </div>
      ```
    - **Benefits:** Dramatic effect, guides eye
    - **Where:** Sprint landing page

---

## Content Schema Specification

### Directory Structure

```
content/
└── sprint/
    ├── day-01.md
    ├── day-02.md
    ├── ...
    ├── day-30.md
    └── sprint-config.yml  (optional, Phase 2+)
```

### Markdown Frontmatter Schema

**Complete Field Reference:**

```yaml
---
# ===== REQUIRED FIELDS =====
day: 1                                    # Integer: 1-30
title: "Building Your Foundation"        # String: Day title
subtitle: "Understanding the Diamond Mindset"  # String: Day subtitle
published: true                           # Boolean: Publish status

# ===== MEDIA FIELDS (Optional) =====
video: "youtube:dQw4w9WgXcQ"             # String: Video embed
# Supported formats:
#   - "youtube:VIDEO_ID"
#   - "https://www.youtube.com/watch?v=VIDEO_ID"
#   - "vimeo:VIDEO_ID"
#   - "https://vimeo.com/VIDEO_ID"
#   - "/uploads/video.mp4" (self-hosted)

audio: "/uploads/sprint/day-01-meditation.mp3"  # String: Audio file URL
# Supported formats:
#   - Relative URL: "/uploads/file.mp3"
#   - Absolute URL: "https://example.com/audio.mp3"
#   - File types: .mp3, .wav, .ogg

images:                                   # Array: Image URLs
  - "/uploads/sprint/day-01-framework.jpg"
  - "/uploads/sprint/day-01-example.jpg"
# Or with captions (Phase 2+):
# images:
#   - url: "/uploads/image.jpg"
#     alt: "Description"
#     caption: "Framework diagram"

# ===== METADATA FIELDS (Optional) =====
duration: "15 minutes"                    # String: Estimated time
difficulty: "Beginner"                    # String: Beginner|Intermediate|Advanced
category: "Mindset"                       # String: Topic category
week: 1                                   # Integer: 1-4 (which week)

# ===== ORGANIZATIONAL FIELDS (Optional) =====
tags:                                     # Array: Tags for search/filter
  - foundation
  - mindset
  - introduction

description: "Day 1 introduces the core concepts..."  # String: SEO description

# ===== EXERCISE FIELDS (Optional, Phase 2+) =====
hasExercise: true                         # Boolean: Has reflection exercise
exerciseTitle: "Daily Reflection"        # String: Exercise title
exerciseInstructions: "Take 5 minutes..." # String: Exercise instructions

# ===== ADVANCED FIELDS (Phase 3+) =====
difficulty_variations:                    # Object: Content variations by difficulty
  beginner: "beginner-day-01.md"
  intermediate: "intermediate-day-01.md"
  advanced: "advanced-day-01.md"

unlockTime: "09:00"                       # String: Time of day to unlock (HH:MM)
prerequisites: [1, 2]                     # Array: Required previous days
---

# Day 1 Content Starts Here

Markdown content goes here...
```

### Field Validation Rules

**Required Validations:**
- `day`: Must be integer 1-30, unique within sprint
- `title`: Non-empty string, max 100 characters
- `subtitle`: Non-empty string, max 150 characters
- `published`: Must be boolean

**Optional Validations:**
- `video`: Valid format string (regex: `^(youtube|vimeo):[a-zA-Z0-9_-]+$` or URL)
- `audio`: Valid URL format
- `images`: Array of valid URLs
- `duration`: String matching pattern `^\d+ (minutes?|hours?)$`
- `difficulty`: Enum ['Beginner', 'Intermediate', 'Advanced']
- `week`: Integer 1-4
- `tags`: Array of strings, max 10 tags
- `description`: Max 300 characters

### Content Guidelines

**Writing Best Practices:**

1. **Day Title:**
   - Action-oriented (e.g., "Building...", "Creating...", "Discovering...")
   - Clear and specific
   - 3-10 words

2. **Day Subtitle:**
   - Explains the "why" or "what"
   - Complements the title
   - 5-15 words

3. **Body Content:**
   - Target: 800-1200 words
   - Clear section headings (H2, H3)
   - Use bullet points and lists
   - Include actionable takeaways
   - End with encouragement

4. **Video Content:**
   - Recommended: 5-15 minutes
   - Professional quality (720p minimum)
   - Subtitle/captions available
   - Engaging thumbnail

5. **Audio Content:**
   - Recommended: 10-20 minutes
   - Clear audio quality
   - Background music optional (low volume)
   - MP3 format, 128kbps minimum

6. **Images:**
   - Diagrams should be simple and clear
   - Photos should be high-quality (1200px+ width)
   - Use alt text for accessibility
   - Optimize file size (<500KB per image)

### Sprint Configuration File (Phase 2+)

**File:** `content/sprint/sprint-config.yml`

```yaml
# Sprint Metadata
title: "30 Day Diamond Transformation Sprint"
description: "A structured 30-day journey to build lasting habits and transform your mindset."
version: "1.0"
createdDate: "2025-01-01"
lastUpdated: "2025-01-15"

# Sprint Settings
duration: 30  # days
mode: "flexible"  # "flexible" | "strict"
startDate: null  # null = starts when user enrolls, or specific date

# Week Themes
weeks:
  - number: 1
    title: "Foundation"
    theme: "Building Core Habits"
    description: "Establish the fundamental practices for transformation"
  - number: 2
    title: "Momentum"
    theme: "Deepening Your Practice"
    description: "Accelerate your progress and build consistency"
  - number: 3
    title: "Integration"
    theme: "Making It Stick"
    description: "Integrate new habits into your daily life"
  - number: 4
    title: "Mastery"
    theme: "Owning Your Transformation"
    description: "Solidify your gains and plan for the future"

# Badge Definitions (synced to database in Phase 2)
badges:
  - id: "first-step"
    title: "First Step"
    description: "Completed Day 1"
    icon: "/images/badges/first-step.svg"
    rarity: "common"
    category: "milestone"
    requirement:
      type: "day"
      value: 1

  - id: "week-1-warrior"
    title: "Week 1 Warrior"
    description: "Completed Week 1"
    icon: "/images/badges/week-1.svg"
    rarity: "rare"
    category: "milestone"
    requirement:
      type: "days_range"
      value: "1-7"

  - id: "halfway-hero"
    title: "Halfway Hero"
    description: "Reached the halfway point"
    icon: "/images/badges/halfway.svg"
    rarity: "epic"
    category: "milestone"
    requirement:
      type: "day"
      value: 15

  - id: "week-3-champion"
    title: "Week 3 Champion"
    description: "Completed Week 3"
    icon: "/images/badges/week-3.svg"
    rarity: "epic"
    category: "milestone"
    requirement:
      type: "days_range"
      value: "15-21"

  - id: "diamond-achiever"
    title: "Diamond Achiever"
    description: "Completed all 30 days"
    icon: "/images/badges/diamond.svg"
    rarity: "legendary"
    category: "milestone"
    requirement:
      type: "day"
      value: 30

  # Streak Badges
  - id: "consistent"
    title: "Consistent"
    description: "Maintained a 3-day streak"
    icon: "/images/badges/streak-3.svg"
    rarity: "common"
    category: "streak"
    requirement:
      type: "streak"
      value: 3

  - id: "committed"
    title: "Committed"
    description: "Maintained a 7-day streak"
    icon: "/images/badges/streak-7.svg"
    rarity: "rare"
    category: "streak"
    requirement:
      type: "streak"
      value: 7

  - id: "unstoppable"
    title: "Unstoppable"
    description: "Maintained a 14-day streak"
    icon: "/images/badges/streak-14.svg"
    rarity: "epic"
    category: "streak"
    requirement:
      type: "streak"
      value: 14

  - id: "legendary"
    title: "Legendary"
    description: "Maintained a 21-day streak"
    icon: "/images/badges/streak-21.svg"
    rarity: "epic"
    category: "streak"
    requirement:
      type: "streak"
      value: 21

  - id: "flawless"
    title: "Flawless"
    description: "Completed all 30 days with a perfect streak"
    icon: "/images/badges/flawless.svg"
    rarity: "legendary"
    category: "streak"
    requirement:
      type: "streak"
      value: 30

# Feature Flags (Phase 2+)
features:
  allowSkipDays: true              # Flexible mode: can skip days
  gracePeriodHours: 24             # Strict mode: catch-up window
  requireVideoCompletion: false    # Track video watch time
  enableComments: false            # Community comments
  enableSharing: true              # Social sharing
  enableLeaderboard: false         # Cohort leaderboard

# Email Settings (Phase 2+)
emails:
  dailyUnlock:
    enabled: true
    subject: "Day {{day}} is Now Unlocked!"
  milestones:
    enabled: true
    subject: "🎉 You Completed {{milestone}}!"
  reEngagement:
    enabled: true
    triggerAfterDays: 3
    subject: "We miss you! Your sprint is waiting"
```

---

## Data Models Overview

### Phase 1: localStorage Schema

```typescript
// Storage Key Pattern
const STORAGE_KEY = `sprint_progress_${userId}`;

// Stored Object
interface SprintProgress {
  userId: string;
  sprintId: string;
  enrollmentDate: string;  // ISO 8601

  completedDays: {
    day: number;
    completedAt: string;  // ISO 8601
  }[];

  currentDay: number;  // 1-30
  totalDaysCompleted: number;
  completionPercentage: number;

  status: "not_started" | "in_progress" | "completed";
  completionDate?: string;  // ISO 8601

  lastAccessDate: string;
  createdAt: string;
  updatedAt: string;
}
```

### Phase 2: Database Schema (Turso/LibSQL)

**Key Tables:**

1. **sprint_progress** - Main progress tracking
2. **completed_days** - Individual day completions
3. **badges** - Badge definitions
4. **user_badges** - User's earned badges
5. **email_preferences** - User notification settings

**Relationships:**
```
users (1) ──────< (N) sprint_progress
sprint_progress (1) ──────< (N) completed_days
users (M) ──────< (N) user_badges >────── (M) badges
users (1) ──────< (1) email_preferences
```

**Indexes:**
- `sprint_progress.user_id` - Fast user lookup
- `sprint_progress(user_id, sprint_id)` - Unique constraint
- `completed_days.sprint_progress_id` - Fast day lookup
- `user_badges.user_id` - Fast badge lookup

### Phase 3: Extended Schema

**Additional Tables:**
- `cohorts` - Group management
- `partnerships` - Accountability pairs
- `discussions` - Community threads
- `celebration_posts` - Shared achievements
- `sprint_variations` - Multiple sprint types
- `user_preferences` - Advanced settings

**New Relationships:**
```
cohorts (1) ──────< (N) sprint_progress
users (M) ──────< (N) partnerships >────── (M) users
sprint_variations (1) ──────< (N) sprint_progress
```

---

## Key Design Decisions

### Decision 1: localStorage → Database Migration Path

**Phase 1 Decision:** Use localStorage for MVP
- **Rationale:** Fast to implement, no backend complexity
- **Trade-off:** Data loss risk, single-device only
- **Mitigation:** Clearly communicate limitation, migrate early in Phase 2

**Phase 2 Decision:** Migrate to Turso (LibSQL) with direct SQL queries
- **Rationale:** Already in use in codebase, serverless, edge-optimized, SQLite-compatible
- **Migration Strategy:** Auto-migrate on user login, confirm success
- **Backup:** Export feature before migration
- **Advantages:** No ORM overhead, follows existing patterns in `/src/app/api/leads/route.ts`

**Key Takeaway:** localStorage enables fast MVP launch, but database migration is critical for Phase 2.

### Decision 2: Client-Side Rendering for Member Portal

**Decision:** All sprint pages are client-side rendered (`"use client"`)
- **Rationale:** Require authentication, use React Context, heavy interactivity
- **Trade-off:** Slower initial load, larger JS bundle
- **Mitigation:** Dynamic imports for heavy components, code-splitting

**Alternative Considered:** Server Components with client islands
- **Why Not Chosen:** Context provider needs client-side, complexity not justified for Phase 1

**Key Takeaway:** CSR appropriate for authenticated portal, optimize with code-splitting.

### Decision 3: Markdown-Based Content System

**Decision:** Use markdown files with gray-matter for content
- **Rationale:** Version control, Git-based workflow, CMS-agnostic
- **Trade-off:** No dynamic content, rebuild required for updates
- **Benefits:** Simple, developer-friendly, integrates with existing system

**Alternative Considered:** Database-stored content
- **Why Not Chosen:** Adds complexity, no need for dynamic content, content creators prefer markdown

**Key Takeaway:** Markdown works well for static sprint content, aligns with existing architecture.

### Decision 4: Progressive Enhancement with Aceternity UI

**Phase 1 Decision:** Minimal Aceternity components
- **Rationale:** Focus on functionality, avoid over-engineering
- **Components Used:** None (basic Tailwind only)

**Phase 2 Decision:** Strategic Aceternity integration
- **Rationale:** Enhance UX without rebuilding everything
- **Components Added:** Timeline, TracingBeam, AnimatedModal, GlowingStars, Meteors
- **Approach:** Wrap existing content, don't replace

**Key Takeaway:** Start simple, enhance progressively. Aceternity adds polish without blocking MVP.

### Decision 5: Sequential vs. Date-Locked Unlocking

**Phase 1-2 Decision:** Sequential unlocking (complete Day X → unlock Day X+1)
- **Rationale:** Simple to implement, user-controlled pacing
- **Benefit:** No timezone complexity, flexible for users
- **Trade-off:** Users can binge (reduces habit formation)

**Phase 3 Decision:** Date-locked option for strict mode
- **Rationale:** Enforce daily habit, prevent rushing
- **Benefit:** True 30-day commitment, better outcomes
- **Trade-off:** Rigid, may frustrate some users
- **Solution:** Offer both modes, let user choose or admin configure

**Key Takeaway:** Flexible mode for MVP, strict mode for advanced users. Choice is key.

### Decision 6: Badge System Design

**Decision:** Badge definitions in database, not code
- **Rationale:** Non-developers can add badges, easy to modify
- **Structure:** Badge table with JSON requirement field
- **Flexibility:** Supports complex requirements (day ranges, streaks, special)

**Alternative Considered:** Hard-coded badge logic
- **Why Not Chosen:** Inflexible, requires code changes for new badges

**Key Takeaway:** Data-driven badge system enables experimentation without code changes.

### Decision 7: Email vs. Push Notifications

**Phase 2 Decision:** Email notifications only
- **Rationale:** Works for all users, no app install required
- **Service:** Resend (or SendGrid)
- **Templates:** HTML emails with personalization

**Phase 3 Addition:** Push notifications for mobile users
- **Rationale:** Higher engagement, immediate delivery
- **Implementation:** PWA push or native app
- **Fallback:** Always send email, push as enhancement

**Key Takeaway:** Email-first approach for accessibility, push for engaged users later.

---

## Implementation Patterns

### Pattern 1: React Context for State Management

**Why:** Avoid prop drilling, global sprint state needed across components

**Structure:**
```typescript
<SprintProvider>  {/* Wraps entire sprint section */}
  <SprintOverview />
  <SprintDashboard />
  <DayContent />
</SprintProvider>
```

**Context Value:**
```typescript
{
  progress: SprintProgress | null,
  isEnrolled: boolean,
  enrollInSprint: () => void,
  completeDay: (day: number) => void,
  isDayUnlocked: (day: number) => boolean,
  isDayCompleted: (day: number) => boolean,
}
```

**Best Practice:** Single source of truth, all sprint state in context.

### Pattern 2: API Route Design

**Convention:** RESTful endpoints with clear naming

```
GET    /api/sprint/progress          → Get user progress
POST   /api/sprint/enroll            → Enroll in sprint
POST   /api/sprint/complete          → Mark day complete
GET    /api/sprint/badges            → Get badges with status
POST   /api/sprint/badges/award      → Award badge (internal)
```

**Response Format:**
```typescript
{
  success: boolean,
  data?: any,
  error?: string,
  message?: string
}
```

**Error Handling:**
```typescript
try {
  // ... operation
  return NextResponse.json({ success: true, data });
} catch (error) {
  console.error('Error:', error);
  return NextResponse.json(
    { success: false, error: 'Internal server error' },
    { status: 500 }
  );
}
```

### Pattern 3: Content Loading Strategy

**Static Generation for Sprint Days:**
```typescript
// Generate all 30 day pages at build time
export async function generateStaticParams() {
  return Array.from({ length: 30 }, (_, i) => ({
    dayNumber: (i + 1).toString()
  }));
}
```

**Runtime Check for Access:**
```typescript
// In component
const { isDayUnlocked } = useSprint();

if (!isDayUnlocked(dayNumber)) {
  return <LockedDayView />;
}

return <UnlockedDayView />;
```

**Best Practice:** Pre-render all pages, control access via client-side state.

### Pattern 4: Badge Award Logic

**Centralized Badge Checking:**
```typescript
// lib/badges.ts
import { turso } from '@/lib/turso';
import { nanoid } from 'nanoid';

export async function checkAndAwardBadges(
  userId: string,
  progress: any
): Promise<any[]> {
  const allBadgesResult = await turso.execute({
    sql: 'SELECT * FROM badges'
  });

  const userBadgesResult = await turso.execute({
    sql: 'SELECT * FROM user_badges WHERE user_id = ?',
    args: [userId]
  });

  const earnedBadgeIds = userBadgesResult.rows.map((ub: any) => ub.badge_id);
  const newBadges: any[] = [];

  for (const badge of allBadgesResult.rows) {
    if (earnedBadgeIds.includes(badge.id)) continue;

    if (checkBadgeRequirement(badge, progress)) {
      const now = Math.floor(Date.now() / 1000);
      await turso.execute({
        sql: `INSERT INTO user_badges (id, user_id, badge_id, earned_at)
              VALUES (?, ?, ?, ?)`,
        args: [`badge_${nanoid()}`, userId, badge.id, now]
      });
      newBadges.push(badge);
    }
  }

  return newBadges;
}

function checkBadgeRequirement(badge: Badge, progress: SprintProgress): boolean {
  const req = badge.requirement as { type: string; value: any };

  switch (req.type) {
    case 'day':
      return progress.completedDays.some(d => d.day === req.value);
    case 'days_range':
      const [start, end] = req.value.split('-').map(Number);
      const completedInRange = progress.completedDays.filter(
        d => d.day >= start && d.day <= end
      );
      return completedInRange.length === (end - start + 1);
    case 'streak':
      return progress.currentStreak >= req.value;
    default:
      return false;
  }
}
```

**Best Practice:** Check badges after every day completion, award immediately.

---

## Performance Considerations

### Optimization Strategies

**1. Code Splitting:**
```typescript
// Lazy load heavy 3D components
const Meteors = dynamic(() => import('@/components/ui/meteors'), {
  ssr: false,
  loading: () => <LoadingSkeleton />
});
```

**2. Image Optimization:**
```typescript
// Use Next.js Image component (Phase 2)
import Image from 'next/image';

<Image
  src={day.frontmatter.thumbnail}
  alt={day.frontmatter.title}
  width={800}
  height={600}
  loading="lazy"
/>
```

**3. Video Lazy Loading:**
```typescript
// Don't load video until user scrolls to it
<div ref={videoRef}>
  {isVideoVisible && <VideoPlayer url={videoUrl} />}
</div>
```

**4. Database Query Optimization:**
```typescript
// Fetch related data in single batch with proper indexing
const { turso } = await import('@/lib/turso');

// Get progress and completed days in two queries
const progressResult = await turso.execute({
  sql: `SELECT * FROM sprint_progress
        WHERE user_id = ? AND sprint_id = ?`,
  args: [userId, sprintId]
});

if (progressResult.rows.length > 0) {
  const progress = progressResult.rows[0];

  const completedDaysResult = await turso.execute({
    sql: `SELECT * FROM completed_days
          WHERE sprint_progress_id = ?
          ORDER BY day ASC`,
    args: [progress.id]
  });

  progress.completedDays = completedDaysResult.rows;
}
```

**5. Caching Strategy (Phase 2+):**
```typescript
// Cache badge definitions (rarely change)
const BADGE_CACHE_TTL = 60 * 60; // 1 hour

const cachedBadges = await redis.get('badges:all');
if (cachedBadges) return JSON.parse(cachedBadges);

const badgesResult = await turso.execute({ sql: 'SELECT * FROM badges' });
const badges = badgesResult.rows;
await redis.setex('badges:all', BADGE_CACHE_TTL, JSON.stringify(badges));
```

### Performance Targets

- **Page Load:** <2 seconds (Time to Interactive)
- **API Response:** <200ms (p95)
- **Video Start:** <1 second (player ready)
- **Animation FPS:** 60fps (smooth animations)
- **Database Query:** <50ms (p95)
- **Image Load:** Progressive (lazy loading)

---

## Summary

This technical summary provides:

1. **Aceternity UI Component Recommendations** - Specific components for each phase with implementation examples
2. **Content Schema Specification** - Complete frontmatter reference and validation rules
3. **Data Models Overview** - localStorage and database schemas for all phases
4. **Key Design Decisions** - Rationale behind major architectural choices
5. **Implementation Patterns** - Best practices for common scenarios
6. **Performance Considerations** - Optimization strategies and targets

**Next Steps:**
- Review Main PRD for complete feature specifications
- Reference Phase PRDs for implementation order
- Use this document for technical implementation decisions

---

**Document Prepared By:** Claude Code (AI Product Strategist & Technical Architect)
**For:** Becoming Diamond Development Team
**Related Documents:**
- `30-day-sprint-main.md`
- `30-day-sprint-phase-1.md`
- `30-day-sprint-phase-2.md`
- `30-day-sprint-phase-3.md`
