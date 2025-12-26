#!/usr/bin/env node
/**
 * Generate summaries from transcripts and update sprint day markdown files
 *
 * Process:
 * 1. Read all transcript files from content/sprint/transcripts/
 * 2. For each transcript, generate a concise summary (< 100 words) using Claude API
 * 3. Update the corresponding day file in content/sprint/
 * 4. Replace body text after video embed with the generated summary
 *
 * Usage:
 *   npm run generate-summaries
 *   npm run generate-summaries -- --day 5 (single day)
 */

import { config } from 'dotenv';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import matter from 'gray-matter';
import Anthropic from '@anthropic-ai/sdk';

// Load environment variables
config({ path: path.resolve(process.cwd(), '.env.local') });

// Configuration
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!;

const CONTENT_DIR = path.join(process.cwd(), 'content/sprint');
const TRANSCRIPT_DIR = path.join(process.cwd(), 'content/sprint/transcripts');

// Validate environment
function validateEnvironment() {
  const missing: string[] = [];

  if (!ANTHROPIC_API_KEY) missing.push('ANTHROPIC_API_KEY');

  if (missing.length > 0) {
    console.error('Missing required environment variables:');
    missing.forEach(v => console.error(`  - ${v}`));
    process.exit(1);
  }
}

// Read transcript file
async function getTranscript(dayNumber: number): Promise<string | null> {
  const transcriptFile = path.join(TRANSCRIPT_DIR, `day-${dayNumber.toString().padStart(2, '0')}.md`);

  if (!existsSync(transcriptFile)) {
    console.log(`  Transcript not found: ${transcriptFile}`);
    return null;
  }

  const content = await fs.readFile(transcriptFile, 'utf-8');
  const { content: transcriptContent } = matter(content);

  return transcriptContent;
}

// Generate summary from transcript using Claude
async function generateSummary(transcript: string, title: string, dayNumber: number): Promise<string> {
  console.log(`  Generating summary with Claude API...`);

  const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  const prompt = `You are creating a concise summary for a video transcript from a 30-day personal transformation sprint.

Video Title: ${title}
Day Number: ${dayNumber}

Full Transcript:
${transcript}

Please generate a concise summary that:
1. Is LESS THAN 100 words (strict limit)
2. Is formatted as 2-3 short paragraphs for better readability (use blank lines between paragraphs)
3. Captures the key message and main action items
4. Is written in second person ("you will learn", "you'll discover")
5. Maintains the motivational tone of the original
6. Focuses on what the viewer will gain or do

Do not add any preamble or introduction. Start directly with the summary text.`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 256,
    messages: [{
      role: 'user',
      content: prompt,
    }],
  });

  const summaryText = message.content[0].type === 'text' ? message.content[0].text : '';

  // Verify word count
  const wordCount = summaryText.trim().split(/\s+/).length;
  console.log(`  Summary generated (${wordCount} words)`);

  if (wordCount > 100) {
    console.warn(`  ⚠ Warning: Summary exceeds 100 words (${wordCount} words)`);
  }

  return summaryText;
}

// Update sprint day file with generated summary
async function updateDayFile(dayNumber: number, summary: string): Promise<void> {
  const dayFile = path.join(CONTENT_DIR, `day-${dayNumber.toString().padStart(2, '0')}.md`);

  if (!existsSync(dayFile)) {
    console.error(`  Day file not found: ${dayFile}`);
    return;
  }

  // Read existing file
  const content = await fs.readFile(dayFile, 'utf-8');
  const { data: frontmatter, content: bodyContent } = matter(content);

  // Parse the body to preserve everything up to and including the video embed
  const lines = bodyContent.split('\n');
  const preservedLines: string[] = [];

  for (const line of lines) {
    preservedLines.push(line);
    // Stop after the video embed line
    if (line.trim().startsWith('{{video:')) {
      preservedLines.push(''); // Add blank line after video
      break;
    }
  }

  // Reconstruct the file with preserved content + new summary
  const updatedBody = preservedLines.join('\n') + summary + '\n';

  // Write updated file
  const updatedContent = matter.stringify(updatedBody, frontmatter);
  await fs.writeFile(dayFile, updatedContent, 'utf-8');

  console.log(`  ✓ Updated: ${dayFile}`);
}

// Process a single day
async function processDay(dayNumber: number): Promise<void> {
  console.log(`\n[${'='.repeat(60)}]`);
  console.log(`Processing Day ${dayNumber}`);
  console.log(`[${'='.repeat(60)}]`);

  try {
    // Get transcript
    const transcript = await getTranscript(dayNumber);
    if (!transcript) {
      console.log(`  Skipping day ${dayNumber} - transcript not available yet`);
      return;
    }

    // Read day file to get title
    const dayFile = path.join(CONTENT_DIR, `day-${dayNumber.toString().padStart(2, '0')}.md`);
    const dayContent = await fs.readFile(dayFile, 'utf-8');
    const { data } = matter(dayContent);
    const title = data.title || `Day ${dayNumber}`;

    // Generate summary
    const summary = await generateSummary(transcript, title, dayNumber);

    // Update day file
    await updateDayFile(dayNumber, summary);

    console.log(`✓ Day ${dayNumber} complete\n`);
  } catch (error) {
    console.error(`✗ Day ${dayNumber} failed:`, error instanceof Error ? error.message : String(error));
  }
}

// Main function
async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║      Sprint Summary Generation Tool                       ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Validate environment
  validateEnvironment();
  console.log('✓ Environment variables validated\n');

  // Parse arguments
  const args = process.argv.slice(2);
  const dayArg = args.find(arg => arg.startsWith('--day='));

  const singleDay = dayArg ? parseInt(dayArg.split('=')[1]) : null;

  if (singleDay) {
    if (singleDay < 1 || singleDay > 30) {
      console.error('Day number must be between 1 and 30');
      process.exit(1);
    }
    console.log(`Processing single day: ${singleDay}\n`);
    await processDay(singleDay);
  } else {
    console.log('Processing all available transcripts\n');
    for (let day = 1; day <= 30; day++) {
      await processDay(day);
    }
  }

  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                    COMPLETE                                ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(`\nSummaries applied to: ${CONTENT_DIR}\n`);
}

main().catch(error => {
  console.error('\n✗ Script failed:', error);
  process.exit(1);
});
