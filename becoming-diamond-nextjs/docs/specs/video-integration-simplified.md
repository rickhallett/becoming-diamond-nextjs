# Simplified Video Integration - Bunny Dashboard Approach
## Scope Reduction Analysis

**Date**: 2025-10-05
**Approach**: Use Bunny's native admin panel instead of building custom UI
**Estimated Time Savings**: 80% (from 1 week to 1-2 days)

---

## Table of Contents

1. [Scope Comparison](#scope-comparison)
2. [Simplified Architecture](#simplified-architecture)
3. [Implementation Plan](#implementation-plan)
4. [Markdown Parser Integration](#markdown-parser-integration)
5. [Decap CMS Configuration](#decap-cms-configuration)
6. [Code Implementation](#code-implementation)
7. [User Workflow](#user-workflow)
8. [Cost-Benefit Analysis](#cost-benefit-analysis)

---

## Scope Comparison

### Original Plan (Full Admin UI)
**Estimated Time**: 6-7 days
**Complexity**: High

**What We'd Build:**
- ❌ Video upload UI component
- ❌ Drag-and-drop interface
- ❌ Progress tracking system
- ❌ Video library management
- ❌ Encoding status monitoring
- ❌ Bulk operations UI
- ❌ Preview functionality
- ❌ Search and filtering
- ❌ Admin route protection
- ❌ File validation UI
- ❌ Error handling UI
- ❌ Thumbnail management UI

**Total Code**: ~2,000 lines of React/TypeScript
**API Routes**: 5-6 endpoints
**Database Tables**: 2 (videos, video_analytics)
**User Training**: Extensive (custom interface)
**Maintenance**: High (bug fixes, feature requests, UI updates)

---

### Simplified Plan (Bunny Dashboard)
**Estimated Time**: 1-2 days
**Complexity**: Low

**What We'd Build:**
- ✅ Video ID parser (20 lines)
- ✅ VideoPlayer component (100 lines)
- ✅ Playback token API (50 lines)
- ✅ Markdown syntax extension (minimal)
- ✅ Decap CMS field configuration (10 lines)

**Total Code**: ~200 lines of React/TypeScript
**API Routes**: 1 endpoint (token generation)
**Database Tables**: 0 (optional: analytics only)
**User Training**: Minimal (they already know Bunny dashboard)
**Maintenance**: Low (Bunny handles upload/encoding/management)

---

### Scope Reduction Breakdown

| Feature | Original | Simplified | Eliminated |
|---------|----------|------------|------------|
| **Upload Interface** | Custom UI | Bunny Dashboard | ✅ |
| **File Validation** | Client + Server | Bunny handles | ✅ |
| **Progress Tracking** | Custom websockets | Bunny dashboard | ✅ |
| **Encoding Status** | Webhooks + DB | Check in Bunny | ✅ |
| **Video Library** | Custom UI | Bunny dashboard | ✅ |
| **Thumbnail Management** | Custom upload | Bunny generates | ✅ |
| **Search/Filter** | Custom UI | Bunny dashboard | ✅ |
| **Preview Player** | Custom component | Bunny dashboard | ✅ |
| **Bulk Operations** | Custom UI | Bunny dashboard | ✅ |
| **User Permissions** | Custom RBAC | Bunny team roles | ✅ |
| **Error Handling** | Custom UI | Bunny handles | ✅ |
| **Video Player** | Required | Required | ❌ |
| **Token Auth** | Required | Required | ❌ |
| **CMS Integration** | Required | Required | ❌ |

**Eliminated**: 11 out of 14 features (78%)
**Time Savings**: 5-6 days of development
**Code Reduction**: 90% less custom code
**Maintenance**: 95% less ongoing work

---

## Simplified Architecture

### Before (Full Admin UI)
```
User (Admin) → Custom Admin Panel → Upload API → Database → Bunny API
     ↓                                  ↓
Progress UI ← Websockets ← Encoding Status ← Webhooks
     ↓
Video Library UI → Search/Filter → Preview
     ↓
Assign to Course → CMS Integration
```

### After (Bunny Dashboard)
```
User (Admin) → Bunny Dashboard → Upload → Encoding → Copy Video ID
     ↓
Decap CMS → Paste Video ID → Markdown Parser → VideoPlayer
     ↓
End User → Request Video → Token API → Secure Playback
```

**Key Insight**: Bunny already built a professional admin interface. Why duplicate it?

---

## Implementation Plan

### Phase 1: Core Integration (Day 1 - 4 hours)

**Tasks:**
1. ✅ Set up Bunny Stream account
2. ✅ Add environment variables
3. ✅ Create playback token API route
4. ✅ Build VideoPlayer component
5. ✅ Test playback with sample video

**Deliverable**: Working video playback

---

### Phase 2: CMS Integration (Day 1-2 - 4 hours)

**Tasks:**
1. ✅ Extend markdown parser to recognize video syntax
2. ✅ Add video field to Decap CMS config
3. ✅ Update course schema
4. ✅ Test full workflow

**Deliverable**: Videos embedded in courses via CMS

---

### Phase 3: Documentation (Day 2 - 2 hours)

**Tasks:**
1. ✅ Document user workflow
2. ✅ Create quick reference guide
3. ✅ Add troubleshooting section

**Deliverable**: Admin can use system independently

---

## Markdown Parser Integration

### New Markdown Syntax

We'll support a simple, clean syntax for videos:

```markdown
# Course Slide Title

Some introductory text about this concept.

{{video:abc123def456}}

Or with custom options:

{{video:abc123def456|autoplay:false|poster:custom-thumbnail.jpg}}

More content after the video...
```

### Parser Implementation

**Before** (existing parser):
```typescript
// src/lib/course-parser.ts
export interface CourseSlide {
  id: string;
  chapterId: string;
  title: string;
  content: string; // HTML rendered from markdown
  order: number;
  mediaUrl?: string;        // Currently unused
  mediaType?: 'video' | 'audio'; // Currently unused
  estimatedMinutes?: number;
}
```

**After** (enhanced parser):
```typescript
// src/lib/course-parser.ts

// 1. Add video extraction function
function extractVideoReferences(markdown: string): VideoReference[] {
  const videoRegex = /\{\{video:([\w-]+)(?:\|([^}]+))?\}\}/g;
  const references: VideoReference[] = [];
  let match;

  while ((match = videoRegex.exec(markdown)) !== null) {
    const videoId = match[1];
    const options = match[2] ? parseVideoOptions(match[2]) : {};

    references.push({
      placeholder: match[0],
      videoId,
      options,
    });
  }

  return references;
}

function parseVideoOptions(optionsStr: string): VideoOptions {
  const options: VideoOptions = {};
  const pairs = optionsStr.split('|');

  pairs.forEach(pair => {
    const [key, value] = pair.split(':');
    if (key && value) {
      options[key.trim()] = value.trim();
    }
  });

  return options;
}

// 2. Enhance slide parser
export async function parseSlide(
  markdown: string,
  slideId: string,
  chapterId: string,
  order: number
): Promise<CourseSlide> {
  // Extract video references BEFORE converting to HTML
  const videoRefs = extractVideoReferences(markdown);

  // Replace video placeholders with player components
  let processedMarkdown = markdown;
  videoRefs.forEach(ref => {
    const playerPlaceholder = `<video-player
      video-id="${ref.videoId}"
      autoplay="${ref.options.autoplay || 'false'}"
      poster="${ref.options.poster || ''}"
    ></video-player>`;

    processedMarkdown = processedMarkdown.replace(
      ref.placeholder,
      playerPlaceholder
    );
  });

  // Convert markdown to HTML
  const htmlContent = await markdownToHtml(processedMarkdown);

  // Store first video reference (for backward compatibility)
  const primaryVideo = videoRefs[0];

  return {
    id: slideId,
    chapterId,
    title: extractTitle(markdown),
    content: htmlContent,
    order,
    mediaUrl: primaryVideo?.videoId,
    mediaType: primaryVideo ? 'video' : undefined,
    estimatedMinutes: estimateReadingTime(markdown),
    videoReferences: videoRefs, // Store all videos for this slide
  };
}

// 3. Add types
interface VideoReference {
  placeholder: string;
  videoId: string;
  options: VideoOptions;
}

interface VideoOptions {
  autoplay?: string;
  poster?: string;
  quality?: string;
  [key: string]: string | undefined;
}
```

### Updated Course Type

```typescript
// src/types/course.ts
export interface CourseSlide {
  id: string;
  chapterId: string;
  title: string;
  content: string; // HTML with <video-player> tags
  order: number;

  // Legacy fields (maintain backward compatibility)
  mediaUrl?: string;
  mediaType?: 'video' | 'audio';

  // New field for multiple videos per slide
  videoReferences?: VideoReference[];

  estimatedMinutes?: number;
}

export interface VideoReference {
  videoId: string; // Bunny video GUID
  autoplay?: boolean;
  poster?: string;
  quality?: string;
}
```

---

## Decap CMS Configuration

### Update Course Collection

```yaml
# public/admin/config.yml

collections:
  - name: "courses"
    label: "Courses"
    folder: "content/courses"
    create: true
    slug: "{{slug}}"
    fields:
      # ... existing fields ...

      - label: "Chapters"
        name: "chapters"
        widget: "list"
        fields:
          - {label: "Title", name: "title", widget: "string"}
          - {label: "Order", name: "order", widget: "number"}

          - label: "Slides"
            name: "slides"
            widget: "list"
            fields:
              - {label: "Title", name: "title", widget: "string"}
              - {label: "Content", name: "content", widget: "markdown"}

              # NEW: Video ID field with helper text
              - label: "Video ID"
                name: "videoId"
                widget: "string"
                required: false
                hint: "Paste the Video ID from Bunny Stream dashboard (e.g., abc123-def456-ghi789)"

              # NEW: Video options
              - label: "Autoplay Video"
                name: "autoplay"
                widget: "boolean"
                default: false
                required: false

              - label: "Custom Thumbnail URL"
                name: "poster"
                widget: "string"
                required: false
                hint: "Optional: Override default Bunny thumbnail"

              - {label: "Order", name: "order", widget: "number"}
              - {label: "Estimated Minutes", name: "estimatedMinutes", widget: "number"}
```

### Alternative: Simple Text Field with Instructions

Even simpler approach - just use the markdown editor:

```yaml
# public/admin/config.yml

collections:
  - name: "courses"
    label: "Courses"
    fields:
      - label: "Slides"
        name: "slides"
        widget: "list"
        fields:
          - label: "Content"
            name: "content"
            widget: "markdown"
            hint: |
              To embed a video, use: {{video:YOUR_VIDEO_ID}}

              Get the Video ID from Bunny Stream dashboard:
              1. Go to https://dash.bunny.net/stream
              2. Click on your video
              3. Copy the Video ID (shown in the URL or details)
              4. Paste it using the format above

              Example: {{video:abc123-def456-ghi789}}
```

**Benefit**: Zero CMS config changes, just use existing markdown field with documentation.

---

## Code Implementation

### 1. Playback Token API

```typescript
// src/app/api/video/[videoId]/token/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import crypto from 'crypto';

const BUNNY_LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID!;
const BUNNY_API_KEY = process.env.BUNNY_STREAM_API_KEY!;
const BUNNY_CDN_HOSTNAME = process.env.BUNNY_STREAM_CDN_HOSTNAME!;

export async function GET(
  request: NextRequest,
  { params }: { params: { videoId: string } }
) {
  // Optional: Check authentication
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { videoId } = params;

  // Generate signed URL token
  const expirationTime = Math.floor(Date.now() / 1000) + 86400; // 24 hours
  const tokenBase = `${BUNNY_LIBRARY_ID}${BUNNY_API_KEY}${expirationTime}${videoId}`;
  const token = crypto
    .createHash('sha256')
    .update(tokenBase)
    .digest('hex');

  const streamUrl = `https://${BUNNY_CDN_HOSTNAME}/${videoId}/playlist.m3u8?token=${token}&expires=${expirationTime}`;

  return NextResponse.json({
    streamUrl,
    token,
    expiresAt: new Date(expirationTime * 1000).toISOString(),
  });
}
```

**That's it!** Just 30 lines of code for the entire API.

---

### 2. VideoPlayer Component

```typescript
// src/components/VideoPlayer.tsx
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
    async function initPlayer() {
      try {
        // Fetch signed stream URL
        const response = await fetch(`/api/video/${videoId}/token`);
        if (!response.ok) throw new Error('Failed to load video');

        const { streamUrl } = await response.json();
        const video = videoRef.current;
        if (!video) return;

        // Initialize HLS
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(streamUrl);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setLoading(false);
            if (autoplay) video.play();
          });

          return () => hls.destroy();
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // Safari native HLS
          video.src = streamUrl;
          video.addEventListener('loadedmetadata', () => {
            setLoading(false);
            if (autoplay) video.play();
          });
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    initPlayer();
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
```

**Total**: 100 lines for complete video player with HLS, error handling, and progress tracking.

---

### 3. SlideContent Integration

```typescript
// src/components/course/SlideContent.tsx
import { VideoPlayer } from '@/components/VideoPlayer';

interface SlideContentProps {
  content: string; // HTML with <video-player> tags
  videoReferences?: VideoReference[];
}

export function SlideContent({ content, videoReferences }: SlideContentProps) {
  // Replace <video-player> tags with actual VideoPlayer components
  const renderContent = () => {
    if (!videoReferences || videoReferences.length === 0) {
      // No videos, just render HTML
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }

    // Split content by video player tags and render with actual components
    const parts = content.split(/(<video-player[^>]*><\/video-player>)/);

    return (
      <div className="prose max-w-none">
        {parts.map((part, index) => {
          const videoMatch = part.match(/video-id="([^"]+)"/);

          if (videoMatch) {
            const videoId = videoMatch[1];
            const autoplayMatch = part.match(/autoplay="([^"]+)"/);
            const posterMatch = part.match(/poster="([^"]+)"/);

            return (
              <VideoPlayer
                key={index}
                videoId={videoId}
                autoplay={autoplayMatch?.[1] === 'true'}
                poster={posterMatch?.[1]}
              />
            );
          }

          return <div key={index} dangerouslySetInnerHTML={{ __html: part }} />;
        })}
      </div>
    );
  };

  return renderContent();
}
```

---

## User Workflow

### For Content Creators (Course Authors)

**1. Upload Video in Bunny Dashboard** (2 minutes)
```
1. Go to https://dash.bunny.net/stream/
2. Click "Add Video" or drag-and-drop
3. Wait for upload (Bunny shows progress)
4. Video processes automatically
5. Click on the video
6. Copy the Video ID from URL or details panel
   Example: abc123-def456-ghi789
```

**2. Add to Course in Decap CMS** (1 minute)
```
1. Open your course in Decap CMS
2. Navigate to the slide where you want the video
3. In the markdown editor, type:

   {{video:abc123-def456-ghi789}}

4. Save and publish
```

**3. Preview** (instant)
```
1. Navigate to the course slide
2. Video appears and plays automatically
```

### Total Time Per Video
- **Upload**: 2-5 minutes (depending on file size)
- **Add to course**: 1 minute
- **Total**: 3-6 minutes

**vs Custom Admin UI**: Same time, but no custom interface to learn or maintain!

---

## Cost-Benefit Analysis

### Development Cost Comparison

| Metric | Full Admin UI | Simplified (Bunny Dashboard) | Savings |
|--------|---------------|------------------------------|---------|
| **Initial Development** | 6-7 days | 1-2 days | **5-6 days** |
| **Code to Write** | ~2,000 lines | ~200 lines | **90%** |
| **Code to Maintain** | ~2,000 lines | ~200 lines | **90%** |
| **API Endpoints** | 5-6 routes | 1 route | **80%** |
| **Database Tables** | 2 tables | 0 tables* | **100%** |
| **Testing Burden** | High (UI + API) | Low (API only) | **80%** |
| **Bug Surface Area** | Large | Minimal | **90%** |
| **User Training** | Extensive docs needed | Minimal (they know Bunny) | **90%** |
| **Support Tickets** | "Upload broken", "Can't find my videos" | Rare | **80%** |
| **Feature Requests** | "Add search", "Bulk edit", etc. | N/A (Bunny handles) | **100%** |

*Optional: Can add analytics table later if needed

### Ongoing Maintenance Cost

**Full Admin UI:**
- Bugs in upload flow
- Encoding status sync issues
- UI/UX improvements
- Search/filter performance
- Browser compatibility issues
- Mobile responsive issues
- Feature parity with Bunny (they keep improving)
- User permission bugs
- File validation edge cases

**Simplified:**
- Rare: Token generation bugs (simple logic)
- Rare: Parser edge cases (well-defined syntax)
- Bunny handles everything else

**Maintenance Savings**: 90-95% less ongoing work

---

### Business Benefits

**1. Faster Time to Market**
- Ship video feature in 1-2 days instead of 1 week
- Start creating course content immediately
- Get user feedback faster

**2. Lower Risk**
- Bunny is battle-tested (millions of videos)
- Professional upload/encoding pipeline
- Reliable encoding status updates
- Automatic thumbnail generation
- Built-in error handling

**3. Better User Experience**
- Content creators already know Bunny interface (or quick to learn industry-standard UI)
- Professional encoding progress indicators
- Reliable upload resume functionality
- Better error messages (from Bunny)
- Mobile app available (Bunny mobile app)

**4. Future Flexibility**
- Easy to add custom admin UI later if needed
- Can gradually build features based on actual user needs
- Not locked in to custom solution

**5. Cost Savings**
- Development: 5-6 days saved × $500-1000/day = **$2,500-6,000 saved**
- Maintenance: ~2-4 hours/month saved × $100/hour × 12 months = **$2,400-4,800/year**
- **Total Year 1 Savings: $4,900-10,800**

---

## Potential Drawbacks & Mitigations

### Drawback 1: Multiple Admin Interfaces
**Issue**: Content creators need to use both Bunny dashboard and Decap CMS.

**Mitigation**:
- Document clear workflow
- Bunny UI is professional and intuitive
- Most video platforms work this way (YouTube embed, Vimeo embed, etc.)
- Can add direct link from CMS to Bunny dashboard
- Future: If this becomes a real pain point, build custom UI then (with user feedback)

**Reality Check**: This is how most platforms work:
- YouTube → Get video ID → Embed
- Vimeo → Get video ID → Embed
- Wistia → Get video ID → Embed
- **Not a novel workflow**

---

### Drawback 2: No Seamless Integration
**Issue**: Can't upload videos directly from within the course editor.

**Mitigation**:
- Bunny's UI is actually better than most custom solutions
- Drag-and-drop works great
- Mobile app available
- Can add iframe embed of Bunny UI in CMS later if desired

**Reality Check**:
- First priority: Video playback working
- Second priority: Content creation workflow smooth
- Can iterate on "seamless" integration later based on actual pain points

---

### Drawback 3: Learning Curve
**Issue**: Content creators need to learn Bunny dashboard.

**Mitigation**:
- Bunny UI is very intuitive (similar to YouTube)
- 5-minute tutorial video covers everything
- FAQs and documentation
- One-time learning investment

**Reality Check**:
- They already learned Decap CMS
- Bunny is actually easier (fewer concepts)
- Industry-standard UI patterns

---

## Decision Matrix

### Choose Full Admin UI If:
- [ ] You have 10+ content creators (needs custom workflow)
- [ ] Content creators are non-technical (need hand-holding)
- [ ] Brand consistency is critical (need white-label everything)
- [ ] You have specific upload workflow requirements
- [ ] You plan to add unique features (AI transcription, auto-chaptering, etc.)

### Choose Bunny Dashboard If:
- [✅] You have 1-3 content creators
- [✅] Content creators are technically competent
- [✅] Speed to market is important
- [✅] Maintenance burden is a concern
- [✅] Budget is limited
- [✅] MVP approach preferred

**Recommendation**: Start with Bunny Dashboard, add custom UI only if proven necessary.

---

## Implementation Checklist

### Day 1: Core Setup (2-4 hours)

**Morning:**
- [ ] Create Bunny Stream account
- [ ] Upload test video
- [ ] Copy Video ID
- [ ] Add environment variables to `.env.local`:
  ```bash
  BUNNY_STREAM_LIBRARY_ID=your_library_id
  BUNNY_STREAM_API_KEY=your_api_key
  BUNNY_STREAM_CDN_HOSTNAME=your_cdn_hostname.b-cdn.net
  ```

**Afternoon:**
- [ ] Install `hls.js` dependency: `npm install hls.js`
- [ ] Create `/api/video/[videoId]/token/route.ts` (30 lines)
- [ ] Create `VideoPlayer.tsx` component (100 lines)
- [ ] Test playback with test video ID
- [ ] Verify token generation works

---

### Day 2: CMS Integration (2-4 hours)

**Morning:**
- [ ] Update course parser to extract `{{video:ID}}` syntax
- [ ] Update `CourseSlide` type with `videoReferences` field
- [ ] Test parser with sample markdown

**Afternoon:**
- [ ] Update `SlideContent` component to render VideoPlayer
- [ ] Update Decap CMS config (add video ID field or instructions)
- [ ] Test full workflow: Bunny upload → CMS → Playback
- [ ] Document user workflow

---

### Day 2-3: Documentation (1-2 hours)

- [ ] Create "Adding Videos to Courses" guide
- [ ] Add screenshots of Bunny dashboard
- [ ] Document video ID format
- [ ] Add troubleshooting section
- [ ] Create quick reference card

---

## Sample Documentation for Users

### Quick Start: Adding Videos to Courses

**Step 1: Upload Video to Bunny Stream**

1. Go to https://dash.bunny.net/stream/
2. Click "**Add Video**" button (or drag and drop)
3. Upload your video file
4. Wait for processing (progress bar shows status)
5. When complete, click on the video
6. Copy the **Video ID** (found in URL or details panel)
   - Example: `abc123-def456-ghi789`

**Step 2: Add Video to Course**

1. Open Decap CMS: https://yourdomain.com/admin
2. Navigate to **Courses** → Your Course → Chapter → Slide
3. In the **Content** field (markdown editor), add:
   ```markdown
   {{video:abc123-def456-ghi789}}
   ```
4. Click **Save** and **Publish**

**Step 3: Preview**

1. Navigate to your course slide on the website
2. Video should appear and play automatically

**That's it!** 🎉

---

### Video Options

You can customize video playback with options:

```markdown
{{video:abc123-def456-ghi789|autoplay:false}}

{{video:abc123-def456-ghi789|poster:custom-thumbnail.jpg}}

{{video:abc123-def456-ghi789|autoplay:false|poster:custom-thumbnail.jpg}}
```

**Available Options:**
- `autoplay:true` or `autoplay:false` - Whether video plays automatically
- `poster:URL` - Custom thumbnail image URL

---

### Troubleshooting

**Video doesn't appear:**
- Check that Video ID is correct (copy from Bunny dashboard)
- Verify video is published in Bunny (not draft)
- Check syntax: `{{video:ID}}` with double curly braces

**Video won't play:**
- Check browser console for errors
- Verify environment variables are set
- Try in different browser
- Check Bunny dashboard for encoding status

**Need Help?**
- Bunny Support: https://support.bunny.net/
- Internal: support@becomingdiamond.com

---

## Conclusion

### Recommendation: Use Bunny Dashboard Approach

**Reasons:**
1. ✅ **80% time savings** (1-2 days vs 6-7 days)
2. ✅ **90% code reduction** (200 lines vs 2,000 lines)
3. ✅ **95% maintenance reduction** (minimal ongoing work)
4. ✅ **Lower risk** (battle-tested Bunny UI)
5. ✅ **Better UX** (professional encoding pipeline)
6. ✅ **Cost savings** ($5-10K in Year 1)
7. ✅ **Standard workflow** (like YouTube embed)
8. ✅ **Future flexibility** (can add custom UI later if needed)

### When to Reconsider

Build custom admin UI if:
- User feedback shows Bunny dashboard is a real pain point (not just theoretical)
- Multiple content creators complain about workflow
- Specific features needed that Bunny doesn't provide
- Have budget for ongoing maintenance

### Next Steps

1. **This Week**: Implement simplified approach
2. **Gather Feedback**: Monitor actual usage for 1-2 months
3. **Iterate**: Add custom features only if proven necessary
4. **Re-evaluate**: After 100+ videos uploaded, reassess workflow

**Start simple. Add complexity only when justified by real user needs.**

---

## Code Changes Summary

**Total Changes Required:**

1. **New Files** (2):
   - `/src/app/api/video/[videoId]/token/route.ts` (30 lines)
   - `/src/components/VideoPlayer.tsx` (100 lines)

2. **Modified Files** (3):
   - `/src/lib/course-parser.ts` (+50 lines for video extraction)
   - `/src/components/course/SlideContent.tsx` (+20 lines for player rendering)
   - `/public/admin/config.yml` (+10 lines for video field - optional)

3. **New Dependencies** (1):
   - `hls.js`

**Total**: 210 lines of new code, 3-4 hours of work.

vs **Full Admin UI**: 2,000+ lines, 6-7 days of work.

**Time savings: 90%+**
