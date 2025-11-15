# Knip Cleanup Automation

This directory contains an automated cleanup script that works with the knip analysis checklist.

## Files

- `cleanup-from-checklist.ts` - Main automation script
- `../docs/knip-cleanup-checklist.md` - Interactive checklist for review

## Quick Start

```bash
# 1. Review and edit the checklist
# Check boxes ([x]) for files you want to KEEP
# Leave unchecked ([ ]) for files to DELETE
code docs/knip-cleanup-checklist.md

# 2. Preview changes (dry run - safe, makes no changes)
npm run cleanup:knip

# 3. Execute cleanup (after reviewing preview)
npm run cleanup:knip:execute
```

## How It Works

1. **Parse Checklist**: Reads `docs/knip-cleanup-checklist.md`
2. **Identify Actions**: Collects all unchecked items ([ ])
3. **Group by Type**: Separates files, dependencies, dev dependencies
4. **Execute Phases**:
   - Phase 1: Delete files (with backup)
   - Phase 2: Uninstall dependencies
   - Phase 3: Uninstall dev dependencies

## Safety Features

- **Dry Run Default**: Always previews before making changes
- **Backups**: Files backed up to `.cleanup-backup/` before deletion
- **Logging**: All actions logged to `cleanup-log.txt`
- **5-Second Delay**: Countdown before execution (Ctrl+C to cancel)
- **Selective Execution**: Only touches unchecked items

## Output Files

- `.cleanup-backup/backup-{timestamp}/` - Backup of deleted files
- `cleanup-log.txt` - Detailed log of all actions

## Examples

### Preview Only (Safe)
```bash
npm run cleanup:knip
```

Output:
```
📋 Reading checklist from: docs/knip-cleanup-checklist.md
✅ Found 89 actions to perform

────────────────────────────────────────────────────────────────────────────────
📁 PHASE 1: File Deletions (75 files)
────────────────────────────────────────────────────────────────────────────────

[Scripts - Utility/Debug Scripts] - 18 files
   [DRY RUN] Would delete: scripts/check-all-profiles.ts
   [DRY RUN] Would delete: scripts/check-corrupt-user.ts
   ...

════════════════════════════════════════════════════════════════════════════════
✅ CLEANUP COMPLETE
════════════════════════════════════════════════════════════════════════════════

Summary:
  - Files deleted: 75
  - Dependencies removed: 14
  - Dev dependencies removed: 5
  - Total actions: 94

⚠️  This was a DRY RUN - no changes were made
   To execute cleanup, run: npm run cleanup:knip:execute
```

### Execute Cleanup
```bash
npm run cleanup:knip:execute
```

Output:
```
⚠️  WARNING: This will permanently delete files and uninstall packages!
   Press Ctrl+C within 5 seconds to cancel...

📋 Reading checklist from: docs/knip-cleanup-checklist.md
✅ Found 89 actions to perform

📦 Creating backup directory...
   Backup location: .cleanup-backup/backup-2025-11-15T10-30-00-000Z

────────────────────────────────────────────────────────────────────────────────
📁 PHASE 1: File Deletions (75 files)
────────────────────────────────────────────────────────────────────────────────

[Scripts - Utility/Debug Scripts] - 18 files
   💾 Backed up: scripts/check-all-profiles.ts
   🗑️  Deleted: scripts/check-all-profiles.ts
   ...
```

## Modifying the Checklist

The script reads markdown checkboxes:

```markdown
### Section Name

- [ ] `file/to/delete.ts` - Will be deleted
- [x] `file/to/keep.ts` - Will be skipped
- [ ] `@radix-ui/react-tabs` - Will be uninstalled
```

**Checkbox states:**
- `[ ]` (unchecked) = Safe to delete/uninstall
- `[x]` (checked) = Keep/skip this item

## Restoring from Backup

If you need to restore deleted files:

```bash
# Find your backup
ls -la .cleanup-backup/

# Copy files back
cp -r .cleanup-backup/backup-2025-11-15T10-30-00-000Z/* .
```

## Manual Cleanup (Alternative)

If you prefer manual control:

```bash
# Delete a specific file
rm scripts/check-all-profiles.ts

# Uninstall dependencies
npm uninstall @radix-ui/react-tabs @tsparticles/engine

# Uninstall dev dependencies
npm uninstall @types/pdfkit pdfkit
```

## Troubleshooting

**Script won't run:**
- Ensure `tsx` is installed: `npm install tsx`
- Check file permissions: `chmod +x scripts/cleanup-from-checklist.ts`

**Files not being deleted:**
- Check if checkbox is marked `[x]` (will skip)
- Verify file path matches exactly
- Check backup location for conflicts

**Dependencies not uninstalling:**
- Run `npm install` to reset
- Manually check package.json
- Clear npm cache: `npm cache clean --force`

## Safety Tips

1. **Always run dry run first**: `npm run cleanup:knip`
2. **Commit your work** before executing cleanup
3. **Review the log file** after execution
4. **Keep backups** until you verify everything works
5. **Test your app** after cleanup: `npm run build && npm run dev`

## See Also

- Main checklist: `docs/knip-cleanup-checklist.md`
- Knip documentation: https://knip.dev/
- Project architecture: `CLAUDE.md`
