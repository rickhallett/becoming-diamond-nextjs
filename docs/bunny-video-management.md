# Bunny Stream Video Management

This guide covers programmatic management of your Bunny Stream video library.

## Overview

The Bunny Stream API allows you to:
- List all videos with pagination
- Update video metadata (title, collectionId, metaTags)
- Manage collections
- Bulk update video titles with standardized formats

## API Endpoints

### Base URL
```
https://video.bunnycdn.com
```

### Authentication
All requests require the `AccessKey` header with your Bunny Stream API key:

```typescript
headers: {
  'AccessKey': process.env.BUNNY_STREAM_API_KEY,
  'Content-Type': 'application/json'
}
```

### List Videos
```
GET /library/{libraryId}/videos?page=1&itemsPerPage=100
```

**Response:**
```json
{
  "items": [
    {
      "guid": "video-id",
      "title": "Video Title",
      "dateUploaded": "2025-12-24T10:30:00Z",
      "length": 1234,
      "status": 4,
      "views": 100,
      "collectionId": "collection-id"
    }
  ],
  "currentPage": 1,
  "totalItems": 30,
  "totalPages": 1
}
```

### Update Video
```
POST /library/{libraryId}/videos/{videoId}
```

**Body:**
```json
{
  "title": "New Title",
  "collectionId": "collection-guid",
  "metaTags": [
    { "property": "description", "value": "Video description" },
    { "property": "version", "value": "1.0" }
  ]
}
```

## Video Title Standardization Script

### Features

The `standardize-video-titles.ts` script provides:

✅ **Dry-run mode** - Preview changes before applying
✅ **Multiple format options** - Date-based, sequential, or simple
✅ **Version management** - Append version numbers to titles
✅ **Batch processing** - Handle entire video library
✅ **Error handling** - Detailed logging and error reporting
✅ **Rate limiting** - Prevents API throttling

### Usage

#### Preview Changes (Dry Run)
```bash
npm run standardize-videos -- --dry-run
```

#### Apply Changes (Live Mode)
```bash
npm run standardize-videos
```

#### Custom Format Options

**Date-based format** (default):
```bash
npm run standardize-videos -- --format=date --version=1.0
# Output: 2025-12-24 - Original Title - v1.0
```

**Sequential format** (for numbered series):
```bash
npm run standardize-videos -- --format=sequential --version=2.0
# Output: Day 01 - Original Title - v2.0
```

**Simple format** (version only):
```bash
npm run standardize-videos -- --format=simple --version=1.5
# Output: Original Title - v1.5
```

### Title Format Details

The script intelligently processes existing titles:

1. **Removes existing date prefixes**: `2025-12-24 - Title` → `Title`
2. **Removes existing version suffixes**: `Title - v1.0` → `Title`
3. **Preserves day numbers**: Extracts and formats "Day 01", "Day 1", etc.
4. **Applies new format**: Adds date, version, or both based on selected format

### Output Example

```
╔════════════════════════════════════════════════════════════╗
║         Bunny Stream Video Title Standardization          ║
╚════════════════════════════════════════════════════════════╝

📹 Fetching videos from Bunny Stream...

   Fetched page 1/1 (30 videos)

✅ Total videos fetched: 30

🔄 UPDATING video titles...

Format: date, Version: 1.0

────────────────────────────────────────────────────────────────
📝 Introduction to Becoming Diamond
   → 2025-12-01 - Introduction to Becoming Diamond - v1.0
   ✅ Updated

📝 Day 1: Foundation
   → 2025-12-02 - Day 1: Foundation - v1.0
   ✅ Updated

⏭️  SKIP: 2025-12-03 - Day 2: Growth - v1.0

────────────────────────────────────────────────────────────────

📊 SUMMARY

Total videos processed: 30
✅ Successful: 28
❌ Failed: 2

Failed videos:
  • Old Video Title
    Error: Update failed: 404 Not Found
```

### Script Behavior

**Dry Run Mode** (`--dry-run`):
- Fetches all videos from Bunny Stream
- Displays proposed title changes
- No actual updates are made
- Perfect for previewing changes

**Live Mode** (no `--dry-run`):
- Prompts for confirmation before proceeding
- Updates videos one at a time with rate limiting (100ms delay)
- Displays real-time progress
- Shows detailed error messages if updates fail

### Environment Variables Required

Ensure these are set in your `.env.local`:

```bash
BUNNY_STREAM_LIBRARY_ID=512164
BUNNY_STREAM_API_KEY=your_api_key_here
```

### Error Handling

The script handles:
- Missing environment variables
- API rate limiting
- Network errors
- Invalid video IDs
- Authentication failures

All errors are logged with detailed messages for troubleshooting.

### Advanced Customization

To create custom title formats, modify the `generateStandardizedTitle()` function in `scripts/standardize-video-titles.ts`:

```typescript
function generateStandardizedTitle(video: BunnyVideo, format: string, version: string): string {
  const uploadDate = new Date(video.dateUploaded);
  const dateStr = uploadDate.toISOString().split('T')[0];

  // Add your custom format logic here
  switch (format) {
    case 'custom':
      return `[${dateStr}] ${video.title} (v${version})`;
    // ... other formats
  }
}
```

## Collection Management

### List Collections
```bash
curl -X GET "https://video.bunnycdn.com/library/${LIBRARY_ID}/collections" \
  -H "AccessKey: ${API_KEY}"
```

### Create Collection
```bash
curl -X POST "https://video.bunnycdn.com/library/${LIBRARY_ID}/collections" \
  -H "AccessKey: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"name": "Sprint Videos"}'
```

### Update Collection
```bash
curl -X POST "https://video.bunnycdn.com/library/${LIBRARY_ID}/collections/${COLLECTION_ID}" \
  -H "AccessKey: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"name": "New Collection Name"}'
```

### Assign Video to Collection
```bash
curl -X POST "https://video.bunnycdn.com/library/${LIBRARY_ID}/videos/${VIDEO_ID}" \
  -H "AccessKey: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"collectionId": "collection-guid"}'
```

## Best Practices

1. **Always use dry-run first** - Preview changes before applying them
2. **Backup video metadata** - Export current titles before bulk updates
3. **Use semantic versioning** - Increment versions logically (1.0, 1.1, 2.0)
4. **Organize with collections** - Group related videos for easier management
5. **Rate limit API calls** - The script includes 100ms delays between updates
6. **Monitor API responses** - Check for errors and retry failed updates

## Troubleshooting

### "Bunny API error: 401 Unauthorized"
- Verify `BUNNY_STREAM_API_KEY` is correct
- Check that the API key hasn't expired

### "Bunny API error: 404 Not Found"
- Verify `BUNNY_STREAM_LIBRARY_ID` is correct
- Check that the video GUID exists in your library

### "Rate limit exceeded"
- The script includes delays, but you can increase them in the code
- Reduce batch size or run updates in smaller groups

### Videos not updating
- Ensure you're not in dry-run mode
- Check that the video status allows updates (status: 4 = ready)
- Verify network connectivity

## API Rate Limits

Bunny Stream API has rate limits:
- **Recommended**: 100ms delay between requests (built into script)
- **Maximum**: 10 requests per second per library
- **Burst**: Up to 100 requests in short bursts

## References

- [Bunny Stream API Overview](https://docs.bunny.net/reference/stream-api-overview)
- [Update Video Endpoint](https://docs.bunny.net/reference/video_updatevideo)
- [Upload Videos via API](https://docs.bunny.net/docs/stream-uploading-videos-through-our-http-api)
- [Collection Management](https://docs.bunny.net/reference/collection_updatecollection)
