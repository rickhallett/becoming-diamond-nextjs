# Video Management Scripts

Reusable utilities for managing Bunny.net videos and sprint content.

## Available Scripts

### 1. Fetch Videos from API
```bash
./scripts/fetch-videos.sh | jq '.'
```
Returns raw JSON from `/api/videos` endpoint with authentication.

**Common queries:**
```bash
# Save to file for faster iteration
./scripts/fetch-videos.sh > /tmp/videos.json

# Search for specific title
jq '.videos[] | select(.title | contains("Day 15"))' /tmp/videos.json

# Filter by collection
jq '.videos[] | select(.collectionId == "collection-guid-here")' /tmp/videos.json

# Sort by upload date
jq '.videos | sort_by(.dateUploaded)' /tmp/videos.json

# Get all titles
jq -r '.videos[].title' /tmp/videos.json | sort
```

### 2. Show Current Video Mappings
```bash
./scripts/show-current-videos.sh
```
Displays what videos are currently configured in sprint markdown files.

**Output format:**
```
Day 01: {guid}  # {title}
Day 02: {guid}  # {title}
...
```

### 3. Analyze All Videos
```bash
./scripts/analyze-all-videos.sh
```
Shows complete video inventory grouped by upload month with summary statistics.

**Use cases:**
- Understanding video library structure
- Identifying when new videos were uploaded
- Finding videos that don't match sprint naming patterns

## Data Files

### video-replacement-mapping.csv
Historical record of OLD→NEW GUID mapping from the 2025 sprint video update.

**Format:**
```csv
day,old_guid,new_guid,old_title,new_title
1,old-guid-here,new-guid-here,Old Title,New Title
```

**Usage:**
```bash
# View as table
cat scripts/video-replacement-mapping.csv | column -t -s,

# Extract specific day
grep "^5," scripts/video-replacement-mapping.csv
```

### video-structure-analysis.md
Documentation of complete Bunny video library structure including:
- NEW sprint series (30 videos, Nov/Dec 2025)
- OLD sprint series (30 videos, Oct 2025)
- Intro video ("Welcome To Diamond Sprint")
- Supplementary content (Book Reading, etc.)

## Common Workflows

### Check What's Currently Deployed
```bash
# See all current video GUIDs and titles
./scripts/show-current-videos.sh

# Compare with available videos in Bunny
./scripts/fetch-videos.sh | jq -r '.videos[] | "\(.guid) | \(.title)"' | sort
```

### Find Videos by Pattern
```bash
# Save API response
./scripts/fetch-videos.sh > /tmp/videos.json

# Videos with "Breath" in title
jq '.videos[] | select(.title | test("breath"; "i"))' /tmp/videos.json

# Latest 5 uploads
jq '.videos | sort_by(.dateUploaded) | reverse | .[0:5]' /tmp/videos.json

# Videos uploaded in December 2025
jq '.videos[] | select(.dateUploaded | startswith("2025-12"))' /tmp/videos.json
```

### Export for Spreadsheet
```bash
# CSV format
./scripts/fetch-videos.sh | jq -r '.videos[] | [.title, .guid, .dateUploaded] | @csv' > videos.csv
```

### Update Session Cookie
When your auth session expires, update the cookie in `fetch-videos.sh`:

1. Login to http://localhost:3003/app
2. Open DevTools → Application → Cookies
3. Copy `authjs.session-token` value
4. Update the `-b` parameter in `fetch-videos.sh`

## Quick Reference

| Task | Command |
|------|---------|
| Fetch all videos | `./scripts/fetch-videos.sh` |
| Show current config | `./scripts/show-current-videos.sh` |
| Analyze inventory | `./scripts/analyze-all-videos.sh` |
| View mapping history | `cat scripts/video-replacement-mapping.csv \| column -t -s,` |

## Notes

- All scripts are standalone and reusable
- Auth token in `fetch-videos.sh` requires valid session
- Scripts assume `content/sprint/day-XX.md` naming convention
- Video GUIDs in markdown frontmatter should not have quotes
