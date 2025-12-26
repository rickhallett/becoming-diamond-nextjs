# Video Metadata Backup & Restore Guide

## Overview

Before making bulk changes to your Bunny Stream video library, always create a backup snapshot. This allows you to restore the original metadata if something goes wrong.

## Quick Start

### 1. Create Backup (Before Making Changes)

```bash
npm run backup-videos
```

This creates a timestamped JSON file in `backups/` directory containing all video metadata.

### 2. Make Your Changes

```bash
npm run version-sprint-videos -- --apply
```

### 3. Restore If Needed

```bash
# Preview restore (dry run)
npm run restore-videos -- --backup=backups/video-metadata-backup-2025-12-24T19-19-03.json

# Apply restore
npm run restore-videos -- --backup=backups/video-metadata-backup-2025-12-24T19-19-03.json --apply
```

## Backup Script Details

### What Gets Backed Up

The backup script saves **complete metadata** for all videos:

✅ **Core Fields:**
- `guid` - Unique video identifier
- `title` - Current video title
- `dateUploaded` - Upload timestamp
- `length` - Video duration
- `status` - Processing status
- `views` - View count

✅ **Additional Fields:**
- `thumbnailFileName`
- `collectionId`
- `width`, `height`
- `availableResolutions`
- All other metadata from Bunny API

### Backup File Format

```json
{
  "backupDate": "2025-12-24T19:19:03.402Z",
  "backupTimestamp": 1735068543402,
  "libraryId": "512164",
  "totalVideos": 61,
  "videos": [
    {
      "guid": "cbcb782f-0f85-40d5-8c64-f83c8c5b3cd3",
      "title": "Day 30 Congratulations 30 Day Diamond Sprint",
      "dateUploaded": "2025-12-21T17:30:14.989",
      "length": 187,
      "status": 4,
      "views": 0,
      ...
    }
  ]
}
```

### Backup Output Example

```
╔════════════════════════════════════════════════════════════╗
║           Bunny Stream Video Metadata Backup              ║
╚════════════════════════════════════════════════════════════╝

Output file: backups/video-metadata-backup-2025-12-24T19-19-03.json

Fetching videos from Bunny Stream...

   Fetched page 1/1 (61 videos)

✅ Total videos fetched: 61

BACKUP SUMMARY

────────────────────────────────────────────────────────────
Total videos: 61
  Sprint videos (Day X): 54
  Other videos: 7

Collections: 0

Video statuses:
  Ready: 61

────────────────────────────────────────────────────────────
✅ Backup saved to: backups/video-metadata-backup-2025-12-24T19-19-03.json
   Total videos: 61
   File size: 66.67 KB

✅ Backup completed successfully
```

### Custom Backup Filename

```bash
npm run backup-videos -- --output=my-backup.json
```

## Restore Script Details

### How Restore Works

1. **Loads backup file** - Reads JSON metadata
2. **Fetches current state** - Gets current video data from Bunny API
3. **Compares titles** - Identifies what changed
4. **Shows restore plan** - Displays what will be restored
5. **Applies changes** - Updates video titles via API

### Restore Modes

#### Dry Run (Preview)

```bash
npm run restore-videos -- --backup=backups/video-metadata-backup-2025-12-24.json
```

Shows what **would** be restored without making changes.

#### Live Restore

```bash
npm run restore-videos -- --backup=backups/video-metadata-backup-2025-12-24.json --apply
```

Actually restores video titles from the backup.

### Restore Output Example

```
╔════════════════════════════════════════════════════════════╗
║         Bunny Stream Video Metadata Restore               ║
╚════════════════════════════════════════════════════════════╝

Backup file: backups/video-metadata-backup-2025-12-24.json

Loading backup file...

✅ Backup loaded successfully
   Backup date: 12/24/2025, 7:19:03 PM
   Library ID: 512164
   Total videos in backup: 61

Analyzing current state vs backup...

RESTORE PLAN

════════════════════════════════════════════════════════════

Videos needing restore: 54
Videos already correct: 7

CHANGES TO BE RESTORED:

────────────────────────────────────────────────────────────

1. GUID: cbcb782f-0f85-40d5-8c64-f83c8c5b3cd3
   Current:  day-30-congratulations-30-day-diamond-sprint-2025-12-21-v2
   Restore:  Day 30 Congratulations 30 Day Diamond Sprint

2. GUID: bb194ce7-00b2-45c1-a10f-969a630f8625
   Current:  day-03-breath-deep-second-blade-2025-12-03-v2
   Restore:  Day 3: Breath Deep Second Blade

...

════════════════════════════════════════════════════════════

DRY RUN MODE - No changes applied

To apply restore, run:
   npm run restore-videos -- --backup=backups/video-metadata-backup-2025-12-24.json --apply
```

## Safety Features

### Backup Script

✅ **Auto-timestamped filenames** - Never overwrites previous backups
✅ **Creates `backups/` directory** - Automatically if it doesn't exist
✅ **Complete metadata** - Captures all fields from API
✅ **Validation** - Checks environment variables before running
✅ **Summary statistics** - Shows what was backed up

### Restore Script

✅ **Dry-run by default** - Preview before applying
✅ **Confirmation prompt** - Asks "yes/no" before restoring
✅ **Library ID verification** - Ensures backup matches current library
✅ **Handles missing videos** - Skips videos that no longer exist
✅ **Rate limiting** - 100ms delay between API calls
✅ **Detailed logging** - Shows exactly what's being restored

## Best Practices

### 1. Always Backup Before Bulk Operations

```bash
# ALWAYS do this first
npm run backup-videos

# Then make changes
npm run version-sprint-videos -- --apply
```

### 2. Keep Backup Files

Don't delete backup files immediately. Keep them for at least:
- **24 hours** after changes (in case issues appear later)
- **Before major operations** (re-encoding, collection changes, etc.)
- **Before production deployments**

### 3. Name Backups Descriptively (Optional)

```bash
# Before versioning operation
npm run backup-videos -- --output=backups/before-versioning-2025-12-24.json

# Before collection reorganization
npm run backup-videos -- --output=backups/before-collections-2025-12-24.json
```

### 4. Verify Backup Contents

```bash
# Check backup file size (should be 60-100 KB for 61 videos)
ls -lh backups/*.json

# Inspect backup structure
cat backups/video-metadata-backup-2025-12-24.json | jq '.totalVideos'

# View specific video
cat backups/video-metadata-backup-2025-12-24.json | jq '.videos[0]'
```

## Complete Workflow Example

### Safe Video Versioning Workflow

```bash
# Step 1: Create backup
npm run backup-videos
# Output: backups/video-metadata-backup-2025-12-24T19-19-03.json

# Step 2: Preview versioning changes
npm run version-sprint-videos
# Review output carefully

# Step 3: Apply versioning
npm run version-sprint-videos -- --apply
# Confirm with "yes"

# Step 4: Verify results in Bunny Stream dashboard
# Check a few videos manually

# Step 5: If something went wrong, restore
npm run restore-videos -- --backup=backups/video-metadata-backup-2025-12-24T19-19-03.json --apply
```

## Troubleshooting

### "Backup file not found"

```bash
# List available backups
ls -la backups/

# Use full filename with timestamp
npm run restore-videos -- --backup=backups/video-metadata-backup-2025-12-24T19-19-03.json
```

### "Library ID does not match"

The backup was created for a different Bunny Stream library. Verify:
- You're using the correct `.env.local` file
- `BUNNY_STREAM_LIBRARY_ID` matches the backup

### "Video no longer exists"

This is normal if videos were deleted after the backup. The restore script will skip these automatically.

### Partial Restore

If only some videos need restoring:
1. Run restore in dry-run mode
2. Review the restore plan
3. Manually edit the backup JSON to include only specific videos
4. Run restore with the edited backup

## File Management

### Backup Storage

Backups are stored in `backups/` directory:
```
backups/
├── video-metadata-backup-2025-12-24T19-19-03.json
├── video-metadata-backup-2025-12-24T20-45-12.json
└── before-versioning-2025-12-24.json
```

### Cleanup Old Backups

```bash
# List backups by date
ls -lt backups/

# Remove backups older than 30 days
find backups/ -name "*.json" -mtime +30 -delete
```

### Backup to External Storage

```bash
# Copy to external drive
cp backups/*.json /path/to/external/drive/

# Upload to cloud storage (example)
aws s3 cp backups/ s3://my-bucket/bunny-backups/ --recursive
```

## Technical Details

### API Endpoints Used

**Backup:**
- `GET /library/{libraryId}/videos` - Fetch all videos with pagination

**Restore:**
- `GET /library/{libraryId}/videos/{videoId}` - Fetch current video state
- `POST /library/{libraryId}/videos/{videoId}` - Update video title

### Rate Limiting

Both scripts include 100ms delays between API calls to prevent rate limiting (10 requests/second max).

### Error Handling

- Network errors: Script exits with error code 1
- Missing videos: Logged as warnings, restore continues
- API errors: Detailed error messages displayed
- Invalid backup: Validation errors before restore begins

## FAQ

**Q: Does backup include video files?**
A: No, only metadata (titles, IDs, dates, etc.). Video files remain in Bunny Stream.

**Q: Can I restore to a different library?**
A: No, the script validates library ID matches. This prevents accidental cross-library restores.

**Q: What if I delete videos after backup?**
A: Restore script will skip deleted videos and show a warning.

**Q: Can I edit the backup JSON manually?**
A: Yes, but be careful. The JSON structure must remain valid.

**Q: How long does backup/restore take?**
A: ~5-10 seconds for 61 videos (depends on API response time).

**Q: Does this affect video collections?**
A: No, currently only restores titles. Collections are backed up but not restored.

## Next Steps

After creating your backup:

1. ✅ **Backup complete** - Snapshot saved
2. **Preview changes** - Run versioning script in dry-run
3. **Apply changes** - Execute versioning
4. **Verify** - Check results in Bunny dashboard
5. **Keep backup** - Store for at least 24 hours

---

**Remember:** Always create a backup before bulk operations. It takes 10 seconds and could save hours of manual work!
