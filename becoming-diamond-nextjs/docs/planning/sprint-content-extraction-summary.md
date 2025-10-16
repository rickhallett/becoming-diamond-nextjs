# Sprint Video Narrative Extraction - Quick Summary

**Full Plan**: See `docs/specs/sprint-video-narrative-extraction.prd.md`

---

## The Plan in 60 Seconds

**Goal**: Extract narratives from 28 sprint videos and use them as the body content for each day's markdown file.

**Recommended Approach**: Hybrid (AI + Manual)
1. Use Whisper AI to transcribe videos (4 hours)
2. Format with GPT-4/Claude + manual editing (8 hours)
3. Integrate into markdown files (2 hours)
4. Review and QA (2 hours)

**Total Time**: 1.5-2 days
**Total Cost**: ~$14 (Whisper is free, GPT-4 formatting)

---

## Why This Approach?

✅ **Fast**: Whisper transcribes in ~5 min per video
✅ **Accurate**: 95%+ accuracy with medium model
✅ **Quality**: Manual editing preserves authentic voice
✅ **Scalable**: Can process all 28 videos in 2 days
✅ **Professional**: Output worthy of paid course

---

## Three Approach Options

| Approach | Time | Cost | Quality | Recommended |
|----------|------|------|---------|-------------|
| **AI Only** (Whisper + GPT-4) | 1 day | $14 | 85% | Good for MVP |
| **Hybrid** (AI + Manual) | 1.5 days | $14 | 95% | ✅ **Best** |
| **Manual** (Type everything) | 3 days | $0 | 100% | Slow |

---

## Quick Start Steps

### Step 1: Download Videos (2 hours)
```bash
# Create script to download from Bunny
node scripts/download-bunny-videos.js

# Or download manually from Bunny dashboard
# Save to: ./videos/day-01.mp4, day-02.mp4, etc.
```

### Step 2: Transcribe with Whisper (2 hours)
```bash
# Install Whisper
pip install openai-whisper

# Transcribe all videos
for video in videos/*.mp4; do
  whisper "$video" --model medium --language en
done

# Outputs: ./day-01.txt, ./day-02.txt, etc.
```

### Step 3: Format with AI (4 hours)
```bash
# For each transcript:
# 1. Copy raw transcript
# 2. Paste into Claude/GPT-4 with this prompt:

"Format this video transcript as engaging markdown for a personal development course.
Remove filler words, add headings, use bullet lists, bold key terms, and keep the
authentic voice. Include exercises and key takeaways."

# 3. Save formatted version
# 4. Quick review while watching video
```

### Step 4: Integrate into Markdown (2 hours)
```javascript
// Run automation script
node scripts/integrate-transcripts.js

// This updates content/sprint/day-XX.md with:
// - Original frontmatter
// - Video embed at top
// - Formatted narrative below
```

### Step 5: Review (2 hours)
```bash
# Test in browser
npm run dev

# Visit each day and verify:
# ✅ Video plays
# ✅ Content displays correctly
# ✅ Narrative matches video
# ✅ Formatting looks good
```

---

## Example Output

**Before** (current):
```markdown
# Day 1: Welcome to Your Transformation

{{video:abc123}}

Welcome to the beginning of your 30-day journey...

[Generic placeholder text]
```

**After** (with narrative):
```markdown
# Day 1: Welcome to Your Transformation

{{video:abc123}}

Welcome to day one of your transformation into diamond. Today marks the first step
in a process that will challenge you, inspire you, and help you unlock your true potential.

## The Diamond Under Pressure

A diamond doesn't start as a diamond. It begins as coal—ordinary, unrefined, full of
potential but unrealized. Through **intense pressure** and time, it transforms into
something extraordinary.

You are that coal. This 30-day sprint is the pressure that will transform you.

### The Three Pillars

1. **Consistency Over Intensity** - Small daily actions compound
2. **Pressure Creates Diamonds** - Embrace discomfort as growth
3. **Clarity Before Action** - Know your why first

## Your Challenge Today

Take 10 minutes to reflect on these questions:
- What brought you to this sprint?
- What do you hope to achieve by Day 30?
- What old version of yourself are you ready to leave behind?

## Key Takeaway

> "Transformation isn't about massive overnight change. It's about showing up every
> single day, even when it's hard. That's when the pressure creates the diamond."
```

---

## Timeline

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Setup & Download | 2-4 hours | 28 video files |
| Transcription | 2-4 hours | 28 raw transcripts |
| Formatting | 6-8 hours | 28 formatted narratives |
| Integration | 2 hours | Updated markdown files |
| QA & Review | 2 hours | Production-ready content |
| **TOTAL** | **14-20 hours** | **Complete sprint content** |

Can be spread over 2-3 days.

---

## Tools Required

### Must Have
- **Whisper AI**: Free, open source
- **Python 3.8+**: To run Whisper
- **Video files**: Download from Bunny

### Nice to Have
- **GPT-4/Claude API**: Automated formatting ($14 total)
- **ffmpeg**: Video format conversion (if needed)

### Scripts to Create
1. `scripts/download-bunny-videos.js` - Download from Bunny
2. `scripts/transcribe-videos.sh` - Batch transcription
3. `scripts/integrate-transcripts.js` - Update markdown
4. `scripts/validate-content.js` - QA checks

---

## Benefits

### For Members
✅ Can read content before/after watching video
✅ Searchable text for quick reference
✅ Accessible to those who prefer reading
✅ Can copy quotes and exercises

### For Platform
✅ SEO benefits (indexed text content)
✅ Consistent messaging across formats
✅ Professional course experience
✅ Reduced content creation time

### For Instructor
✅ Video content repurposed as written lessons
✅ Authentic voice preserved
✅ Can update both formats easily
✅ Single source of truth

---

## Decision Points

### ✅ Decisions Made
- Use Whisper AI for transcription (fast + accurate)
- Hybrid approach with manual editing (quality)
- Keep video embeds at top of content
- Format as engaging markdown (not verbatim)

### 🤔 Decisions Needed
- When to start? (Videos need to be re-encoded in Bunny first)
- Who will do the editing? (Instructor review?)
- Days 23-30? (Videos don't exist yet)
- Add timestamps? (Link text sections to video moments)

---

## Next Steps

### Immediate (Today)
1. ✅ Review this plan
2. ✅ Approve approach
3. ⏳ Wait for Bunny videos to re-encode

### Phase 1 (When Videos Ready)
1. Download all 28 videos from Bunny
2. Install Whisper and dependencies
3. Test transcription on Day 1
4. Refine formatting process

### Phase 2 (Execute)
1. Batch transcribe all videos
2. Format with AI assistance
3. Manual review and editing
4. Update markdown files

### Phase 3 (Launch)
1. QA all 28 days
2. Deploy to production
3. Announce to members
4. Gather feedback

---

## Open Questions

1. **Video Access**: Can we download MP4 files from Bunny, or do we need to screen record?
2. **Instructor Review**: Should the instructor review final transcripts for accuracy?
3. **Content Style**: Verbatim transcript or more polished written lesson?
4. **Days 23-30**: Wait for videos or create content separately?
5. **Timestamps**: Add clickable timestamps linking text to video moments?

---

## Success Criteria

**Must Have**:
- ✅ All 28 videos transcribed accurately
- ✅ Narratives are engaging and readable
- ✅ Content matches video messaging
- ✅ Proper markdown formatting
- ✅ Videos still embedded and playable

**Should Have**:
- ✅ Consistent tone across all days
- ✅ Exercises clearly outlined
- ✅ Key takeaways highlighted
- ✅ Professional writing quality

**Nice to Have**:
- ⭐ Timestamps linking to video
- ⭐ Downloadable PDF versions
- ⭐ Multiple language translations

---

**Status**: Plan complete, awaiting approval
**Blocker**: Videos need to be re-encoded in Bunny before download
**Next Action**: Approve plan and prepare tools while waiting for video encoding

---

**Full Details**: See `docs/specs/sprint-video-narrative-extraction.prd.md`
