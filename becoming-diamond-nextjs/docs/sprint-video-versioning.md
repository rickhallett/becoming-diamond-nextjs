# Sprint Video Versioning Guide

## Overview

This document explains how to version your 30-Day Sprint videos using the automated versioning script.

## The Problem

Your Bunny Stream library contains two versions of each sprint day video:
- **Older version (v1)**: The archived/original video
- **Newer version (v2)**: The current/active video used in the sprint

The videos need clear version labels to distinguish which is which.

## The Solution

The `version-sprint-videos.ts` script automatically:
1. Groups videos by day number (Day 01, Day 02, etc.)
2. Sorts each group by upload date
3. Assigns **v1** to the oldest (archived) video
4. Assigns **v2** to the newest (current) video
5. Generates standardized titles: `Original Title - v1` or `Original Title - v2`

## Current State Analysis

Based on your video library:

```
Total sprint videos found: 54
Days covered: 30

Days with 1 video: 6   ← Need attention (missing v2)
Days with 2 videos: 24 ← Perfect! Will get v1 and v2
Days with 3+ videos: 0 ← None

Videos needing updates: 54
Videos already correct: 0
```

### Days with Only One Video

The following days have only **one video** (will be marked as v1):
- Day 01
- Day 02
- Day 11
- Day 12
- Day 22
- Day 24

**Action Required**: Check if these days need a v2 video uploaded.

### Days with Two Videos (Perfect!)

24 days have exactly two videos. Examples:

**Day 03**:
- 📦 v1 (ARCHIVED): `Day 3 Swiss Army Knife Breath.mov` - Uploaded 2025-10-15
- 🎬 v2 (CURRENT): `Day 3: Breath Deep Second Blade` - Uploaded 2025-12-03

**Day 30**:
- 📦 v1 (ARCHIVED): `Day 30 Congratulations Your a Diamond` - Uploaded 2025-10-23
- 🎬 v2 (CURRENT): `Day 30 Congratulations 30 Day Diamond Sprint` - Uploaded 2025-12-21

## Usage

### Step 1: Preview Changes (Dry Run)

```bash
npm run version-sprint-videos
```

This will:
- ✅ Fetch all videos from Bunny Stream
- ✅ Group them by day number
- ✅ Show detailed comparison tables
- ✅ Display summary statistics
- ❌ NOT apply any changes

**Output Example**:
```
🔹 DAY 03 (2 videos)
────────────────────────────────────────────────────────────

   📦 VERSION 1 (ARCHIVED)
   Uploaded: 2025-10-15 02:08:03
   GUID: a2aea625-4738-46f2-b341-46ca7f7dc060
   Current:  Day 3 Swiss Army Knife Breath.mov
   New:      Day 3 Swiss Army Knife Breath.mov - v1
   Status:   ✏️  Will be updated

   🎬 VERSION 2 (CURRENT)
   Uploaded: 2025-12-03 22:13:47
   GUID: bb194ce7-00b2-45c1-a10f-969a630f8625
   Current:  Day 3: Breath Deep Second Blade
   New:      Day 3: Breath Deep Second Blade - v2
   Status:   ✏️  Will be updated
```

### Step 2: Review the Output

Carefully check:
1. **Day grouping**: Are videos correctly grouped by day?
2. **Version assignment**: Is v1 the older video and v2 the newer one?
3. **Title changes**: Do the new titles look correct?
4. **Missing days**: Are there days with only one video that should have two?

### Step 3: Apply Changes (Live Mode)

When you're confident everything is correct:

```bash
npm run version-sprint-videos -- --apply
```

The script will:
1. Show the same preview as dry-run
2. Ask for confirmation: `Apply these changes? (yes/no):`
3. Update each video in Bunny Stream
4. Show real-time progress
5. Display final results

**Output**:
```
📝 Day 03 v1
   Day 3 Swiss Army Knife Breath.mov
   → Day 3 Swiss Army Knife Breath.mov - v1
   ✅ Updated

📝 Day 03 v2
   Day 3: Breath Deep Second Blade
   → Day 3: Breath Deep Second Blade - v2
   ✅ Updated

📊 UPDATE RESULTS

✅ Successfully updated: 54
⏭️  Skipped (no change): 0
```

## How It Works

### Day Number Detection

The script recognizes various day number formats:
- `Day 1`, `Day 01`
- `day 30`, `DAY 15`
- Case-insensitive matching

### Title Cleaning

Before adding version numbers, the script:
1. Removes existing version suffixes: `- v1`, `- v2`, `(v1)`, etc.
2. Preserves the original title content
3. Adds the new version: `- v1` or `- v2`

### Upload Date Sorting

Within each day group:
- Videos are sorted by `dateUploaded` (oldest first)
- First video (oldest) = v1
- Second video (newest) = v2
- Third+ videos = v3, v4, etc. (if present)

## Safety Features

✅ **Dry-run by default**: No changes unless you use `--apply`
✅ **Confirmation prompt**: Asks "yes/no" before applying changes
✅ **Rate limiting**: 100ms delay between API calls to prevent throttling
✅ **Error handling**: Continues processing even if individual updates fail
✅ **Detailed logging**: Shows exactly what's changing and why

## Troubleshooting

### "Days with 1 video"

If a day has only one video, it will be marked as v1 (archived). This might mean:
- The v2 video hasn't been uploaded yet
- The v2 video has a different title format that doesn't match "Day X"
- You intentionally only have one version for that day

**Solution**: Check if these days need v2 videos uploaded.

### "Days with 3+ videos"

If a day has more than 2 videos, all will be versioned (v1, v2, v3, etc.). This might mean:
- Multiple re-uploads or corrections
- Test videos that should be deleted

**Solution**: Review these days and consider deleting unwanted versions.

### Video Not Detected

If a video isn't being grouped:
- Check that the title contains "Day" followed by a number
- Ensure the day number is recognizable: `Day 01`, `Day 1`, etc.
- Case doesn't matter: `day 5` and `DAY 05` both work

## Best Practices

1. **Always dry-run first**: Review the output before applying changes
2. **Check day coverage**: Ensure all 30 days are represented
3. **Verify upload dates**: Confirm v1 is older than v2
4. **Save the output**: Redirect to a file for reference:
   ```bash
   npm run version-sprint-videos > versioning-preview.txt
   ```
5. **Backup before applying**: Consider exporting current video metadata

## Example Workflow

```bash
# Step 1: Preview changes
npm run version-sprint-videos

# Step 2: Save preview for reference
npm run version-sprint-videos > preview.txt

# Step 3: Review the preview.txt file
cat preview.txt

# Step 4: If everything looks good, apply
npm run version-sprint-videos -- --apply

# Step 5: Verify in Bunny Stream dashboard
# Check a few videos manually to confirm titles updated correctly
```

## Next Steps After Versioning

Once videos are versioned, you can:

1. **Update sprint content markdown**: Ensure day-XX.md files reference the correct video GUIDs
2. **Create collections**: Group v1 videos in "Archived" collection, v2 in "Current Sprint"
3. **Set visibility**: Consider making v1 videos unlisted or private
4. **Update documentation**: Reference the new versioning system in your content

## Technical Details

**Script Location**: `scripts/version-sprint-videos.ts`

**Environment Variables Required**:
- `BUNNY_STREAM_LIBRARY_ID`
- `BUNNY_STREAM_API_KEY`

**API Endpoint Used**: `POST /library/{libraryId}/videos/{videoId}`

**Rate Limiting**: 100ms delay between requests (10 requests/second max)

**Logging**: All operations logged to console with emoji indicators:
- 📦 = Archived version (v1)
- 🎬 = Current version (v2)
- ✏️ = Will be updated
- ⏭️ = No change needed
- ✅ = Successfully updated
- ❌ = Update failed
