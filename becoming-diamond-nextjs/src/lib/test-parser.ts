/**
 * Parser Test Utility
 * Run this to test the course parser with the actual course content
 * Usage: ts-node --esm src/lib/test-parser.ts
 */

import { getCourseContent, getAllCourses } from './content';

async function testParser() {
  console.log('Testing Course Parser...\n');

  try {
    // Test getting all courses
    console.log('1. Testing getAllCourses()...');
    const courses = await getAllCourses();
    console.log(`Found ${courses.length} courses`);

    if (courses.length > 0) {
      courses.forEach((course) => {
        console.log(`  - ${course.title} (${course.totalChapters} chapters, ${course.totalSlides} slides)`);
      });
    }

    // Test getting specific course
    console.log('\n2. Testing getCourseContent()...');
    const course = await getCourseContent('pr1-stabilize-snowflakes-to-diamonds');

    if (!course) {
      console.error('❌ Course not found!');
      return;
    }

    console.log('✅ Course loaded successfully!');
    console.log(`\nCourse: ${course.title}`);
    console.log(`Pressure Room: ${course.metadata.pressureRoom}`);
    console.log(`Instructor: ${course.metadata.instructor}`);
    console.log(`Duration: ${course.metadata.duration}`);
    console.log(`Total Chapters: ${course.totalChapters}`);
    console.log(`Total Slides: ${course.totalSlides}`);

    // Show chapter breakdown
    console.log('\nChapter Breakdown:');
    course.chapters.forEach((chapter, index) => {
      console.log(`  Chapter ${index + 1} (Part ${chapter.part}): ${chapter.title}`);
      console.log(`    - ${chapter.slides.length} slides`);

      if (index < 3) {
        // Show first few slides of first 3 chapters
        chapter.slides.slice(0, 3).forEach((slide, slideIndex) => {
          const contentPreview = slide.content
            .replace(/<[^>]*>/g, '')
            .substring(0, 60)
            .trim();
          console.log(`      ${slideIndex + 1}. ${slide.title} (${contentPreview}...)`);
        });
      }
    });

    // Show statistics
    console.log('\nStatistics:');
    const partCounts = [0, 0, 0, 0, 0];
    course.chapters.forEach((chapter) => {
      partCounts[chapter.part]++;
    });

    partCounts.forEach((count, part) => {
      if (count > 0) {
        console.log(`  Part ${part}: ${count} chapters`);
      }
    });

    console.log('\n✅ Parser test completed successfully!');
  } catch (error) {
    console.error('❌ Parser test failed:', error);
    if (error instanceof Error) {
      console.error(error.stack);
    }
  }
}

testParser();
