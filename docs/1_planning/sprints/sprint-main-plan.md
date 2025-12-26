# 30 Day Sprint Feature - Main PRD

**Version:** 1.0
**Last Updated:** 2025-10-03
**Product Owner:** Becoming Diamond Team
**Document Status:** Draft for Review

---

## Executive Summary

The 30 Day Sprint is a structured, time-based learning module designed to create habit formation and sustained engagement within the Becoming Diamond member portal. Unlike the self-paced courses section, the Sprint enforces progressive unlocking of daily content to maintain momentum and prevent information overload, while incorporating gamification elements to drive completion rates.

**Key Differentiators:**
- Time-based progression (vs. self-paced courses)
- Daily unlocking mechanism
- Gamification and achievement system
- Focused 30-day commitment period
- Multi-modal content delivery (text, video, audio, images)

**Success Metrics:**
- 70%+ completion rate for enrolled members
- Average daily engagement time: 15-20 minutes
- 80%+ user satisfaction score
- 3+ day average streak length
- 50%+ badge collection rate

---

## Problem Statement & Goals

### Problem Statement

Current member portal offers self-paced courses, which while flexible, can lead to:
1. **Procrastination:** Members delay starting or completing content
2. **Inconsistent Engagement:** Sporadic access patterns reduce habit formation
3. **Low Completion Rates:** Without structure, many members don't finish what they start
4. **Lack of Momentum:** No time-based urgency or progression system
5. **Limited Accountability:** No mechanism to track daily commitment

### Goals

**Primary Goals:**
1. **Habit Formation:** Create daily engagement patterns over 30 consecutive days
2. **Higher Completion Rates:** Achieve 70%+ completion through structured progression
3. **Sustained Engagement:** Maintain consistent daily logins and content consumption
4. **Behavioral Transformation:** Support the core "Becoming Diamond" methodology through consistent practice

**Secondary Goals:**
1. **Community Building:** Create shared experience among cohort members
2. **Gamification Engagement:** Drive motivation through achievements and badges
3. **Content Versatility:** Support multiple content formats for different learning styles
4. **Progressive Disclosure:** Prevent overwhelm by revealing one day at a time

---

## User Stories & Use Cases

### Primary User Personas

**1. The Committed Transformer**
- 35-45 years old, professional seeking personal development
- High motivation, values structure and accountability
- Prefers guided experiences over self-directed learning
- Has attempted 30-day challenges before with mixed results

**2. The Busy Professional**
- 28-40 years old, limited daily time for personal development
- Needs bite-sized, focused daily content (15-20 min max)
- Values mobile accessibility and flexible viewing times
- Struggles with consistency due to work demands

**3. The Achievement-Oriented Learner**
- 25-35 years old, motivated by progress tracking and gamification
- Competitive, enjoys earning badges and maintaining streaks
- Social proof and community validation are important
- Likely to share achievements on social media

### Core User Stories

**As a member, I want to:**

1. **Start a 30 Day Sprint**
   - Enroll in a sprint with clear expectations
   - Understand what to expect each day
   - See overview of the 30-day journey
   - Know the time commitment required

2. **Access Daily Content**
   - View today's unlocked content immediately upon login
   - See clear indication of what day I'm on (e.g., "Day 7 of 30")
   - Consume content in my preferred format (video, audio, or text)
   - Save progress if I need to step away mid-session

3. **Track My Progress**
   - Visualize how far I've come (days completed)
   - See how many days remain
   - Maintain awareness of my current streak
   - View all completed days for reference

4. **Mark Days Complete**
   - Clearly indicate I've finished today's content
   - Receive confirmation and encouragement
   - Unlock tomorrow's content
   - See progress update in real-time

5. **Earn Recognition**
   - Receive badges for milestones (Day 7, 14, 21, 30)
   - Maintain streak tracking (consecutive days)
   - View all earned achievements
   - Celebrate completion of the full sprint

6. **Navigate the Sprint**
   - Return to previous days' content for review
   - See which days are locked vs. unlocked
   - Jump directly to today's active day
   - Understand when next day will unlock

### Use Case Scenarios

**Scenario 1: First-Time Sprint Enrollment**
```
Given: Sarah is a new member who just completed PR1
When: She navigates to the Sprint section
Then: She sees an engaging overview page explaining the sprint
And: A clear "Start Sprint" call-to-action
When: She clicks "Start Sprint"
Then: She's enrolled and Day 1 content is immediately accessible
And: Days 2-30 show as locked with countdown/status
And: Her progress tracker shows 0/30 complete
```

**Scenario 2: Daily Engagement Routine**
```
Given: John completed Day 5 yesterday
When: He logs in the next day
Then: Day 6 is automatically unlocked
And: He sees a notification: "Day 6 is ready!"
And: The dashboard highlights Day 6 as "Active"
When: He completes Day 6 content and clicks "Mark Complete"
Then: He receives congratulatory feedback
And: Progress updates to 6/30 (20% complete)
And: Day 7 shows as "Unlocks Tomorrow"
```

**Scenario 3: Milestone Achievement**
```
Given: Maria just completed Day 7
When: She clicks "Mark Complete"
Then: A celebration modal appears
And: She receives the "Week 1 Complete" badge
And: Confetti or animation plays
And: She sees encouragement: "You're building momentum!"
And: Badge is added to her achievements collection
```

**Scenario 4: Reviewing Previous Content**
```
Given: Tom is on Day 15
When: He wants to review Day 3's content
Then: He can navigate back to Day 3
And: All completed days show as "Completed" with checkmark
And: He can read/watch Day 3 content again
But: He cannot re-mark it as complete
And: Current day (Day 15) remains his active day
```

**Scenario 5: Missing a Day**
```
Given: Lisa completed Day 10 but didn't access Day 11 the next day
When: She logs in 2 days later
Then: Day 11 is still unlocked and available
And: Her streak counter shows "Streak: 0 days" (broken)
And: She can still complete Day 11 and continue
But: The missed days are visible in her history
Note: Phase 1 allows catch-up; Phase 3 may enforce strict daily access
```

---

## Detailed Feature Specifications

### 1. Sprint Overview Page (`/app/sprint`)

**Purpose:** Landing page for the Sprint feature, providing overview and enrollment entry point.

**Components:**
- **Hero Section**
  - Title: "30 Day Transformation Sprint"
  - Subtitle: Brief description of what the sprint offers
  - Visual: Animated timeline or progress graphic
  - CTA: "Start Your Sprint" or "Continue Sprint" (if enrolled)

- **What to Expect Section**
  - Daily time commitment: "15-20 minutes per day"
  - Content types: Video, audio, text, exercises
  - Support: Access to community and resources
  - Gamification: Badges, streaks, achievements

- **Sprint Timeline Preview**
  - Visual representation of 30 days
  - Highlight key milestones (Week 1, 2, 3, 4, Completion)
  - Show sample day topics (if available)

- **Enrollment State Handling**
  - Not enrolled: Show "Start Sprint" CTA
  - Enrolled: Show current progress and "Continue to Day X" CTA
  - Completed: Show completion certificate and "Restart Sprint" option

**Recommended Aceternity Components:**
- `Timeline` - For visual representation of 30-day journey
- `HeroHighlight` - For engaging header section
- `BentoGrid` - For "What to Expect" feature cards
- `AnimatedModal` - For enrollment confirmation

### 2. Daily Content View (`/app/sprint/day/[dayNumber]`)

**Purpose:** Display a single day's content with all materials and completion mechanism.

**Layout Structure:**
```
┌─────────────────────────────────────┐
│ Header: Day X of 30 | Progress Bar │
├─────────────────────────────────────┤
│                                     │
│  [Optional: Day Title/Subtitle]     │
│                                     │
│  [Video Player] (if video exists)   │
│                                     │
│  [Audio Player] (if audio exists)   │
│                                     │
│  [Main Content - Markdown Rendered] │
│                                     │
│  [Images Gallery] (if images exist) │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  Mark Day Complete Button     │  │
│  └───────────────────────────────┘  │
│                                     │
│  [Navigation: ← Previous | Next →] │
│                                     │
└─────────────────────────────────────┘
```

**Content Elements:**
1. **Day Header**
   - Day number with context: "Day 7 of 30"
   - Progress percentage: "23% Complete"
   - Progress bar visualization
   - Day title (from frontmatter)
   - Day subtitle (from frontmatter)

2. **Video Embed** (Optional)
   - Responsive video player
   - Support for YouTube, Vimeo, or self-hosted
   - Embed code from frontmatter: `video: "youtube:dQw4w9WgXcQ"`
   - Default aspect ratio: 16:9

3. **Audio Embed** (Optional)
   - Audio player component
   - Support for MP3, embedded podcast links
   - Playback controls: play, pause, speed, progress
   - Embed code from frontmatter: `audio: "/uploads/day-7-meditation.mp3"`

4. **Main Content Body**
   - Markdown rendered to HTML
   - Support for:
     - Headings (H1-H6)
     - Lists (ordered, unordered)
     - Blockquotes
     - Code blocks
     - Links
     - Bold, italic, strikethrough
   - Consistent typography with site theme

5. **Images Gallery** (Optional)
   - Support for multiple images
   - Responsive grid layout
   - Lightbox on click for full view
   - Images from frontmatter array: `images: ["/uploads/day7-1.jpg", "/uploads/day7-2.jpg"]`

6. **Completion Button**
   - Primary CTA: "Mark Day X Complete"
   - Disabled if already completed (shows "Completed ✓")
   - Triggers completion logic and unlocks next day
   - Visual feedback on click (loading state)

7. **Day Navigation**
   - Previous Day button (disabled if Day 1)
   - Next Day button (disabled if locked or Day 30)
   - Shows lock icon for locked days
   - Tooltip: "Complete Day X to unlock"

**State Management:**
- Track current day
- Track completion status
- Handle video/audio playback state
- Manage navigation permissions

**Recommended Aceternity Components:**
- `TracingBeam` - Wrap entire content for visual progress beam
- `AnimatedModal` - For completion confirmation
- `CardSpotlight` - For highlighting key content sections
- `TextGenerateEffect` - For animated day title reveal

### 3. Sprint Dashboard / All Days View (`/app/sprint/dashboard`)

**Purpose:** High-level overview of all 30 days with progress tracking and quick navigation.

**Layout:**
```
┌──────────────────────────────────────────────┐
│  Your Sprint Progress                        │
│  ┌────────────────────────────────────────┐  │
│  │  [Progress Ring: 15/30 Days Complete]  │  │
│  │  Current Streak: 7 days                │  │
│  │  Total Time Invested: 5.5 hours        │  │
│  └────────────────────────────────────────┘  │
├──────────────────────────────────────────────┤
│  Week 1: Foundation                          │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐        │
│  │✓1│ │✓2│ │✓3│ │✓4│ │✓5│ │✓6│ │✓7│        │
│  └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘        │
├──────────────────────────────────────────────┤
│  Week 2: Momentum                            │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐        │
│  │✓8│ │✓9│ │10│ │🔒│ │🔒│ │🔒│ │🔒│        │
│  └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘        │
├──────────────────────────────────────────────┤
│  [Weeks 3-4 similar pattern]                 │
└──────────────────────────────────────────────┘
```

**Components:**

1. **Progress Summary Card**
   - Circular progress ring showing completion percentage
   - Days completed: X/30
   - Current streak count
   - Estimated time remaining
   - Next milestone (e.g., "3 days until Week 2 badge!")

2. **Weekly Breakdown**
   - Four sections: Week 1, Week 2, Week 3, Week 4 (+ Days 29-30)
   - Each week has a title/theme (from content configuration)
   - Visual grid of 7 day cards per week

3. **Day Card States**
   - **Completed:** Green checkmark, full color, clickable to review
   - **Active/Current:** Highlighted border, "Current" badge, primary CTA
   - **Locked:** Lock icon, grayscale, disabled, tooltip showing unlock requirement
   - **Unlocked but not completed:** Full color, clickable, no checkmark

4. **Day Card Content (on hover/click)**
   - Day number
   - Day title
   - Brief preview (first 50 characters of content)
   - Status badge
   - Quick action: "View" or "Complete"

5. **Achievement Showcase**
   - Display earned badges
   - Show locked upcoming badges
   - Progress toward next badge

**Interactions:**
- Click completed day → Navigate to day view (read-only)
- Click active day → Navigate to day view (editable)
- Click locked day → Show tooltip explaining unlock requirement
- Hover day card → Show preview information

**Recommended Aceternity Components:**
- `Timeline` - Alternative vertical layout for weeks
- `FocusCards` - For day cards with hover effects
- `GlowingStarsBackgroundCard` - For achievement badges
- `CardHoverEffect` - For interactive day cards
- Custom circular progress ring (can create or use CSS)

### 4. Gamification & Achievement System

**Purpose:** Drive engagement, celebrate progress, and provide extrinsic motivation.

#### 4.1 Badge System

**Milestone Badges:**
1. **"First Step"** - Complete Day 1
2. **"Week 1 Warrior"** - Complete Days 1-7
3. **"Momentum Builder"** - Complete Week 2 (Days 8-14)
4. **"Halfway Hero"** - Complete Day 15
5. **"Week 3 Champion"** - Complete Days 15-21
6. **"Final Push"** - Complete Days 22-28
7. **"Diamond Achiever"** - Complete all 30 days

**Streak Badges:**
1. **"Consistent"** - 3-day streak
2. **"Committed"** - 7-day streak
3. **"Unstoppable"** - 14-day streak
4. **"Legendary"** - 21-day streak
5. **"Flawless"** - 30-day perfect streak

**Special Badges:**
1. **"Early Bird"** - Complete day content before 9 AM (5 times)
2. **"Night Owl"** - Complete day content after 9 PM (5 times)
3. **"Perfectionist"** - Complete all optional exercises
4. **"Social Diamond"** - Share 3 achievements
5. **"Comeback King/Queen"** - Resume after 3+ day break and finish

**Badge Display:**
- Visual icon for each badge
- Title and description
- Earn date
- Locked vs. unlocked state
- Progress toward locked badges (e.g., "4/7 days for Week 1 Warrior")

**Recommended Aceternity Components:**
- `GlowingStarsBackgroundCard` - Individual badge cards
- `AnimatedModal` - Badge unlock celebration modal
- `Meteors` or `ShootingStars` - Celebration effects
- `BentoGrid` - Badge collection display

#### 4.2 Streak Tracking

**Streak Logic:**
- Increments by 1 for each consecutive day completed
- Resets to 0 if a day is skipped
- Displays prominently on dashboard
- Separate "Best Streak" vs. "Current Streak"

**Visual Indicators:**
- Flame icon or streak counter
- Color coding:
  - 1-3 days: Gray (building)
  - 4-7 days: Blue (good)
  - 8-14 days: Green (great)
  - 15+ days: Gold (legendary)
- Streak milestone notifications

**Streak Preservation (Phase 3 - Future):**
- "Freeze" power-up: Skip one day without breaking streak (1 per sprint)
- Grace period: Complete "yesterday's" content within 24 hours

#### 4.3 Progress Statistics

**Tracked Metrics:**
1. **Days Completed:** X/30
2. **Completion Percentage:** 0-100%
3. **Current Streak:** Number of consecutive days
4. **Best Streak:** Highest streak achieved
5. **Total Time Invested:** Estimated based on content length
6. **Days Remaining:** 30 - X
7. **Estimated Completion Date:** Based on current pace
8. **Badges Earned:** X/Y total badges

**Dashboard Display:**
- Prominent stats cards
- Visual progress indicators
- Trend graphs (Phase 2+)
- Comparison to community average (Phase 3 - optional)

#### 4.4 Celebration Moments

**Trigger Points:**
- Day 1 completion: "You've started your journey!"
- Day 7 completion: Week 1 badge + encouragement
- Day 15 completion: Halfway celebration
- Day 21 completion: "You're in the home stretch!"
- Day 30 completion: Grand celebration + certificate

**Celebration Elements:**
- Animated modal with congratulations message
- Badge reveal animation
- Confetti or particle effects
- Encouraging copy specific to milestone
- Social share prompt (Phase 2+)

**Recommended Aceternity Components:**
- `AnimatedModal` - Celebration modal container
- `Meteors` - Celebratory particle effects
- `GlowingEffect` - Badge glow animation
- `TextGenerateEffect` - Animated congratulations text

---

## Content Structure & Schema Design

### Content Storage Architecture

**Directory Structure:**
```
content/
├── sprint/
│   ├── day-01.md
│   ├── day-02.md
│   ├── day-03.md
│   ├── ...
│   ├── day-30.md
│   └── sprint-config.yml  # Optional: Sprint metadata
```

### Markdown File Schema

**Frontmatter Structure:**
```yaml
---
# Required Fields
day: 1
title: "Building Your Foundation"
subtitle: "Understanding the Diamond Mindset"
published: true

# Optional Media Fields
video: "youtube:dQw4w9WgXcQ"  # Format: "platform:id" or URL
audio: "/uploads/sprint/day-01-audio.mp3"  # Relative or absolute URL
images:
  - "/uploads/sprint/day-01-image-1.jpg"
  - "/uploads/sprint/day-01-image-2.jpg"

# Optional Metadata
duration: "15 minutes"  # Estimated reading/viewing time
difficulty: "Beginner"  # Beginner, Intermediate, Advanced
category: "Mindset"  # Week theme or category
week: 1  # Which week (1-4)

# Optional Exercise/Reflection
hasExercise: true  # Boolean flag
exerciseTitle: "Daily Reflection"  # Title for exercise section

# SEO & Organization
tags:
  - foundation
  - mindset
  - introduction
description: "Day 1 introduces the core concepts of the Diamond Transformation methodology."
---

# Day 1: Building Your Foundation

Welcome to Day 1 of your transformation journey! Today, we're laying the groundwork...

## What You'll Learn Today

- The three pillars of the Diamond Mindset
- Why consistency beats intensity
- Your daily practice framework

## Video Lesson

[Note: Video is embedded automatically from frontmatter]

## Key Concepts

### 1. The Diamond Mindset

The Diamond Mindset is built on three core principles:

1. **Pressure Creates Diamonds** - Embrace challenges as growth opportunities
2. **Clarity Comes from Cutting** - Refinement requires removing what doesn't serve you
3. **Brilliance Through Polish** - Consistent daily practice creates lasting transformation

...

## Daily Reflection Exercise

Take 5 minutes to journal on these questions:

1. What brought you to this 30-day sprint?
2. What does becoming "diamond" mean to you personally?
3. What's one area of your life ready for transformation?

## Key Takeaways

- Consistency is the foundation of transformation
- Small daily actions compound into major results
- You're building a new identity, not just changing habits

## Tomorrow's Preview

Tomorrow, we'll dive into creating your personal transformation vision...

---

**Congratulations on completing Day 1!** Click "Mark Complete" below to unlock Day 2.
```

### Video Embed Format

**Supported Formats:**
```yaml
# YouTube
video: "youtube:dQw4w9WgXcQ"
video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

# Vimeo
video: "vimeo:123456789"
video: "https://vimeo.com/123456789"

# Self-hosted
video: "/uploads/sprint/day-01-video.mp4"

# Wistia (if needed)
video: "wistia:abc123xyz"
```

**Parser Logic:**
- Extract platform and ID from string
- Generate appropriate embed code
- Handle responsive sizing
- Add loading states

### Audio Embed Format

**Supported Formats:**
```yaml
# Self-hosted audio file
audio: "/uploads/sprint/day-01-meditation.mp3"

# Podcast episode URL
audio: "https://example.com/podcast/episode-1.mp3"

# Soundcloud (if needed)
audio: "soundcloud:track-id"
```

**Player Features:**
- Play/pause
- Scrubbing timeline
- Playback speed control (0.75x, 1x, 1.25x, 1.5x, 2x)
- Volume control
- Download option (optional)

### Image Handling

**Frontmatter Array:**
```yaml
images:
  - url: "/uploads/sprint/day-01-diagram.jpg"
    alt: "The Diamond Mindset Framework"
    caption: "The three pillars of transformation"
  - url: "/uploads/sprint/day-01-example.jpg"
    alt: "Real-world application"
```

**Or Simplified:**
```yaml
images:
  - "/uploads/sprint/day-01-diagram.jpg"
  - "/uploads/sprint/day-01-example.jpg"
```

**Display Options:**
- Single image: Full-width display
- Multiple images: Responsive grid (2-3 columns)
- Lightbox on click
- Lazy loading for performance

### Sprint Configuration File (Optional)

**`content/sprint/sprint-config.yml`**
```yaml
title: "30 Day Diamond Transformation Sprint"
description: "A structured 30-day journey to build lasting habits and transform your mindset."
startDate: null  # null = starts when user enrolls
duration: 30  # days

weeks:
  - number: 1
    title: "Foundation"
    theme: "Building Core Habits"
  - number: 2
    title: "Momentum"
    theme: "Deepening Your Practice"
  - number: 3
    title: "Integration"
    theme: "Making It Stick"
  - number: 4
    title: "Mastery"
    theme: "Owning Your Transformation"

badges:
  - id: "first-step"
    title: "First Step"
    description: "Completed Day 1"
    icon: "/images/badges/first-step.svg"
    requirement: "day:1"
  - id: "week-1-warrior"
    title: "Week 1 Warrior"
    description: "Completed Week 1"
    icon: "/images/badges/week-1.svg"
    requirement: "days:1-7"
  # ... more badges

settings:
  allowSkipDays: true  # Phase 1: true, Phase 3: false
  gracePeriodHours: 24  # Phase 3: Allow completing yesterday's content
  requireVideoCompletion: false  # Future: Track video watch time
  enableComments: false  # Future: Community discussion per day
  enableSharing: false  # Future: Social sharing
```

---

## UI/UX Design Requirements

### Design Principles

1. **Progressive Disclosure:** Show only what's relevant now, avoid overwhelming
2. **Clear Progress:** Always visible indicators of where user is in journey
3. **Celebration-Focused:** Make completion moments joyful and memorable
4. **Mobile-First:** Optimized for on-the-go daily engagement
5. **Consistent Theming:** Match existing member portal aesthetic

### Color System

**Existing Theme (maintain consistency):**
- Background: `#000000` (pure black)
- Primary Accent: `#4fc3f7` (diamond blue)
- Secondary: Gradients with primary
- Text: `#ffffff` (white) and `#999999` (gray-400)

**Sprint-Specific Color Additions:**
```css
/* State Colors */
--sprint-completed: #10b981;     /* Green for completed days */
--sprint-active: #4fc3f7;        /* Primary blue for current day */
--sprint-locked: #4b5563;        /* Gray for locked days */
--sprint-unlocked: #6b7280;      /* Lighter gray for unlocked but not active */

/* Streak Colors */
--streak-building: #6b7280;      /* 1-3 days */
--streak-good: #3b82f6;          /* 4-7 days */
--streak-great: #10b981;         /* 8-14 days */
--streak-legendary: #f59e0b;     /* 15+ days */

/* Badge Rarity */
--badge-common: #94a3b8;         /* Gray */
--badge-rare: #3b82f6;           /* Blue */
--badge-epic: #8b5cf6;           /* Purple */
--badge-legendary: #f59e0b;      /* Gold */
```

### Typography

**Maintain existing hierarchy:**
- Headings: Geist Sans (light weight for h1-h2, normal for h3-h6)
- Body: Geist Sans (regular weight)
- Code: Geist Mono

**Sprint-Specific Styles:**
```css
.sprint-day-title {
  font-size: 2.5rem;
  font-weight: 300;
  color: var(--primary);
  letter-spacing: -0.02em;
}

.sprint-day-subtitle {
  font-size: 1.25rem;
  font-weight: 400;
  color: #999;
}

.sprint-day-number {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--primary);
}
```

### Spacing & Layout

**Grid System:**
- Max content width: 1280px (consistent with existing pages)
- Container padding: 1.5rem mobile, 2rem desktop
- Section spacing: 3rem (mobile), 4rem (desktop)
- Card gaps: 1rem (mobile), 1.5rem (desktop)

**Responsive Breakpoints:**
```css
/* Tailwind defaults (maintain consistency) */
sm: 640px   /* Tablet portrait */
md: 768px   /* Tablet landscape */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

### Component Design Specifications

#### Sprint Overview Page

**Hero Section:**
- Full-width background with subtle gradient
- Title + Subtitle centered
- Primary CTA button (large, diamond blue)
- Visual: Animated timeline preview using `Timeline` component

**What to Expect Cards:**
- 2x2 grid (mobile: 1 column)
- Icon + Title + Description
- Hover effect: Slight scale and glow
- Use `BentoGrid` for layout

**Sprint Timeline:**
- Horizontal scrollable timeline (mobile)
- Full view (desktop)
- 30 day markers with week separators
- Highlight milestones (Week 1, 2, 3, 4, Completion)

#### Daily Content View

**Layout:**
```
Desktop:
┌────────────────────────────────────────────┐
│  Day 7 of 30 | 23% Complete  [Progress]   │
├────────────────────────────────────────────┤
│                                            │
│  Building Resilience Through Practice      │  ← Title
│  Learn to bounce back stronger             │  ← Subtitle
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │                                      │  │
│  │      [Video Player 16:9]             │  │
│  │                                      │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  [Audio Player - full width]               │
│                                            │
│  [Markdown Content - max 720px width]      │
│  Well-spaced paragraphs, clear headings    │
│  ...                                       │
│                                            │
│  ┌────────┐  ┌────────┐                   │
│  │ Image  │  │ Image  │                   │
│  │  Grid  │  │  Grid  │                   │
│  └────────┘  └────────┘                   │
│                                            │
│  ┌────────────────────────────────────┐   │
│  │  ✓ Mark Day 7 Complete             │   │
│  └────────────────────────────────────┘   │
│                                            │
│  ← Day 6        |        Day 8 🔒 →        │
│                                            │
└────────────────────────────────────────────┘

Mobile:
- Single column
- Stacked elements
- Full-width video/audio
- Sticky bottom completion button
```

**Progress Bar:**
- Fixed to top on scroll (sticky)
- Visual bar showing % complete
- Day indicator: "Day X of 30"
- Percentage text: "23%"

**Video Player:**
- Aspect ratio: 16:9 (responsive)
- Custom controls (or platform default)
- Poster image from first frame
- Loading skeleton

**Audio Player:**
- Compact horizontal layout
- Waveform visualization (optional, Phase 2)
- Current time / total time
- Standard controls

**Completion Button:**
- Full-width on mobile, max 400px on desktop
- Primary color background
- Large touch target (min 48px height)
- Loading state on click
- Disabled state when already completed

#### Dashboard View

**Progress Summary:**
- Card with subtle border and gradient background
- Circular progress ring (center)
- Stats surrounding or below ring
- Animate progress on load

**Week Sections:**
- Accordion or always-visible sections
- Week title + theme
- 7-day grid per week
- Consistent spacing

**Day Cards:**
- Square or slight rectangle (4:3)
- Day number prominent
- Icon for status (✓ checkmark, 🔒 lock, current indicator)
- Hover: Scale + border glow
- Completed: Green border/background tint
- Active: Primary blue border + glow
- Locked: Grayscale + lock icon

**Achievements Section:**
- Grid of badge cards
- Locked badges: Grayscale + outline
- Unlocked badges: Full color + glow
- Progress bars for in-progress badges

### Accessibility Requirements

**WCAG 2.1 AA Compliance:**

1. **Color Contrast:**
   - Text: Minimum 4.5:1 contrast ratio
   - Large text (18pt+): Minimum 3:1
   - Interactive elements: 3:1 against background

2. **Keyboard Navigation:**
   - All interactive elements keyboard accessible
   - Logical tab order
   - Focus indicators visible and high-contrast
   - Skip navigation links

3. **Screen Reader Support:**
   - Semantic HTML (headings, landmarks, lists)
   - ARIA labels for icons and buttons
   - Status announcements for completions
   - Alt text for all images

4. **Motion:**
   - Respect `prefers-reduced-motion`
   - Disable complex animations if user preference set
   - Provide pause/stop for auto-playing media

5. **Interactive Elements:**
   - Minimum touch target: 44x44px (mobile)
   - Clear focus states
   - Error messages associated with inputs
   - Descriptive link text

**Specific Implementations:**
```jsx
// Example: Completion Button
<button
  type="button"
  onClick={handleComplete}
  disabled={isCompleted}
  aria-label={`Mark Day ${dayNumber} as complete`}
  className="sprint-complete-btn"
>
  {isCompleted ? (
    <>
      <CheckIcon aria-hidden="true" />
      <span>Completed</span>
    </>
  ) : (
    <>
      <span>Mark Day {dayNumber} Complete</span>
    </>
  )}
</button>

// Example: Progress announcement
<div role="status" aria-live="polite" className="sr-only">
  Day {dayNumber} marked as complete. Progress: {percentage}% complete.
</div>
```

### Responsive Design Patterns

**Mobile (<640px):**
- Single column layout
- Full-width cards
- Sticky header with progress
- Bottom-fixed completion button
- Drawer navigation for day list
- Collapsible week sections

**Tablet (640px-1024px):**
- 2-column grid for dashboard
- Side-by-side day cards (2-3 per row)
- Expanded navigation
- Larger touch targets

**Desktop (1024px+):**
- 3-4 column grid
- Sidebar navigation (use existing portal sidebar)
- Hover states more pronounced
- Tooltip details on hover

### Animation & Motion Design

**Guiding Principles:**
- Purposeful, not decorative
- Enhance understanding of state changes
- Respect user motion preferences
- Subtle and professional (not distracting)

**Key Animations:**

1. **Progress Bar Fill**
   - Duration: 800ms
   - Easing: ease-out
   - Trigger: On page load or completion

2. **Day Card State Change**
   - Scale transform: 1.02x on hover
   - Duration: 200ms
   - Border glow transition: 300ms

3. **Completion Celebration**
   - Modal entrance: Slide up + fade in (400ms)
   - Confetti particles: 2-3 second animation
   - Badge reveal: Scale from 0 to 1 with bounce (600ms)

4. **Page Transitions**
   - Fade between days: 300ms
   - Smooth scroll to content: 500ms ease-in-out

5. **Unlock Animation**
   - Lock icon fades out
   - Card transitions from grayscale to color
   - Subtle pulse to draw attention

**Aceternity Components with Built-in Animations:**
- `Timeline` - Scroll-based progress line animation
- `TracingBeam` - Animated beam following scroll
- `AnimatedModal` - Enter/exit transitions
- `Meteors` - Particle celebration effects
- `TextGenerateEffect` - Text reveal animations

---

## Technical Architecture & Data Flow

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     User Browser                        │
│  ┌───────────────────────────────────────────────────┐  │
│  │  React Components (Client-Side)                   │  │
│  │  - Sprint Overview                                │  │
│  │  - Daily Content Viewer                           │  │
│  │  - Dashboard                                      │  │
│  │  - Achievement System                             │  │
│  └─────────────┬─────────────────────────────────────┘  │
│                │                                         │
│                ▼                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  State Management                                 │  │
│  │  - User Progress Context (React Context)          │  │
│  │  - Completion State                               │  │
│  │  - Badge Tracking                                 │  │
│  └─────────────┬─────────────────────────────────────┘  │
│                │                                         │
└────────────────┼─────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js Server (SSR/API Routes)            │
│  ┌───────────────────────────────────────────────────┐  │
│  │  API Routes                                       │  │
│  │  - /api/sprint/progress (GET, POST)              │  │
│  │  │  - /api/sprint/complete (POST)                   │  │
│  │  - /api/sprint/badges (GET)                      │  │
│  └─────────────┬─────────────────────────────────────┘  │
│                │                                         │
│                ▼                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Content Layer                                    │  │
│  │  - getSprintDays() - Fetch all sprint content    │  │
│  │  - getSprintDay(dayNumber) - Single day          │  │
│  │  - Markdown parsing (gray-matter + remark)       │  │
│  └─────────────┬─────────────────────────────────────┘  │
└────────────────┼─────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│                  Data Layer                             │
│  ┌───────────────────────────────────────────────────┐  │
│  │  File System (Markdown Content)                   │  │
│  │  content/sprint/day-01.md ... day-30.md           │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │  User Data Storage (Phase-Dependent)              │  │
│  │  Phase 1: localStorage (browser)                  │  │
│  │  Phase 2+: Database (Turso/LibSQL)                 │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Data Models

#### SprintDay (Content Item)

```typescript
interface SprintDay {
  day: number;                    // 1-30
  slug: string;                   // "day-01"
  frontmatter: {
    day: number;
    title: string;
    subtitle: string;
    published: boolean;

    // Media
    video?: string;               // "youtube:id" or URL
    audio?: string;               // URL
    images?: string[];            // Array of URLs

    // Metadata
    duration?: string;            // "15 minutes"
    difficulty?: string;          // "Beginner" | "Intermediate" | "Advanced"
    category?: string;
    week?: number;                // 1-4

    // Exercise
    hasExercise?: boolean;
    exerciseTitle?: string;

    // SEO
    tags?: string[];
    description?: string;
  };
  content: string;                // Rendered HTML from markdown
}
```

#### UserSprintProgress (User Data)

```typescript
interface UserSprintProgress {
  userId: string;                 // User identifier
  sprintId: string;               // "30-day-sprint" (for future multiple sprints)
  enrollmentDate: string;         // ISO 8601 timestamp

  completedDays: CompletedDay[];  // Array of completed days
  currentDay: number;             // 1-30, next day to complete

  // Stats
  totalDaysCompleted: number;     // 0-30
  completionPercentage: number;   // 0-100
  currentStreak: number;          // Consecutive days
  bestStreak: number;             // Highest streak achieved
  estimatedTimeInvested: number;  // Minutes (estimated)

  // Badges
  earnedBadges: string[];         // Array of badge IDs

  // Status
  status: "not_started" | "in_progress" | "completed" | "abandoned";
  completionDate?: string;        // ISO 8601 timestamp (when all 30 days done)

  // Metadata
  lastAccessDate: string;         // Last time user viewed sprint
  createdAt: string;
  updatedAt: string;
}

interface CompletedDay {
  day: number;
  completedAt: string;            // ISO 8601 timestamp
  timeSpent?: number;             // Minutes (optional tracking)
}
```

#### Badge Definition

```typescript
interface Badge {
  id: string;                     // Unique identifier
  title: string;
  description: string;
  icon: string;                   // URL or path to badge image
  rarity: "common" | "rare" | "epic" | "legendary";

  // Unlock requirement
  requirement: {
    type: "day" | "days_range" | "streak" | "special";
    value: number | string;       // Day number, "1-7", streak count, etc.
  };

  // Optional
  category?: "milestone" | "streak" | "special";
}
```

### API Endpoints

#### Phase 1: Client-Side Only (localStorage)

**No API routes needed initially.** All data stored in browser localStorage.

**LocalStorage Keys:**
- `sprint_progress_{userId}` - User progress data
- `sprint_completed_days_{userId}` - Array of completed day objects
- `sprint_badges_{userId}` - Array of earned badge IDs

**Data Flow:**
1. User marks day complete → Update localStorage
2. Calculate new stats (streak, percentage)
3. Check for badge unlocks
4. Update UI via React state

#### Phase 2: API Integration (Database-backed)

**Endpoints:**

1. **GET `/api/sprint/progress`**
   - **Description:** Get user's sprint progress
   - **Auth:** Required
   - **Response:**
     ```json
     {
       "success": true,
       "data": {
         "userId": "user123",
         "sprintId": "30-day-sprint",
         "enrollmentDate": "2025-10-03T10:00:00Z",
         "completedDays": [
           { "day": 1, "completedAt": "2025-10-03T14:30:00Z" },
           { "day": 2, "completedAt": "2025-10-04T09:15:00Z" }
         ],
         "currentDay": 3,
         "totalDaysCompleted": 2,
         "completionPercentage": 6.67,
         "currentStreak": 2,
         "bestStreak": 2,
         "earnedBadges": ["first-step"],
         "status": "in_progress"
       }
     }
     ```

2. **POST `/api/sprint/enroll`**
   - **Description:** Enroll user in sprint
   - **Auth:** Required
   - **Body:** `{ "sprintId": "30-day-sprint" }`
   - **Response:**
     ```json
     {
       "success": true,
       "message": "Enrolled in 30 Day Sprint",
       "data": { /* UserSprintProgress object */ }
     }
     ```

3. **POST `/api/sprint/complete`**
   - **Description:** Mark a day as complete
   - **Auth:** Required
   - **Body:**
     ```json
     {
       "sprintId": "30-day-sprint",
       "day": 3
     }
     ```
   - **Response:**
     ```json
     {
       "success": true,
       "message": "Day 3 marked complete!",
       "data": {
         "completedDay": { "day": 3, "completedAt": "2025-10-05T..." },
         "newBadges": ["streak-3"],  // If badges earned
         "updatedProgress": { /* Full progress object */ }
       }
     }
     ```

4. **GET `/api/sprint/badges`**
   - **Description:** Get all available badges and user's earned status
   - **Auth:** Required
   - **Response:**
     ```json
     {
       "success": true,
       "data": [
         {
           "id": "first-step",
           "title": "First Step",
           "earned": true,
           "earnedAt": "2025-10-03T14:30:00Z"
         },
         {
           "id": "week-1-warrior",
           "title": "Week 1 Warrior",
           "earned": false,
           "progress": "3/7 days"
         }
       ]
     }
     ```

5. **GET `/api/sprint/stats`** (Phase 3 - Optional)
   - **Description:** Get community-wide stats
   - **Response:**
     ```json
     {
       "totalParticipants": 1250,
       "averageCompletionRate": 68.5,
       "mostCompletedDay": 1,
       "averageStreak": 5.2
     }
     ```

### Content Fetching Functions

**Location:** `src/lib/content.ts` (extend existing)

```typescript
/**
 * Get all sprint days
 * @returns Array of SprintDay objects (all 30 days)
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

  // Filter published and sort by day number
  return days
    .filter(day => day.frontmatter.published !== false)
    .sort((a, b) => a.day - b.day);
}

/**
 * Get single sprint day by day number
 * @param dayNumber - Day number (1-30)
 * @returns SprintDay object or null if not found
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
 * Get sprint configuration
 * @returns Sprint config object
 */
export async function getSprintConfig(): Promise<SprintConfig | null> {
  const configPath = path.join(contentDirectory, 'sprint', 'sprint-config.yml');

  if (!fs.existsSync(configPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(configPath, 'utf8');
  const config = yaml.load(fileContents) as SprintConfig;

  return config;
}
```

### State Management (React Context)

**Location:** `src/contexts/SprintContext.tsx`

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface SprintContextValue {
  progress: UserSprintProgress | null;
  isLoading: boolean;
  isEnrolled: boolean;

  // Actions
  enrollInSprint: () => Promise<void>;
  completeDay: (day: number) => Promise<void>;

  // Computed values
  isDayUnlocked: (day: number) => boolean;
  isDayCompleted: (day: number) => boolean;
  getNextUncompletedDay: () => number | null;

  // Badge system
  earnedBadges: Badge[];
  checkForNewBadges: () => Badge[];
}

const SprintContext = createContext<SprintContextValue | undefined>(undefined);

export const SprintProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useSession();
  const [progress, setProgress] = useState<UserSprintProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load progress from localStorage (Phase 1) or API (Phase 2+)
  useEffect(() => {
    if (!session?.user) return;

    // Phase 1: localStorage
    const storageKey = `sprint_progress_${session.user.id}`;
    const savedProgress = localStorage.getItem(storageKey);

    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }

    setIsLoading(false);
  }, [session]);

  const enrollInSprint = async () => {
    // Create new progress object
    const newProgress: UserSprintProgress = {
      userId: session?.user.id || '',
      sprintId: '30-day-sprint',
      enrollmentDate: new Date().toISOString(),
      completedDays: [],
      currentDay: 1,
      totalDaysCompleted: 0,
      completionPercentage: 0,
      currentStreak: 0,
      bestStreak: 0,
      estimatedTimeInvested: 0,
      earnedBadges: [],
      status: 'in_progress',
      lastAccessDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProgress(newProgress);

    // Save to localStorage
    const storageKey = `sprint_progress_${session?.user.id}`;
    localStorage.setItem(storageKey, JSON.stringify(newProgress));

    // Phase 2: POST to /api/sprint/enroll
  };

  const completeDay = async (day: number) => {
    if (!progress) return;

    // Check if already completed
    if (progress.completedDays.some(d => d.day === day)) {
      return;
    }

    const completedDay: CompletedDay = {
      day,
      completedAt: new Date().toISOString(),
    };

    const updatedProgress = {
      ...progress,
      completedDays: [...progress.completedDays, completedDay].sort((a, b) => a.day - b.day),
      totalDaysCompleted: progress.totalDaysCompleted + 1,
      completionPercentage: ((progress.totalDaysCompleted + 1) / 30) * 100,
      currentDay: day + 1,
      updatedAt: new Date().toISOString(),
    };

    // Calculate streak
    updatedProgress.currentStreak = calculateStreak(updatedProgress.completedDays);
    updatedProgress.bestStreak = Math.max(updatedProgress.currentStreak, progress.bestStreak);

    setProgress(updatedProgress);

    // Save to localStorage
    const storageKey = `sprint_progress_${session?.user.id}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedProgress));

    // Check for new badges
    const newBadges = checkForNewBadges();
    if (newBadges.length > 0) {
      updatedProgress.earnedBadges = [
        ...progress.earnedBadges,
        ...newBadges.map(b => b.id)
      ];
      setProgress(updatedProgress);
      localStorage.setItem(storageKey, JSON.stringify(updatedProgress));
    }

    // Phase 2: POST to /api/sprint/complete
  };

  const isDayUnlocked = (day: number): boolean => {
    if (!progress || day < 1 || day > 30) return false;

    // Phase 1: All days up to currentDay are unlocked
    return day <= progress.currentDay;
  };

  const isDayCompleted = (day: number): boolean => {
    if (!progress) return false;
    return progress.completedDays.some(d => d.day === day);
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

  const calculateStreak = (completedDays: CompletedDay[]): number => {
    if (completedDays.length === 0) return 0;

    // Sort by day
    const sorted = [...completedDays].sort((a, b) => a.day - b.day);

    let streak = 1;
    for (let i = sorted.length - 1; i > 0; i--) {
      if (sorted[i].day - sorted[i - 1].day === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const checkForNewBadges = (): Badge[] => {
    // Badge checking logic
    // Compare current progress against badge requirements
    // Return newly earned badges
    return [];
  };

  const value: SprintContextValue = {
    progress,
    isLoading,
    isEnrolled: progress !== null && progress.status !== 'not_started',
    enrollInSprint,
    completeDay,
    isDayUnlocked,
    isDayCompleted,
    getNextUncompletedDay,
    earnedBadges: [],  // Populated from badge definitions + user's earnedBadges array
    checkForNewBadges,
  };

  return (
    <SprintContext.Provider value={value}>
      {children}
    </SprintContext.Provider>
  );
};

export const useSprint = () => {
  const context = useContext(SprintContext);
  if (!context) {
    throw new Error('useSprint must be used within SprintProvider');
  }
  return context;
};
```

### Routing Structure

```
/app/sprint                          → Sprint Overview (landing)
/app/sprint/dashboard                → All 30 days view with progress
/app/sprint/day/[dayNumber]          → Individual day content (1-30)
/app/sprint/achievements             → Badge collection page
```

**File Structure:**
```
src/app/app/sprint/
├── page.tsx                         # Overview/landing
├── dashboard/
│   └── page.tsx                     # All days view
├── day/
│   └── [dayNumber]/
│       └── page.tsx                 # Dynamic day content
└── achievements/
    └── page.tsx                     # Badge collection
```

---

## Success Metrics & KPIs

### Primary Success Metrics

1. **Enrollment Rate**
   - **Definition:** % of active members who enroll in the sprint
   - **Target:** 40% enrollment rate within first 3 months
   - **Measurement:** Total enrollments / Total active members
   - **Data Source:** User enrollment tracking

2. **Completion Rate**
   - **Definition:** % of enrolled users who complete all 30 days
   - **Target:** 70% completion rate
   - **Measurement:** Users who complete Day 30 / Total enrolled users
   - **Benchmark:** Industry standard for 30-day challenges: 20-40%
   - **Data Source:** User progress tracking

3. **Daily Engagement Rate**
   - **Definition:** % of enrolled users who access content on any given day
   - **Target:** 85% daily engagement for active participants
   - **Measurement:** Daily active users / Currently enrolled users (not yet completed)
   - **Data Source:** Access logs, day view tracking

4. **Average Days to Completion**
   - **Definition:** Mean number of calendar days to complete 30 days of content
   - **Target:** 35 days (allowing for 5 days of missed days)
   - **Measurement:** (Completion date - Enrollment date) for completed users
   - **Data Source:** Enrollment and completion timestamps

### Secondary Success Metrics

5. **Average Streak Length**
   - **Definition:** Mean consecutive days completed without interruption
   - **Target:** 8+ day average streak
   - **Measurement:** Average of all users' best streaks
   - **Data Source:** Streak calculation from completion history

6. **Badge Collection Rate**
   - **Definition:** % of available badges earned on average
   - **Target:** 50% badge collection rate
   - **Measurement:** (Total badges earned by all users) / (Total possible badges × Total users)
   - **Data Source:** Badge tracking system

7. **Content Consumption Time**
   - **Definition:** Average time spent per day on content
   - **Target:** 15-20 minutes per day
   - **Measurement:** Session duration tracking (Phase 2+)
   - **Data Source:** Analytics (time on page)

8. **Dropout Rate by Day**
   - **Definition:** % of users who stop progressing at each day
   - **Target:** <5% dropout per day after Day 7
   - **Measurement:** Users who don't complete day X but completed day X-1 / Users who completed day X-1
   - **Critical Days:** Day 1 (highest), Days 7, 15, 21 (milestones)
   - **Data Source:** Completion tracking

### Engagement Quality Metrics

9. **Return to Content Rate**
   - **Definition:** % of users who revisit previously completed days
   - **Target:** 30% of users revisit at least one day
   - **Measurement:** Users who access completed days / Total users
   - **Data Source:** Page view tracking

10. **Social Sharing Rate** (Phase 2+)
    - **Definition:** % of users who share achievements
    - **Target:** 15% sharing rate
    - **Measurement:** Share events / Badge unlock events
    - **Data Source:** Share button click tracking

11. **User Satisfaction Score**
    - **Definition:** Post-sprint survey rating
    - **Target:** 80%+ users rate 4/5 or 5/5 stars
    - **Measurement:** Survey responses (1-5 scale)
    - **Data Source:** Post-completion survey

12. **Restart Rate** (Long-term)
    - **Definition:** % of completed users who restart the sprint
    - **Target:** 20% restart within 90 days of completion
    - **Measurement:** Users who enroll again after completion / Total completed users
    - **Data Source:** Enrollment tracking

### Technical Performance Metrics

13. **Page Load Time**
    - **Target:** <2 seconds for daily content pages
    - **Measurement:** Time to First Contentful Paint (FCP)
    - **Data Source:** Vercel Analytics or Lighthouse

14. **Mobile Performance Score**
    - **Target:** 90+ Lighthouse score on mobile
    - **Measurement:** Lighthouse audit
    - **Data Source:** Lighthouse CI

15. **Error Rate**
    - **Target:** <0.5% error rate
    - **Measurement:** Failed requests / Total requests
    - **Data Source:** Error logging (Sentry)

### Dashboard for Tracking (Phase 3)

**Admin View Metrics:**
- Current active participants
- Completion funnel visualization (Day 1 → Day 30)
- Most common dropout points
- Engagement heatmap (which days have highest engagement)
- Badge distribution chart
- Average time per day content
- User feedback aggregation

**Individual User Dashboard:**
- Personal completion percentage
- Days completed vs. expected (if on pace)
- Streak visualization
- Badge collection progress
- Comparison to community average (optional, opt-in)

---

## Future Enhancements (Post-MVP)

### Phase 3: Advanced Features

1. **Date-Locked Progression**
   - Days unlock based on calendar dates, not just completion
   - Prevent "binge consumption" of multiple days
   - Grace period: Can complete yesterday's content within 24 hours
   - "Freeze" power: Skip one day without breaking streak (1 per sprint)
   - Configurable: Admin can toggle strict vs. flexible mode

2. **Advanced Gamification**
   - Leaderboard (opt-in, privacy-conscious)
   - Bonus badges for creative achievements
   - Streak recovery challenges
   - Completion certificates (downloadable/printable)
   - Personalized avatar/profile enhancements based on progress

3. **Social Features**
   - Cohort system: Users who started on same day
   - Accountability partners: Pair users for mutual encouragement
   - Discussion threads per day (community comments)
   - Share achievements to social media (Twitter, LinkedIn, etc.)
   - Celebration posts when completing milestones

4. **Personalization**
   - Recommended start date based on user's calendar
   - Preferred content time (morning, afternoon, evening reminders)
   - Content format preferences (video, audio, text priority)
   - Adjustable difficulty level (beginner, intermediate, advanced variations)

5. **Content Versioning**
   - Multiple sprint themes (e.g., "Mindset Sprint", "Productivity Sprint", "Health Sprint")
   - Seasonal sprints (New Year, Summer, etc.)
   - User can repeat sprint with new content variations
   - A/B testing different content approaches

6. **Email Notifications**
   - Daily reminder emails (opt-in)
   - Encouragement emails on milestones
   - Re-engagement emails if user hasn't accessed in 2+ days
   - Weekly progress summary emails
   - Completion celebration email

7. **Mobile App Integration**
   - Push notifications for daily reminders
   - Offline content access (download days in advance)
   - Native video/audio players
   - Widget for quick progress check

8. **Analytics & Insights**
   - Personal insights: "You're most productive in the morning"
   - Content effectiveness: Which days have highest engagement
   - Predictive analytics: Likelihood to complete based on early patterns
   - Recommendations: "Users who liked this sprint also liked..."

9. **Coach/Admin Features**
   - Monitor cohort progress
   - Send custom messages to struggling users
   - Adjust content on-the-fly
   - Create custom sprints for specific groups
   - Export user progress data

10. **Integration with Other Features**
    - Unlock exclusive courses upon sprint completion
    - Sprint completion counts toward Pressure Room progression
    - Integrate with DiamondMindAI for personalized coaching during sprint
    - Calendar integration (Google Calendar, Apple Calendar)

### Potential Sprint Variations

1. **7-Day Mini Sprint**
   - Shorter commitment for new users
   - Quick wins to build confidence
   - Gateway to 30-day sprint

2. **60-Day Deep Dive**
   - Extended version for advanced users
   - More in-depth daily content
   - Higher difficulty level

3. **Weekend Warrior Sprint**
   - Content releases only on weekends (Sat/Sun)
   - 15-week program for busy professionals
   - Longer, more intensive sessions

4. **Custom Duration Sprints**
   - Admin can create sprints of any length (14-day, 21-day, 90-day, etc.)
   - Dynamic content loading based on sprint config
   - Reusable architecture

### Content Ideas for Future Sprints

- **Morning Routine Sprint:** 30 days of morning habit building
- **Evening Reflection Sprint:** 30 days of evening journaling
- **Gratitude Sprint:** 30 days of gratitude practices
- **Productivity Sprint:** 30 days of productivity techniques
- **Meditation Sprint:** 30 days of guided meditation
- **Creativity Sprint:** 30 days of creative exercises
- **Fitness Sprint:** 30 days of movement practices (partner with fitness content)
- **Reading Sprint:** 30 days of curated reading + reflection

---

## Risks & Mitigation Strategies

### Technical Risks

**Risk 1: Performance Issues with Video Embeds**
- **Impact:** High (affects UX significantly)
- **Likelihood:** Medium
- **Mitigation:**
  - Lazy load video players (load on scroll or user interaction)
  - Use poster images to reduce initial load
  - Implement CDN for self-hosted videos
  - Consider video thumbnails with click-to-play
  - Test on slow 3G connections

**Risk 2: localStorage Data Loss**
- **Impact:** High (user loses all progress)
- **Likelihood:** Low (but catastrophic when it happens)
- **Mitigation:**
  - Phase 1: Warn users about localStorage limitations
  - Implement export/import functionality (download progress as JSON)
  - Move to database-backed storage in Phase 2 (high priority)
  - Consider background sync when online
  - Clear communication about data storage

**Risk 3: Markdown Parsing Errors**
- **Impact:** Medium (content fails to display)
- **Likelihood:** Low (with proper testing)
- **Mitigation:**
  - Comprehensive testing of markdown parser
  - Error boundaries in React components
  - Fallback to raw markdown if HTML parsing fails
  - Validation script to check all markdown files before deployment
  - Clear error messages for content editors

**Risk 4: Browser Compatibility**
- **Impact:** Medium (some users can't access feature)
- **Likelihood:** Low (modern browsers widely adopted)
- **Mitigation:**
  - Test on major browsers (Chrome, Firefox, Safari, Edge)
  - Polyfills for older browsers if needed
  - Graceful degradation for unsupported features
  - Clear browser requirements communicated to users

### Product Risks

**Risk 5: Low Enrollment Rate**
- **Impact:** High (feature underutilized)
- **Likelihood:** Medium
- **Mitigation:**
  - Clear value proposition on landing page
  - Social proof (testimonials from beta users)
  - Email campaign announcing feature to existing members
  - In-app promotions and banners
  - Onboarding tutorial explaining benefits
  - Incentives for early adopters (special badge, etc.)

**Risk 6: High Dropout Rate**
- **Impact:** High (users don't complete, feature seen as failure)
- **Likelihood:** Medium-High (30-day commitments are hard)
- **Mitigation:**
  - Re-engagement tactics (emails, push notifications)
  - Identify dropout patterns and intervene proactively
  - Make early days engaging and easy (build confidence)
  - Milestone celebrations to maintain motivation
  - Community support and accountability
  - Allow pausing/resuming sprint (Phase 2)

**Risk 7: Content Quality Issues**
- **Impact:** High (poor content leads to poor experience)
- **Likelihood:** Low-Medium (depends on content creation process)
- **Mitigation:**
  - Rigorous content review process
  - Beta testing with select users before full launch
  - Continuous content improvement based on feedback
  - User feedback mechanism on each day
  - A/B test different content approaches
  - Editorial calendar and quality standards

**Risk 8: User Confusion with UI/Navigation**
- **Impact:** Medium (friction in user experience)
- **Likelihood:** Medium
- **Mitigation:**
  - User testing before launch
  - Clear onboarding flow
  - Tooltips and help text
  - Intuitive navigation patterns
  - Consistent with existing member portal UI
  - Feedback collection on UX

### Business Risks

**Risk 9: Cannibalization of Existing Courses**
- **Impact:** Medium (users do sprint instead of courses)
- **Likelihood:** Low (different use cases)
- **Mitigation:**
  - Position sprint as complementary to courses
  - Sprint can unlock courses or vice versa
  - Different value propositions (structured daily vs. self-paced)
  - Track engagement metrics for both features
  - Bundle sprint + course for complete experience

**Risk 10: Scalability Concerns**
- **Impact:** Low-Medium (if user base grows significantly)
- **Likelihood:** Low (phased approach mitigates this)
- **Mitigation:**
  - Phase 1: localStorage (scales to browser limit)
  - Phase 2: Database with proper indexing
  - Phase 3: Caching strategies, CDN for media
  - Monitor performance metrics continuously
  - Cloud infrastructure that auto-scales

**Risk 11: Content Staleness**
- **Impact:** Medium (content becomes outdated over time)
- **Likelihood:** Medium-High (over 12+ months)
- **Mitigation:**
  - Quarterly content reviews
  - User feedback loop
  - Version control for content
  - Easy content update process via CMS
  - Evergreen content principles
  - Plan for content refresh cycles

### User Engagement Risks

**Risk 12: Feature Goes Unnoticed**
- **Impact:** High (no adoption despite development effort)
- **Likelihood:** Medium (depends on marketing/positioning)
- **Mitigation:**
  - Launch campaign (email, in-app, social media)
  - Homepage/dashboard promotion
  - Beta program with influential members
  - Clear navigation in member portal
  - Onboarding includes sprint introduction

**Risk 13: Lack of Social Proof**
- **Impact:** Medium (users hesitant to start without seeing others succeed)
- **Likelihood:** Medium (especially at launch)
- **Mitigation:**
  - Seed with beta testers who complete and provide testimonials
  - Display aggregate stats (X users enrolled, Y completed)
  - Success stories and case studies
  - Community highlights
  - Start with small cohort, build momentum

---

## Dependencies & Prerequisites

### Technical Dependencies

**Existing Infrastructure:**
- ✅ Next.js 15 with App Router
- ✅ React 19
- ✅ NextAuth.js (for user authentication)
- ✅ Tailwind CSS 4
- ✅ Aceternity UI components
- ✅ Content management system (gray-matter, remark)
- ✅ Framer Motion (for animations)

**New Dependencies (to add):**

**Phase 1:**
- None (use existing stack)

**Phase 2:**
- Database client (@libsql/client) - already installed
- Database (Turso - serverless LibSQL/SQLite) - already configured
- API validation library (Zod)
- Email service (Resend) - for notifications
- nanoid - for ID generation (already installed)

**Phase 3:**
- Push notification service (if mobile)
- Analytics enhancement (Mixpanel or Amplitude)
- Social sharing SDK
- Certificate generation library (PDF)

### Content Prerequisites

**Required Before Launch:**
- 30 markdown files (day-01.md through day-30.md) with complete content
- Sprint configuration file (sprint-config.yml)
- Badge icon images (SVG or PNG)
- Video content recorded/sourced and uploaded
- Audio content recorded/sourced and uploaded
- Supporting images created/sourced
- Content reviewed and approved

**Content Creation Workflow:**
1. Content outline and strategy (Week 1-4 themes)
2. Daily content writing (title, subtitle, body)
3. Video production (optional but recommended)
4. Audio production (optional)
5. Image creation/curation
6. Content review and editing
7. Markdown file creation with frontmatter
8. CMS upload and testing
9. Final QA pass

### Design Prerequisites

**UI Design Assets:**
- Badge designs (12+ unique badges)
- Icon set for day states (completed, locked, active)
- Loading states and skeleton screens
- Celebration/confetti animations
- Progress ring/bar designs
- Certificate template (for completion)

**UX Artifacts:**
- User flow diagrams
- Wireframes for all pages
- Prototype for user testing
- Accessibility audit checklist

### Operational Prerequisites

**Team Requirements:**
- Content creator (for 30 days of content)
- Designer (UI components, badges, graphics)
- Frontend developer (React/Next.js implementation)
- Backend developer (API routes, database - Phase 2+)
- QA tester (cross-browser, cross-device testing)
- Product manager (feature oversight)

**Timeline:**
- Content creation: 4-6 weeks
- Design: 2-3 weeks
- Phase 1 development: 3-4 weeks
- Testing & QA: 2 weeks
- Beta testing: 2 weeks
- Launch: 1 week
- **Total: 14-18 weeks** (3.5-4.5 months)

---

## Implementation Phases Summary

### Phase 1: MVP (Core Functionality)
**Timeline:** 3-4 weeks development
**Focus:** Basic feature with manual completion and localStorage

**Deliverables:**
- Sprint overview page
- 30 daily content pages (markdown-based)
- Manual "Mark Complete" system
- Simple progress tracker (X/30, percentage)
- Basic day unlocking (sequential)
- Client-side state (localStorage)
- Minimal gamification (completion counter only)

**Success Criteria:**
- All 30 days of content accessible
- Users can enroll and complete days
- Progress persists in browser
- Mobile responsive

### Phase 2: Enhanced Features
**Timeline:** 4-6 weeks development
**Focus:** Gamification, database integration, polish

**Deliverables:**
- Full badge system (12+ badges)
- Streak tracking with visual indicators
- Database-backed progress (API routes)
- Enhanced UI with animations
- Celebration modals on milestones
- Achievement showcase page
- Email notifications (basic)
- Export/import progress

**Success Criteria:**
- All badges functional
- Progress syncs across devices
- Smooth animations and interactions
- Users receive milestone celebrations

### Phase 3: Advanced Features
**Timeline:** 6-8 weeks development
**Focus:** Date-locking, social features, analytics

**Deliverables:**
- Date-locked progression option
- Cohort system
- Social sharing
- Advanced analytics dashboard
- Leaderboard (opt-in)
- Downloadable certificates
- Advanced email automation
- Admin panel for monitoring

**Success Criteria:**
- Date-locking prevents binge completion
- Community features drive engagement
- Analytics provide actionable insights
- Admin can manage sprints effectively

---

## Conclusion

The 30 Day Sprint feature represents a strategic expansion of the Becoming Diamond member portal, addressing the need for structured, habit-forming experiences that complement the existing self-paced courses. By combining progressive content unlocking, gamification, and celebration of milestones, this feature is designed to achieve exceptional completion rates while building lasting engagement.

**Key Success Factors:**
1. **Quality Content:** Compelling daily content that delivers value
2. **Frictionless UX:** Intuitive navigation and clear progress indicators
3. **Motivation Loop:** Badges, streaks, and celebrations maintain engagement
4. **Phased Rollout:** MVP first, iterate based on user feedback
5. **Clear Metrics:** Track and optimize for completion and satisfaction

**Next Steps:**
1. Review and approve this PRD
2. Review phased PRD documents (Phase 1, 2, 3)
3. Approve content strategy and begin content creation
4. Initiate design phase (UI mockups, badge designs)
5. Begin Phase 1 development
6. Plan beta testing program

**Questions for Stakeholders:**
- Is the 70% completion rate target realistic and aligned with business goals?
- Should we prioritize video content or is text-based content acceptable for MVP?
- What is the budget/timeline for content creation?
- Are there any compliance or legal requirements for user data storage?
- Should we build Phase 1 with localStorage or jump straight to database?
- What analytics platform should we integrate for tracking metrics?

---

**Document Prepared By:** Claude Code (AI Product Strategist)
**For:** Becoming Diamond Product Team
**Review Status:** Awaiting stakeholder review
**Version History:**
- v1.0 (2025-10-03): Initial comprehensive PRD
