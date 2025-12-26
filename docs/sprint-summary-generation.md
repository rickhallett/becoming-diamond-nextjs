# Sprint Summary Generation

## Overview

Automated summary generation for all 30-day sprint videos using Claude API. This script reads generated transcripts and creates concise (< 100 word) summaries that are automatically inserted into the sprint day markdown files.

## Prerequisites

### Required Files
- **Transcripts**: Generated via `npm run generate-transcripts` (must exist first)
- Located in: `content/sprint/transcripts/day-XX.md`

### Required Environment Variables
Add to `.env.local`:
```bash
# Anthropic (for Claude summary generation)
ANTHROPIC_API_KEY=sk-ant-...
```

## Usage

### Generate All Summaries
Process all available transcripts:
```bash
npm run generate-summaries
```

### Generate Single Day
Process a specific day:
```bash
npm run generate-summaries -- --day=5
```

## Process Flow

1. **Read Transcript**
   - Scans `content/sprint/transcripts/day-XX.md` files
   - Extracts full transcript content (excluding frontmatter)

2. **Generate Summary with Claude**
   - Sends transcript to Claude API
   - Model: `claude-sonnet-4-5-20250929`
   - Constraint: < 100 words (strict limit)
   - Tone: Second person, motivational, action-focused

3. **Update Sprint Day File**
   - Opens `content/sprint/day-XX.md`
   - Preserves frontmatter
   - Preserves title, subtitle, and video embed
   - Replaces body text after video with generated summary
   - Saves updated file

## Output Format

Each sprint day file is updated with this structure:

```markdown
---
day: 5
title: "Heart Coherence"
subtitle: Your heart is smarter than you think
published: true
duration: 15 minutes
difficulty: Beginner
video: abc123-def456
---

# Heart Coherence

Your heart is smarter than you think

{{video:abc123-def456}}

[Generated summary < 100 words appears here]
```

## Prompt Design

The Claude API receives:
- Full transcript content
- Video title and day number
- Specific formatting requirements:
  - < 100 words (strict)
  - Second person perspective
  - Motivational tone
  - Focus on key message and action items

**Example prompt structure**:
```
You are creating a concise summary for a video transcript from a 30-day personal transformation sprint.

Video Title: Understanding Your Baseline
Day Number: 1

Full Transcript:
[transcript content]

Please generate a concise summary that:
1. Is LESS THAN 100 words (strict limit)
2. Captures the key message and main action items
3. Is written in second person ("you will learn", "you'll discover")
4. Maintains the motivational tone of the original
5. Focuses on what the viewer will gain or do
```

## Cost Estimation

For 30 videos averaging 3K tokens per transcript:

**Claude API** (with Max subscription):
- Input: ~90K tokens (reading transcripts)
- Output: ~3K tokens (summaries)
- Cost: Covered by subscription credits

**Total**: $0 with Claude Max subscription

## Performance

- **Single day**: ~3-5 seconds
- **All 30 days**: ~2-3 minutes
- Sequential processing to avoid API rate limits

## Workflow

### Recommended Process

1. **Generate transcripts first**:
   ```bash
   npm run generate-transcripts
   ```

2. **Wait for completion** (15-90 minutes depending on caching)

3. **Generate summaries**:
   ```bash
   npm run generate-summaries
   ```

4. **Review output** in `content/sprint/day-XX.md` files

### Future Video Updates

When videos change:

1. Regenerate transcripts for updated videos:
   ```bash
   npm run generate-transcripts -- --day=5
   ```

2. Regenerate summary for that day:
   ```bash
   npm run generate-summaries -- --day=5
   ```

3. Changes are automatically applied to sprint content

## Troubleshooting

### Script reports "Transcript not found"
- Run `npm run generate-transcripts` first
- Check `content/sprint/transcripts/` directory exists
- Verify transcript files are named `day-01.md` through `day-30.md`

### Summary exceeds 100 words
- Script will warn but still apply the summary
- Claude API usually respects the limit
- If persistent, adjust prompt or max_tokens parameter

### API quota exceeded
- Check usage at https://console.anthropic.com/
- Summaries use minimal tokens (< 100 tokens per summary)
- With Max subscription, limits are generous

### Updated summaries not appearing
- Check file permissions on `content/sprint/day-XX.md`
- Verify frontmatter is valid YAML
- Ensure video embed line `{{video:...}}` exists

## Examples

### Before Summary Generation

```markdown
---
day: 1
title: Understanding Your Baseline
video: 9ae33582-29f9-4afc-9786-64c969eaa112
---

# Understanding Your Baseline

If your baseline doesn't change… nothing does.

{{video:9ae33582-29f9-4afc-9786-64c969eaa112}}

This is the starting point. We unpack why your life always drifts back to your emotional frequency — unless you reset the signal. You'll learn the power of consistency, the science of identity, and why doing the thing your ego resists is exactly how you change your life.
```

### After Summary Generation

```markdown
---
day: 1
title: Understanding Your Baseline
video: 9ae33582-29f9-4afc-9786-64c969eaa112
---

# Understanding Your Baseline

If your baseline doesn't change… nothing does.

{{video:9ae33582-29f9-4afc-9786-64c969eaa112}}

Discover how to break free from your default emotional patterns by understanding your baseline. You'll learn why life keeps returning to your set point and how consistency shapes identity. By capturing three stress moments today and reflecting on your diamond self, you'll begin the transformation from reactive to responsive living. This foundational awareness is the first step in upgrading how you handle pressure and stress.
```

## Integration with Transcript Generation

This script is designed to work as part 2 of a two-step process:

**Step 1**: Generate transcripts
```bash
npm run generate-transcripts
```
- Downloads videos from Bunny Stream
- Extracts audio with ffmpeg
- Transcribes with OpenAI Whisper
- Formats with Claude for readability
- Saves to `content/sprint/transcripts/`

**Step 2**: Generate summaries
```bash
npm run generate-summaries
```
- Reads formatted transcripts
- Generates concise summaries with Claude
- Updates sprint day files automatically

Both steps are repeatable when videos change, ensuring content stays synchronized.
