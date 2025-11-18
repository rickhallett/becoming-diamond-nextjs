# Documentation Implementation Plan - Pragmatic Approach

**Date**: 2025-11-14
**Budget**: 6-8 hours maximum
**Approach**: Simple, effective, no scope creep

## Decision: Next.js + Simple MDX on Subdomain

**What we're NOT building:**
- ❌ Interactive demo components (scope creep)
- ❌ Custom search (use browser CMD+F)
- ❌ Fancy animations
- ❌ Contentlayer (unnecessary complexity)

**What we ARE building:**
- ✅ Clean, branded documentation site
- ✅ Screenshots and screen recordings
- ✅ Links to actual app routes
- ✅ NextAuth protection (support@ only)
- ✅ Simple navigation
- ✅ Professional presentation

## Architecture (Simple)

```
app/docs-site/
├── layout.tsx          (sidebar + basic styling)
├── page.tsx            (docs home/index)
├── user/
│   ├── getting-started/page.tsx
│   ├── sprint-program/page.tsx
│   └── profile/page.tsx
├── admin/
│   ├── cms-overview/page.tsx
│   ├── content-workflow/page.tsx
│   └── rollback/page.tsx
└── technical/          (collapsed by default)
    ├── architecture/page.tsx
    ├── reports/page.tsx
    └── specs/page.tsx
```

Each page is just a **simple TSX file** with Tailwind styling. No MDX complexity needed initially.

## Time Breakdown (Realistic)

### Hour 1-2: Basic Structure
```typescript
// app/docs-site/layout.tsx (45 min)
export default function DocsLayout({ children }) {
  return (
    <div className="flex h-screen bg-black">
      {/* Simple sidebar - just links */}
      <aside className="w-64 border-r border-neutral-800 p-6">
        <DocsNav />
      </aside>

      {/* Content area */}
      <main className="flex-1 overflow-auto p-12">
        {children}
      </main>
    </div>
  );
}

// components/docs/docs-nav.tsx (45 min)
// Just a list of links, collapsible sections
```

### Hour 3-4: NextAuth Protection + Subdomain
```typescript
// middleware.ts (1 hour)
export default auth((req) => {
  if (req.nextUrl.pathname.startsWith('/docs-site')) {
    if (req.auth?.user?.email !== 'support@becomingdiamond.com') {
      return NextResponse.redirect('/');
    }
  }
});

// Vercel subdomain config (1 hour)
// docs.becomingdiamond.com → /docs-site
```

### Hour 5-6: Core Content Pages
Write 3-4 key pages with screenshots:

```typescript
// app/docs-site/admin/cms-overview/page.tsx
export default function CMSOverviewPage() {
  return (
    <DocsPage
      title="CMS Overview"
      description="Managing content with Decap CMS"
    >
      <h2>Accessing the CMS</h2>
      <p>Navigate to <a href="/admin">/admin</a> on the live site.</p>

      {/* Screenshot */}
      <img src="/docs/screenshots/cms-login.png" alt="CMS Login" />

      <h2>Sprint Content Management</h2>
      <p>The Sprint collection manages all 30 days...</p>

      {/* Video walkthrough */}
      <video controls src="/docs/videos/cms-walkthrough.mp4" />

      {/* Link to actual feature */}
      <a href="/admin" target="_blank">Try it yourself →</a>
    </DocsPage>
  );
}
```

### Hour 7-8: Polish + Screenshots
- Take 10-15 key screenshots
- Record 2-3 short screen recordings
- Add subtle upsell hints

**Total: 6-8 hours**

## Content Structure (Focused)

### Primary Docs (Front and Center)

**User Guide** (Website Owner Perspective)
```
├── Getting Started
│   └── Logging in, navigating the dashboard
├── Sprint Program
│   └── Viewing content, tracking progress, certificates
├── Profile Management
│   └── Updating profile, changing settings
└── Content Browsing
    └── Blog, news, book pages
```

**Admin Guide** (CMS Management)
```
├── CMS Overview
│   └── Accessing /admin, authentication
├── Managing Sprint Content
│   └── Editing days, adding videos, publishing
├── Blog & News Posts
│   └── Creating articles, adding images
├── Content Workflow
│   └── Edit → Preview → Publish flow
└── Rollback Procedures
    └── When to revert, how to contact support
```

### Secondary Docs (Collapsed, Background)

**Technical Documentation**
```
├── Architecture (link to existing CLAUDE.md)
├── Weekly Reports (link to docs/reports/)
├── Technical Specs (link to docs/specs/)
└── Deployment Guide (for future devs)
```

## Subtle Upsell Strategy

### "Future Enhancements" Callouts

Use this pattern throughout docs:

```typescript
<FutureEnhancement>
  <h4>💎 Potential Enhancement</h4>
  <p>
    Currently, sprint progress is tracked locally.
    <strong>Future enhancement:</strong> Sync progress across devices
    with cloud backup for seamless experience.
  </p>
</FutureEnhancement>
```

**Example placements:**

**User Guide → Sprint Program:**
> "💎 **Potential Enhancement**: AI-powered daily insights based on your progress and engagement patterns."

**Admin Guide → CMS Overview:**
> "💎 **Potential Enhancement**: Scheduled publishing and content calendar for planning ahead."

**Admin Guide → Content Workflow:**
> "💎 **Potential Enhancement**: Multi-user approval workflow for team content review."

These are:
- Subtle (not salesy)
- Contextual (where feature makes sense)
- Professional (positioned as evolution, not missing features)
- Valuable (real improvements, not fluff)

## Component Reuse (No New Components Needed)

Just use what you already have:

```typescript
// Simple, existing UI
import { Button } from '@/components/ui/button';

export function DocsPage({ title, description, children }) {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-neutral-400 mb-8">{description}</p>

      <div className="prose prose-invert max-w-none">
        {children}
      </div>
    </div>
  );
}
```

That's it. No custom components needed.

## What "Live" Actually Means (No Scope Creep)

Instead of building interactive demos, use:

**1. Links to Actual Features**
```tsx
<p>
  To try this yourself, <a href="/app/sprint/day/1" target="_blank">
    open Day 1 of the Sprint →
  </a>
</p>
```

**2. Screenshots with Annotations**
```tsx
<img
  src="/docs/screenshots/sprint-day-annotated.png"
  alt="Sprint day interface showing video player, progress tracker, and navigation"
/>
```

**3. Short Video Walkthroughs (Screen Recordings)**
```tsx
<video
  controls
  src="/docs/videos/cms-create-sprint-day.mp4"
  className="rounded-lg border border-neutral-800"
/>
<p className="text-sm text-neutral-500">
  2-minute walkthrough of creating a new sprint day
</p>
```

**4. Code Snippets They Can Copy**
```tsx
<pre className="bg-neutral-900 p-4 rounded">
  git revert HEAD --no-edit{'\n'}
  git push origin main
</pre>
<p>Copy-paste this to rollback the last CMS change.</p>
```

## Scope Boundaries (Firm)

### In Scope (6-8 hours)
- ✅ Basic Next.js routes for docs
- ✅ Simple sidebar navigation
- ✅ NextAuth middleware
- ✅ 8-10 core documentation pages
- ✅ Screenshots and videos (using existing tools)
- ✅ Links to existing app features
- ✅ Basic Tailwind styling (consistent with site)

### Out of Scope (Would be scope creep)
- ❌ Interactive component demos
- ❌ Custom search functionality
- ❌ Contentlayer or complex MDX setup
- ❌ Auto-generated navigation from frontmatter
- ❌ Code playground / sandboxes
- ❌ Advanced animations
- ❌ Multi-language support
- ❌ Version history UI

## MVP Content Plan (Can Expand Later)

### Week 1: Essential Pages Only (4-6 hours)
1. Docs home (index)
2. User Guide: Getting Started
3. Admin Guide: CMS Overview
4. Admin Guide: Sprint Management

### Week 2+: Expand as Needed (2 hours each)
5. User Guide: Sprint Program deep-dive
6. Admin Guide: Blog/News management
7. Technical: Architecture overview
8. Technical: Rollback procedures

This lets you deliver **usable docs immediately** and expand over time.

## Taking Screenshots Efficiently

### Tools
- **macOS**: Cmd+Shift+4 → Select area
- **Annotation**: Preview.app (built-in) or Skitch
- **Screen Recording**: QuickTime (built-in) or Loom

### Screenshot Workflow (20 min per feature)
1. Clear browser cache, fresh state
2. Take 3-5 screenshots of key screens
3. Add arrows/highlights in Preview
4. Export to `/public/docs/screenshots/`
5. Reference in docs

### Video Workflow (10 min per video)
1. QuickTime → New Screen Recording
2. 1-2 minute walkthrough (no audio needed if UI is clear)
3. Export to `/public/docs/videos/`
4. Embed in docs

## File Structure (Simple)

```
app/docs-site/
├── layout.tsx                    # Sidebar + main layout
├── page.tsx                      # Docs homepage
├── user/
│   ├── getting-started/page.tsx
│   └── sprint-program/page.tsx
└── admin/
    ├── cms-overview/page.tsx
    └── content-management/page.tsx

components/docs/
├── docs-nav.tsx                  # Sidebar navigation
├── docs-page.tsx                 # Page wrapper
└── future-enhancement.tsx        # Upsell callout

public/docs/
├── screenshots/                  # PNG screenshots
└── videos/                       # MP4 screen recordings
```

**That's it.** No complex folder hierarchies, no build scripts.

## Implementation Checklist

- [ ] Create `app/docs-site/` directory
- [ ] Build simple sidebar component (1 hour)
- [ ] Add NextAuth middleware for `/docs-site/*` (30 min)
- [ ] Create 4 core pages (2 hours)
- [ ] Take 10-15 screenshots (1 hour)
- [ ] Record 2-3 videos (30 min)
- [ ] Add subtle enhancement callouts (30 min)
- [ ] Configure subdomain in Vercel (30 min)
- [ ] Test authentication (30 min)

**Total: 6-8 hours**

## Handover Value Without Scope Creep

The client gets:

✅ **Professional presentation** - Branded, clean, easy to navigate
✅ **Complete walkthrough** - Everything they need to know
✅ **Visual guides** - Screenshots and videos, not walls of text
✅ **Self-service support** - Answer their own questions
✅ **Technical visibility** - Can see proof of work if interested
✅ **Future opportunities** - Subtle enhancement hints
✅ **Secure access** - Only they can access

All delivered in **6-8 focused hours**, not 50.

## Next Steps

1. Approve this pragmatic approach
2. I'll create the basic structure (2 hours)
3. You write content and take screenshots as you go
4. Launch when 4-5 core pages are done

This keeps scope tight, timeline predictable, and quality high.
