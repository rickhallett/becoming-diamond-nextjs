import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { parseCourseMarkdown } from './course-parser';
import type { ParsedCourse } from '@/types/course';

const contentDirectory = path.join(process.cwd(), 'content');

export interface ContentItem {
  slug: string;
  frontmatter: {
    title: string;
    date?: string;
    description?: string;
    thumbnail?: string;
    published?: boolean;
    [key: string]: unknown;
  };
  content: string;
}

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

export async function getContentByType(type: string): Promise<ContentItem[]> {
  const typeDirectory = path.join(contentDirectory, type);

  if (!fs.existsSync(typeDirectory)) {
    return [];
  }

  const files = fs.readdirSync(typeDirectory);
  const items = await Promise.all(
    files
      .filter((file) => file.endsWith('.md'))
      .map(async (file) => {
        const slug = file.replace(/\.md$/, '');
        const fullPath = path.join(typeDirectory, file);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        const htmlContent = await markdownToHtml(content);

        return {
          slug,
          frontmatter: data as ContentItem['frontmatter'],
          content: htmlContent,
        };
      })
  );

  // Filter out unpublished items and sort by date
  return items
    .filter((item) => item.frontmatter.published !== false)
    .sort((a, b) => {
      if (a.frontmatter.date && b.frontmatter.date) {
        return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
      }
      return 0;
    });
}

export async function getContentBySlug(type: string, slug: string): Promise<ContentItem | null> {
  const fullPath = path.join(contentDirectory, type, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const htmlContent = await markdownToHtml(content);

  return {
    slug,
    frontmatter: data as ContentItem['frontmatter'],
    content: htmlContent,
  };
}

/**
 * Gets a course by its ID and parses it into structured format
 * @param courseId - Course identifier (e.g., "gateway-1-snowflakes-to-diamonds")
 * @returns Parsed course with chapters and slides, or null if not found
 */
export async function getCourseContent(courseId: string): Promise<ParsedCourse | null> {
  const coursesDirectory = path.join(contentDirectory, 'courses');

  if (!fs.existsSync(coursesDirectory)) {
    return null;
  }

  // Try to find the course file by ID
  const files = fs.readdirSync(coursesDirectory);
  let courseFile: string | undefined;

  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    const fullPath = path.join(coursesDirectory, file);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    if (data.id === courseId) {
      courseFile = file;
      break;
    }
  }

  if (!courseFile) {
    return null;
  }

  // Parse the course
  const fullPath = path.join(coursesDirectory, courseFile);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  try {
    const parsedCourse = await parseCourseMarkdown(fileContents);
    return parsedCourse;
  } catch (error) {
    console.error(`Error parsing course ${courseId}:`, error);
    return null;
  }
}

/**
 * Gets all available courses (published only)
 * @returns Array of parsed courses
 */
export async function getAllCourses(): Promise<ParsedCourse[]> {
  const coursesDirectory = path.join(contentDirectory, 'courses');

  if (!fs.existsSync(coursesDirectory)) {
    return [];
  }

  const files = fs.readdirSync(coursesDirectory);
  const courses = await Promise.all(
    files
      .filter((file) => file.endsWith('.md'))
      .map(async (file) => {
        const fullPath = path.join(coursesDirectory, file);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        try {
          const parsedCourse = await parseCourseMarkdown(fileContents);
          return parsedCourse;
        } catch (error) {
          console.error(`Error parsing course file ${file}:`, error);
          return null;
        }
      })
  );

  // Filter out failed parses and unpublished courses
  return courses
    .filter((course): course is ParsedCourse => course !== null && course.metadata.published)
    .sort((a, b) => a.metadata.gateway - b.metadata.gateway);
}
