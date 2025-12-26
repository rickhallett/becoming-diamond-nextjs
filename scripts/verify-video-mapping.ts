#!/usr/bin/env tsx
/**
 * Verify Video Mapping Consistency
 *
 * Compares video GUIDs in sprint markdown files with:
 * 1. Current Bunny Stream library
 * 2. Versioning script's v2 (CURRENT) videos
 *
 * Ensures that the videos about to be renamed are the correct ones
 * referenced in the markdown files.
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync, readdirSync } from 'fs';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

interface BunnyVideo {
  guid: string;
  title: string;
  dateUploaded: string;
  length: number;
  status: number;
}

interface BunnyVideosResponse {
  items: BunnyVideo[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

interface VideoMapping {
  dayNumber: number;
  markdownGuid: string;
  bunnyTitle: string;
  bunnyUploadDate: string;
  isV2: boolean;
  matchedVersion: number | null;
}

const BUNNY_LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID!;
const BUNNY_API_KEY = process.env.BUNNY_STREAM_API_KEY!;
const API_BASE = 'https://video.bunnycdn.com';

/**
 * Extract video GUID from markdown frontmatter
 */
function extractVideoGuid(markdownPath: string): string | null {
  const content = readFileSync(markdownPath, 'utf-8');
  const match = content.match(/^video:\s*([a-f0-9-]+)$/m);
  return match ? match[1] : null;
}

/**
 * Extract day number from filename
 */
function extractDayNumber(filename: string): number {
  const match = filename.match(/day-(\d+)\.md/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Get all markdown video GUIDs
 */
function getMarkdownVideoGuids(): Map<number, string> {
  const sprintDir = resolve(process.cwd(), 'content/sprint');
  const files = readdirSync(sprintDir).filter(f => f.match(/day-\d+\.md/));

  const guidMap = new Map<number, string>();

  files.forEach(file => {
    const dayNumber = extractDayNumber(file);
    const guid = extractVideoGuid(resolve(sprintDir, file));
    if (guid) {
      guidMap.set(dayNumber, guid);
    }
  });

  return guidMap;
}

/**
 * Fetch all videos from Bunny Stream
 */
async function fetchAllVideos(): Promise<BunnyVideo[]> {
  const allVideos: BunnyVideo[] = [];
  let currentPage = 1;
  let totalPages = 1;

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
  }

  return allVideos;
}

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
function extractDayNumberFromTitle(title: string): number | null {
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
 * Group videos by day number
 */
function groupVideosByDay(videos: BunnyVideo[]): Map<number, BunnyVideo[]> {
  const grouped = new Map<number, BunnyVideo[]>();

  videos.forEach(video => {
    const dayNumber = extractDayNumberFromTitle(video.title);
    if (dayNumber) {
      if (!grouped.has(dayNumber)) {
        grouped.set(dayNumber, []);
      }
      grouped.get(dayNumber)!.push(video);
    }
  });

  // Sort each group by upload date
  grouped.forEach(group => {
    group.sort((a, b) => new Date(a.dateUploaded).getTime() - new Date(b.dateUploaded).getTime());
  });

  return grouped;
}

/**
 * Verify mappings
 */
function verifyMappings(
  markdownGuids: Map<number, string>,
  bunnyVideos: BunnyVideo[]
): VideoMapping[] {
  const videosByDay = groupVideosByDay(bunnyVideos);
  const videoByGuid = new Map(bunnyVideos.map(v => [v.guid, v]));
  const mappings: VideoMapping[] = [];

  markdownGuids.forEach((guid, dayNumber) => {
    const video = videoByGuid.get(guid);
    const dayVideos = videosByDay.get(dayNumber) || [];

    // Determine if this is v1 or v2 based on position in day group
    // If single video: it's v2
    // If multiple videos: latest is v2
    let isV2 = false;
    let matchedVersion: number | null = null;

    if (dayVideos.length > 0) {
      const videoIndex = dayVideos.findIndex(v => v.guid === guid);
      if (videoIndex !== -1) {
        if (dayVideos.length === 1) {
          matchedVersion = 2; // Single video is v2
          isV2 = true;
        } else {
          matchedVersion = videoIndex + 1; // v1, v2, v3, etc.
          isV2 = matchedVersion === dayVideos.length; // Is this the latest version?
        }
      }
    }

    mappings.push({
      dayNumber,
      markdownGuid: guid,
      bunnyTitle: video?.title || 'NOT FOUND',
      bunnyUploadDate: video?.dateUploaded || 'N/A',
      isV2,
      matchedVersion,
    });
  });

  return mappings.sort((a, b) => a.dayNumber - b.dayNumber);
}

/**
 * Display verification results
 */
function displayResults(mappings: VideoMapping[]): void {
  console.log('\nVIDEO MAPPING VERIFICATION\n');
  console.log('═'.repeat(120));

  const allV2 = mappings.every(m => m.isV2);
  const notFound = mappings.filter(m => m.bunnyTitle === 'NOT FOUND');
  const v1Videos = mappings.filter(m => !m.isV2 && m.matchedVersion !== null);

  console.log(`\nTotal days: ${mappings.length}`);
  console.log(`Videos are v2 (CURRENT): ${mappings.filter(m => m.isV2).length}`);
  console.log(`Videos are v1 (ARCHIVED): ${v1Videos.length}`);
  console.log(`Videos not found: ${notFound.length}`);
  console.log('');

  if (allV2 && notFound.length === 0) {
    console.log('✅ VERIFICATION PASSED: All markdown files reference v2 (CURRENT) videos\n');
  } else {
    console.log('❌ VERIFICATION FAILED: Issues detected\n');
  }

  console.log('─'.repeat(120));

  mappings.forEach(m => {
    const versionStr = m.matchedVersion ? `v${m.matchedVersion}` : 'UNKNOWN';
    const status = m.isV2 ? '✅' : '❌';
    const dayStr = `Day ${m.dayNumber.toString().padStart(2, '0')}`;
    const titleTrunc = m.bunnyTitle.substring(0, 60);

    console.log(`${status} ${dayStr.padEnd(7)} ${versionStr.padEnd(8)} ${m.markdownGuid}  ${titleTrunc}`);
  });

  console.log('═'.repeat(120));

  // Display warnings
  if (v1Videos.length > 0) {
    console.log('\n❌ WARNING: The following markdown files reference v1 (ARCHIVED) videos:\n');
    v1Videos.forEach(m => {
      console.log(`   Day ${m.dayNumber.toString().padStart(2, '0')}: ${m.bunnyTitle}`);
    });
    console.log('\n   These videos will NOT be renamed as they are archived versions.');
    console.log('   You should update the markdown files to reference v2 videos.\n');
  }

  if (notFound.length > 0) {
    console.log('\n❌ WARNING: The following video GUIDs were not found:\n');
    notFound.forEach(m => {
      console.log(`   Day ${m.dayNumber.toString().padStart(2, '0')}: ${m.markdownGuid}`);
    });
    console.log('');
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║          Video Mapping Verification Tool                  ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  // Validate environment variables
  if (!BUNNY_LIBRARY_ID || !BUNNY_API_KEY) {
    console.error('\n❌ Error: Missing required environment variables');
    console.error('   Required: BUNNY_STREAM_LIBRARY_ID, BUNNY_STREAM_API_KEY');
    process.exit(1);
  }

  try {
    console.log('\nStep 1: Reading markdown files...');
    const markdownGuids = getMarkdownVideoGuids();
    console.log(`   Found ${markdownGuids.size} sprint day files\n`);

    console.log('Step 2: Fetching videos from Bunny Stream...');
    const bunnyVideos = await fetchAllVideos();
    console.log(`   Found ${bunnyVideos.length} videos in library\n`);

    console.log('Step 3: Verifying mappings...');
    const mappings = verifyMappings(markdownGuids, bunnyVideos);

    displayResults(mappings);

    const allValid = mappings.every(m => m.isV2) && !mappings.some(m => m.bunnyTitle === 'NOT FOUND');
    process.exit(allValid ? 0 : 1);
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

main();
