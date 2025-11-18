# Documentation Structure Migration

This directory contains scripts to reorganize the repository's documentation structure into a cleaner, more intuitive organization based on purpose and audience.

## Migration Overview

The migration reorganizes documentation from a flat structure into a hierarchical organization:

```
docs/
├── 1_planning/              # Strategic planning and analysis
│   ├── analysis/
│   ├── product_requirements/
│   └── sprints/
├── 2_architecture_and_specs/  # Technical specifications
│   ├── ai/
│   ├── auth/
│   ├── cms/
│   ├── payments/
│   └── video/
├── 3_guides_and_how-tos/    # Instructional content
│   ├── handoff/
│   ├── setup/
│   └── workflows/
└── 4_content_and_copy/      # Marketing content
    ├── book/
    └── website_copy/

_archive/                    # Historical documents
└── reports/
    ├── weekly_updates/
    ├── implementation_summaries/
    ├── audits_and_analysis/
    └── testing/
```

## Available Scripts

### Python Script (Recommended)

**File:** `migrate-docs-structure.py`

**Features:**
- Comprehensive error handling
- Detailed logging
- Migration log file generation
- Colored terminal output
- Cross-platform compatibility

**Usage:**

```bash
# Preview changes (dry-run)
python scripts/migrate-docs-structure.py --dry-run

# Preview with detailed output
python scripts/migrate-docs-structure.py --dry-run --verbose

# Execute migration
python scripts/migrate-docs-structure.py

# Execute with detailed logging
python scripts/migrate-docs-structure.py --verbose

# Show help
python scripts/migrate-docs-structure.py --help
```

**Options:**
- `--dry-run`: Preview changes without modifying files
- `--verbose`, `-v`: Show detailed output for each operation
- `--help`, `-h`: Display help message

### Shell Script (Alternative)

**File:** `migrate-docs-structure.sh`

**Features:**
- Simpler implementation
- Bash-native for Unix environments
- Basic error handling

**Usage:**

```bash
# Preview changes (dry-run)
./scripts/migrate-docs-structure.sh --dry-run

# Preview with detailed output
./scripts/migrate-docs-structure.sh --dry-run --verbose

# Execute migration
./scripts/migrate-docs-structure.sh

# Execute with detailed logging
./scripts/migrate-docs-structure.sh --verbose

# Show help
./scripts/migrate-docs-structure.sh --help
```

## Migration Process

Both scripts follow the same 3-step process:

### Step 1: Create Directory Structure
Creates the new hierarchical directory structure under `docs/` and `_archive/`.

### Step 2: Migrate Files
Moves and renames files according to the migration map:
- Files are moved to their new locations
- Many files are renamed with semantic prefixes (`spec-`, `prd-`, `guide-`, `report-`, etc.)
- Missing files are skipped and logged

### Step 3: Cleanup Empty Directories
Removes old empty directories that are no longer needed after migration.

## Before Running Migration

1. **Commit your current work**
   ```bash
   git add .
   git commit -m "Pre-migration checkpoint"
   ```

2. **Run a dry-run first**
   ```bash
   python scripts/migrate-docs-structure.py --dry-run --verbose
   ```

3. **Review the output** to ensure the migration matches your expectations

## After Migration

1. **Review the changes**
   ```bash
   git status
   git diff --stat
   ```

2. **Check the migration log** (Python script only)
   ```
   migration-log-YYYY-MM-DD_HH-MM-SS.txt
   ```

3. **Update any documentation links** that reference the old paths

4. **Commit the migration**
   ```bash
   git add .
   git commit -m "docs: reorganize documentation structure

   - Moved files to new hierarchy under docs/
   - Renamed files with semantic prefixes
   - Archived historical reports
   - Cleaned up empty directories"
   ```

## File Naming Conventions

The migration applies semantic prefixes to files:

- `spec-*` - Technical specifications
- `prd-*` - Product Requirements Documents
- `analysis-*` - Analysis documents
- `guide-*` - How-to guides
- `report-*` - Implementation reports
- `impl-*` - Implementation summaries
- `audit-*` - Audit reports
- `update-*` - Weekly/session updates
- `workflow-*` - Process workflows

## Troubleshooting

### Files Not Found
Some files may not exist in your repository. This is normal - the scripts skip missing files and continue.

### Permission Errors
If you get permission errors:
```bash
chmod +x scripts/migrate-docs-structure.py
chmod +x scripts/migrate-docs-structure.sh
```

### Migration Failed Partially
If the migration fails partway through:
1. Check the error message
2. Fix the issue
3. Reset with `git reset --hard`
4. Run the migration again

### Rollback Migration
To completely rollback:
```bash
git reset --hard HEAD~1  # If you committed
# OR
git reset --hard  # If you haven't committed yet
```

## Design Principles

The new structure follows these principles:

1. **Separation of Concerns**: Documentation separated from source code
2. **Audience-First**: Grouped by who uses them (developers, clients, strategists)
3. **Lifecycle Stages**: Flows from planning → architecture → guides → archives
4. **Clear Naming**: Semantic prefixes make purpose immediately clear
5. **Logical Hierarchy**: Related documents grouped together

## Questions or Issues?

If you encounter any issues with the migration scripts, check:
1. File permissions (scripts should be executable)
2. Python version (Python 3.6+ required for Python script)
3. Git status (ensure clean working directory)
4. Available disk space

For script modifications, edit `migrate-docs-structure.py` or `migrate-docs-structure.sh` directly.
