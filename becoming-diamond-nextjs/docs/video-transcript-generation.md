# Video Transcript Generation

## Overview

Automated transcript generation for all 30-day sprint videos using OpenAI Whisper API (transcription) and Claude API (formatting).

## Prerequisites

### Required Software
- **ffmpeg**: Audio extraction from video files
  ```bash
  # macOS
  brew install ffmpeg

  # Ubuntu/Debian
  sudo apt install ffmpeg

  # Verify installation
  ffmpeg -version
  ```

### Required Environment Variables
Add to `.env.local`:
```bash
# Bunny Stream (already configured)
BUNNY_STREAM_LIBRARY_ID=your_library_id
BUNNY_STREAM_API_KEY=your_api_key
BUNNY_STREAM_CDN_HOSTNAME=your_cdn_hostname

# OpenAI (for Whisper transcription)
OPENAI_API_KEY=sk-...

# Anthropic (for Claude formatting)
ANTHROPIC_API_KEY=sk-ant-...
```

## Usage

### Generate All Transcripts
Process all 30 days:
```bash
npm run generate-transcripts
```

### Generate Single Day
Process a specific day:
```bash
npm run generate-transcripts -- --day=5
```

### Skip Video Download
Use cached videos (faster for re-runs):
```bash
npm run generate-transcripts -- --skip-download
```

## Process Flow

1. **Read Sprint Content**
   - Scans `content/sprint/day-XX.md` files
   - Extracts video ID from frontmatter

2. **Download Video**
   - Generates signed Bunny Stream token
   - Downloads best available quality (1080p → 720p → 480p → 360p)
   - Caches in `tmp/video-cache/`
   - Skips if already cached

3. **Extract Audio**
   - Uses ffmpeg to extract audio track
   - Converts to MP3 format
   - Caches in `tmp/audio-cache/`
   - Skips if already extracted

4. **Transcribe with Whisper**
   - Sends audio to OpenAI Whisper API
   - Model: `whisper-1`
   - Returns timestamped segments
   - Cost: $0.006 per minute of audio

5. **Format with Claude**
   - Enhances raw transcript for readability
   - Adds section headings
   - Fixes punctuation and capitalization
   - Removes excessive filler words
   - Adds emphasis to key concepts
   - Extracts key takeaways
   - Model: `claude-sonnet-4-5-20250929`

6. **Save Markdown**
   - Creates frontmatter with metadata
   - Saves to `content/sprint/transcripts/day-XX.md`

## Output Format

Each transcript is saved as markdown:

```markdown
---
day: 5
title: "Heart Coherence"
videoId: abc123-def456
generatedAt: 2025-12-24T20:45:00.000Z
---

## Introduction

[Formatted transcript content with proper paragraphs, headings, and emphasis]

## Key Concepts

*Heart coherence* is the alignment between...

## Key Takeaways

- Breath work regulates nervous system
- Heart-brain connection affects emotional state
- Practice 5-5-8 breathing for coherence
```

## Cost Estimation

For 30 videos averaging 3 minutes each:

**Whisper API**:
- Rate: $0.006 per minute
- Total audio: ~90 minutes
- Cost: ~$0.54

**Claude API** (with Max subscription):
- Included in subscription credits
- ~4K tokens per transcript
- ~120K tokens total
- Cost: Covered by subscription

**Total**: ~$0.54 for all 30 transcripts

## Directory Structure

```
content/sprint/transcripts/
  ├── day-01.md
  ├── day-02.md
  └── ... (30 total)

tmp/
  ├── video-cache/
  │   ├── day-01.mp4
  │   └── ... (cached videos)
  └── audio-cache/
      ├── day-01.mp3
      └── ... (extracted audio)
```

## Troubleshooting

### ffmpeg not found
```bash
# Install ffmpeg first
brew install ffmpeg  # macOS
sudo apt install ffmpeg  # Linux
```

### OpenAI API quota exceeded
- Check usage at https://platform.openai.com/usage
- Upgrade plan or wait for quota reset

### Video download fails
- Verify Bunny Stream credentials in `.env.local`
- Check video exists in Bunny dashboard
- Ensure video is in "Ready" status

### Transcript formatting issues
- Claude may occasionally miss section breaks
- Re-run for that specific day: `npm run generate-transcripts -- --day=5`
- Manually edit output markdown if needed

## Cache Management

### Clear Video Cache
```bash
rm -rf tmp/video-cache/*
```

### Clear Audio Cache
```bash
rm -rf tmp/audio-cache/*
```

### Clear All Caches
```bash
rm -rf tmp/
```

Note: Clearing caches will require re-downloading/re-processing on next run.

## Performance

- **Single day**: ~2-3 minutes (with download)
- **Single day (cached)**: ~30-45 seconds
- **All 30 days**: ~60-90 minutes (first run)
- **All 30 days (cached)**: ~15-25 minutes

Parallel processing not implemented to avoid API rate limits.

## Future Enhancements

Possible improvements:
- Parallel processing with rate limiting
- Speaker diarization (identify different speakers)
- Timestamp preservation for video sync
- SRT/VTT subtitle generation
- Automatic upload to Bunny Stream as captions
