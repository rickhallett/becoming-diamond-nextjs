#!/usr/bin/env node

/**
 * Update all video IDs in sprint markdown files
 * Maps new Bunny library video IDs to sprint days
 */

const fs = require('fs');
const path = require('path');

// Video ID mapping from Bunny API (ordered by day)
const VIDEO_MAPPING = {
  1: '4a151e6b-7911-41b9-b1ef-c6fa00bafaa5',  // Day 1 Welcome and Baseline
  2: 'daf70a49-4110-4f52-a2de-7f273a8475c1',  // Day 2 Swiss Army Knife Stand Strong Be Strong
  3: 'a2aea625-4738-46f2-b341-46ca7f7dc060',  // Day 3 Swiss Army Knife Breath
  4: 'c5a735ac-9c1e-45d0-a19c-80028e59da35',  // Day 4 Swiss Army Knife The Brain
  5: 'df89060d-213c-431e-8d77-90b0d756e275',  // Day 5 Pattern Interupts
  6: '83af77c8-a9dd-4519-8ef3-0ac4b5734e7b',  // Day 6 Grounding in The Present Moment
  7: 'df982ffb-df9a-4755-9fe2-366594e0e2b8',  // Day 7 Congratulations
  8: 'bb119231-068b-485a-9104-1a7603e4d8f5',  // Day 8 Introduction to The Boss
  9: '0e8b5da3-4312-466e-b500-5fe34dab888f',  // Day 9 Identity Awareness
  10: 'd33ba1bf-d0d3-4e02-bb51-a29d46bfc9f2', // Day 10 ART Accept Release Transform
  11: 'ed4d0b12-2a21-4d41-b102-6c3ac51ad19c', // Day 11 Triggers Are Teachers
  12: 'fe8c2939-7e6c-4863-8538-d98ec5d9fdc0', // Day 12 Break The Default Loop
  13: 'ecf0a25a-8df9-42e7-b62a-82118b555406', // Day 13 Run Your Breath, Run Your Life
  14: '2fa0592e-cc84-489f-818a-1897ebcbb5aa', // Day 14 Discipline Plus Consistency
  15: 'ff25ddf2-0576-417d-a861-985f548fa788', // Day 15 The Pressure Room
  16: '78607971-138c-4f4e-85f9-072833822fe1', // Day 16 ART Squared
  17: '332ea0f7-36f8-4a54-b8fb-7286a9498019', // Day 17 Leading the Field
  18: '19706b3e-6a5f-44aa-b473-7fe7d18d7e79', // Day 18 Calmness is the New Currency
  19: 'f19e972a-04d6-46bd-9fa3-40a72e8938f6', // Day 19 Rewire Through Presence
  20: '649a2a38-db81-4912-94da-c70c6bc1e709', // Day 20 Upgrade Your Capacity
  21: '411a4444-0be6-48c0-9f71-825858bf247d', // Day 21 Week Three Strengthen Summation
  22: '49903bed-23fd-4f88-89b2-ab258e98f77a', // Day 22 Week Four Shine Proximity Prime
};

const CONTENT_DIR = path.join(__dirname, '../content/sprint');

console.log('\n=== UPDATING VIDEO IDs IN SPRINT FILES ===\n');

let updated = 0;
let added = 0;
let skipped = 0;
let errors = 0;

for (let day = 1; day <= 30; day++) {
  const dayFile = path.join(CONTENT_DIR, `day-${String(day).padStart(2, '0')}.md`);
  const videoId = VIDEO_MAPPING[day];

  if (!fs.existsSync(dayFile)) {
    console.log(`⚪ Day ${day}: File not found, skipping`);
    skipped++;
    continue;
  }

  if (!videoId) {
    console.log(`⚪ Day ${day}: No video available in library, skipping`);
    skipped++;
    continue;
  }

  try {
    let content = fs.readFileSync(dayFile, 'utf-8');
    const hasVideo = content.match(/\{\{video:([a-f0-9-]+)\}\}/);

    if (hasVideo) {
      const oldId = hasVideo[1];
      if (oldId === videoId) {
        console.log(`✅ Day ${day}: Already has correct video ID`);
        skipped++;
      } else {
        content = content.replace(
          /\{\{video:[a-f0-9-]+\}\}/,
          `{{video:${videoId}}}`
        );
        fs.writeFileSync(dayFile, content, 'utf-8');
        console.log(`🔄 Day ${day}: Updated video ID`);
        console.log(`   Old: ${oldId}`);
        console.log(`   New: ${videoId}`);
        updated++;
      }
    } else {
      // Find a good place to insert the video (after frontmatter)
      const frontmatterEnd = content.indexOf('---', 3) + 3;
      if (frontmatterEnd > 2) {
        // Insert after first heading
        const firstHeading = content.indexOf('#', frontmatterEnd);
        if (firstHeading > 0) {
          const insertPos = content.indexOf('\n', firstHeading) + 1;
          content = content.slice(0, insertPos) +
                   `\n{{video:${videoId}}}\n` +
                   content.slice(insertPos);
          fs.writeFileSync(dayFile, content, 'utf-8');
          console.log(`➕ Day ${day}: Added video ID`);
          console.log(`   ID: ${videoId}`);
          added++;
        }
      }
    }
  } catch (error) {
    console.error(`❌ Day ${day}: Error - ${error.message}`);
    errors++;
  }
}

console.log('\n=== SUMMARY ===\n');
console.log(`Updated: ${updated}`);
console.log(`Added: ${added}`);
console.log(`Skipped: ${skipped}`);
console.log(`Errors: ${errors}`);
console.log(`\nTotal processed: ${updated + added + skipped + errors}`);

if (updated > 0 || added > 0) {
  console.log('\n✅ Video IDs updated successfully!');
  console.log('\n⚠️  IMPORTANT: All videos show "Failed" status in Bunny.');
  console.log('   You must re-encode them in Bunny Stream dashboard:');
  console.log('   1. Go to https://dash.bunny.net/stream/512164');
  console.log('   2. Select failed videos');
  console.log('   3. Re-encode or re-upload');
  console.log('   4. Wait for encoding to complete (status = Finished)');
}
