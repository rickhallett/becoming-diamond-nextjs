import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export interface ContentItem {
  slug: string;
  frontmatter: Record<string, unknown>;
  content: string;
}

export async function getContentByType(type: string): Promise<ContentItem[]> {
  const directory = path.join(contentDirectory, type);
  
  if (!fs.existsSync(directory)) {
    return [];
  }

  const files = fs.readdirSync(directory);
  
  const content = files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const slug = file.replace('.md', '');
      const fullPath = path.join(directory, file);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      return {
        slug,
        frontmatter: data,
        content,
      };
    })
    .filter(item => item.frontmatter.published !== false)
    .sort((a, b) => {
      const dateA = new Date(a.frontmatter.date || 0).getTime();
      const dateB = new Date(b.frontmatter.date || 0).getTime();
      return dateB - dateA;
    });

  return content;
}

export async function getContentBySlug(
  type: string,
  slug: string
): Promise<ContentItem | null> {
  const directory = path.join(contentDirectory, type);
  const fullPath = path.join(directory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    frontmatter: data,
    content,
  };
}