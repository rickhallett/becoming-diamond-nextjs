# Knip Cleanup - Quick Start

## 30-Second Guide

```bash
# 1. Review and check boxes to KEEP files
code docs/knip-cleanup-checklist.md

# 2. Preview changes (SAFE - no modifications)
npm run cleanup:knip

# 3. Execute cleanup
npm run cleanup:knip:execute
```

## What It Does

- Deletes 109 unused files (scripts, old components, archives)
- Uninstalls 19 unused dependencies (~20 MB saved)
- Creates backups in `.cleanup-backup/`
- Logs everything to `cleanup-log.txt`

## Files Created

| File | Purpose |
|------|---------|
| `docs/knip-cleanup-checklist.md` | Interactive checklist - edit this |
| `scripts/cleanup-from-checklist.ts` | Automation script |
| `docs/knip-cleanup-summary.md` | Detailed analysis |
| `scripts/README-cleanup.md` | Script documentation |

## Critical First Steps

**Before cleanup, add missing dependencies:**
```bash
npm install --save nanoid
npm install --save-dev @eslint/js postcss
```

## Safety Features

- ✅ Dry run by default (preview only)
- ✅ Backups created automatically
- ✅ 5-second countdown before execution
- ✅ Detailed logging of all actions
- ✅ Only deletes unchecked items

## How Checklist Works

```markdown
- [ ] `file.ts` ← WILL BE DELETED (unchecked)
- [x] `keep.ts` ← WILL BE KEPT (checked)
```

**You control what gets deleted by checking/unchecking boxes.**

## After Cleanup

```bash
npm run build  # Verify build works
npm run dev    # Test the app
```

## Rollback

```bash
# Restore from backup
cp -r .cleanup-backup/backup-*/\* .

# Or restore package.json
git checkout package.json
npm install
```

## Documentation

- Full details: `docs/knip-cleanup-summary.md`
- Script docs: `scripts/README-cleanup.md`
- Checklist: `docs/knip-cleanup-checklist.md`

---

**Estimated Time:** 5-10 minutes (review + execution)
**Risk Level:** LOW (with backups and dry run)
**Savings:** ~20 MB dependencies + cleaner codebase
