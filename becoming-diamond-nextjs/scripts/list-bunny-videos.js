#!/usr/bin/env node

/**
 * Query Bunny Stream API to list all videos
 * Usage: node scripts/list-bunny-videos.js
 */

require('dotenv').config({ path: '.env.local' });

const BUNNY_LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID;
const BUNNY_API_KEY = process.env.BUNNY_STREAM_API_KEY;

if (!BUNNY_LIBRARY_ID || !BUNNY_API_KEY) {
  console.error('Error: BUNNY_STREAM_LIBRARY_ID and BUNNY_STREAM_API_KEY must be set in .env.local');
  process.exit(1);
}

async function listVideos() {
  try {
    const response = await fetch(
      `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos?page=1&itemsPerPage=100&orderBy=date`,
      {
        headers: {
          'AccessKey': BUNNY_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Bunny API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const videos = data.items || [];

    console.log('\n=== BUNNY STREAM VIDEO LIBRARY ===\n');
    console.log(`Library ID: ${BUNNY_LIBRARY_ID}`);
    console.log(`Total Videos: ${videos.length}`);
    console.log(`Total Items: ${data.totalItems || videos.length}\n`);

    if (videos.length === 0) {
      console.log('No videos found in library.');
      return;
    }

    // Sort by title (looking for "Day" pattern)
    const sortedVideos = videos.sort((a, b) => {
      // Try to extract day number from title
      const dayA = extractDayNumber(a.title);
      const dayB = extractDayNumber(b.title);

      if (dayA !== null && dayB !== null) {
        return dayA - dayB;
      }

      // Fall back to date sorting
      return new Date(b.dateUploaded) - new Date(a.dateUploaded);
    });

    console.log('=== VIDEOS (Ordered by Day) ===\n');

    sortedVideos.forEach((video, index) => {
      const dayNum = extractDayNumber(video.title);
      const duration = formatDuration(video.length);
      const status = getStatusText(video.status);
      const uploadDate = new Date(video.dateUploaded).toLocaleDateString();

      console.log(`${index + 1}. ${video.title}`);
      console.log(`   ID: ${video.guid}`);
      console.log(`   Day: ${dayNum !== null ? dayNum : 'N/A'}`);
      console.log(`   Status: ${status}`);
      console.log(`   Duration: ${duration}`);
      console.log(`   Uploaded: ${uploadDate}`);
      console.log(`   Views: ${video.views}`);
      console.log(`   Resolution: ${video.width}x${video.height}`);
      console.log('');
    });

    // Generate markdown table
    console.log('\n=== MARKDOWN TABLE FOR DOCS ===\n');
    console.log('| Day | Video ID | Title | Status | Duration |');
    console.log('|-----|----------|-------|--------|----------|');

    sortedVideos.forEach(video => {
      const dayNum = extractDayNumber(video.title);
      const duration = formatDuration(video.length);
      const status = getStatusText(video.status);

      if (dayNum !== null) {
        console.log(`| ${dayNum} | \`${video.guid}\` | ${video.title} | ${status} | ${duration} |`);
      }
    });

    // Check current sprint embeddings
    console.log('\n\n=== CHECKING CURRENT SPRINT EMBEDDINGS ===\n');

    const fs = require('fs');
    const path = require('path');

    for (let day = 1; day <= 30; day++) {
      const dayFile = path.join(__dirname, `../content/sprint/day-${String(day).padStart(2, '0')}.md`);

      if (fs.existsSync(dayFile)) {
        const content = fs.readFileSync(dayFile, 'utf-8');
        const videoMatch = content.match(/\{\{video:([a-f0-9-]+)\}\}/);

        if (videoMatch) {
          const embeddedId = videoMatch[1];
          const video = videos.find(v => v.guid === embeddedId);

          if (video) {
            console.log(`✅ Day ${day}: Video found - "${video.title}"`);
            console.log(`   ID: ${embeddedId}`);
          } else {
            console.log(`❌ Day ${day}: Video ID not found in library`);
            console.log(`   ID: ${embeddedId}`);
          }
        } else {
          console.log(`⚪ Day ${day}: No video embedded`);
        }
      }
    }

  } catch (error) {
    console.error('Error fetching videos:', error.message);
    process.exit(1);
  }
}

function extractDayNumber(title) {
  // Match patterns like "Day 1", "Day 01", "day-1", etc.
  const match = title.match(/day[:\s-]*(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
}

function formatDuration(seconds) {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

function getStatusText(status) {
  const statusMap = {
    0: 'Queued',
    1: 'Processing',
    2: 'Encoding',
    3: 'Finished',
    4: 'Failed',
    5: 'Cancelled',
  };
  return statusMap[status] || `Unknown (${status})`;
}

// Run the script
listVideos();
