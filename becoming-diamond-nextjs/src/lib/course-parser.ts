/**
 * Course Parser
 * Converts markdown course content into structured course data with chapters and slides
 */

import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import type {
  ParsedCourse,
  CourseChapter,
  CourseSlide,
  CourseMetadata,
  MarkdownSection,
  MediaReference,
} from '@/types/course';

/**
 * Parses markdown content into a structured course
 * @param markdownContent - Raw markdown string with frontmatter
 * @returns Parsed course object with chapters and slides
 */
export async function parseCourseMarkdown(
  markdownContent: string
): Promise<ParsedCourse> {
  // Parse frontmatter
  const { data: frontmatter, content } = matter(markdownContent);

  // Extract metadata
  const metadata: CourseMetadata = {
    id: frontmatter.id || 'unknown-course',
    title: frontmatter.title || 'Untitled Course',
    pressureRoom: frontmatter.pressureRoom || frontmatter.gateway || 1,
    duration: frontmatter.duration || '8 weeks',
    difficulty: frontmatter.difficulty || 'Beginner',
    instructor: frontmatter.instructor || 'Michael Dugan',
    thumbnail: frontmatter.thumbnail || '/courses/default-thumbnail.jpg',
    published: frontmatter.published !== false,
    description: frontmatter.description,
    estimatedHours: frontmatter.estimatedHours,
  };

  // Parse content into sections
  const sections = parseMarkdownSections(content);

  // Group sections into chapters (## headers) and slides (### headers)
  const chapters = groupIntoChapters(sections, metadata.id);

  // Calculate totals
  const totalSlides = chapters.reduce(
    (sum, chapter) => sum + chapter.slides.length,
    0
  );
  const totalChapters = chapters.length;

  return {
    id: metadata.id,
    title: metadata.title,
    metadata,
    chapters,
    totalSlides,
    totalChapters,
    estimatedHours: metadata.estimatedHours,
  };
}

/**
 * Parses markdown content into sections based on heading levels
 * @param content - Markdown content without frontmatter
 * @returns Array of markdown sections
 */
function parseMarkdownSections(content: string): MarkdownSection[] {
  const lines = content.split('\n');
  const sections: MarkdownSection[] = [];
  let currentSection: MarkdownSection | null = null;
  let currentContent: string[] = [];
  let order = 0;

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);

    if (headingMatch) {
      // Save previous section if exists
      if (currentSection) {
        currentSection.content = currentContent.join('\n').trim();
        sections.push(currentSection);
      }

      // Start new section
      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();

      currentSection = {
        level,
        title,
        content: '',
        order: order++,
      };
      currentContent = [];
    } else if (currentSection) {
      // Add content to current section
      currentContent.push(line);
    }
  }

  // Save last section
  if (currentSection) {
    currentSection.content = currentContent.join('\n').trim();
    sections.push(currentSection);
  }

  return sections;
}

/**
 * Groups markdown sections into chapters and slides
 * ## headers become chapters
 * ### headers become slides within chapters
 * @param sections - Array of parsed markdown sections
 * @param courseId - Course identifier
 * @returns Array of course chapters with slides
 */
function groupIntoChapters(
  sections: MarkdownSection[],
  courseId: string
): CourseChapter[] {
  const chapters: CourseChapter[] = [];
  let currentChapter: CourseChapter | null = null;
  let chapterOrder = 0;
  let slideOrder = 0;
  let currentPart = 1;

  for (const section of sections) {
    // Extract part number from chapter titles like "Part 1: ..." or "Part One: ..."
    const partMatch = section.title.match(/Part\s+(\d+|One|Two|Three|Four)/i);
    if (partMatch) {
      const partNum = partMatch[1];
      if (partNum === 'One' || partNum === '1') currentPart = 1;
      else if (partNum === 'Two' || partNum === '2') currentPart = 2;
      else if (partNum === 'Three' || partNum === '3') currentPart = 3;
      else if (partNum === 'Four' || partNum === '4') currentPart = 4;
      else currentPart = parseInt(partNum) || currentPart;
    }

    if (section.level === 2) {
      // ## header = new chapter
      if (currentChapter) {
        chapters.push(currentChapter);
      }

      const chapterId = generateSlug(
        `${courseId}-chapter-${chapterOrder}-${section.title}`
      );

      currentChapter = {
        id: chapterId,
        title: section.title,
        order: chapterOrder++,
        part: currentPart,
        slides: [],
      };

      slideOrder = 0;

      // If chapter has content (not just a header), create first slide
      if (section.content.trim()) {
        const slide = createSlide(
          section,
          chapterId,
          slideOrder++,
          courseId,
          chapterOrder - 1
        );
        currentChapter.slides.push(slide);
      }
    } else if (section.level === 3 && currentChapter) {
      // ### header = new slide within current chapter
      const slide = createSlide(
        section,
        currentChapter.id,
        slideOrder++,
        courseId,
        chapterOrder - 1
      );
      currentChapter.slides.push(slide);
    } else if (section.level === 1) {
      // # header = main title, skip or create intro slide
      // For now, skip level 1 headers
      continue;
    }
  }

  // Add last chapter
  if (currentChapter) {
    chapters.push(currentChapter);
  }

  return chapters;
}

/**
 * Creates a slide from a markdown section
 * @param section - Markdown section
 * @param chapterId - Parent chapter ID
 * @param order - Slide order within chapter
 * @param courseId - Course ID
 * @param chapterOrder - Chapter order number
 * @returns Course slide
 */
function createSlide(
  section: MarkdownSection,
  chapterId: string,
  order: number,
  courseId: string,
  chapterOrder: number
): CourseSlide {
  const slideId = generateSlug(
    `${courseId}-c${chapterOrder}-s${order}-${section.title}`
  );

  // Detect media references in content
  const mediaRef = detectMediaReference(section.content);

  // Convert markdown to HTML synchronously (remark supports this)
  const htmlContent = markdownToHtml(section.content);

  return {
    id: slideId,
    chapterId,
    title: section.title,
    content: htmlContent,
    order,
    mediaUrl: mediaRef?.url,
    mediaType: mediaRef?.type,
  };
}

/**
 * Converts markdown content to HTML
 * @param markdown - Markdown string
 * @returns HTML string
 */
function markdownToHtml(markdown: string): string {
  try {
    const result = remark()
      .use(remarkGfm)
      .use(html, { sanitize: false })
      .processSync(markdown);
    return String(result);
  } catch (error) {
    console.error('Error converting markdown to HTML:', error);
    return `<p>${markdown}</p>`; // Fallback to plain text wrapped in p tag
  }
}

/**
 * Detects media references in markdown content
 * Supports: [VIDEO: video-id] or [AUDIO: audio-id]
 * @param content - Markdown content
 * @returns Media reference or undefined
 */
function detectMediaReference(content: string): MediaReference | undefined {
  const videoMatch = content.match(/\[VIDEO:\s*([^\]]+)\]/);
  if (videoMatch) {
    return {
      type: 'video',
      placeholder: videoMatch[1].trim(),
      url: undefined, // Will be mapped later via media config
    };
  }

  const audioMatch = content.match(/\[AUDIO:\s*([^\]]+)\]/);
  if (audioMatch) {
    return {
      type: 'audio',
      placeholder: audioMatch[1].trim(),
      url: undefined, // Will be mapped later via media config
    };
  }

  return undefined;
}

/**
 * Generates a URL-safe slug from text
 * @param text - Input text
 * @returns Slugified string
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 100); // Limit length
}

/**
 * Estimates reading time for a slide based on word count
 * @param content - HTML content
 * @returns Estimated minutes
 */
export function estimateReadingTime(content: string): number {
  // Strip HTML tags for word count
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  const wordsPerMinute = 200;
  return Math.ceil(words / wordsPerMinute);
}
