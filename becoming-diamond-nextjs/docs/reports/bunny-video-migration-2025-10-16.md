# Bunny Stream Video Migration Report

**Date**: 2025-10-16
**Library**: 512164
**Status**: ⚠️ CRITICAL - Videos Need Re-Encoding

## Executive Summary

**28 videos found in new Bunny library**, but ALL have **"Failed" encoding status**. Video IDs have been updated in sprint markdown files (Days 1-22), but videos cannot play until re-encoded in Bunny dashboard.

## Video Inventory

| Day | Video ID | Title | Status | Duration |
|-----|----------|-------|--------|----------|
| 1 | `4a151e6b-7911-41b9-b1ef-c6fa00bafaa5` | Day 1 Welcome and Baseline | ❌ Failed | 5:54 |
| 2 | `daf70a49-4110-4f52-a2de-7f273a8475c1` | Day 2 Swiss Army Knife Stand Strong Be Strong | ❌ Failed | 4:03 |
| 3 | `a2aea625-4738-46f2-b341-46ca7f7dc060` | Day 3 Swiss Army Knife Breath | ❌ Failed | 3:37 |
| 4 | `c5a735ac-9c1e-45d0-a19c-80028e59da35` | Day 4 Swiss Army Knife The Brain | ❌ Failed | 3:30 |
| 5 | `df89060d-213c-431e-8d77-90b0d756e275` | Day 5 Pattern Interupts | ❌ Failed | 3:38 |
| 6 | `83af77c8-a9dd-4519-8ef3-0ac4b5734e7b` | Day 6 Grounding in The Present Moment | ❌ Failed | 4:29 |
| 7 | `df982ffb-df9a-4755-9fe2-366594e0e2b8` | Day 7 Congratulations | ❌ Failed | 2:10 |
| 8 | `bb119231-068b-485a-9104-1a7603e4d8f5` | Day 8 Introduction to The Boss | ❌ Failed | 2:47 |
| 9 | `0e8b5da3-4312-466e-b500-5fe34dab888f` | Day 9 Identity Awareness | ❌ Failed | 3:34 |
| 10 | `d33ba1bf-d0d3-4e02-bb51-a29d46bfc9f2` | Day 10 ART Accept Release Transform | ❌ Failed | 3:36 |
| 11 | `ed4d0b12-2a21-4d41-b102-6c3ac51ad19c` | Day 11 Triggers Are Teachers | ❌ Failed | 2:08 |
| 12 | `fe8c2939-7e6c-4863-8538-d98ec5d9fdc0` | Day 12 Break The Default Loop | ❌ Failed | 1:53 |
| 13 | `ecf0a25a-8df9-42e7-b62a-82118b555406` | Day 13 Run Your Breath, Run Your Life | ❌ Failed | 2:40 |
| 14 | `2fa0592e-cc84-489f-818a-1897ebcbb5aa` | Day 14 Discipline Plus Consistency | ❌ Failed | 1:54 |
| 15 | `ff25ddf2-0576-417d-a861-985f548fa788` | Day 15 The Pressure Room | ❌ Failed | 1:47 |
| 16 | `78607971-138c-4f4e-85f9-072833822fe1` | Day 16 ART Squared | ❌ Failed | 2:15 |
| 17 | `332ea0f7-36f8-4a54-b8fb-7286a9498019` | Day 17 Leading the Field | ❌ Failed | 5:15 |
| 18 | `19706b3e-6a5f-44aa-b473-7fe7d18d7e79` | Day 18 Calmness is the New Currency | ❌ Failed | 1:24 |
| 19 | `f19e972a-04d6-46bd-9fa3-40a72e8938f6` | Day 19 Rewire Through Presence | ❌ Failed | 3:22 |
| 20 | `649a2a38-db81-4912-94da-c70c6bc1e709` | Day 20 Upgrade Your Capacity | ❌ Failed | 2:04 |
| 21 | `411a4444-0be6-48c0-9f71-825858bf247d` | Day 21 Week Three Strengthen Summation | ❌ Failed | 3:39 |
| 22 | `49903bed-23fd-4f88-89b2-ab258e98f77a` | Day 22 Week Four Shine Proximity Prime | ❌ Failed | 3:42 |

**Additional Videos** (not mapped to days):
- Book Reading Part 1 (`d3df494a-a1e7-4969-9408-496d04a925b5`)
- Book Reading Part 2 (`939a33ed-7e4d-4753-a0c5-07704bfc3944`)

**Duplicate Day 15**:
- `ff25ddf2-0576-417d-a861-985f548fa788` (The Pressure Room)
- `99e9b581-c127-4b49-bfa6-dd64a7b9293f` (Welcome to the Pressure Room)

**Duplicate Day 17**:
- `332ea0f7-36f8-4a54-b8fb-7286a9498019` (Leading the Field)
- `7d6cd4c5-a143-4dfd-bd3a-4f7b49aae034` (Lead the Field)

**Duplicate Day 19**:
- `f19e972a-04d6-46bd-9fa3-40a72e8938f6` (Rewire Through Presence)
- `d5f9bab1-8b51-48d9-acac-784fed408630` (Calm through Breath)

**Duplicate Day 20**:
- `649a2a38-db81-4912-94da-c70c6bc1e709` (Upgrade Your Capacity)
- `2d0ec262-fe3e-4dc9-8f28-7b138d175aec` (Upgrade your Capacity)

## Missing Days

**Days 23-30**: No videos found in library
- Day 23: ❌ Missing
- Day 24: ❌ Missing
- Day 25: ❌ Missing
- Day 26: ❌ Missing
- Day 27: ❌ Missing
- Day 28: ❌ Missing
- Day 29: ❌ Missing
- Day 30: ❌ Missing

## What Happened

### Previous Library (504876)
- Had 7 videos with IDs embedded in Days 1-7
- Videos were working with encoding status "Finished"

### New Library (512164)
- 28 videos uploaded
- **ALL videos have "Failed" encoding status**
- Videos cannot play until re-encoded

### Root Cause

Bunny Stream encoding failed for all uploaded videos. Possible reasons:
1. **Unsupported format**: Videos may be in a format Bunny cannot process
2. **Corrupted uploads**: Upload may have been interrupted
3. **Codec issues**: Video codec may not be compatible
4. **Library configuration**: New library settings may need adjustment

## Actions Taken

### 1. Integrated ContentRenderer into SlideContent.tsx ✅

**Fixed video rendering infrastructure**:
- Updated `src/components/course/SlideContent.tsx:6` - Added ContentRenderer import
- Updated `src/components/course/SlideContent.tsx:70-91` - Replaced `dangerouslySetInnerHTML` with `<ContentRenderer>`
- Videos now hydrate properly in sprint slides

**Impact**: Videos embedded with `{{video:ID}}` syntax automatically render as interactive players in sprint slides.

### 1a. Fixed Test Auth Support for Video Token API ✅

**Problem**: Video token API required NextAuth session, blocking test auth users

**Fixed authentication check**:
- Updated `src/app/api/video/[videoId]/token/route.ts:13-19` - Added test auth header support
- Updated `src/components/VideoPlayer.tsx:26-35` - Send x-test-auth header when localStorage auth detected

**Impact**: Videos now work in development with test auth, enabling testing without full OAuth setup.

### 2. Updated Video IDs ✅

Automated script updated all sprint markdown files with new video IDs:

```bash
node scripts/update-all-video-ids.js
```

**Results**:
- Days 1-22: Video IDs updated
- Days 23-30: No videos available

### 3. Created Utility Scripts ✅

**`scripts/list-bunny-videos.js`**:
- Queries Bunny API for video inventory
- Orders by day number
- Shows encoding status
- Validates against embedded IDs

**`scripts/update-all-video-ids.js`**:
- Bulk updates video IDs in markdown
- Maps Bunny videos to sprint days
- Handles missing videos gracefully

## Critical Action Required

### IMMEDIATE: Re-Encode All Videos in Bunny Dashboard

**Steps**:

1. **Login to Bunny Stream**:
   - Go to: https://dash.bunny.net/stream/512164
   - Navigate to Video Library

2. **Identify Failed Videos**:
   - Filter by Status: "Failed"
   - Should show all 28 videos

3. **Re-Encode Options**:

   **Option A: Retry Encoding** (Recommended)
   - Select all failed videos
   - Click "Re-encode" or "Retry"
   - Wait for processing (may take 30-60 minutes)

   **Option B: Re-Upload**
   - Delete failed videos
   - Re-upload source files
   - Use same filenames for consistency
   - Wait for auto-encoding

   **Option C: Check Source Files**
   - Download original videos
   - Verify format (MP4 H.264 recommended)
   - Convert if needed using:
     ```bash
     ffmpeg -i input.mov -c:v libx264 -c:a aac -movflags +faststart output.mp4
     ```
   - Re-upload converted files

4. **Monitor Encoding Status**:
   ```bash
   # Run periodically to check status
   node scripts/list-bunny-videos.js | grep Status
   ```

5. **Verify Playback**:
   - Once status = "Finished"
   - Test video playback in dev environment
   - Check Day 1: http://localhost:3000/app/sprint/1

## Video Format Recommendations

**Optimal Format for Bunny Stream**:
```
Container: MP4
Video Codec: H.264 (AVC)
Audio Codec: AAC
Resolution: 1080p (1920x1080) or 720p (1280x720)
Frame Rate: 24fps, 30fps, or 60fps
Bitrate: 4-8 Mbps for 1080p
```

**Current Videos**:
- Format: `.mov` (QuickTime)
- Resolution: 1080x1920 (vertical/portrait)
- May need transcoding to H.264 MP4

### Convert Videos (if needed):

```bash
# Convert all .mov files to H.264 MP4
for file in *.mov; do
  ffmpeg -i "$file" \
    -c:v libx264 \
    -preset medium \
    -crf 23 \
    -c:a aac \
    -b:a 128k \
    -movflags +faststart \
    "${file%.mov}.mp4"
done
```

## Testing Checklist

### Before Re-Encoding
- [✅] Video IDs updated in markdown files
- [✅] Environment variables configured
- [✅] API authentication working (NextAuth + test auth)
- [✅] ContentRenderer integrated into SlideContent.tsx
- [✅] Video token API working with test auth
- [✅] VideoPlayer component renders in sprint slides
- [❌] Videos cannot play (Bunny encoding failed)

### After Re-Encoding
- [ ] Check encoding status = "Finished"
- [ ] Test Day 1 video playback
- [ ] Test HLS streaming (Chrome/Firefox/Safari)
- [ ] Test mobile playback (iOS/Android)
- [ ] Verify token generation working
- [ ] Check video player controls
- [ ] Test autoplay behavior
- [ ] Verify progress tracking

### Integration Test

```bash
# 1. Start dev server
npm run dev

# 2. Navigate to Day 1
open http://localhost:3000/app/sprint/1

# 3. Check browser console for:
# - Token API call succeeds
# - HLS stream URL generated
# - Video player initializes
# - Playback starts

# 4. Verify in DevTools Network tab:
# - /api/video/4a151e6b-7911-41b9-b1ef-c6fa00bafaa5/token → 200 OK
# - playlist.m3u8 → 200 OK
# - Video segments (.ts files) → 200 OK
```

## Rollback Plan

If new library continues to fail:

1. **Revert to old library**:
   ```bash
   # In .env.local
   BUNNY_STREAM_LIBRARY_ID=504876
   BUNNY_STREAM_API_KEY=869a201d-3d97-4966-aee9f8306997-8cf2-497d
   BUNNY_STREAM_CDN_HOSTNAME=vz-d03ef62e-af2.b-cdn.net
   ```

2. **Restore old video IDs**:
   - Revert markdown files via git:
     ```bash
     git checkout HEAD -- content/sprint/day-0*.md
     ```

3. **Test old library**:
   ```bash
   npm run dev
   # Verify Days 1-7 still work
   ```

## Next Steps

### Priority 1: Fix Encoding
- [ ] Re-encode all 28 videos in Bunny dashboard
- [ ] Monitor encoding progress
- [ ] Verify status changes to "Finished"

### Priority 2: Complete Coverage
- [ ] Upload/create videos for Days 23-30
- [ ] Update markdown with new video IDs
- [ ] Test all 30 days

### Priority 3: Production Deployment
- [ ] Update Vercel environment variables
- [ ] Deploy with new video IDs
- [ ] Test in production
- [ ] Monitor playback errors

### Priority 4: Cleanup
- [ ] Resolve duplicate videos (Days 15, 17, 19, 20)
- [ ] Deactivate old library (504876)
- [ ] Revoke old API key
- [ ] Update documentation

## Technical Details

### API Endpoint Used
```
GET https://video.bunnycdn.com/library/512164/videos
Headers:
  AccessKey: 26deeb0e-ad7b-4983-bd206a2ae3b7-0b0a-4334
  Content-Type: application/json
```

### Response Format
```json
{
  "items": [
    {
      "guid": "4a151e6b-7911-41b9-b1ef-c6fa00bafaa5",
      "title": "Day 1 Welcome and Baseline.mov",
      "status": 4,  // 4 = Failed
      "length": 354,
      "dateUploaded": "2025-10-15T...",
      "width": 1080,
      "height": 1920
    }
  ],
  "totalItems": 28,
  "currentPage": 1
}
```

### Encoding Status Codes
- `0` = Queued
- `1` = Processing
- `2` = Encoding
- `3` = Finished ✅
- `4` = Failed ❌
- `5` = Cancelled

## Support Resources

**Bunny Stream Dashboard**: https://dash.bunny.net/stream/512164
**Bunny Documentation**: https://docs.bunny.net/docs/stream
**Support**: https://support.bunny.net

---

**Status**: ⚠️ BLOCKED - Waiting for video re-encoding
**Next Action**: Re-encode videos in Bunny dashboard
**ETA**: 30-60 minutes after re-encoding initiated
**Updated**: 2025-10-16
