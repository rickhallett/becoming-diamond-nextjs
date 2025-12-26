#!/usr/bin/env tsx
/**
 * Standardize Video Titles in Bunny Stream
 *
 * This script bulk updates video titles in your Bunny Stream library with a standardized format.
 *
 * Title Format Options:
 * 1. Date-based: "YYYY-MM-DD - Original Title - v1.0"
 * 2. Sequential: "Day 01 - Original Title - v1.0"
 * 3. Custom format via function
 *
 * Usage:
 *   npm run tsx scripts/standardize-video-titles.ts --dry-run    # Preview changes
 *   npm run tsx scripts/standardize-video-titles.ts              # Apply changes
 *   npm run tsx scripts/standardize-video-titles.ts --format=date
 *   npm run tsx scripts/standardize-video-titles.ts --version=2.0
 */

import { config } from 'dotenv';
import { resolve } from 'path';

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
  metaTags?: Array<{ property: string; value: string }>;
}

interface BunnyVideosResponse {
  items: BunnyVideo[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

interface UpdateResult {
  guid: string;
  oldTitle: string;
  newTitle: string;
  success: boolean;
  error?: string;
}

// Configuration
const BUNNY_LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID!;
const BUNNY_API_KEY = process.env.BUNNY_STREAM_API_KEY!;
const API_BASE = 'https://video.bunnycdn.com';

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const formatArg = args.find(arg => arg.startsWith('--format='))?.split('=')[1] || 'date';
const versionArg = args.find(arg => arg.startsWith('--version='))?.split('=')[1] || '1.0';

/**
 * Fetch all videos from Bunny Stream library
 */
async function fetchAllVideos(): Promise<BunnyVideo[]> {
  const allVideos: BunnyVideo[] = [];
  let currentPage = 1;
  let totalPages = 1;

  console.log('📹 Fetching videos from Bunny Stream...\n');

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
 * Generate standardized title based on format
 */
function generateStandardizedTitle(video: BunnyVideo, format: string, version: string): string {
  const uploadDate = new Date(video.dateUploaded);
  const dateStr = uploadDate.toISOString().split('T')[0]; // YYYY-MM-DD

  // Extract original title (remove existing date/version if present)
  let cleanTitle = video.title
    .replace(/^\d{4}-\d{2}-\d{2}\s*-\s*/, '') // Remove existing date prefix
    .replace(/\s*-\s*v\d+\.\d+\s*$/, '')      // Remove existing version suffix
    .trim();

  // Extract day number if present (e.g., "Day 01", "Day 1", etc.)
  const dayMatch = cleanTitle.match(/^Day\s*(\d+)/i);
  const dayNumber = dayMatch ? dayMatch[1].padStart(2, '0') : null;

  switch (format) {
    case 'date':
      return `${dateStr} - ${cleanTitle} - v${version}`;

    case 'sequential':
      if (dayNumber) {
        return `Day ${dayNumber} - ${cleanTitle.replace(/^Day\s*\d+\s*-?\s*/i, '')} - v${version}`;
      }
      return `${cleanTitle} - v${version}`;

    case 'simple':
      return `${cleanTitle} - v${version}`;

    default:
      return `${dateStr} - ${cleanTitle} - v${version}`;
  }
}

/**
 * Update a single video's title
 */
async function updateVideoTitle(guid: string, newTitle: string): Promise<void> {
  const url = `${API_BASE}/library/${BUNNY_LIBRARY_ID}/videos/${guid}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'AccessKey': BUNNY_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title: newTitle }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Update failed: ${response.status} ${response.statusText} - ${errorText}`);
  }
}

/**
 * Process all videos and update titles
 */
async function processVideos(): Promise<UpdateResult[]> {
  const videos = await fetchAllVideos();
  const results: UpdateResult[] = [];

  console.log(`🔄 ${isDryRun ? 'PREVIEW' : 'UPDATING'} video titles...\n`);
  console.log(`Format: ${formatArg}, Version: ${versionArg}\n`);
  console.log('─'.repeat(80));

  for (const video of videos) {
    const newTitle = generateStandardizedTitle(video, formatArg, versionArg);

    const result: UpdateResult = {
      guid: video.guid,
      oldTitle: video.title,
      newTitle,
      success: false,
    };

    // Skip if title is already correct
    if (video.title === newTitle) {
      console.log(`⏭️  SKIP: ${video.title}`);
      continue;
    }

    // Display the change
    console.log(`📝 ${video.title}`);
    console.log(`   → ${newTitle}`);

    if (!isDryRun) {
      try {
        await updateVideoTitle(video.guid, newTitle);
        result.success = true;
        console.log('   ✅ Updated');
      } catch (error) {
        result.success = false;
        result.error = error instanceof Error ? error.message : 'Unknown error';
        console.log(`   ❌ Failed: ${result.error}`);
      }
    } else {
      result.success = true; // In dry-run, mark as "success" for preview
      console.log('   👁️  Preview (not applied)');
    }

    console.log('');
    results.push(result);

    // Rate limiting: wait 100ms between requests
    if (!isDryRun) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return results;
}

/**
 * Display summary of results
 */
function displaySummary(results: UpdateResult[]): void {
  console.log('─'.repeat(80));
  console.log('\n📊 SUMMARY\n');

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`Total videos processed: ${results.length}`);
  console.log(`✅ Successful: ${successful}`);

  if (failed > 0) {
    console.log(`❌ Failed: ${failed}\n`);
    console.log('Failed videos:');
    results
      .filter(r => !r.success)
      .forEach(r => {
        console.log(`  • ${r.oldTitle}`);
        console.log(`    Error: ${r.error}`);
      });
  }

  if (isDryRun) {
    console.log('\n⚠️  DRY RUN MODE - No changes were applied');
    console.log('   Remove --dry-run flag to apply changes');
  }

  console.log('');
}

/**
 * Main execution
 */
async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║         Bunny Stream Video Title Standardization          ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Validate environment variables
  if (!BUNNY_LIBRARY_ID || !BUNNY_API_KEY) {
    console.error('❌ Error: Missing required environment variables');
    console.error('   Required: BUNNY_STREAM_LIBRARY_ID, BUNNY_STREAM_API_KEY');
    process.exit(1);
  }

  if (isDryRun) {
    console.log('🔍 Running in DRY RUN mode - no changes will be applied\n');
  } else {
    console.log('⚠️  LIVE MODE - changes will be applied to Bunny Stream\n');

    // Wait for user confirmation in live mode
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    await new Promise<void>((resolve) => {
      readline.question('Continue? (yes/no): ', (answer: string) => {
        readline.close();
        if (answer.toLowerCase() !== 'yes') {
          console.log('\n❌ Aborted by user');
          process.exit(0);
        }
        console.log('');
        resolve();
      });
    });
  }

  try {
    const results = await processVideos();
    displaySummary(results);

    // Exit with error code if any updates failed
    const hasFailed = results.some(r => !r.success);
    process.exit(hasFailed ? 1 : 0);
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
main();
