#!/usr/bin/env tsx
/**
 * Version Sprint Videos (v1 = Old, v2 = New)
 *
 * This script assigns version numbers to 30-day sprint videos based on upload date:
 * - v1 = Older/archived version
 * - v2 = Current/active version
 *
 * The script:
 * 1. Fetches all videos from Bunny Stream
 * 2. Groups videos by day number (Day 01, Day 02, etc.)
 * 3. Sorts each group by upload date (oldest first)
 * 4. Assigns v1 to oldest, v2 to newest (if two videos exist for that day)
 * 5. Shows a detailed comparison table for verification
 *
 * Usage:
 *   npm run version-sprint-videos          # Dry run (preview only)
 *   npm run version-sprint-videos --apply  # Apply changes to Bunny Stream
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
}

interface BunnyVideosResponse {
  items: BunnyVideo[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

interface VideoWithVersion {
  video: BunnyVideo;
  dayNumber: number;
  version: number;
  newTitle: string;
  uploadDate: Date;
}

interface DayGroup {
  dayNumber: number;
  videos: VideoWithVersion[];
}

// Configuration
const BUNNY_LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID!;
const BUNNY_API_KEY = process.env.BUNNY_STREAM_API_KEY!;
const API_BASE = 'https://video.bunnycdn.com';

// Parse command line arguments
const args = process.argv.slice(2);
const shouldApply = args.includes('--apply');

/**
 * Convert word numbers to integers
 */
function wordToNumber(word: string): number | null {
  const words: Record<string, number> = {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
    'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19, 'twenty': 20,
    'twenty-one': 21, 'twenty-two': 22, 'twenty-three': 23, 'twenty-four': 24, 'twenty-five': 25,
    'twenty-six': 26, 'twenty-seven': 27, 'twenty-eight': 28, 'twenty-nine': 29, 'thirty': 30,
  };

  return words[word.toLowerCase()] || null;
}

/**
 * Extract day number from video title
 */
function extractDayNumber(title: string): number | null {
  // Try numeric pattern first: "Day 01", "Day 1", "day 30", etc.
  const numericMatch = title.match(/day\s*(\d+)/i);
  if (numericMatch) {
    return parseInt(numericMatch[1], 10);
  }

  // Try word pattern: "Day One", "Day Two", "Welcome To Day One", etc.
  const wordMatch = title.match(/day\s+([\w-]+)/i);
  if (wordMatch) {
    const dayWord = wordMatch[1];
    const number = wordToNumber(dayWord);
    if (number !== null) {
      return number;
    }
  }

  return null;
}

/**
 * Clean title by removing day prefix, file extensions, version suffixes, and week mentions
 */
function cleanTitle(title: string): string {
  return title
    // Remove common prefixes like "Welcome to", "Welcome To", etc.
    .replace(/^welcome\s+to\s+/i, '')
    // Remove day prefix and all day mentions (Day 01, Day 1, Day One, etc.)
    .replace(/^day\s*\d+\s*:?\s*/i, '')       // Remove leading day (numeric)
    .replace(/^day\s+[\w-]+\s*:?\s*/i, '')    // Remove leading day (word)
    .replace(/\s+day\s*\d+\s*/gi, ' ')        // Remove day mentions anywhere else (numeric)
    .replace(/\s+day\s+[\w-]+\s*/gi, ' ')     // Remove day mentions anywhere else (word)
    // Remove week mentions (Week 2, Week 4, etc.)
    .replace(/week\s*\d+\s*/gi, '')
    // Remove file extensions
    .replace(/\.mov$/i, '')
    .replace(/\.mp4$/i, '')
    .replace(/\.MOV$/i, '')
    // Remove existing version suffixes
    .replace(/\s*-\s*v\d+(\.\d+)?\s*$/i, '')
    .replace(/\s*\(v\d+\)\s*$/i, '')
    // Clean up multiple spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Convert title to kebab-case
 */
function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '');    // Remove leading/trailing hyphens
}

/**
 * Generate new title with standardized format:
 * day-<num>-<title>-<date>-v<version>
 */
function generateTitleWithVersion(
  originalTitle: string,
  dayNumber: number,
  version: number,
  uploadDate: Date
): string {
  const cleanedTitle = cleanTitle(originalTitle);
  const kebabTitle = toKebabCase(cleanedTitle);
  const dateStr = uploadDate.toISOString().split('T')[0]; // YYYY-MM-DD
  const dayNum = dayNumber.toString().padStart(2, '0');

  return `day-${dayNum}-${kebabTitle}-${dateStr}-v${version}`;
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
 * Group videos by day number and assign versions
 */
function groupAndVersionVideos(videos: BunnyVideo[]): DayGroup[] {
  // Filter videos with day numbers
  const sprintVideos = videos
    .map(video => ({
      video,
      dayNumber: extractDayNumber(video.title),
      uploadDate: new Date(video.dateUploaded),
    }))
    .filter(item => item.dayNumber !== null);

  // Group by day number
  const groupedByDay = new Map<number, typeof sprintVideos>();

  sprintVideos.forEach(item => {
    const day = item.dayNumber!;
    if (!groupedByDay.has(day)) {
      groupedByDay.set(day, []);
    }
    groupedByDay.get(day)!.push(item);
  });

  // Sort each group by upload date and assign versions
  const dayGroups: DayGroup[] = [];

  groupedByDay.forEach((items, dayNumber) => {
    // Sort by upload date (oldest first)
    items.sort((a, b) => a.uploadDate.getTime() - b.uploadDate.getTime());

    // Assign versions
    // If only 1 video: assign v2 (current/active)
    // If 2+ videos: v1 (oldest), v2 (next), etc.
    const versioned: VideoWithVersion[] = items.map((item, index) => {
      let version: number;
      if (items.length === 1) {
        version = 2; // Single video is current version (v2)
      } else {
        version = index + 1; // Multiple videos: v1, v2, v3, etc.
      }

      return {
        video: item.video,
        dayNumber: item.dayNumber!,
        version,
        newTitle: generateTitleWithVersion(
          item.video.title,
          item.dayNumber!,
          version,
          item.uploadDate
        ),
        uploadDate: item.uploadDate,
      };
    });

    dayGroups.push({
      dayNumber,
      videos: versioned,
    });
  });

  // Sort day groups by day number
  dayGroups.sort((a, b) => a.dayNumber - b.dayNumber);

  return dayGroups;
}

/**
 * Display grouped videos in a formatted table
 */
function displayGroupedVideos(dayGroups: DayGroup[]): void {
  console.log('GROUPED VIDEOS BY DAY\n');
  console.log('═'.repeat(100));

  dayGroups.forEach(group => {
    console.log(`\nDAY ${group.dayNumber.toString().padStart(2, '0')} (${group.videos.length} video${group.videos.length > 1 ? 's' : ''})`);
    console.log('─'.repeat(100));

    group.videos.forEach(item => {
      const uploadDateStr = item.uploadDate.toISOString().split('T')[0];
      const uploadTime = item.uploadDate.toISOString().split('T')[1].split('.')[0];

      console.log(`\n   VERSION ${item.version} (${item.version === 1 ? 'ARCHIVED' : 'CURRENT'})`);
      console.log(`   Uploaded: ${uploadDateStr} ${uploadTime}`);
      console.log(`   GUID: ${item.video.guid}`);
      console.log(`   Current:  ${item.video.title}`);
      console.log(`   New:      ${item.newTitle}`);

      if (item.video.title === item.newTitle) {
        console.log(`   Status:   No change needed`);
      } else {
        console.log(`   Status:   Will be updated`);
      }
    });

    console.log('');
  });

  console.log('═'.repeat(100));
}

/**
 * Display summary statistics
 */
function displaySummary(dayGroups: DayGroup[]): void {
  console.log('\nSUMMARY\n');

  const totalVideos = dayGroups.reduce((sum, group) => sum + group.videos.length, 0);
  const daysWithOneVideo = dayGroups.filter(g => g.videos.length === 1).length;
  const daysWithTwoVideos = dayGroups.filter(g => g.videos.length === 2).length;
  const daysWithMoreVideos = dayGroups.filter(g => g.videos.length > 2).length;

  const videosToUpdate = dayGroups.reduce((count, group) => {
    return count + group.videos.filter(v => v.video.title !== v.newTitle).length;
  }, 0);

  console.log(`Total sprint videos found: ${totalVideos}`);
  console.log(`Days covered: ${dayGroups.length}`);
  console.log('');
  console.log(`Days with 1 video: ${daysWithOneVideo}`);
  console.log(`Days with 2 videos: ${daysWithTwoVideos}`);
  console.log(`Days with 3+ videos: ${daysWithMoreVideos}`);
  console.log('');
  console.log(`Videos needing updates: ${videosToUpdate}`);
  console.log(`Videos already correct: ${totalVideos - videosToUpdate}`);

  if (daysWithMoreVideos > 0) {
    console.log('\nWARNING: Some days have more than 2 videos:');
    dayGroups
      .filter(g => g.videos.length > 2)
      .forEach(g => {
        console.log(`   Day ${g.dayNumber}: ${g.videos.length} videos`);
      });
  }

  console.log('');
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
 * Apply version updates to Bunny Stream
 */
async function applyUpdates(dayGroups: DayGroup[]): Promise<void> {
  console.log('\nAPPLYING UPDATES TO BUNNY STREAM\n');
  console.log('─'.repeat(100));

  let successCount = 0;
  let failCount = 0;
  let skipCount = 0;

  for (const group of dayGroups) {
    for (const item of group.videos) {
      // Skip if no change needed
      if (item.video.title === item.newTitle) {
        skipCount++;
        continue;
      }

      console.log(`\nDay ${item.dayNumber.toString().padStart(2, '0')} v${item.version}`);
      console.log(`   ${item.video.title}`);
      console.log(`   → ${item.newTitle}`);

      try {
        await updateVideoTitle(item.video.guid, item.newTitle);
        successCount++;
        console.log('   ✅ Updated');
      } catch (error) {
        failCount++;
        console.log(`   ❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Rate limiting: wait 100ms between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  console.log('\n' + '─'.repeat(100));
  console.log('\nUPDATE RESULTS\n');
  console.log(`✅ Successfully updated: ${successCount}`);
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
  console.log('║         Sprint Video Versioning (v1=Old, v2=New)          ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Validate environment variables
  if (!BUNNY_LIBRARY_ID || !BUNNY_API_KEY) {
    console.error('❌ Error: Missing required environment variables');
    console.error('   Required: BUNNY_STREAM_LIBRARY_ID, BUNNY_STREAM_API_KEY');
    process.exit(1);
  }

  if (!shouldApply) {
    console.log('DRY RUN MODE - No changes will be applied\n');
    console.log('   Use --apply flag to actually update videos\n');
  } else {
    console.log('LIVE MODE - Changes will be applied to Bunny Stream\n');
  }

  try {
    // Fetch all videos
    const videos = await fetchAllVideos();

    // Group and version
    const dayGroups = groupAndVersionVideos(videos);

    // Display results
    displayGroupedVideos(dayGroups);
    displaySummary(dayGroups);

    // Apply updates if requested
    if (shouldApply) {
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      await new Promise<void>((resolve) => {
        readline.question('Apply these changes? (yes/no): ', async (answer: string) => {
          readline.close();
          if (answer.toLowerCase() !== 'yes') {
            console.log('\n❌ Aborted by user');
            process.exit(0);
          }
          console.log('');
          resolve();
        });
      });

      await applyUpdates(dayGroups);
    } else {
      console.log('To apply these changes, run:');
      console.log('   npm run version-sprint-videos -- --apply\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
main();
