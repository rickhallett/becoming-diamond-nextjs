# Knip Cleanup - Quick Reference

**Generated:** 2025-11-15
**Analysis Tool:** knip v5.69.1

## TL;DR

Run these commands to clean up your codebase:

```bash
# Step 1: Review checklist and check boxes to KEEP files
code docs/knip-cleanup-checklist.md

# Step 2: Preview (safe - no changes)
npm run cleanup:knip

# Step 3: Execute (after review)
npm run cleanup:knip:execute
```

## What Was Found

| Category | Count | Recommendation |
|----------|-------|----------------|
| Unused Files | 111 | Delete 109 (2 are false positives) |
| Unused Dependencies | 18 | Remove 14-17 (review 3) |
| Unused Dev Dependencies | 8 | Remove 5 (keep 3) |
| Missing Dependencies | 3 | **ADD THESE FIRST** |
| Unresolved Imports | 3 | Delete test files |
| Duplicate Exports | 2 | Fix exports |
| **Total Actions** | **145** | |

## Critical Actions (Do First)

### 1. Add Missing Dependencies
```bash
npm install --save nanoid
npm install --save-dev @eslint/js postcss
```

### 2. Fix Duplicate Exports
- `src/emails/welcome-email.tsx` - Remove duplicate export
- `src/lib/axiom-logger.ts` - Remove duplicate export

### 3. Delete Orphaned Test Files
```bash
rm src/test/unit/components/CourseProgress.test.tsx
rm src/test/unit/components/MarkdownMessage.test.tsx
rm src/test/unit/lib/course-parser.test.ts
```

## Expected Benefits

### Disk Space Savings
- **Scripts**: ~200 KB
- **Aceternity Components**: ~1-2 MB (if removed)
- **Dependencies**: ~15-20 MB in node_modules

### Bundle Size Reduction
- **Production Bundle**: ~500 KB - 1 MB smaller
- **Development Build**: Faster compilation

### Maintenance Benefits
- Cleaner codebase
- Fewer dependencies to update
- Reduced security surface area
- Easier onboarding for new developers

## Files by Category

### Safe to Delete (High Confidence 90%+)

**Utility Scripts (28 files)**
- Database query/debug scripts
- One-time migration scripts
- Development utilities
- Test/demo scripts

**Unused UI Components (73 files)**
- Aceternity UI components never imported
- Can be removed if bundle size is a concern
- Reinstallable from `aceternity-ui` package

**Archive (2 files)**
- Old landing page variations
- Development utilities

### Must Keep (False Positives)

- `lib/content.ts` ✅ - Used by blog/sprint/legal pages
- `public/admin/decap-cms.js` ✅ - Required by CMS
- `eslint-config-next` ✅ - Required by Next.js
- `aceternity-ui` ✅ - Source package for UI components

## Automation

### Script Location
`scripts/cleanup-from-checklist.ts`

### NPM Commands
```bash
# Preview mode (safe, no changes)
npm run cleanup:knip

# Execute mode (makes changes)
npm run cleanup:knip:execute
```

### Features
- ✅ Dry run by default
- ✅ Creates backups before deleting
- ✅ Logs all actions
- ✅ Groups by category
- ✅ 5-second safety countdown
- ✅ Respects checklist selections

### Output Files
- `.cleanup-backup/backup-{timestamp}/` - File backups
- `cleanup-log.txt` - Detailed action log

## Decision Matrix

### When to Delete

| File Type | Delete If | Keep If |
|-----------|-----------|---------|
| Scripts | One-time use complete | Still debugging/migrating |
| UI Components | Never used, bundle size critical | May use in future |
| Dependencies | Not imported anywhere | Used indirectly |
| Test Files | Component doesn't exist | Planning to implement |

### Risk Assessment

| Action | Risk Level | Reversibility |
|--------|------------|---------------|
| Delete scripts | LOW | Easy (from backup) |
| Uninstall deps | LOW | Easy (`npm install`) |
| Delete UI components | MEDIUM | Easy (from aceternity-ui) |
| Delete tests | LOW | Hard (if custom) |

## Recommended Approach

### Conservative (Lowest Risk)
1. Add missing dependencies
2. Fix duplicate exports
3. Delete orphaned test files
4. Delete only scripts/archive files
5. Remove 5-10 unused dependencies
6. Keep all UI components

**Savings:** ~10 MB, minimal risk

### Moderate (Balanced)
1. All conservative actions
2. Delete all utility scripts
3. Remove all unused dependencies
4. Keep UI components
5. Monitor for issues

**Savings:** ~20 MB, low risk

### Aggressive (Maximum Cleanup)
1. All moderate actions
2. Delete unused UI components
3. Remove all flagged dependencies
4. Clean up unused exports
5. Thorough testing required

**Savings:** ~30-40 MB, medium risk

## Post-Cleanup Checklist

After running cleanup:

- [ ] Run `npm install` to verify package.json
- [ ] Run `npm run build` to check for errors
- [ ] Run `npm run dev` and test the app
- [ ] Check CMS at `/admin` still works
- [ ] Verify authentication flow
- [ ] Test sprint video playback
- [ ] Check blog pages render correctly
- [ ] Run tests: `npm test`
- [ ] Commit changes with descriptive message

## Rollback Procedure

If something breaks:

```bash
# 1. Restore files from backup
cp -r .cleanup-backup/backup-{timestamp}/* .

# 2. Restore package.json from git
git checkout package.json
npm install

# 3. Review what went wrong
cat cleanup-log.txt

# 4. Selectively re-apply cleanup
# Edit checklist to keep problematic items
npm run cleanup:knip:execute
```

## Additional Resources

- **Full Checklist**: `docs/knip-cleanup-checklist.md`
- **Script Documentation**: `scripts/README-cleanup.md`
- **Knip Docs**: https://knip.dev/
- **Project Architecture**: `CLAUDE.md`

## Maintenance Schedule

Recommended frequency for knip analysis:

- **Weekly**: During active development
- **Monthly**: During maintenance phase
- **Before Major Releases**: Always
- **After Dependency Updates**: Check for new unused deps

## Questions & Troubleshooting

### Q: Is it safe to run the script?
A: Yes, it creates backups and has dry-run mode. Always preview first.

### Q: What if I delete something I need?
A: Check `.cleanup-backup/` directory or restore from git.

### Q: Should I delete all Aceternity components?
A: Only if bundle size is critical. They can be useful for future features.

### Q: Can I run this multiple times?
A: Yes, it's idempotent. Re-run after updating the checklist.

### Q: What about the false positives?
A: They're pre-checked in the checklist to prevent deletion.

---

**Last Updated:** 2025-11-15
**Knip Version:** 5.69.1
**Project:** Becoming Diamond Next.js
