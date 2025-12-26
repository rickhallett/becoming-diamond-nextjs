#!/usr/bin/env node
/**
 * Generate transcripts for all 30-day sprint videos
 *
 * Process:
 * 1. Read sprint day markdown files to get video IDs
 * 2. Download video from Bunny Stream (or use cached)
 * 3. Extract audio using ffmpeg
 * 4. Transcribe with OpenAI Whisper API
 * 5. Format/enhance transcript with Claude API
 * 6. Save as markdown in content/sprint/transcripts/
 *
 * Usage:
 *   npm run generate-transcripts
 *   npm run generate-transcripts -- --day 5 (single day)
 *   npm run generate-transcripts -- --skip-download (use cached videos)
 */

import { config } from 'dotenv';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import matter from 'gray-matter';
import Anthropic from '@anthropic-ai/sdk';

const execAsync = promisify(exec);

// Load environment variables
config({ path: path.resolve(process.cwd(), '.env.local') });

// Configuration
const BUNNY_LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID!;
const BUNNY_API_KEY = process.env.BUNNY_STREAM_API_KEY!;
const BUNNY_CDN_HOSTNAME = process.env.BUNNY_STREAM_CDN_HOSTNAME!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!;

const CONTENT_DIR = path.join(process.cwd(), 'content/sprint');
const CACHE_DIR = path.join(process.cwd(), 'tmp/video-cache');
const AUDIO_DIR = path.join(process.cwd(), 'tmp/audio-cache');
const TRANSCRIPT_DIR = path.join(process.cwd(), 'content/sprint/transcripts');

// Validate environment
function validateEnvironment() {
  const missing: string[] = [];

  if (!BUNNY_LIBRARY_ID) missing.push('BUNNY_STREAM_LIBRARY_ID');
  if (!BUNNY_API_KEY) missing.push('BUNNY_STREAM_API_KEY');
  if (!BUNNY_CDN_HOSTNAME) missing.push('BUNNY_STREAM_CDN_HOSTNAME');
  if (!OPENAI_API_KEY) missing.push('OPENAI_API_KEY');
  if (!ANTHROPIC_API_KEY) missing.push('ANTHROPIC_API_KEY');

  if (missing.length > 0) {
    console.error('Missing required environment variables:');
    missing.forEach(v => console.error(`  - ${v}`));
    process.exit(1);
  }
}

// Ensure directories exist
async function ensureDirectories() {
  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.mkdir(AUDIO_DIR, { recursive: true });
  await fs.mkdir(TRANSCRIPT_DIR, { recursive: true });
}

// Read sprint day file to get video ID
async function getVideoId(dayNumber: number): Promise<{ videoId: string; title: string } | null> {
  const dayFile = path.join(CONTENT_DIR, `day-${dayNumber.toString().padStart(2, '0')}.md`);

  if (!existsSync(dayFile)) {
    console.error(`Day ${dayNumber} file not found: ${dayFile}`);
    return null;
  }

  const content = await fs.readFile(dayFile, 'utf-8');
  const { data } = matter(content);

  if (!data.video) {
    console.error(`No video ID found in day ${dayNumber} frontmatter`);
    return null;
  }

  return {
    videoId: data.video,
    title: data.title || `Day ${dayNumber}`,
  };
}

// Generate signed token for video download
function generateToken(videoId: string): { token: string; expires: number } {
  const crypto = require('crypto');
  const expirationTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour
  const tokenBase = `${BUNNY_LIBRARY_ID}${BUNNY_API_KEY}${expirationTime}${videoId}`;
  const token = crypto.createHash('sha256').update(tokenBase).digest('hex');

  return { token, expires: expirationTime };
}

// Download video from Bunny Stream
async function downloadVideo(videoId: string, dayNumber: number): Promise<string> {
  const videoPath = path.join(CACHE_DIR, `day-${dayNumber.toString().padStart(2, '0')}.mp4`);

  // Skip if already cached
  if (existsSync(videoPath)) {
    console.log(`  Using cached video: ${videoPath}`);
    return videoPath;
  }

  console.log(`  Downloading video...`);

  const { token, expires } = generateToken(videoId);

  // Try multiple video quality options
  const qualities = ['1080p', '720p', '480p', '360p'];
  let downloadUrl = '';

  for (const quality of qualities) {
    const testUrl = `https://${BUNNY_CDN_HOSTNAME}/${videoId}/play_${quality}.mp4?token=${token}&expires=${expires}`;

    try {
      // Test if URL is accessible
      const response = await fetch(testUrl, { method: 'HEAD' });
      if (response.ok) {
        downloadUrl = testUrl;
        console.log(`  Found video at ${quality}`);
        break;
      }
    } catch {
      continue;
    }
  }

  if (!downloadUrl) {
    throw new Error(`No accessible video quality found for ${videoId}`);
  }

  // Download with curl
  await execAsync(`curl -o "${videoPath}" "${downloadUrl}"`);
  console.log(`  Downloaded to: ${videoPath}`);

  return videoPath;
}

// Extract audio from video using ffmpeg
async function extractAudio(videoPath: string, dayNumber: number): Promise<string> {
  const audioPath = path.join(AUDIO_DIR, `day-${dayNumber.toString().padStart(2, '0')}.mp3`);

  // Skip if already extracted
  if (existsSync(audioPath)) {
    console.log(`  Using cached audio: ${audioPath}`);
    return audioPath;
  }

  console.log(`  Extracting audio with ffmpeg...`);

  // Check if ffmpeg is installed
  try {
    await execAsync('ffmpeg -version');
  } catch {
    throw new Error('ffmpeg not found. Install with: sudo apt install ffmpeg (or brew install ffmpeg on macOS)');
  }

  // Extract audio as MP3
  await execAsync(`ffmpeg -i "${videoPath}" -vn -acodec libmp3lame -q:a 2 "${audioPath}" -y`);
  console.log(`  Audio extracted to: ${audioPath}`);

  return audioPath;
}

// Transcribe audio with OpenAI Whisper
async function transcribeAudio(audioPath: string): Promise<string> {
  console.log(`  Transcribing with Whisper API...`);

  const formData = new FormData();
  const audioBuffer = await fs.readFile(audioPath);
  const audioBlob = new Blob([audioBuffer], { type: 'audio/mp3' });

  formData.append('file', audioBlob, path.basename(audioPath));
  formData.append('model', 'whisper-1');
  formData.append('response_format', 'verbose_json');
  formData.append('timestamp_granularities[]', 'segment');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Whisper API error: ${response.status} ${error}`);
  }

  const result = await response.json();
  console.log(`  Transcription complete (${result.duration?.toFixed(1)}s audio)`);

  return result.text;
}

// Format transcript with Claude API
async function formatTranscript(rawTranscript: string, title: string, dayNumber: number): Promise<string> {
  console.log(`  Formatting with Claude API...`);

  const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  const prompt = `You are formatting a video transcript for a 30-day personal transformation sprint.

Video Title: ${title}
Day Number: ${dayNumber}

Raw transcript from Whisper:
${rawTranscript}

Please format this transcript as a clean, readable markdown document with:
1. Proper paragraphs (break at natural sentence boundaries, not arbitrary line breaks)
2. Add section headings where topic shifts occur (use ## for sections)
3. Fix capitalization and punctuation
4. Remove filler words and false starts if excessive
5. Add emphasis (*italic*) for key concepts or important points
6. Keep the speaker's authentic voice and tone
7. If there are any action items or key takeaways, add a "Key Takeaways" section at the end

Do not add a title at the top (we'll add frontmatter separately).
Do not add any preamble - start directly with the formatted content.`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    messages: [{
      role: 'user',
      content: prompt,
    }],
  });

  const formattedText = message.content[0].type === 'text' ? message.content[0].text : '';
  console.log(`  Formatting complete`);

  return formattedText;
}

// Save transcript as markdown
async function saveTranscript(
  content: string,
  dayNumber: number,
  title: string,
  videoId: string
): Promise<void> {
  const filename = `day-${dayNumber.toString().padStart(2, '0')}.md`;
  const filepath = path.join(TRANSCRIPT_DIR, filename);

  const frontmatter = `---
day: ${dayNumber}
title: "${title}"
videoId: ${videoId}
generatedAt: ${new Date().toISOString()}
---

`;

  await fs.writeFile(filepath, frontmatter + content, 'utf-8');
  console.log(`  Saved transcript: ${filepath}`);
}

// Process a single day
async function processDay(dayNumber: number, skipDownload: boolean = false): Promise<void> {
  console.log(`\n[${'='.repeat(60)}]`);
  console.log(`Processing Day ${dayNumber}`);
  console.log(`[${'='.repeat(60)}]`);

  try {
    // Get video ID
    const videoInfo = await getVideoId(dayNumber);
    if (!videoInfo) {
      console.error(`Skipping day ${dayNumber} - no video info`);
      return;
    }

    const { videoId, title } = videoInfo;
    console.log(`  Video ID: ${videoId}`);
    console.log(`  Title: ${title}`);

    // Download video (or use cache)
    let videoPath: string;
    if (skipDownload) {
      videoPath = path.join(CACHE_DIR, `day-${dayNumber.toString().padStart(2, '0')}.mp4`);
      if (!existsSync(videoPath)) {
        throw new Error('Video not in cache. Run without --skip-download first.');
      }
      console.log(`  Using cached video: ${videoPath}`);
    } else {
      videoPath = await downloadVideo(videoId, dayNumber);
    }

    // Extract audio
    const audioPath = await extractAudio(videoPath, dayNumber);

    // Transcribe
    const rawTranscript = await transcribeAudio(audioPath);

    // Format with Claude
    const formattedTranscript = await formatTranscript(rawTranscript, title, dayNumber);

    // Save
    await saveTranscript(formattedTranscript, dayNumber, title, videoId);

    console.log(`✓ Day ${dayNumber} complete\n`);
  } catch (error) {
    console.error(`✗ Day ${dayNumber} failed:`, error instanceof Error ? error.message : String(error));
  }
}

// Main function
async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║      Sprint Video Transcript Generation Tool              ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Validate environment
  validateEnvironment();
  console.log('✓ Environment variables validated\n');

  // Ensure directories
  await ensureDirectories();
  console.log('✓ Directories created\n');

  // Parse arguments
  const args = process.argv.slice(2);
  const dayArg = args.find(arg => arg.startsWith('--day='));
  const skipDownload = args.includes('--skip-download');

  const singleDay = dayArg ? parseInt(dayArg.split('=')[1]) : null;

  if (singleDay) {
    if (singleDay < 1 || singleDay > 30) {
      console.error('Day number must be between 1 and 30');
      process.exit(1);
    }
    console.log(`Processing single day: ${singleDay}\n`);
    await processDay(singleDay, skipDownload);
  } else {
    console.log('Processing all 30 days\n');
    for (let day = 1; day <= 30; day++) {
      await processDay(day, skipDownload);
    }
  }

  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                    COMPLETE                                ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(`\nTranscripts saved to: ${TRANSCRIPT_DIR}`);
  console.log(`Cache directories: ${CACHE_DIR}, ${AUDIO_DIR}\n`);
}

main().catch(error => {
  console.error('\n✗ Script failed:', error);
  process.exit(1);
});
