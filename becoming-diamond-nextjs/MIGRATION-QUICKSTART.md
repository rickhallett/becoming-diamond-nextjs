# Documentation Migration Quick Start

Two scripts have been created to reorganize your documentation structure:

## Quick Commands

### Python Script (Recommended)
```bash
# Preview what will happen
python scripts/migrate-docs-structure.py --dry-run --verbose

# Execute the migration
python scripts/migrate-docs-structure.py --verbose
```

### Shell Script (Alternative)
```bash
# Preview what will happen
./scripts/migrate-docs-structure.sh --dry-run --verbose

# Execute the migration
./scripts/migrate-docs-structure.sh --verbose
```

## What Gets Created

```
docs/
├── 1_planning/
│   ├── analysis/              # Strategic analysis docs
│   ├── product_requirements/  # PRD documents
│   └── sprints/              # Sprint planning
├── 2_architecture_and_specs/
│   ├── ai/                   # AI-related specs
│   ├── auth/                 # Authentication specs
│   ├── cms/                  # CMS specifications
│   ├── payments/             # Payment system specs
│   └── video/                # Video integration specs
├── 3_guides_and_how-tos/
│   ├── handoff/              # Client handoff guides
│   ├── setup/                # Setup instructions
│   └── workflows/            # Process workflows
└── 4_content_and_copy/
    ├── book/                 # Book content
    └── website_copy/         # Marketing copy

_archive/
└── reports/
    ├── weekly_updates/
    ├── implementation_summaries/
    ├── audits_and_analysis/
    └── testing/
```

## Before You Run

1. **Commit your work:**
   ```bash
   git add .
   git commit -m "Pre-migration checkpoint"
   ```

2. **Always preview first:**
   ```bash
   python scripts/migrate-docs-structure.py --dry-run --verbose
   ```

## After Migration

1. Check what changed:
   ```bash
   git status
   ```

2. Review the migration log (Python only):
   ```
   cat migration-log-*.txt
   ```

3. Commit the changes:
   ```bash
   git add .
   git commit -m "docs: reorganize documentation structure"
   ```

## Full Documentation

See `scripts/README-MIGRATION.md` for complete documentation including:
- Detailed feature comparison
- File naming conventions
- Troubleshooting guide
- Rollback procedures
- Design principles

## Features

### Python Script
- Detailed error handling
- Migration log file generation
- Colored terminal output
- Cross-platform compatible
- Better progress reporting

### Shell Script
- Simpler, bash-native
- Good for CI/CD environments
- Fewer dependencies

Both scripts support `--dry-run` and `--verbose` modes.
