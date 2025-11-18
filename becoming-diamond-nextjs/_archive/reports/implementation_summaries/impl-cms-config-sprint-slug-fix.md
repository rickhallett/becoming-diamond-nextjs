# Decap CMS Configuration Fix - Sprint Collection and Git Repository Structure

**Date**: 2025-11-14
**Status**: Implemented
**Files Modified**: `public/admin/config.js` (all collection folder paths and sprint widget)

## Problems Discovered

### Problem 1: Git Repository Structure Mismatch

The git repository root is at `/Users/richardhallett/Documents/code/jobs/becoming-diamond/`, but the Next.js project is in a subdirectory `becoming-diamond-nextjs/`. All CMS folder paths were relative to the git root, causing files to be created outside the project directory.

**Result**: When user created a sprint entry via CMS, it was written to:
- `/Users/richardhallett/Documents/code/jobs/becoming-diamond/content/sprint/day-14.md` ❌

Instead of the expected location:
- `/Users/richardhallett/Documents/code/jobs/becoming-diamond/becoming-diamond-nextjs/content/sprint/day-14.md` ✅

### Problem 2: Filename Generation Mismatch

The Sprint collection in Decap CMS also had a filename generation mismatch:

- **Existing files**: `day-01.md`, `day-02.md`, `day-03.md`, ..., `day-30.md` (zero-padded)
- **CMS slug pattern**: `'day-{{day}}'` with number widget (values 1-30)
- **Generated filenames**: Would create `day-1.md`, `day-2.md`, `day-3.md` (not zero-padded)

This mismatch would cause:
- Duplicate files in the repository
- Conflicts between CMS-created and existing content
- Broken file references and routing issues

## Investigation

Research into Decap CMS capabilities revealed:

1. **No built-in zero-padding filter**: Decap CMS supports template filters (date, upper, lower) but has no `padStart()` or `printf()` style formatting
2. **No custom filter API**: The `CMS.registerStringTemplateFilter()` function is not implemented
3. **GitHub Issues reviewed**:
   - #2118: Number types in slugs (fixed in earlier versions)
   - #4783: Date filters in slugs (implemented)
   - #3677: Custom filter registration (not implemented)

## Solutions

### Solution 1: Update All Folder Paths

Added `becoming-diamond-nextjs/` prefix to all collection folder paths and file paths in the CMS configuration:

**Collections Updated**:
- News: `folder: 'becoming-diamond-nextjs/content/news'`
- Blog: `folder: 'becoming-diamond-nextjs/content/blog'`
- Sprint: `folder: 'becoming-diamond-nextjs/content/sprint'`
- Pages: `file: 'becoming-diamond-nextjs/content/pages/...'`
- Settings: `file: 'becoming-diamond-nextjs/content/settings/...'`
- Media: `media_folder: 'becoming-diamond-nextjs/public/uploads'`

### Solution 2: Select Widget for Zero-Padding

Changed the day field from a number widget to a select widget with pre-formatted zero-padded string options.

### Configuration Change

**Before**:
```javascript
{
  label: 'Day Number',
  name: 'day',
  widget: 'number',
  min: 1,
  max: 30
}
```

**After**:
```javascript
{
  label: 'Day Number',
  name: 'day',
  widget: 'select',
  options: [
    '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
    '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
    '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'
  ]
}
```

## How It Works

1. Content editor opens Sprint collection in CMS
2. Selects day from dropdown (displays: '01', '02', '03', etc.)
3. Selected value is a string (e.g., '01')
4. Slug pattern `'day-{{day}}'` uses the string value directly
5. Generated filename: `day-01.md` (matches existing convention)
6. Frontmatter `day` field stores string value: `day: '01'`

## Benefits

- **No code changes**: Uses built-in Decap CMS widgets
- **No custom filters**: Avoids maintenance burden of custom code
- **Immediate fix**: Works with current CMS version
- **Clear UX**: Dropdown shows exact filename format
- **Validation built-in**: Cannot create invalid day numbers

## Trade-offs

- **String vs. Number**: Day field is now stored as string ('01') instead of number (1)
- **Fixed list**: Cannot dynamically extend beyond 30 days without config change
- **Dropdown UX**: Slightly less flexible than free-text number input

## Testing Performed

**First Test (Before Fix)**:
- Selected day "01" in CMS
- File created at wrong location: `../content/sprint/day-14.md` (outside project)
- Frontmatter had correct value: `day: "01"`
- Filename was incorrect: `day-14.md` instead of `day-01.md`

**Root Causes Identified**:
1. Git repo structure: parent directory contains both `.git` and `becoming-diamond-nextjs/` subdirectory
2. CMS paths were relative to git root, not project root
3. Select widget changes were lost during git reset

## Validation Required

Before considering this fix complete, the following should be tested:

1. Start dev server and navigate to `/admin`
2. Authenticate with GitHub OAuth
3. Open Sprint collection
4. Create new sprint entry:
   - Select a day from dropdown (e.g., '15')
   - Fill in required fields (title, subtitle, etc.)
   - Publish the entry
5. Verify file created at correct location: `becoming-diamond-nextjs/content/sprint/day-15.md`
6. Verify frontmatter has correct value: `day: '15'`
7. Verify git commit created by CMS
8. Verify content pushed to GitHub remote
9. Test frontend rendering at `/app/sprint/day/15`
10. Delete test entry and clean up
11. Repeat test for News and Blog collections to verify path fixes work across all collections

## Future Considerations

If the string-based day field causes issues with frontend code (e.g., sorting, filtering, comparisons), consider:

1. **Frontend parsing**: Parse string to number when needed: `parseInt(day, 10)`
2. **GraphQL/API layer**: Transform day field to number in data layer
3. **Dual fields**: Store both `day` (string for slug) and `dayNumber` (number for logic)

## Related Documentation

- `/docs/specs/sprint-cms-migration.md` - Overall CMS migration plan
- `public/admin/config.js` - Decap CMS configuration file
- `content/sprint/` - Sprint content directory with existing files
