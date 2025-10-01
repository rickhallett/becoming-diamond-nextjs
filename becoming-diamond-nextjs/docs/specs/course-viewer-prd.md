# PRD: Course Viewer for Members Area

**Product:** Becoming Diamond - Course Viewer
**Version:** 1.0
**Status:** In Development
**Last Updated:** 2025-10-01
**Owner:** Development Team

---

## Executive Summary

Create a secure, interactive course viewer for the Becoming Diamond members area that transforms the "Turning Snowflakes into Diamonds" course content into an engaging, slide-by-slide learning experience with video/audio support, progress tracking, and note-taking capabilities.

---

## Problem Statement

**Current State:**
- Course catalog exists but shows only mock data
- No actual course content is accessible to members
- "Turning Snowflakes into Diamonds" course exists as markdown but is not presented
- Members cannot track progress through course material
- No way to take notes or engage with course content

**Desired State:**
- Members can access and navigate through complete course content
- Course is presented slide-by-slide with clear chapter organization
- Progress is tracked and persisted across sessions
- Members can take notes on each slide
- Video and audio content is securely embedded (non-downloadable)
- Seamless mobile and desktop experience

---

## Goals & Success Metrics

### Primary Goals
1. Enable members to consume course content in structured, digestible slides
2. Provide secure media playback without download capabilities
3. Track and persist learning progress
4. Support note-taking for active learning

### Success Metrics
- **Engagement:** 70%+ of enrolled members complete at least one chapter
- **Retention:** Average session time >15 minutes
- **Completion:** 40%+ of enrolled members complete full course within 8 weeks
- **Notes Usage:** 50%+ of active users create at least one note
- **Performance:** Time to first slide <2 seconds
- **Mobile:** 40%+ of sessions on mobile devices

### Non-Goals (Phase 1)
- Multi-device sync (future backend feature)
- Social features (comments, discussions)
- Certificates or gamification
- Downloadable course materials
- Live/scheduled content

---

## User Stories

### Core User Stories

**US-1: Navigate Course Content**
> As a member, I want to navigate through course slides one at a time, so that I can focus on each concept without distraction.

**Acceptance Criteria:**
- Course displays one slide at a time
- Next/Previous buttons work correctly
- Keyboard shortcuts (arrow keys) work
- Current slide position is clearly indicated
- Can jump to any slide via chapter navigation

**US-2: Track Learning Progress**
> As a member, I want my progress to be automatically saved, so that I can resume where I left off.

**Acceptance Criteria:**
- Progress bar shows current position in course
- Viewed slides are marked with checkpoints
- "Continue Learning" button appears on course catalog
- Progress persists after closing browser
- Progress percentage updates in real-time

**US-3: Take Notes**
> As a member, I want to take notes on each slide, so that I can capture insights and review them later.

**Acceptance Criteria:**
- Notes panel accessible from each slide
- Notes auto-save without requiring manual action
- Notes persist across sessions
- Can see which slides have notes
- Can export all notes as markdown/text

**US-4: Watch/Listen to Media**
> As a member, I want to watch videos and listen to audio embedded in the course, so that I can learn through multiple modalities.

**Acceptance Criteria:**
- Videos play inline without leaving the page
- Audio has playback controls (play/pause, seek, speed)
- Cannot download media files directly
- Media playback tracks progress
- Works on mobile and desktop

**US-5: Organize Learning by Chapters**
> As a member, I want to see the course organized by chapters, so that I can understand the structure and navigate efficiently.

**Acceptance Criteria:**
- Chapter navigation shows all chapters with titles
- Can see current chapter highlighted
- Can jump to any chapter
- Chapter completion is visually indicated
- Chapter structure matches course material

---

## Technical Specification

### Architecture Overview

```
┌─────────────────────────────────────────────────┐
│         Course Markdown File                    │
│  (turning-snowflakes-into-diamonds.md)          │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│         Course Parser                           │
│  - Parse frontmatter (metadata)                 │
│  - Split by ## (chapters)                       │
│  - Split by ### (slides)                        │
│  - Convert markdown to HTML                     │
│  - Extract media references                     │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│         ParsedCourse Object                     │
│  {                                              │
│    chapters: [{                                 │
│      slides: [{ content, media, ... }]          │
│    }]                                           │
│  }                                              │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│         Course Viewer UI                        │
│  - ChapterNav (sidebar)                         │
│  - SlideContent (main area)                     │
│  - MediaPlayer (video/audio)                    │
│  - SlideNotes (collapsible panel)               │
│  - CourseProgress (header bar)                  │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│         State Persistence                       │
│  - CourseContext (progress tracking)            │
│  - LocalStorage (notes, last viewed)            │
└─────────────────────────────────────────────────┘
```

### Data Models

#### ParsedCourse
```typescript
interface ParsedCourse {
  id: string;
  title: string;
  metadata: {
    gateway: number;
    duration: string;
    difficulty: string;
    instructor: string;
    thumbnail: string;
    published: boolean;
  };
  chapters: CourseChapter[];
  totalSlides: number;
}
```

#### CourseChapter
```typescript
interface CourseChapter {
  id: string;
  title: string;
  order: number;
  part: number; // Part 1-4 from book
  slides: CourseSlide[];
}
```

#### CourseSlide
```typescript
interface CourseSlide {
  id: string;
  chapterId: string;
  title: string;
  content: string; // HTML
  order: number;
  mediaUrl?: string;
  mediaType?: 'video' | 'audio';
  estimatedMinutes?: number;
}
```

#### SlideNote
```typescript
interface SlideNote {
  id: string;
  courseId: string;
  slideId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
```

### Content Parsing Strategy

**Chapter Detection:**
- Parse `## ` (h2) headers as chapters
- Group chapters into Parts based on content structure
- Estimated: ~100+ chapters from course material

**Slide Detection:**
- Parse `### ` (h3) headers as individual slides
- Each slide = one concept/section
- Estimated: ~180+ slides total

**Media Detection:**
- Identify placeholder syntax: `[VIDEO: video-id]` or `[AUDIO: audio-id]`
- Map to actual streaming URLs via media config
- Support standard markdown image/video syntax as fallback

**Content Processing:**
- Use gray-matter for frontmatter extraction
- Use remark + remark-html for markdown → HTML conversion
- Apply Tailwind typography classes to rendered HTML
- Generate unique IDs using slug + order number

### Media Hosting & Security

**Video Hosting: Vimeo**
- Privacy settings: "Hide from Vimeo", "Disable download"
- Domain whitelist: only allow embedding on app domain
- Responsive embed with 16:9 aspect ratio
- No Vimeo branding (requires Plus plan)

**Audio Hosting: AWS S3 + CloudFront**
- Pre-signed URLs with 2-hour expiration
- Referrer checking to prevent hotlinking
- Custom HTML5 audio player with controls
- Download attribute disabled

**Security Measures:**
- No direct download links exposed
- Streaming-only playback
- Domain restrictions on embeds
- Time-limited access URLs (for sensitive content)
- Member authentication required (enforced by /app/* routes)

**DRM Level:**
- Focus: "Make it hard" not "Make it impossible"
- Prevents casual downloading
- Does not prevent determined screen recording (acceptable tradeoff)

### Progress Tracking

**Storage:**
- LocalStorage key: `diamond_progress_{courseId}`
- Structure:
```json
{
  "viewedSlides": ["slide-1", "slide-3", "slide-5"],
  "lastViewedSlide": "slide-5",
  "totalTimeSpent": 3600,
  "completedChapters": ["chapter-1"],
  "progressPercentage": 45
}
```

**Update Logic:**
- Mark slide as viewed after 3 seconds on screen
- Update progress percentage: (viewedSlides / totalSlides) * 100
- Save last viewed slide on every navigation
- Track time spent per session (optional analytics)

**Integration:**
- Update CourseContext.enrollments array
- Sync with course catalog for "Continue" button
- Display progress in header bar and chapter nav

### Notes System

**Storage:**
- LocalStorage key per slide: `diamond_notes_{courseId}_{slideId}`
- Individual keys prevent quota issues
- Each note limited to 10KB

**Features:**
- Auto-save with 2-second debounce
- Character count indicator (max 5000 characters)
- Markdown support (basic: bold, italic, lists)
- Visual indicator on slides with notes
- Export all notes as single markdown file

**Quota Management:**
- Monitor localStorage usage
- Warn at 80% capacity
- Provide "Clear old notes" option
- Export before clearing

### UI Components

**Layout (Desktop):**
```
┌───────────────────────────────────────────────────────┐
│ [Course Title]              [Progress: ████░░] 65%    │
├────────────────┬──────────────────────────────────────┤
│ CHAPTERS       │  Slide Title                         │
│                │                                       │
│ Part 1         │  [Slide content with typography]     │
│ ✓ Chapter 1    │                                       │
│ ✓ Chapter 2    │  [Media player if present]           │
│ ▶ Chapter 3    │                                       │
│   • Slide 3.1  │                                       │
│   • Slide 3.2  │  [Notes panel - collapsible]         │
│   • Slide 3.3  │                                       │
│                │                                       │
│ Part 2         │                                       │
│   Chapter 4    │  [←  Previous]  [Notes]  [Next  →]  │
│   Chapter 5    │                                       │
└────────────────┴──────────────────────────────────────┘
```

**Layout (Mobile):**
```
┌────────────────────────────┐
│ [☰]  Title  [Progress 65%] │
├────────────────────────────┤
│                            │
│  Slide Content             │
│                            │
│  [Media player]            │
│                            │
│  [Tap to view notes]       │
│                            │
├────────────────────────────┤
│  [←  Prev] [Notes] [Next→] │
└────────────────────────────┘
```

**Component Breakdown:**

1. **CourseProgress** (Header)
   - Course title (links to catalog)
   - Progress bar with percentage
   - Current slide indicator (e.g., "Slide 15 of 180")

2. **ChapterNav** (Sidebar/Drawer)
   - Collapsible chapter groups by Part
   - Checkmarks on completed slides
   - Current slide highlighted
   - Click to jump to any slide

3. **SlideContent** (Main)
   - Slide title (h2)
   - Rendered HTML content with typography
   - Responsive width (max-w-4xl)
   - Prose styling matching blog

4. **MediaPlayer**
   - Vimeo iframe for video
   - Custom audio controls for audio
   - Playback speed selector
   - Full-width on mobile, embedded in content on desktop

5. **SlideNotes** (Panel)
   - Textarea with auto-save indicator
   - Character count
   - Markdown preview (future)
   - Export button (exports all course notes)

6. **NavigationBar** (Footer)
   - Previous button (disabled on first slide)
   - Notes toggle button (badge if note exists)
   - Next button (disabled on last slide)
   - Keyboard hints (subtle, e.g., "← →")

### Accessibility

**Requirements:**
- ARIA labels on all interactive elements
- Keyboard navigation support (Tab, Arrow keys, Enter, Esc)
- Focus management (auto-focus on slide content after navigation)
- Screen reader announcements for progress updates
- High contrast mode support
- Minimum touch target size: 44x44px (mobile)

**Keyboard Shortcuts:**
- `→` / `Space`: Next slide
- `←`: Previous slide
- `n`: Toggle notes
- `?`: Show shortcuts overlay
- `Esc`: Close modals/overlays
- `Cmd+K`: Slide jump modal (future)

### Performance

**Optimization Strategies:**
- Lazy load slides (preload current + next 2)
- Code splitting: course viewer separate from main app bundle
- Memoize parsed course data
- Debounce scroll/resize handlers
- Optimize images with Next.js Image component
- Cache parsed markdown in memory (per session)

**Performance Targets:**
- Time to First Slide (TTFS): <2 seconds
- Navigation latency: <200ms
- Mobile LCP: <2.5 seconds
- Bundle size: <50KB (course viewer chunk)

### Error Handling

**Scenarios:**
1. **Parse Error:** Markdown fails to parse
   - Show error boundary with "Try again" button
   - Log error for debugging
   - Fallback: display raw markdown

2. **Media Load Error:** Video/audio fails
   - Show placeholder with error message
   - Retry button
   - Continue link to skip slide

3. **Storage Quota Exceeded:**
   - Show warning modal
   - Offer export notes option
   - Suggest clearing old notes

4. **Course Not Found:**
   - 404 page with link back to catalog
   - Suggest enrolling in course

---

## Implementation Phases

### Phase 1: Foundation (2-3 days)
**Goal:** Set up content architecture and parser

**Tasks:**
- Create course parser (`/src/lib/course-parser.ts`)
- Define TypeScript interfaces (`/src/types/course.ts`)
- Move course markdown to `/content/courses/`
- Add frontmatter to course file
- Extend content API (`/src/lib/content.ts`)
- Write parser tests

**Deliverables:**
- Parsed course data structure
- getCourseContent() function
- parseCourseMarkdown() function

**Acceptance Criteria:**
- Parser successfully converts markdown to structured course
- All chapters and slides have unique IDs
- Media placeholders are detected
- Frontmatter is extracted correctly

---

### Phase 2: Basic Viewer UI (3-4 days)
**Goal:** Build functional course viewer with navigation

**Tasks:**
- Create course viewer route (`/app/courses/[courseId]/page.tsx`)
- Build CourseViewer component
- Implement ChapterNav sidebar
- Implement SlideContent display
- Implement CourseProgress header
- Add navigation buttons (prev/next)
- Add keyboard shortcuts
- Style with Aceternity components

**Deliverables:**
- Working course viewer at `/app/courses/{courseId}`
- Chapter navigation
- Slide-by-slide navigation
- Progress indicator

**Acceptance Criteria:**
- Can navigate through all slides
- Current position is clear
- Responsive on mobile and desktop
- Matches Diamond aesthetic
- No console errors

---

### Phase 3: Progress Tracking (1-2 days)
**Goal:** Integrate with existing progress system

**Tasks:**
- Update CourseContext with slide tracking
- Implement markSlideViewed() function
- Update progress bar calculations
- Add "Continue Learning" to catalog
- Persist last viewed slide
- Add chapter completion indicators

**Deliverables:**
- Progress tracking integration
- Updated course catalog
- Persistent progress state

**Acceptance Criteria:**
- Progress saves across sessions
- Catalog shows accurate progress
- "Continue" button links to correct slide
- Viewed slides have visual indicators

---

### Phase 4: Notes Feature (2 days)
**Goal:** Enable note-taking on slides

**Tasks:**
- Create NotesManager utility (`/src/lib/notes.ts`)
- Build SlideNotes component
- Implement auto-save with debounce
- Add note indicators to chapter nav
- Implement export functionality
- Add quota monitoring

**Deliverables:**
- Notes panel on each slide
- Auto-save functionality
- Export notes feature

**Acceptance Criteria:**
- Notes persist across sessions
- Auto-save works without lag
- Can export all notes as markdown
- Visual indicators for slides with notes
- No localStorage quota issues

---

### Phase 5: Media Integration (2-3 days)
**Goal:** Embed video and audio securely

**Tasks:**
- Set up Vimeo account and configure privacy
- Create MediaPlayer component
- Implement media URL mapping
- Update parser to detect media
- Add playback controls
- Configure DRM settings
- Test on all devices

**Deliverables:**
- Video playback via Vimeo
- Audio playback with custom player
- Secure, non-downloadable media

**Acceptance Criteria:**
- Videos play without download option
- Audio has speed controls
- Works on mobile and desktop
- Domain restrictions active
- No direct download URLs exposed

---

### Phase 6: Polish & Optimization (2-3 days)
**Goal:** Enhance UX and prepare for production

**Tasks:**
- Add keyboard shortcuts overlay
- Implement accessibility features
- Optimize performance (lazy loading, code splitting)
- Add swipe gestures for mobile
- Polish animations and transitions
- Add error boundaries
- Test across browsers

**Deliverables:**
- Keyboard shortcuts help
- Accessibility audit pass
- Performance optimizations
- Cross-browser compatibility

**Acceptance Criteria:**
- WCAG 2.1 AA compliant
- Performance targets met
- Works in Chrome, Safari, Firefox, Edge
- Smooth animations on 60fps

---

## Technical Requirements

### Browser Support
- Chrome 90+ (desktop, mobile)
- Safari 14+ (desktop, iOS)
- Firefox 88+ (desktop)
- Edge 90+ (desktop)

### Device Support
- Desktop: 1280px+ (primary experience)
- Tablet: 768px - 1279px
- Mobile: 375px - 767px

### Dependencies
- Next.js 15.5.3
- React 19
- Tailwind CSS 4
- @tailwindcss/typography
- gray-matter (frontmatter parsing)
- remark + remark-html (markdown processing)
- Framer Motion (animations, via Aceternity)

### New Dependencies (to add)
- None required (all functionality achievable with existing stack)

---

## Security & Privacy

### Data Security
- All course content behind authentication (/app/* routes)
- No public course content URLs
- Media embeds domain-restricted
- Notes stored client-side only (no PII collected)

### Content Protection
- Streaming-only video (Vimeo DRM)
- Time-limited audio URLs (S3 signed URLs)
- No download buttons or links
- Referrer checking on media requests

### User Privacy
- No tracking cookies
- No third-party analytics on course content
- Notes remain local to user's device
- Progress data not shared

---

## Future Enhancements (Post-Phase 1)

### Backend Integration
- Sync progress across devices (Supabase/Firebase)
- Backend API for notes storage
- Real-time progress updates
- Course completion certificates

### Social Features
- Discussion forums per slide
- Highlight and share quotes
- Study groups / cohorts
- Instructor Q&A

### Advanced Features
- Downloadable workbooks (PDF)
- Interactive exercises and quizzes
- Spaced repetition reminders
- Personalized learning paths
- Offline mode (PWA)

### Analytics
- Slide engagement tracking
- Drop-off analysis
- Time-on-slide metrics
- Completion funnel

---

## Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Markdown parsing fails on edge cases | High | Medium | Extensive testing with full course content, fallback rendering |
| LocalStorage quota exceeded | Medium | Medium | Quota monitoring, export prompts, per-slide storage |
| Media hosting costs high | High | Low | Start with Vimeo free tier, evaluate before scaling, placeholder content initially |
| Mobile performance issues | Medium | Medium | Lazy loading, code splitting, performance testing on real devices |
| Vimeo embed blocked by ad blockers | Low | Low | Fallback message, test with common ad blockers |
| Course content doesn't fit slide structure | Medium | Low | Flexible parser, manual chapter/slide markers if needed |

---

## Success Criteria

### Phase 1 Success
- ✅ Course markdown parsed into structured data
- ✅ All chapters and slides accessible
- ✅ Content API integrated

### Phase 2 Success
- ✅ Full course navigation functional
- ✅ Responsive design on mobile/desktop
- ✅ Clean, distraction-free UI

### Phase 3 Success
- ✅ Progress persists across sessions
- ✅ Course catalog integration complete
- ✅ Accurate progress tracking

### Phase 4 Success
- ✅ Notes save automatically
- ✅ Notes exportable
- ✅ No quota issues

### Phase 5 Success
- ✅ Video playback secure
- ✅ Audio playback functional
- ✅ No download options available

### Phase 6 Success
- ✅ Accessibility audit passes
- ✅ Performance targets met
- ✅ Production-ready quality

### Overall Success
- 📊 70% of enrolled members complete Chapter 1 within 1 week
- 📊 Average session time >15 minutes
- 📊 40% of active users take notes
- 📊 <5% bounce rate from course viewer
- 📊 >4.5/5 user satisfaction score

---

## Appendix

### Glossary
- **Slide:** Single screen of course content (one concept)
- **Chapter:** Group of related slides (5-15 slides typically)
- **Part:** Major section of course (multiple chapters)
- **Gateway:** Course level (1-5, increasing depth)
- **Checkpoint:** Progress indicator showing completed sections

### References
- Course Content: `/docs/content/turning-snowflakes-into-diamonds.md`
- Existing Course Context: `/src/contexts/CourseContext.tsx`
- Content API: `/src/lib/content.ts`
- Aceternity Components: `/src/components/ui/*`

### Changelog
- 2025-10-01: Initial PRD created from feature-increment-planner analysis
