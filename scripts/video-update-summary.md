# Sprint Video Update - Completion Summary

**Date**: December 24, 2025
**Task**: Replace all 30 sprint videos with new series from Bunny.net

## What Was Accomplished

### ✅ Video GUIDs Updated
All 30 sprint markdown files updated with new video GUIDs:
- OLD series: October 2025 uploads
- NEW series: November/December 2025 uploads

### ✅ Titles Standardized
All frontmatter titles updated to match new video content:
- Extracted clean titles from Bunny video names
- Removed quotes for YAML consistency
- Special formatting for "Blade" trilogy (Days 2-4)

### ✅ Formatting Cleaned
- Removed all quotes from `video:` fields
- Removed all quotes from `title:` fields
- Consistent YAML formatting across all 30 files

### ✅ Special Cases Handled
**Blade Trilogy** (Days 2-4):
- Day 2: "The First Blade: The Body Check"
- Day 3: "The Second Blade: Breathe Before You Break"
- Day 4: "The Third Blade: Run The Brain"

**Intro Video** (Not in sprint):
- GUID: `6dd787f9-b725-46c8-9b45-b422ac17a3ee`
- Title: "Welcome To Diamond Sprint"
- Use separately as orientation content

## Files Modified

**Sprint Markdown**: `content/sprint/day-01.md` through `day-30.md` (30 files)

**Changes per file** (2 occurrences):
1. Frontmatter `video:` field
2. Markdown `{{video:...}}` shortcode

**Additional updates**:
- Frontmatter `title:` field
- H1 `#` header

## Data Artifacts

### Kept for Reference

**Scripts** (3 reusable):
- `fetch-videos.sh` - Fetch video data from API
- `show-current-videos.sh` - Display current configuration
- `analyze-all-videos.sh` - Analyze complete video inventory

**Data Files** (3 reference):
- `video-replacement-mapping.csv` - Complete OLD→NEW mapping (30 rows)
- `video-structure-analysis.md` - Bunny library documentation
- `VIDEO_SCRIPTS.md` - Usage guide for remaining scripts

### Deleted (Cleanup)

**One-time scripts** (12 deleted):
- Bulk update tools (videos, titles)
- Verification tools
- Mapping generators
- Quote cleanup scripts
- Blade title standardization

**Guides** (1 deleted):
- BULK_UPDATE_GUIDE.md (task complete)

**Filters** (1 deleted):
- extract-day-from-title.jq (no longer needed)

## Video Library Structure (Bunny.net)

**Total**: 65 videos

**NEW Sprint Series** (30 videos):
- Day 1: Nov 30, 2025
- Days 2-30: Nov/Dec 2025
- Consistent with current markdown files

**OLD Sprint Series** (30 videos):
- Days 1-30: October 2025
- Replaced but kept in Bunny for reference

**Intro Video** (1 video):
- "Welcome To Diamond Sprint"
- Separate from 30-day sprint

**Supplementary** (4 videos):
- Book Reading Part 1 & 2
- Welcome to Becoming Diamond
- Interrupt Your Patterns

## Future Maintenance

### Adding New Videos
```bash
# Check what's available
./scripts/fetch-videos.sh | jq -r '.videos[].title' | sort

# See current configuration
./scripts/show-current-videos.sh

# Manually update specific day
vim content/sprint/day-XX.md
# Update both: frontmatter video field + {{video:...}} shortcode
```

### Verifying Configuration
```bash
# List all current video GUIDs
grep "^video:" content/sprint/*.md

# Compare with Bunny inventory
./scripts/analyze-all-videos.sh
```

### Updating Auth Token
When session expires, update `fetch-videos.sh`:
1. Login to http://localhost:3003/app
2. DevTools → Application → Cookies
3. Copy `authjs.session-token`
4. Update `-b` parameter in script

## Key Learnings

1. **Video Naming Inconsistency**: Bunny videos used various patterns ("Day One", "Day 1", "Day 1:", etc.)
2. **Quote Inconsistency**: Original markdown had mixed quoting in frontmatter
3. **Title Extraction**: Automated cleanup worked well with manual override for special cases
4. **Intro Video**: "Welcome To Diamond Sprint" is separate orientation, not Day 1

## Verification Commands

```bash
# Show all current titles
grep "^title:" content/sprint/*.md

# Show all current video GUIDs
grep "^video:" content/sprint/*.md

# View historical mapping
cat scripts/video-replacement-mapping.csv | column -t -s,

# Check Bunny inventory
./scripts/analyze-all-videos.sh
```

All 30 sprint videos successfully updated with new series. Scripts cleaned up, only reusable utilities remain.
