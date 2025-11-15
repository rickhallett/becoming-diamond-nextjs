#!/usr/bin/env tsx

/**
 * Automated Cleanup Script for Knip Analysis
 *
 * This script reads docs/knip-cleanup-checklist.md and performs cleanup actions
 * based on checkbox selections.
 *
 * Usage:
 *   npm run cleanup:knip          # Dry run (preview only)
 *   npm run cleanup:knip:execute  # Actually perform deletions
 *
 * Safety Features:
 *   - Dry run by default
 *   - Requires --execute flag for actual deletions
 *   - Creates backup before deleting files
 *   - Logs all actions to cleanup-log.txt
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const CHECKLIST_PATH = path.join(process.cwd(), 'docs/knip-cleanup-checklist.md');
const BACKUP_DIR = path.join(process.cwd(), '.cleanup-backup');
const LOG_FILE = path.join(process.cwd(), 'cleanup-log.txt');

interface CleanupAction {
  type: 'delete-file' | 'uninstall-dep' | 'uninstall-dev-dep' | 'add-dep' | 'add-dev-dep';
  target: string;
  section: string;
}

class CleanupRunner {
  private actions: CleanupAction[] = [];
  private dryRun: boolean = true;
  private logEntries: string[] = [];

  constructor(execute: boolean = false) {
    this.dryRun = !execute;
    this.log(`\n${'='.repeat(80)}`);
    this.log(`Cleanup Script Started: ${new Date().toISOString()}`);
    this.log(`Mode: ${this.dryRun ? 'DRY RUN (preview only)' : 'EXECUTE (will make changes)'}`);
    this.log(`${'='.repeat(80)}\n`);
  }

  private log(message: string) {
    console.log(message);
    this.logEntries.push(message);
  }

  private parseChecklist(): void {
    this.log('📋 Reading checklist from: ' + CHECKLIST_PATH);

    if (!fs.existsSync(CHECKLIST_PATH)) {
      throw new Error(`Checklist not found at ${CHECKLIST_PATH}`);
    }

    const content = fs.readFileSync(CHECKLIST_PATH, 'utf-8');
    const lines = content.split('\n');

    let currentSection = '';
    let inDependenciesSection = false;
    let inDevDependenciesSection = false;
    let inFilesSection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Track sections
      if (line.startsWith('## 1. UNUSED FILES')) {
        inFilesSection = true;
        inDependenciesSection = false;
        inDevDependenciesSection = false;
        currentSection = 'Files';
      } else if (line.startsWith('## 2. UNUSED DEPENDENCIES')) {
        inDependenciesSection = true;
        inFilesSection = false;
        inDevDependenciesSection = false;
        currentSection = 'Dependencies';
      } else if (line.startsWith('## 3. UNUSED DEV DEPENDENCIES')) {
        inDevDependenciesSection = true;
        inDependenciesSection = false;
        inFilesSection = false;
        currentSection = 'Dev Dependencies';
      } else if (line.startsWith('## 4. CRITICAL FIXES')) {
        inFilesSection = false;
        inDependenciesSection = false;
        inDevDependenciesSection = false;
        currentSection = 'Critical Fixes';
      }

      // Update subsection
      if (line.startsWith('###')) {
        currentSection = line.replace(/^###\s*/, '').replace(/:/g, '').trim();
      }

      // Parse unchecked items (safe to delete/uninstall)
      const uncheckedMatch = line.match(/^- \[ \] `(.+?)`/);
      if (uncheckedMatch) {
        const target = uncheckedMatch[1];

        if (inFilesSection) {
          this.actions.push({
            type: 'delete-file',
            target,
            section: currentSection
          });
        } else if (inDependenciesSection) {
          this.actions.push({
            type: 'uninstall-dep',
            target,
            section: currentSection
          });
        } else if (inDevDependenciesSection) {
          this.actions.push({
            type: 'uninstall-dev-dep',
            target,
            section: currentSection
          });
        }
      }
    }

    this.log(`✅ Found ${this.actions.length} actions to perform\n`);
  }

  private createBackup() {
    if (this.dryRun) return;

    this.log('📦 Creating backup directory...');

    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupSubDir = path.join(BACKUP_DIR, `backup-${timestamp}`);
    fs.mkdirSync(backupSubDir, { recursive: true });

    this.log(`   Backup location: ${backupSubDir}\n`);
    return backupSubDir;
  }

  private deleteFile(filePath: string, backupDir?: string) {
    const fullPath = path.join(process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
      this.log(`   ⚠️  File not found (already deleted?): ${filePath}`);
      return;
    }

    if (this.dryRun) {
      this.log(`   [DRY RUN] Would delete: ${filePath}`);
      return;
    }

    // Backup file
    if (backupDir) {
      const relativePath = filePath;
      const backupPath = path.join(backupDir, relativePath);
      const backupParentDir = path.dirname(backupPath);

      if (!fs.existsSync(backupParentDir)) {
        fs.mkdirSync(backupParentDir, { recursive: true });
      }

      fs.copyFileSync(fullPath, backupPath);
      this.log(`   💾 Backed up: ${filePath}`);
    }

    // Delete file
    fs.unlinkSync(fullPath);
    this.log(`   🗑️  Deleted: ${filePath}`);
  }

  private uninstallDependencies(deps: string[], isDev: boolean) {
    if (deps.length === 0) return;

    const depType = isDev ? 'dev dependencies' : 'dependencies';

    if (this.dryRun) {
      this.log(`\n[DRY RUN] Would uninstall ${deps.length} ${depType}:`);
      deps.forEach(dep => this.log(`   - ${dep}`));
      return;
    }

    this.log(`\n📦 Uninstalling ${deps.length} ${depType}...`);

    try {
      const command = `npm uninstall ${deps.join(' ')}`;
      this.log(`   Running: ${command}`);
      execSync(command, { stdio: 'inherit' });
      this.log(`   ✅ Successfully uninstalled ${depType}`);
    } catch (error) {
      this.log(`   ❌ Error uninstalling ${depType}: ${error}`);
    }
  }

  private groupActionsByType(): Map<string, CleanupAction[]> {
    const grouped = new Map<string, CleanupAction[]>();

    for (const action of this.actions) {
      const key = action.type;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(action);
    }

    return grouped;
  }

  public run() {
    try {
      this.parseChecklist();

      if (this.actions.length === 0) {
        this.log('✅ No actions found - either all items are checked to keep, or checklist is empty.');
        this.saveLog();
        return;
      }

      const backupDir = this.createBackup();
      const grouped = this.groupActionsByType();

      // Phase 1: Delete files
      const fileDeletions = grouped.get('delete-file') || [];
      if (fileDeletions.length > 0) {
        this.log(`\n${'─'.repeat(80)}`);
        this.log(`📁 PHASE 1: File Deletions (${fileDeletions.length} files)`);
        this.log(`${'─'.repeat(80)}\n`);

        const bySection = new Map<string, CleanupAction[]>();
        fileDeletions.forEach(action => {
          if (!bySection.has(action.section)) {
            bySection.set(action.section, []);
          }
          bySection.get(action.section)!.push(action);
        });

        bySection.forEach((actions, section) => {
          this.log(`\n[${section}] - ${actions.length} files`);
          actions.forEach(action => {
            this.deleteFile(action.target, backupDir);
          });
        });
      }

      // Phase 2: Uninstall regular dependencies
      const depUninstalls = grouped.get('uninstall-dep') || [];
      if (depUninstalls.length > 0) {
        this.log(`\n${'─'.repeat(80)}`);
        this.log(`📦 PHASE 2: Dependency Removal (${depUninstalls.length} packages)`);
        this.log(`${'─'.repeat(80)}`);

        this.uninstallDependencies(
          depUninstalls.map(a => a.target),
          false
        );
      }

      // Phase 3: Uninstall dev dependencies
      const devDepUninstalls = grouped.get('uninstall-dev-dep') || [];
      if (devDepUninstalls.length > 0) {
        this.log(`\n${'─'.repeat(80)}`);
        this.log(`🔧 PHASE 3: Dev Dependency Removal (${devDepUninstalls.length} packages)`);
        this.log(`${'─'.repeat(80)}`);

        this.uninstallDependencies(
          devDepUninstalls.map(a => a.target),
          true
        );
      }

      // Summary
      this.log(`\n${'='.repeat(80)}`);
      this.log('✅ CLEANUP COMPLETE');
      this.log(`${'='.repeat(80)}`);
      this.log(`\nSummary:`);
      this.log(`  - Files deleted: ${fileDeletions.length}`);
      this.log(`  - Dependencies removed: ${depUninstalls.length}`);
      this.log(`  - Dev dependencies removed: ${devDepUninstalls.length}`);
      this.log(`  - Total actions: ${this.actions.length}`);

      if (!this.dryRun && backupDir) {
        this.log(`\n📦 Backup saved to: ${backupDir}`);
      }

      if (this.dryRun) {
        this.log(`\n⚠️  This was a DRY RUN - no changes were made`);
        this.log(`   To execute cleanup, run: npm run cleanup:knip:execute`);
      }

      this.saveLog();

    } catch (error) {
      this.log(`\n❌ Error: ${error}`);
      this.saveLog();
      process.exit(1);
    }
  }

  private saveLog() {
    fs.writeFileSync(LOG_FILE, this.logEntries.join('\n'));
    this.log(`\n📝 Log saved to: ${LOG_FILE}`);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const execute = args.includes('--execute');

if (execute) {
  console.log('\n⚠️  WARNING: This will permanently delete files and uninstall packages!');
  console.log('   Press Ctrl+C within 5 seconds to cancel...\n');

  setTimeout(() => {
    const runner = new CleanupRunner(true);
    runner.run();
  }, 5000);
} else {
  const runner = new CleanupRunner(false);
  runner.run();
}
