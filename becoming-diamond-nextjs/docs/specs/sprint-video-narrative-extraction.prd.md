# Sprint Video Narrative Extraction & Content Generation

**Date**: 2025-10-16
**Status**: Planning
**Priority**: High
**Estimated Effort**: 2-3 days (depending on method)

---

## Executive Summary

Extract spoken narratives from the 28 sprint videos and use them as the primary body content for each day's markdown file. This will ensure consistency between video content and written content, reduce manual content creation work, and provide members with a written reference of the video lessons.

---

## Problem Statement

**Current State**:
- Sprint day markdown files contain generic placeholder content
- Video content exists but is separate from written content
- No written transcript of video lessons
- Members cannot easily reference specific points from videos
- SEO benefits of transcribed content are lost

**Desired State**:
- Each sprint day has a written narrative matching the video
- Members can read along or reference content after watching
- Searchable, SEO-friendly text content
- Consistent messaging across video and text

---

## Goals & Objectives

### Primary Goals
1. Extract accurate narratives from all 28 videos (Days 1-22 + 6 extras)
2. Format narratives as engaging written content
3. Update sprint day markdown files with video narratives
4. Maintain video embeds alongside written content

### Success Metrics
- ✅ All 28 videos have accurate transcripts
- ✅ Transcripts are formatted as readable markdown
- ✅ Content reads naturally (not robotic transcription)
- ✅ Key concepts, exercises, and takeaways are preserved
- ✅ Videos remain embedded above or within the narrative

---

## Scope

### In Scope
- Extract narratives from 28 existing videos
- Format as markdown with proper headings, lists, emphasis
- Update Days 1-22 markdown files
- Preserve existing frontmatter (title, duration, tags)
- Keep video embeds in place
- Light editing for readability (remove filler words, add punctuation)

### Out of Scope
- Creating new video content
- Translating to other languages
- Adding images/diagrams (unless mentioned in video)
- Rewriting or changing the message
- Days 23-30 (videos don't exist yet)

---

## Approach & Methods

### Option A: AI Transcription (Recommended - Fast & Accurate)

**Tools**: Whisper AI (OpenAI), AssemblyAI, or Rev.ai

**Process**:
1. **Download Videos from Bunny** (if accessible)
   ```bash
   # Using Bunny API or direct download
   curl -o day-01.mp4 "https://bunny-cdn-url/video-id.mp4"
   ```

2. **Transcribe with Whisper**
   ```bash
   # Install Whisper
   pip install openai-whisper

   # Transcribe each video
   whisper day-01.mp4 --model medium --language en --output_format txt
   ```

3. **Format with GPT-4**
   - Feed raw transcript to Claude/GPT-4
   - Prompt: "Format this video transcript as engaging markdown content with headings, lists, and emphasis. Remove filler words but preserve the speaker's voice and message."

**Pros**:
- Fast (5-10 minutes per video)
- Accurate (95%+ with Whisper)
- Can process all 28 videos in ~4-6 hours
- Automated workflow

**Cons**:
- Requires video file access
- May need Bunny API access or manual download
- Costs: Whisper is free (local), GPT-4 formatting ~$0.50/video

**Timeline**: 1 day
- 4 hours: Download videos
- 4 hours: Transcribe all 28 videos
- 4 hours: Format and review transcripts
- 2 hours: Update markdown files

---

### Option B: Manual Transcription (Accurate but Slow)

**Process**:
1. Play each video
2. Type out narrative in markdown as you listen
3. Add headings, formatting, and structure
4. Review for accuracy

**Pros**:
- 100% accurate
- Can interpret context and add formatting in real-time
- No external tools needed

**Cons**:
- Very time-consuming (30-45 min per video)
- Tedious for 28 videos (~14-21 hours total)
- Easy to miss details or lose context

**Timeline**: 3 days
- Day 1: Videos 1-10
- Day 2: Videos 11-20
- Day 3: Videos 21-28 + review

---

### Option C: Hybrid Approach (Best Quality)

**Process**:
1. Use Whisper for initial transcription (fast)
2. Play video alongside transcript
3. Edit transcript for flow, add headings, format properly
4. Preserve the authentic voice while making it readable

**Pros**:
- Best of both worlds: speed + accuracy
- Transcripts feel natural, not robotic
- Can catch nuances AI might miss

**Cons**:
- Still requires manual review time
- ~15-20 min per video for editing

**Timeline**: 1.5 days
- 4 hours: Transcribe with Whisper
- 8 hours: Review and edit (20 min × 28)
- 2 hours: Update markdown files
- 2 hours: QA and final polish

---

## Recommended Approach

**Method**: Option C - Hybrid Approach

**Reasoning**:
- Balances speed and quality
- Transcripts will feel authentic, not AI-generated
- Professional output worthy of paid course
- Doable in 1-2 days

---

## Implementation Plan

### Phase 1: Setup & Download (2-4 hours)

**1.1 Access Bunny Videos**
```bash
# Create download script
# File: scripts/download-bunny-videos.js

const fs = require('fs');
const path = require('path');
const https = require('https');

const VIDEO_IDS = {
  1: '4a151e6b-7911-41b9-b1ef-c6fa00bafaa5',
  2: 'daf70a49-4110-4f52-a2de-7f273a8475c1',
  // ... all 28 videos
};

// Download each video using Bunny CDN URL
for (const [day, videoId] of Object.entries(VIDEO_IDS)) {
  const url = `https://${BUNNY_CDN_HOSTNAME}/${videoId}/original`;
  const dest = `./videos/day-${day.padStart(2, '0')}.mp4`;

  // Download logic
}
```

**1.2 Install Whisper**
```bash
pip install openai-whisper
# Or use cloud version: AssemblyAI, Rev.ai
```

**1.3 Create Output Directory**
```bash
mkdir -p transcripts/raw
mkdir -p transcripts/formatted
```

---

### Phase 2: Transcription (4 hours)

**2.1 Batch Transcribe All Videos**
```bash
# Create transcription script
# File: scripts/transcribe-videos.sh

#!/bin/bash
for video in videos/*.mp4; do
  basename=$(basename "$video" .mp4)
  echo "Transcribing $basename..."

  whisper "$video" \
    --model medium \
    --language en \
    --output_format txt \
    --output_dir transcripts/raw
done
```

**2.2 Monitor Progress**
- Whisper takes ~3-5 minutes per video
- Total: 1.5-2.5 hours for all 28 videos
- Run overnight if needed

---

### Phase 3: Formatting (8 hours)

**3.1 Create Formatting Prompt**

Save as `prompts/format-transcript.md`:
```markdown
You are formatting a video transcript for a personal development course called "Becoming Diamond: 30-Day Transformation Sprint."

Input: Raw video transcript
Output: Engaging markdown content

Guidelines:
1. Remove filler words (um, uh, like) but keep conversational tone
2. Add markdown headings (##, ###) for major concepts
3. Use bullet lists for key points
4. Use **bold** for emphasis on important terms
5. Use > blockquotes for powerful statements
6. Keep the authentic voice of the speaker
7. Add line breaks for readability
8. Preserve exercises, challenges, and action items
9. Include "Key Takeaway" section at end
10. Keep it engaging and motivational

Raw transcript:
[PASTE TRANSCRIPT HERE]
```

**3.2 Process Each Transcript**
```bash
# Manual process (can be scripted with API)
for day in {01..28}; do
  echo "Formatting Day $day..."

  # 1. Open raw transcript
  # 2. Copy to Claude/GPT-4 with formatting prompt
  # 3. Save formatted version
  # 4. Review for accuracy while watching video
  # 5. Make final edits
done
```

**3.3 Quality Checklist per Video**
- [ ] Transcript matches video narrative
- [ ] Key concepts properly formatted
- [ ] Exercises clearly outlined
- [ ] Tone is motivational and engaging
- [ ] No transcription errors or nonsense
- [ ] Proper markdown syntax
- [ ] Flows naturally when read aloud

---

### Phase 4: Integration (2 hours)

**4.1 Update Markdown Files**

For each day, update `content/sprint/day-XX.md`:

**Before**:
```markdown
---
day: 1
title: "Welcome to Your Transformation"
---

# Day 1: Welcome to Your Transformation

[Generic placeholder content]

{{video:4a151e6b-7911-41b9-b1ef-c6fa00bafaa5}}
```

**After**:
```markdown
---
day: 1
title: "Welcome to Your Transformation"
---

# Day 1: Welcome to Your Transformation

{{video:4a151e6b-7911-41b9-b1ef-c6fa00bafaa5}}

Welcome to day one of your transformation...

[FORMATTED TRANSCRIPT]

## Key Takeaway

[Main lesson from video]
```

**4.2 Automation Script**
```javascript
// File: scripts/integrate-transcripts.js

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const TRANSCRIPT_DIR = './transcripts/formatted';
const CONTENT_DIR = './content/sprint';

for (let day = 1; day <= 28; day++) {
  const dayNum = String(day).padStart(2, '0');
  const transcriptPath = path.join(TRANSCRIPT_DIR, `day-${dayNum}.md`);
  const contentPath = path.join(CONTENT_DIR, `day-${dayNum}.md`);

  // Read existing markdown
  const existing = fs.readFileSync(contentPath, 'utf-8');
  const { data: frontmatter, content } = matter(existing);

  // Extract video embed
  const videoMatch = content.match(/\{\{video:[^}]+\}\}/);
  const videoEmbed = videoMatch ? videoMatch[0] : '';

  // Read formatted transcript
  const transcript = fs.readFileSync(transcriptPath, 'utf-8');

  // Combine: frontmatter + title + video + transcript
  const newContent = `---
${Object.entries(frontmatter).map(([k,v]) => `${k}: ${JSON.stringify(v)}`).join('\n')}
---

# Day ${day}: ${frontmatter.title}

${videoEmbed}

${transcript}
`;

  fs.writeFileSync(contentPath, newContent);
  console.log(`✅ Updated Day ${day}`);
}
```

---

### Phase 5: Review & QA (2 hours)

**5.1 Content Review Checklist**

For each sprint day:
- [ ] Video embed appears at top
- [ ] Narrative flows naturally
- [ ] Key concepts are clear
- [ ] Exercises are actionable
- [ ] Markdown renders correctly
- [ ] No formatting errors
- [ ] Consistent tone across all days

**5.2 Test in Browser**
```bash
npm run dev
# Navigate to each day and verify:
# - Video plays
# - Content displays properly
# - No layout issues
# - Read through content alongside video
```

**5.3 Get Feedback**
- Read 3-5 random days out loud
- Have someone else review for clarity
- Check that non-watchers can understand content

---

## Technical Requirements

### Tools Needed
- **Whisper AI**: Video transcription
- **Python 3.8+**: To run Whisper
- **Node.js**: For automation scripts
- **Claude/GPT-4 API** (optional): Automated formatting
- **ffmpeg** (optional): Video format conversion if needed

### Access Required
- Bunny Stream library access (download videos)
- Or: Play videos locally and use Whisper on audio
- Write access to `content/sprint/` directory

### Scripts to Create
1. `scripts/download-bunny-videos.js` - Download all videos
2. `scripts/transcribe-videos.sh` - Batch transcription
3. `scripts/integrate-transcripts.js` - Update markdown files
4. `scripts/validate-content.js` - QA checks

---

## Content Structure Template

Each sprint day should follow this structure:

```markdown
---
day: X
title: "Day Title"
subtitle: "Subtitle"
published: true
duration: "XX minutes"
difficulty: "Beginner|Intermediate|Advanced"
week: X
tags: ["tag1", "tag2"]
video: ""
audio: ""
images: []
---

# Day X: Day Title

{{video:video-id-here}}

## Introduction

[Opening paragraph from video - sets context]

## Main Concept 1

[First major concept from video]

### Key Points

- Point 1
- Point 2
- Point 3

## Main Concept 2

[Second major concept]

> Powerful quote or statement from video

## Exercise: [Exercise Name]

**Time Required**: X minutes

[Step-by-step instructions from video]

1. Step 1
2. Step 2
3. Step 3

## Reflection Questions

[Questions posed in video]

1. Question 1
2. Question 2

## Key Takeaway

[Main lesson - what to remember]

---

*Tomorrow: [Preview of next day]*
```

---

## Timeline & Milestones

### Day 1: Setup & Transcription
- **Morning** (4h): Download videos, install tools
- **Afternoon** (4h): Run Whisper transcription on all videos

**Deliverable**: 28 raw transcripts in `transcripts/raw/`

---

### Day 2: Formatting & Editing
- **Morning** (4h): Format Days 1-14 with AI assistance
- **Afternoon** (4h): Format Days 15-28, review for quality

**Deliverable**: 28 formatted transcripts in `transcripts/formatted/`

---

### Day 3: Integration & QA
- **Morning** (2h): Run integration script, update markdown
- **Afternoon** (2h): Review in browser, fix issues, final polish

**Deliverable**: All sprint days updated with video narratives

---

## Risks & Mitigation

### Risk 1: Video Download Access
**Impact**: Cannot transcribe without video files
**Mitigation**:
- Alternative: Use Bunny's audio extraction API
- Alternative: Play video and capture audio via screen recording
- Alternative: Use online transcription service (upload via URL)

### Risk 2: Transcription Accuracy
**Impact**: Incorrect content could mislead users
**Mitigation**:
- Review every transcript while watching video
- Use medium/large Whisper model for better accuracy
- Have instructor review final content

### Risk 3: Formatting Consistency
**Impact**: Inconsistent reading experience
**Mitigation**:
- Create style guide template
- Use same formatting prompt for all videos
- Final pass to ensure consistency

### Risk 4: Time Overrun
**Impact**: Takes longer than 2-3 days
**Mitigation**:
- Prioritize Days 1-7 (most critical)
- Can launch with partial content and add rest later
- Consider hiring transcription service if needed

---

## Cost Estimate

### Option A: DIY with Whisper (Recommended)
- Whisper: Free (open source)
- GPT-4 formatting: ~$14 (28 videos × $0.50)
- Time: 16-20 hours
- **Total**: $14 + your time

### Option B: Professional Service
- Rev.ai transcription: $1.50/min × 28 videos × 4 min avg = ~$168
- Formatting: Still need manual work or GPT-4
- **Total**: ~$180-200

### Option C: Hybrid
- Whisper (free) + manual editing (10 hours)
- **Total**: $0 + your time

---

## Success Criteria

### Must Have
- ✅ All 28 videos have written narratives
- ✅ Content is accurate (95%+ match to video)
- ✅ Markdown formatting is correct
- ✅ Narratives are engaging and readable
- ✅ Key concepts are clearly communicated

### Should Have
- ✅ Consistent formatting across all days
- ✅ Exercises clearly outlined
- ✅ Reflection questions included
- ✅ Professional writing quality

### Nice to Have
- ⭐ Timestamps linking to video sections
- ⭐ Downloadable PDF versions
- ⭐ Audio versions for accessibility

---

## Next Steps

1. **Approve this plan** - Confirm approach and timeline
2. **Download videos** - Get access to Bunny library
3. **Setup tools** - Install Whisper, create scripts
4. **Start transcription** - Begin with Day 1 as proof of concept
5. **Iterate** - Refine formatting process based on Day 1 results
6. **Execute** - Process all 28 videos
7. **Review & Deploy** - QA and push to production

---

## Appendix A: Whisper Models

| Model | Size | Speed | Accuracy | RAM Required |
|-------|------|-------|----------|--------------|
| tiny | 39M | Very Fast | ~65% | 1 GB |
| base | 74M | Fast | ~75% | 1 GB |
| small | 244M | Medium | ~85% | 2 GB |
| **medium** | 769M | Slower | **95%** | 5 GB |
| large | 1550M | Slowest | 98% | 10 GB |

**Recommendation**: Use `medium` for best balance of speed/accuracy.

---

## Appendix B: Example Formatting Prompt

```markdown
Format this video transcript as engaging markdown course content:

GUIDELINES:
- Remove filler words but keep conversational tone
- Add ## headings for main concepts
- Use bullet lists for key points
- Use **bold** for emphasis
- Keep authentic voice
- Include exercises and action items
- Add "Key Takeaway" section

VIDEO CONTEXT:
- Course: Becoming Diamond 30-Day Sprint
- Day: [X]
- Title: [Title]
- Duration: [X] minutes

RAW TRANSCRIPT:
[paste here]

OUTPUT FORMAT:
Clean markdown ready to paste into content/sprint/day-XX.md
```

---

## Appendix C: Quality Examples

### Good Example ✅
```markdown
## The Diamond Under Pressure

A diamond doesn't start as a diamond. It begins as coal—ordinary, unrefined, full of potential but unrealized. Through **intense pressure** and time, it transforms into something extraordinary.

You are that coal. This 30-day sprint is the pressure that will transform you.

### The Three Pillars of Transformation

1. **Consistency Over Intensity** - Small daily actions compound into massive results
2. **Pressure Creates Diamonds** - Embrace discomfort as the catalyst for growth
3. **Clarity Before Action** - Know your why before you start your how

> "It's not about massive overnight change. It's about showing up every single day."
```

### Bad Example ❌
```markdown
## um so the diamond under pressure right

so like a diamond um it doesn't like start as a diamond you know what i mean it like begins as coal which is like ordinary and um unrefined and um has potential but like it's unrealized and um through like pressure and stuff and time it like transforms into something um extraordinary

so like you are that coal okay and um this 30 day sprint thing is like the pressure that will um transform you
```

**Key Difference**: Good example removes filler, adds structure, preserves message.

---

**Status**: Ready for approval
**Next Action**: Confirm approach and begin Phase 1
