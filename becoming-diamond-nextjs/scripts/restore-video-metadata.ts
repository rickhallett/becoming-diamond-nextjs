#!/usr/bin/env tsx
/**
 * Restore Video Metadata from Backup
 *
 * Restores video titles from a backup JSON file created by backup-video-metadata.ts
 *
 * Usage:
 *   npm run restore-videos -- --backup=backups/video-metadata-backup-2025-12-24.json
 *   npm run restore-videos -- --backup=backups/video-metadata-backup-2025-12-24.json --dry-run
 *   npm run restore-videos -- --backup=backups/video-metadata-backup-2025-12-24.json --apply
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync, existsSync } from 'fs';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

interface BunnyVideo {
  guid: string;
  title: string;
  dateUploaded: string;
  length: number;
  status: number;
  views: number;
  thumbnailFileName?: string;
  collectionId?: string;
  [key: string]: any;
}

interface BackupData {
  backupDate: string;
  backupTimestamp: number;
  libraryId: string;
  totalVideos: number;
  videos: BunnyVideo[];
}

interface RestoreOperation {
  guid: string;
  currentTitle: string;
  backupTitle: string;
  needsRestore: boolean;
}

// Configuration
const BUNNY_LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID!;
const BUNNY_API_KEY = process.env.BUNNY_STREAM_API_KEY!;
const API_BASE = 'https://video.bunnycdn.com';

// Parse command line arguments
const args = process.argv.slice(2);
const backupFile = args.find(arg => arg.startsWith('--backup='))?.split('=')[1];
const shouldApply = args.includes('--apply');

/**
 * Load backup file
 */
function loadBackup(filename: string): BackupData {
  const filePath = resolve(process.cwd(), filename);

  if (!existsSync(filePath)) {
    throw new Error(`Backup file not found: ${filename}`);
  }

  const fileContent = readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

/**
 * Fetch current video data
 */
async function fetchCurrentVideo(guid: string): Promise<BunnyVideo | null> {
  const url = `${API_BASE}/library/${BUNNY_LIBRARY_ID}/videos/${guid}`;

  const response = await fetch(url, {
    headers: {
      'AccessKey': BUNNY_API_KEY,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null; // Video no longer exists
    }
    throw new Error(`Bunny API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Update video title
 */
async function updateVideoTitle(guid: string, title: string): Promise<void> {
  const url = `${API_BASE}/library/${BUNNY_LIBRARY_ID}/videos/${guid}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'AccessKey': BUNNY_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Update failed: ${response.status} ${response.statusText} - ${errorText}`);
  }
}

/**
 * Analyze what needs to be restored
 */
async function analyzeRestore(backupData: BackupData): Promise<RestoreOperation[]> {
  console.log('Analyzing current state vs backup...\n');

  const operations: RestoreOperation[] = [];

  for (const backupVideo of backupData.videos) {
    const currentVideo = await fetchCurrentVideo(backupVideo.guid);

    if (!currentVideo) {
      console.log(`   WARNING: Video ${backupVideo.guid} no longer exists (skipping)`);
      continue;
    }

    operations.push({
      guid: backupVideo.guid,
      currentTitle: currentVideo.title,
      backupTitle: backupVideo.title,
      needsRestore: currentVideo.title !== backupVideo.title,
    });
  }

  return operations;
}

/**
 * Display restore plan
 */
function displayRestorePlan(operations: RestoreOperation[]): void {
  console.log('\nRESTORE PLAN\n');
  console.log('═'.repeat(100));

  const needsRestore = operations.filter(op => op.needsRestore);
  const alreadyCorrect = operations.filter(op => !op.needsRestore);

  console.log(`\nVideos needing restore: ${needsRestore.length}`);
  console.log(`Videos already correct: ${alreadyCorrect.length}`);
  console.log('');

  if (needsRestore.length > 0) {
    console.log('CHANGES TO BE RESTORED:\n');
    console.log('─'.repeat(100));

    needsRestore.forEach((op, index) => {
      console.log(`\n${index + 1}. GUID: ${op.guid}`);
      console.log(`   Current:  ${op.currentTitle}`);
      console.log(`   Restore:  ${op.backupTitle}`);
    });

    console.log('\n' + '─'.repeat(100));
  }

  if (alreadyCorrect.length > 0 && alreadyCorrect.length <= 10) {
    console.log('\nVIDEOS ALREADY MATCHING BACKUP (no change needed):\n');
    alreadyCorrect.forEach(op => {
      console.log(`   ${op.guid}: ${op.currentTitle}`);
    });
  }

  console.log('\n' + '═'.repeat(100));
}

/**
 * Execute restore
 */
async function executeRestore(operations: RestoreOperation[]): Promise<void> {
  console.log('\nRESTORING VIDEO METADATA\n');
  console.log('─'.repeat(100));

  let successCount = 0;
  let failCount = 0;
  let skipCount = 0;

  for (const op of operations) {
    if (!op.needsRestore) {
      skipCount++;
      continue;
    }

    console.log(`\nRestoring: ${op.guid}`);
    console.log(`   ${op.currentTitle}`);
    console.log(`   → ${op.backupTitle}`);

    try {
      await updateVideoTitle(op.guid, op.backupTitle);
      successCount++;
      console.log('   ✅ Restored');
    } catch (error) {
      failCount++;
      console.log(`   ❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Rate limiting: wait 100ms between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n' + '─'.repeat(100));
  console.log('\nRESTORE RESULTS\n');
  console.log(`✅ Successfully restored: ${successCount}`);
  console.log(`Skipped (no change): ${skipCount}`);
  if (failCount > 0) {
    console.log(`❌ Failed: ${failCount}`);
  }
  console.log('');
}

/**
 * Main execution
 */
async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║         Bunny Stream Video Metadata Restore               ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Validate environment variables
  if (!BUNNY_LIBRARY_ID || !BUNNY_API_KEY) {
    console.error('❌ Error: Missing required environment variables');
    console.error('   Required: BUNNY_STREAM_LIBRARY_ID, BUNNY_STREAM_API_KEY');
    process.exit(1);
  }

  // Validate backup file argument
  if (!backupFile) {
    console.error('❌ Error: No backup file specified');
    console.error('\nUsage:');
    console.error('   npm run restore-videos -- --backup=backups/video-metadata-backup-2025-12-24.json');
    console.error('   npm run restore-videos -- --backup=backups/video-metadata-backup-2025-12-24.json --apply');
    process.exit(1);
  }

  console.log(`Backup file: ${backupFile}\n`);

  try {
    // Load backup
    console.log('Loading backup file...\n');
    const backupData = loadBackup(backupFile);

    console.log(`✅ Backup loaded successfully`);
    console.log(`   Backup date: ${new Date(backupData.backupDate).toLocaleString()}`);
    console.log(`   Library ID: ${backupData.libraryId}`);
    console.log(`   Total videos in backup: ${backupData.totalVideos}`);
    console.log('');

    // Verify library ID matches
    if (backupData.libraryId !== BUNNY_LIBRARY_ID) {
      console.error('❌ Error: Backup library ID does not match current library');
      console.error(`   Backup: ${backupData.libraryId}`);
      console.error(`   Current: ${BUNNY_LIBRARY_ID}`);
      process.exit(1);
    }

    // Analyze what needs to be restored
    const operations = await analyzeRestore(backupData);

    // Display restore plan
    displayRestorePlan(operations);

    // Execute restore if requested
    if (shouldApply) {
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      await new Promise<void>((resolve) => {
        readline.question('\nRestore from backup? (yes/no): ', async (answer: string) => {
          readline.close();
          if (answer.toLowerCase() !== 'yes') {
            console.log('\n❌ Aborted by user');
            process.exit(0);
          }
          console.log('');
          resolve();
        });
      });

      await executeRestore(operations);
    } else {
      console.log('\nDRY RUN MODE - No changes applied\n');
      console.log('To apply restore, run:');
      console.log(`   npm run restore-videos -- --backup=${backupFile} --apply\n`);
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
main();
