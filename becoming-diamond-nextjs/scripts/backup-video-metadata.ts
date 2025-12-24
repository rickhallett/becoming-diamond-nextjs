#!/usr/bin/env tsx
/**
 * Backup Video Metadata from Bunny Stream
 *
 * Creates a JSON snapshot of all video metadata including:
 * - guid, title, dateUploaded, length, status, views
 * - thumbnailFileName, collectionId, width, height, availableResolutions
 * - All other metadata returned by the Bunny API
 *
 * Usage:
 *   npm run backup-videos                    # Auto-generates timestamped filename
 *   npm run backup-videos -- --output=backup.json  # Custom filename
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { writeFileSync, mkdirSync } from 'fs';

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
  width?: number;
  height?: number;
  availableResolutions?: string;
  [key: string]: any; // Allow additional properties
}

interface BunnyVideosResponse {
  items: BunnyVideo[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

interface BackupData {
  backupDate: string;
  backupTimestamp: number;
  libraryId: string;
  totalVideos: number;
  videos: BunnyVideo[];
}

// Configuration
const BUNNY_LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID!;
const BUNNY_API_KEY = process.env.BUNNY_STREAM_API_KEY!;
const API_BASE = 'https://video.bunnycdn.com';

// Parse command line arguments
const args = process.argv.slice(2);
const outputArg = args.find(arg => arg.startsWith('--output='))?.split('=')[1];

/**
 * Generate default backup filename with timestamp
 */
function generateBackupFilename(): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').split('.')[0];
  return `backups/video-metadata-backup-${timestamp}.json`;
}

/**
 * Fetch all videos from Bunny Stream library
 */
async function fetchAllVideos(): Promise<BunnyVideo[]> {
  const allVideos: BunnyVideo[] = [];
  let currentPage = 1;
  let totalPages = 1;

  console.log('Fetching videos from Bunny Stream...\n');

  while (currentPage <= totalPages) {
    const url = `${API_BASE}/library/${BUNNY_LIBRARY_ID}/videos?page=${currentPage}&itemsPerPage=100`;

    const response = await fetch(url, {
      headers: {
        'AccessKey': BUNNY_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Bunny API error: ${response.status} ${response.statusText}`);
    }

    const data: BunnyVideosResponse = await response.json();
    allVideos.push(...data.items);

    totalPages = data.totalPages;
    currentPage++;

    console.log(`   Fetched page ${currentPage - 1}/${totalPages} (${data.items.length} videos)`);
  }

  console.log(`\n✅ Total videos fetched: ${allVideos.length}\n`);
  return allVideos;
}

/**
 * Save backup to JSON file
 */
function saveBackup(videos: BunnyVideo[], filename: string): void {
  const backupData: BackupData = {
    backupDate: new Date().toISOString(),
    backupTimestamp: Date.now(),
    libraryId: BUNNY_LIBRARY_ID,
    totalVideos: videos.length,
    videos: videos,
  };

  // Ensure backups directory exists
  const backupsDir = resolve(process.cwd(), 'backups');
  try {
    mkdirSync(backupsDir, { recursive: true });
  } catch (error) {
    // Directory might already exist, ignore error
  }

  const filePath = resolve(process.cwd(), filename);
  writeFileSync(filePath, JSON.stringify(backupData, null, 2), 'utf-8');

  console.log(`✅ Backup saved to: ${filename}`);
  console.log(`   Total videos: ${videos.length}`);
  console.log(`   File size: ${(JSON.stringify(backupData).length / 1024).toFixed(2)} KB`);
}

/**
 * Display backup summary
 */
function displaySummary(videos: BunnyVideo[]): void {
  console.log('\nBACKUP SUMMARY\n');
  console.log('─'.repeat(80));

  const sprintVideos = videos.filter(v => /day\s*\d+/i.test(v.title));
  const otherVideos = videos.filter(v => !/day\s*\d+/i.test(v.title));

  console.log(`Total videos: ${videos.length}`);
  console.log(`  Sprint videos (Day X): ${sprintVideos.length}`);
  console.log(`  Other videos: ${otherVideos.length}`);
  console.log('');

  const collections = new Set(videos.filter(v => v.collectionId).map(v => v.collectionId));
  console.log(`Collections: ${collections.size}`);
  console.log('');

  const statuses = videos.reduce((acc, v) => {
    acc[v.status] = (acc[v.status] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  console.log('Video statuses:');
  Object.entries(statuses).forEach(([status, count]) => {
    const statusText = status === '4' ? 'Ready' : status === '3' ? 'Processing' : `Status ${status}`;
    console.log(`  ${statusText}: ${count}`);
  });

  console.log('');
  console.log('─'.repeat(80));
}

/**
 * Main execution
 */
async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║           Bunny Stream Video Metadata Backup              ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Validate environment variables
  if (!BUNNY_LIBRARY_ID || !BUNNY_API_KEY) {
    console.error('❌ Error: Missing required environment variables');
    console.error('   Required: BUNNY_STREAM_LIBRARY_ID, BUNNY_STREAM_API_KEY');
    process.exit(1);
  }

  const outputFilename = outputArg || generateBackupFilename();
  console.log(`Output file: ${outputFilename}\n`);

  try {
    // Fetch all videos
    const videos = await fetchAllVideos();

    // Display summary
    displaySummary(videos);

    // Save backup
    saveBackup(videos, outputFilename);

    console.log('\n✅ Backup completed successfully');
    console.log('\nTo restore from this backup, run:');
    console.log(`   npm run restore-videos -- --backup=${outputFilename}\n`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
main();
