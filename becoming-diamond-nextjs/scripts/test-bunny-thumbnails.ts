#!/usr/bin/env node
/**
 * Test script to verify Bunny Stream video metadata and thumbnail availability
 *
 * Usage:
 *   npm run test:thumbnails
 *   or
 *   npx tsx scripts/test-bunny-thumbnails.ts
 *
 * This script:
 * - Fetches video metadata from Bunny Stream API
 * - Tests thumbnail URL accessibility
 * - Shows available metadata fields
 * - Verifies thumbnail URL patterns
 */

import { config } from 'dotenv';
import path from 'path';
import crypto from 'crypto';

// Load .env.local file
config({ path: path.resolve(process.cwd(), '.env.local') });

// Use same validation as production code
function validateBunnyCredentials(): { libraryId: string; apiKey: string; cdnHostname: string } {
  const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID;
  const apiKey = process.env.BUNNY_STREAM_API_KEY;
  const cdnHostname = process.env.BUNNY_STREAM_CDN_HOSTNAME;

  if (!libraryId || libraryId.trim() === '') {
    throw new Error('BUNNY_STREAM_LIBRARY_ID is not configured');
  }

  if (!apiKey || apiKey.trim() === '') {
    throw new Error('BUNNY_STREAM_API_KEY is not configured');
  }

  if (!cdnHostname || cdnHostname.trim() === '') {
    throw new Error('BUNNY_STREAM_CDN_HOSTNAME is not configured');
  }

  return { libraryId, apiKey, cdnHostname };
}

interface BunnyVideo {
  guid: string;
  title: string;
  dateUploaded: string;
  length: number;
  status: number;
  views: number;
  thumbnailFileName?: string;
  thumbnailTime?: number;
  availableResolutions?: string;
  [key: string]: unknown;
}

interface BunnyVideosResponse {
  items: BunnyVideo[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

async function fetchVideoMetadata(libraryId: string, apiKey: string, videoId: string): Promise<BunnyVideo | null> {
  try {
    const response = await fetch(
      `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`,
      {
        headers: {
          'AccessKey': apiKey,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch video ${videoId}: ${response.status} ${response.statusText}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching video ${videoId}:`, error);
    return null;
  }
}

async function fetchAllVideos(libraryId: string, apiKey: string): Promise<BunnyVideo[]> {
  try {
    const response = await fetch(
      `https://video.bunnycdn.com/library/${libraryId}/videos?page=1&itemsPerPage=100`,
      {
        headers: {
          'AccessKey': apiKey,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch videos: ${response.status} ${response.statusText}`);
    }

    const data: BunnyVideosResponse = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
}

async function testThumbnailUrl(url: string): Promise<{ ok: boolean; status: number }> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return { ok: response.ok, status: response.status };
  } catch (error) {
    return { ok: false, status: 0 };
  }
}

async function testApiThumbnail(libraryId: string, apiKey: string, videoId: string): Promise<{ success: boolean; url?: string; contentType?: string }> {
  try {
    // Test direct API thumbnail endpoint
    const apiUrl = `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}/thumbnail`;
    const response = await fetch(apiUrl, {
      headers: {
        'AccessKey': apiKey,
        'Accept': 'image/jpeg,image/png,image/webp,*/*',
      },
    });

    if (response.ok) {
      return {
        success: true,
        url: apiUrl,
        contentType: response.headers.get('content-type') || undefined,
      };
    }

    return { success: false };
  } catch {
    return { success: false };
  }
}

function generateSignedToken(libraryId: string, apiKey: string, expirationTime: number, videoId: string): string {
  const tokenBase = `${libraryId}${apiKey}${expirationTime}${videoId}`;
  return crypto.createHash('sha256').update(tokenBase).digest('hex');
}

function generateThumbnailUrls(videoId: string, cdnHostname: string, thumbnailFileName?: string, libraryId?: string, apiKey?: string): string[] {
  const urls: string[] = [];
  const expirationTime = Math.floor(Date.now() / 1000) + 86400; // 24 hours

  // Generate signed token (same logic as video token API)
  const token = libraryId && apiKey ? generateSignedToken(libraryId, apiKey, expirationTime, videoId) : '';

  // Pattern 1: Signed URLs with token (like video streams)
  if (thumbnailFileName && token) {
    urls.push(`https://${cdnHostname}/${videoId}/${thumbnailFileName}?token=${token}&expires=${expirationTime}`);
  }
  if (token) {
    urls.push(`https://${cdnHostname}/${videoId}/thumbnail.jpg?token=${token}&expires=${expirationTime}`);
  }

  // Pattern 2: Unsigned URLs (public access)
  if (thumbnailFileName) {
    urls.push(`https://${cdnHostname}/${videoId}/${thumbnailFileName}`);
  }
  urls.push(`https://${cdnHostname}/${videoId}/thumbnail.jpg`);

  // Pattern 3: Preview image (screenshot at different resolutions)
  urls.push(`https://${cdnHostname}/${videoId}/preview.webp`);

  // Pattern 4: Using iframe hostname (often public)
  const iframeHostname = 'iframe.mediadelivery.net';
  urls.push(`https://${iframeHostname}/embed/${libraryId}/${videoId}/thumbnail`);

  // Pattern 5: Direct video.bunnycdn.com play endpoint
  urls.push(`https://video.bunnycdn.com/play/${libraryId}/${videoId}/thumbnail.jpg`);

  // Pattern 6: Using thumbnail endpoint with time parameter
  if (thumbnailFileName) {
    urls.push(`https://video.bunnycdn.com/play/${libraryId}/${videoId}/thumbnail`);
  }

  return urls;
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║         Bunny Stream Thumbnail Test Script                ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Validate credentials
  let credentials;
  try {
    credentials = validateBunnyCredentials();
    console.log('✓ Bunny Stream credentials validated\n');
  } catch (error) {
    console.error('✗ Credential validation failed:');
    console.error(`  ${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
  }

  const { libraryId, apiKey, cdnHostname } = credentials;

  console.log('Configuration:');
  console.log(`  Library ID: ${libraryId}`);
  console.log(`  CDN Hostname: ${cdnHostname}`);
  console.log(`  API Key: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}\n`);

  // Fetch all videos
  console.log('Fetching videos from Bunny Stream...\n');
  const videos = await fetchAllVideos(libraryId, apiKey);

  if (videos.length === 0) {
    console.log('✗ No videos found in library\n');
    process.exit(1);
  }

  console.log(`✓ Found ${videos.length} videos\n`);
  console.log('─'.repeat(60));

  // Test first 5 videos (or all if less than 5)
  const testCount = Math.min(5, videos.length);
  console.log(`\nTesting metadata and thumbnails for first ${testCount} videos:\n`);

  for (let i = 0; i < testCount; i++) {
    const video = videos[i];
    console.log(`\n[${i + 1}/${testCount}] ${video.title}`);
    console.log(`    Video ID: ${video.guid}`);
    console.log(`    Status: ${video.status === 4 ? 'Ready' : `Not Ready (${video.status})`}`);
    console.log(`    Duration: ${Math.floor(video.length / 60)}m ${video.length % 60}s`);
    console.log(`    Uploaded: ${new Date(video.dateUploaded).toLocaleDateString()}`);
    console.log(`    Views: ${video.views}`);

    // Fetch detailed metadata
    const metadata = await fetchVideoMetadata(libraryId, apiKey, video.guid);

    if (metadata) {
      console.log(`    Thumbnail Filename: ${metadata.thumbnailFileName || 'Not set'}`);
      console.log(`    Thumbnail Time: ${metadata.thumbnailTime || 'Not set'}`);
      console.log(`    Available Resolutions: ${metadata.availableResolutions || 'Not set'}`);

      // Test API thumbnail endpoint first
      console.log(`\n    Testing API thumbnail endpoint:`);
      const apiResult = await testApiThumbnail(libraryId, apiKey, video.guid);
      if (apiResult.success) {
        console.log(`      ✓ API thumbnail endpoint works!`);
        console.log(`        → URL: ${apiResult.url}`);
        console.log(`        → Content-Type: ${apiResult.contentType}`);
        console.log(`        → RECOMMENDED: Use this API endpoint for production`);
      } else {
        console.log(`      ✗ API thumbnail endpoint not available`);
      }

      // Generate and test thumbnail URLs
      const thumbnailUrls = generateThumbnailUrls(video.guid, cdnHostname, metadata.thumbnailFileName, libraryId, apiKey);
      console.log(`\n    Testing ${thumbnailUrls.length} thumbnail URL patterns:`);

      let foundWorkingUrl = false;
      for (const url of thumbnailUrls) {
        const result = await testThumbnailUrl(url);
        const status = result.ok ? '✓' : '✗';
        const displayUrl = url.length > 90 ? url.substring(0, 87) + '...' : url;
        const statusInfo = result.status > 0 ? ` (${result.status})` : ' (network error)';
        console.log(`      ${status} ${displayUrl}${statusInfo}`);

        if (result.ok && !foundWorkingUrl) {
          foundWorkingUrl = true;
          console.log(`        → WORKING! Use this pattern for production`);
          console.log(`        → Pattern: ${url.includes('token') ? 'Signed (requires token)' : 'Public (no token)'}`);
          console.log(`        → Full URL: ${url}`);
        }
      }
    } else {
      console.log('    ✗ Failed to fetch detailed metadata');
    }

    console.log('─'.repeat(60));
  }

  // Summary
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                         SUMMARY                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log('Next Steps:');
  console.log('  1. Review the working thumbnail access method above');
  console.log('  2. If API endpoint works:');
  console.log('     - Create new API route: /api/video/[videoId]/thumbnail');
  console.log('     - Proxy thumbnail requests through your API with auth');
  console.log('     - Use same AccessKey authentication as production');
  console.log('  3. If CDN URLs work:');
  console.log('     - Update token API to include thumbnail URLs');
  console.log('     - Generate signed tokens similar to video streams');
  console.log('  4. Update VideoPlayer component to use thumbnails as poster');
  console.log('  5. Consider caching thumbnail URLs to reduce API calls\n');

  console.log('API Response Fields Available:');
  if (videos.length > 0) {
    const sampleVideo = videos[0];
    const fields = Object.keys(sampleVideo).sort();
    fields.forEach(field => {
      const value = sampleVideo[field];
      const type = Array.isArray(value) ? 'array' : typeof value;
      console.log(`  - ${field} (${type})`);
    });
  }

  console.log('\n✓ Test complete\n');
}

main().catch((error) => {
  console.error('\n✗ Script failed with error:');
  console.error(error);
  process.exit(1);
});
