# Becoming Diamond - Features Overview

**Last Updated:** October 1, 2025
**Version:** 1.0

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Public Website Features](#public-website-features)
3. [Member Portal Features](#member-portal-features)
4. [Content Management System](#content-management-system)
5. [AI & RAG Integration](#ai--rag-integration)
6. [Data & Infrastructure](#data--infrastructure)
7. [Future Roadmap](#future-roadmap)

---

## Executive Summary

Becoming Diamond is a modern web application built with Next.js 15 that combines a high-converting marketing website with a feature-rich member portal. The platform enables identity transformation coaching through interactive courses, AI-powered chat, and premium content delivery.

**Core Value Propositions:**

- Transform pressure into power through structured learning
- AI-powered coaching available 24/7
- Track progress through courses and transformations
- Access exclusive content and community resources

---

## Public Website Features

### Landing Page (`/`)

**Purpose:** Convert visitors into leads and members

**Implemented Components:**

- **Hero Section** with spotlight effect and gradient text

  - Compelling headline: "Turn Pressure Into Power"
  - Subheadline explaining the transformation
  - Primary CTA: "Get the Free Diamond Sprint Guide"
  - Secondary CTA: "Join the Community"

- **Problem/Pain Points Grid** (Bento Grid)

  - Visual showcase of transformation journey
  - Animated cards with hover effects
  - Pain points: Overwhelm, Uncertainty, Burnout, Self-Doubt

- **Program Timeline**

  - 3-phase transformation roadmap visualization
  - Interactive timeline with animations
  - Gateway 1, Gateway 2, Gateway 3 progression

- **Testimonials Carousel**

  - Animated testimonials slider
  - Social proof from transformed members
  - Real photos and success stories

- **3D Globe Visualization**

  - Interactive world map showing global reach
  - Animated connection arcs between locations
  - WebGL-powered graphics

- **Lead Capture Form**
  - Email collection for free guide download
  - Integration ready for Turso database (see PRD)
  - Privacy-compliant with consent tracking

**Technical Highlights:**

- Aceternity UI components for premium feel
- Framer Motion animations throughout
- Fully responsive mobile-first design
- SEO optimized with meta tags
- Performance optimized with lazy loading

---

### Blog System (`/blog`)

**Purpose:** Content marketing and SEO

**Features:**

- Blog post listing with thumbnails and excerpts
- Individual blog post pages (`/blog/[slug]`)
- Markdown-based content from Git repository
- Author attribution and categorization
- Publication dates and tags
- Static site generation for performance

**Sample Posts:**

- "Mastering Pressure: From Snowflake to Diamond"
- "The AI Anxiety Epidemic"
- "Burnout and Identity Crisis"

**Content API:**

```typescript
const posts = await getContentByType("blog");
const post = await getContentBySlug("blog", slug);
```

---

### News Section (`/news`)

**Purpose:** Updates and announcements

**Features:**

- News article listing
- Individual article pages (`/news/[slug]`)
- Date-stamped updates
- Featured image support
- Tag-based organization

---

### Navigation & Layout

**Public Header:**

- Logo and brand identity
- Desktop navigation menu
- Mobile responsive drawer
- Smooth scroll animations
- Active route highlighting

**Footer:**

- Social media links
- Copyright and legal info
- Newsletter signup (planned)

---

## Member Portal Features

### Protected Area (`/app/*`)

**Access Control:**

- Authentication wall (GitHub OAuth ready)
- Session management
- Protected routes
- Logout functionality

---

### Dashboard (`/app`)

**Purpose:** Member home base and progress overview

**Features:**

- Welcome message with user name
- Course enrollment status
- Progress statistics
  - Courses in progress
  - Completed modules
  - Total learning time
- Quick actions
  - Continue learning
  - Start new course
  - Access chat
- Upcoming sessions (planned)

**Layout:**

- Fixed sidebar navigation (desktop)
- Mobile drawer navigation
- Active route indicators
- User profile section

---

### Course Viewer (`/app/courses/[courseId]`)

**Purpose:** Interactive course consumption experience

**Status:** ✅ Fully Implemented (Phase 3 Complete)

**Core Features:**

1. **Slide Navigation**

   - One slide at a time for focused learning
   - Next/Previous buttons
   - Keyboard shortcuts (Arrow keys, Space)
   - Smooth scrolling transitions
   - Progress indicator

2. **Chapter Sidebar**

   - Hierarchical chapter/slide organization
   - Grouped by course parts (Part 1, Part 2, etc.)
   - Expandable/collapsible chapters
   - Visual completion indicators
   - Click to jump to any slide

3. **Progress Tracking** (Phase 3)

   - localStorage-based persistence
   - Per-slide completion tracking
   - Chapter completion percentages
   - Overall course progress calculation
   - Resume from last position
   - Green checkmarks for completed items
   - Completion celebration on course finish

4. **Mark Complete Button**

   - Manual slide completion
   - Updates progress in real-time
   - Visual feedback on completion

5. **Content Display**

   - Markdown rendered to HTML
   - Typography optimization with Tailwind Prose
   - Proper paragraph spacing and formatting
   - Syntax highlighting for code blocks
   - Responsive font sizing

6. **Notes Feature** (Implemented, not yet activated)
   - Toggle notes panel
   - Per-slide note taking
   - Auto-save functionality
   - Keyboard shortcut (N key)

**Course Structure:**

```
Gateway 1: Turning Snowflakes into Diamonds
├── Part 1: The Snowflake Crisis (3 chapters, 23 slides)
├── Part 2: The Diamond Transformation Roadmap (3 chapters, 22 slides)
└── Part 3: Building Your Diamond Practice (4 chapters, 32 slides)
```

**Technical Implementation:**

- `CourseViewer.tsx` - Main container component
- `ChapterNav.tsx` - Sidebar navigation
- `SlideContent.tsx` - Content renderer
- `CourseProgress.tsx` - Header with progress
- `course-parser.ts` - Markdown to structured data
- `progress.ts` - Progress management functions

**Mobile Experience:**

- Responsive layout
- Touch-friendly navigation
- Mobile drawer for chapter navigation
- Optimized typography for smaller screens

---

### Course Catalog (`/app/courses`)

**Purpose:** Browse and enroll in courses

**Features:**

- Course cards with thumbnails
- Enrollment status badges
  - "Not Started" → "Start Course"
  - "In Progress" → Links to course viewer
  - "Completed" → View again
- Progress percentage display
- Course metadata (duration, instructor, gateway)
- Filtering by gateway level (planned)

**Available Courses:**

- Gateway 1: Turning Snowflakes into Diamonds
- Gateway 2: Advanced Diamond Techniques (planned)
- Gateway 3: Mastery & Leadership (planned)

---

### DiamondMindAI Chat (`/app/chat`)

**Purpose:** 24/7 AI coaching powered by Claude

**Status:** ✅ Fully Implemented with RAG

**Features:**

1. **Conversational Interface**

   - Chat bubble UI with message history
   - User/assistant message distinction
   - Real-time response generation
   - Markdown formatting in responses

2. **RAG System** (Retrieval-Augmented Generation)

   - Entire "Turning Snowflakes into Diamonds" book loaded
   - Claude Sonnet 4.5 with 200K context window
   - Prompt caching for 90% cost reduction
   - Automatic citations from book chapters

3. **Suggested Prompts**

   - Quick-start conversation topics
   - Pre-built questions about the book
   - One-click prompt insertion

4. **Cost Efficiency**
   - First query: ~$0.014
   - Cached queries: ~$0.0027
   - Monthly estimate (100 queries/day): ~$15

**Sample Questions:**

- "What is the Diamond Transformation Roadmap?"
- "How do I stabilize under pressure?"
- "Explain the difference between snowflakes and diamonds"

**Technical Stack:**

- `/api/ask` endpoint for Claude integration
- `claude-simple.ts` RAG implementation
- Streaming responses (backend ready)
- Error handling and retry logic

---

### Profile Page (`/app/profile`)

**Purpose:** User account management

**Features:**

- Profile information display
- Edit profile form (planned)
- Progress history
- Achievements and milestones (planned)
- Avatar upload (planned)

---

### Settings Page (`/app/settings`)

**Purpose:** Account preferences

**Features:**

- Email preferences
- Notification settings
- Privacy controls
- Theme selection (planned)
- Data export (GDPR compliance, planned)

---

### Support Page (`/app/support`)

**Purpose:** Help resources

**Features:**

- FAQ section
- Contact form
- Help articles
- Video tutorials (planned)
- Community links

---

## Content Management System

### Decap CMS Integration

**Access:** `/admin`

**Purpose:** Git-based content management without code

**Features:**

1. **Visual Editor**

   - WYSIWYG markdown editing
   - Live preview
   - Rich text toolbar
   - Image uploads to `/public/uploads/`

2. **Content Collections**

   - **News Updates** - Date-stamped announcements
   - **Blog Posts** - Long-form articles with authors
   - **Pages** - Static pages (About, Contact)
   - **Site Settings** - Global configuration

3. **Media Library**

   - Upload images and files
   - Organize in folders
   - Insert into content
   - Automatic optimization (planned)

4. **Workflow**

   - Draft/Published status
   - Git commits on save
   - Editorial workflow (planned)
   - Preview before publish

5. **GitHub Integration**
   - OAuth authentication
   - Direct commits to repository
   - Pull request workflow (optional)
   - Version history via Git

**Setup:**

```yaml
# /public/admin/config.yml
backend:
  name: github
  repo: your-username/becoming-diamond-nextjs
  branch: main
```

**Environment Variables:**

```env
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

---

### Content API

**Server-Side Functions:**

```typescript
import { getContentByType, getContentBySlug } from "@/lib/content";

// Get all published news articles
const news = await getContentByType("news");

// Get specific article by slug
const article = await getContentBySlug("news", "welcome-2024");

// Access frontmatter and content
article.frontmatter.title;
article.frontmatter.date;
article.content; // HTML string
```

**Features:**

- Automatic markdown to HTML conversion
- Frontmatter parsing with gray-matter
- Published/draft filtering
- Date sorting
- Slug generation

---

## AI & RAG Integration

### Claude-Powered RAG System

**Purpose:** Answer questions about book content

**Architecture:**

- Simple approach leveraging Claude's 200K context
- Entire book loaded into system prompt
- Prompt caching for cost efficiency
- No vector database required

**Implementation:**

**Backend (`/src/lib/rag/claude-simple.ts`):**

```typescript
export async function askBook(question: string): Promise<AskBookResult>;
export async function askBookStreaming(question: string);
```

**API Route (`/src/app/api/ask/route.ts`):**

```typescript
POST /api/ask
Body: { question: string }
Response: { answer: string, usage: {...} }
```

**Frontend Integration:**

- Chat interface at `/app/chat`
- Suggested prompts
- Message history
- Markdown rendering

**Book Content:**

- Located at `docs/content/turning-snowflakes-into-diamonds.md`
- 2,078 lines, ~40K tokens
- Loaded at module initialization
- Cached in memory

**Cost Analysis:**

- Cache creation: $0.012 first query
- Cache read: $0.0012 subsequent queries
- 5-minute cache TTL
- ~$15/month for 100 queries/day

**System Prompt:**

```
You are an expert on the book "Turning Snowflakes into Diamonds" by Michael Dugan.
Answer questions based ONLY on the book content provided.
Always cite specific chapter sections or headings.
Focus on identity transformation, nervous system regulation, and high-performance.
```

---

## Data & Infrastructure

### Database (Turso SQLite)

**Status:** 🔨 Planned (PRD Complete)

**Purpose:** Lead capture and user data persistence

**Planned Features:**

1. **Lead Capture**

   - Email collection from landing page
   - UTM parameter tracking
   - Referrer source tracking
   - Duplicate prevention
   - GDPR consent tracking

2. **User Data** (Future)
   - Profile information
   - Course progress (sync across devices)
   - Notes and annotations
   - Preferences and settings

**Schema (Planned):**

```sql
CREATE TABLE leads (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  source TEXT,
  utm_campaign TEXT,
  utm_medium TEXT,
  utm_source TEXT,
  referrer TEXT,
  consent BOOLEAN DEFAULT true
);
```

**Integration:**

```typescript
import { turso } from "@/lib/turso";

// Insert lead
await turso.execute({
  sql: "INSERT INTO leads (email, source) VALUES (?, ?)",
  args: [email, "landing_page"],
});
```

**Environment Variables:**

```env
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token
```

---

### Authentication

**Current Status:** Infrastructure Ready

**OAuth Implementation:**

- GitHub OAuth for CMS access
- `/api/auth` endpoint
- `/api/callback` handler
- Token exchange flow

**Planned Member Auth:**

- Email/password login
- Magic link authentication
- Social OAuth (Google, GitHub)
- Session management
- Role-based access control

---

### Deployment & Hosting

**Platform:** Vercel (Production)

**Features:**

- Automatic deployments from Git
- Preview deployments for PRs
- Environment variable management
- Edge functions for API routes
- Analytics and monitoring

**Build Configuration:**

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start"
  }
}
```

**Production Optimizations:**

- Static page generation (SSG)
- Server-side rendering (SSR) for dynamic content
- Image optimization
- Code splitting
- Turbopack for fast builds

---

## Technology Stack Summary

### Frontend

- **Next.js 15.5.3** - React framework with App Router
- **React 19.1** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility-first styling
- **Aceternity UI** - 89 premium animated components
- **Framer Motion** - Animation library
- **React Three Fiber** - 3D graphics

### Backend & Data

- **Next.js API Routes** - Serverless functions
- **Turso SQLite** - Database (planned)
- **Decap CMS** - Git-based CMS
- **Gray-matter** - Frontmatter parsing
- **Remark** - Markdown processing

### AI & ML

- **Anthropic Claude Sonnet 4.5** - Language model
- **Prompt Caching** - Cost optimization
- **RAG System** - Book-based Q&A

### DevOps & Tools

- **Vercel** - Hosting and deployment
- **GitHub** - Version control
- **ESLint** - Code linting
- **Turbopack** - Fast bundler

---

## Future Roadmap (phase 8 onwards is for illustration purposes.)

### Phase 4: Member Authentication

- Email/password login system
- Session management
- Protected route middleware
- User profile database
- Password reset flow

### Phase 5: Advanced Course Features

- Video/audio embedding
  - Secure non-downloadable playback
  - Custom video player
  - Playback speed controls
- Rich note-taking
  - Markdown editor
  - Export to PDF/Markdown
  - Search within notes
- Discussion forums
  - Per-slide comments
  - Community Q&A
  - Upvoting/downvoting

### Phase 6: Progress Sync

- Move from localStorage to database
- Multi-device synchronization
- Progress analytics dashboard
- Learning time tracking
- Streak tracking and gamification

### Phase 7: Lead Nurture Automation

- Turso database integration (PRD complete)
- Email automation triggers
- Drip campaign sequences
- Lead scoring
- CRM integration (HubSpot/Mailchimp)

### Phase 8: Community Features

- Member directory
- Group cohorts
- Live Q&A sessions
- Peer accountability partnerships
- Private messaging

### Phase 9: Advanced Analytics

- Course completion funnels
- Engagement heatmaps
- Drop-off analysis
- A/B testing infrastructure
- Conversion tracking

### Phase 10: Mobile App

- React Native application
- Offline course access
- Push notifications
- Mobile-optimized UI
- App Store deployment

---

## Documentation References

- **Architecture Details:** [CLAUDE.md](/CLAUDE.md)
- **CMS Setup:** [README_CMS.md](/README_CMS.md)
- **RAG System:** [README_RAG.md](/README_RAG.md)
- **Main README:** [README.md](/README.md)

**PRDs (Product Requirements Documents):**

- Course Viewer: [docs/specs/course-viewer-prd.md](/docs/specs/course-viewer-prd.md)
- Lead Capture: [docs/specs/lead-capture-turso-prd.md](/docs/specs/lead-capture-turso-prd.md)
- RAG System: [docs/specs/diamond-rag.md](/docs/specs/diamond-rag.md)

---

## Quick Start Guide

### For Developers

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Add ANTHROPIC_API_KEY and GitHub OAuth credentials

# Start development server
npm run dev

# Visit http://localhost:3003
```

### For Content Editors

1. Navigate to `/admin`
2. Log in with GitHub
3. Create/edit content using visual editor
4. Publish to deploy changes

### For Members

1. Visit landing page at `/`
2. Sign up for account (planned)
3. Access member portal at `/app`
4. Browse courses at `/app/courses`
5. Ask questions at `/app/chat`

---

**Last Updated:** October 1, 2025
**Version:** 1.0
**Status:** Production Ready (Core Features)
