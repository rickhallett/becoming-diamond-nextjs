import { describe, it, expect, vi } from 'vitest';
import { parseCourseMarkdown, estimateReadingTime } from '@/lib/course-parser';

// Mock logger
vi.mock('@/lib/logger', () => ({
  log: vi.fn(),
}));

// Mock gray-matter
vi.mock('gray-matter', () => ({
  default: vi.fn((fileContent: string) => {
    const lines = fileContent.split('\n');
    const frontmatterEnd = lines.indexOf('---', 1);

    if (frontmatterEnd === -1) {
      return { data: {}, content: fileContent };
    }

    const frontmatterLines = lines.slice(1, frontmatterEnd);
    const data: Record<string, any> = {};

    frontmatterLines.forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length) {
        let value: any = valueParts.join(':').trim();
        value = value.replace(/^["']|["']$/g, '');
        if (value === 'true') value = true;
        else if (value === 'false') value = false;
        else if (!isNaN(Number(value)) && value !== '') value = Number(value);
        data[key.trim()] = value;
      }
    });

    const markdownContent = lines.slice(frontmatterEnd + 1).join('\n');
    return { data, content: markdownContent };
  }),
}));

// Mock remark and remark-html
vi.mock('remark', () => ({
  remark: vi.fn(() => ({
    use: vi.fn(() => ({
      use: vi.fn(() => ({
        processSync: vi.fn((markdown: string) => String(`<p>${markdown}</p>`)),
      })),
    })),
  })),
}));

vi.mock('remark-html', () => ({ default: vi.fn() }));
vi.mock('remark-gfm', () => ({ default: vi.fn() }));

describe('parseCourseMarkdown', () => {
  it('should parse basic course with frontmatter', async () => {
    const markdown = `---
id: test-course
title: Test Course
pressureRoom: 1
duration: 4 weeks
difficulty: Beginner
instructor: Test Instructor
published: true
---

## Chapter 1

### Slide 1
Content for slide 1

### Slide 2
Content for slide 2`;

    const result = await parseCourseMarkdown(markdown);

    expect(result.id).toBe('test-course');
    expect(result.title).toBe('Test Course');
    expect(result.metadata.pressureRoom).toBe(1);
    expect(result.metadata.duration).toBe('4 weeks');
    expect(result.metadata.difficulty).toBe('Beginner');
    expect(result.metadata.instructor).toBe('Test Instructor');
    expect(result.metadata.published).toBe(true);
    expect(result.totalChapters).toBe(1);
    expect(result.totalSlides).toBe(2);
  });

  it('should group slides into chapters correctly', async () => {
    const markdown = `---
id: multi-chapter
title: Multi Chapter Course
---

## Chapter 1

### Slide 1-1
Content 1-1

### Slide 1-2
Content 1-2

## Chapter 2

### Slide 2-1
Content 2-1`;

    const result = await parseCourseMarkdown(markdown);

    expect(result.chapters.length).toBe(2);
    expect(result.chapters[0].title).toBe('Chapter 1');
    expect(result.chapters[0].slides.length).toBe(2);
    expect(result.chapters[1].title).toBe('Chapter 2');
    expect(result.chapters[1].slides.length).toBe(1);
  });

  it('should handle part numbers in chapter titles', async () => {
    const markdown = `---
id: parts-course
title: Course with Parts
---

## Part 1: Introduction

### Slide 1
Content 1

## Part 2: Advanced

### Slide 2
Content 2

## Part Three: Expert

### Slide 3
Content 3`;

    const result = await parseCourseMarkdown(markdown);

    expect(result.chapters[0].part).toBe(1);
    expect(result.chapters[1].part).toBe(2);
    expect(result.chapters[2].part).toBe(3);
  });

  it('should extract video references from content', async () => {
    const markdown = `---
id: video-course
title: Video Course
---

## Chapter 1

### Slide with Video
{{video:abc123-def456}}

Some text content`;

    const result = await parseCourseMarkdown(markdown);

    const slide = result.chapters[0].slides[0];
    expect(slide.videoReferences).toBeDefined();
    expect(slide.videoReferences?.length).toBe(1);
    expect(slide.videoReferences?.[0].videoId).toBe('abc123-def456');
  });

  it('should parse video options correctly', async () => {
    const markdown = `---
id: video-options-course
title: Video with Options
---

## Chapter 1

### Slide with Video Options
{{video:video-id|autoplay:true|poster:/poster.jpg|quality:1080p}}`;

    const result = await parseCourseMarkdown(markdown);

    const slide = result.chapters[0].slides[0];
    const videoRef = slide.videoReferences?.[0];
    expect(videoRef?.videoId).toBe('video-id');
    expect(videoRef?.autoplay).toBe(true);
    expect(videoRef?.poster).toBe('/poster.jpg');
    expect(videoRef?.quality).toBe('1080p');
  });

  it('should handle multiple videos in one slide', async () => {
    const markdown = `---
id: multi-video
title: Multiple Videos
---

## Chapter 1

### Slide with Multiple Videos
{{video:video1}}

Some content

{{video:video2|autoplay:true}}`;

    const result = await parseCourseMarkdown(markdown);

    const slide = result.chapters[0].slides[0];
    expect(slide.videoReferences?.length).toBe(2);
    expect(slide.videoReferences?.[0].videoId).toBe('video1');
    expect(slide.videoReferences?.[1].videoId).toBe('video2');
    expect(slide.videoReferences?.[1].autoplay).toBe(true);
  });

  it('should detect legacy media references', async () => {
    const markdown = `---
id: legacy-media
title: Legacy Media
---

## Chapter 1

### Slide with Legacy Video
[VIDEO: legacy-video-id]

Content`;

    const result = await parseCourseMarkdown(markdown);

    const slide = result.chapters[0].slides[0];
    expect(slide.mediaType).toBe('video');
    expect(slide.content).toContain('[VIDEO: legacy-video-id]');
  });

  it('should generate proper slide IDs', async () => {
    const markdown = `---
id: test-course
title: Test Course
---

## Chapter One

### First Slide
Content`;

    const result = await parseCourseMarkdown(markdown);

    const slide = result.chapters[0].slides[0];
    expect(slide.id).toMatch(/^test-course-c0-s0-/);
    expect(slide.id).toContain('first-slide');
  });

  it('should handle chapters with content before first slide', async () => {
    const markdown = `---
id: chapter-content
title: Chapter with Content
---

## Chapter 1
This is chapter intro content that should become a slide.

### Second Slide
More content`;

    const result = await parseCourseMarkdown(markdown);

    expect(result.chapters[0].slides.length).toBe(2);
    expect(result.chapters[0].slides[0].content).toContain('chapter intro content');
  });

  it('should skip level 1 headers', async () => {
    const markdown = `---
id: level-1-test
title: Level 1 Test
---

# Main Title

## Chapter 1

### Slide 1
Content`;

    const result = await parseCourseMarkdown(markdown);

    expect(result.chapters.length).toBe(1);
    expect(result.chapters[0].title).toBe('Chapter 1');
  });

  it('should use default values for missing frontmatter', async () => {
    const markdown = `---
id: minimal-course
---

## Chapter 1

### Slide 1
Content`;

    const result = await parseCourseMarkdown(markdown);

    expect(result.title).toBe('Untitled Course');
    expect(result.metadata.pressureRoom).toBe(1);
    expect(result.metadata.duration).toBe('8 weeks');
    expect(result.metadata.difficulty).toBe('Beginner');
    expect(result.metadata.instructor).toBe('Michael Dugan');
    expect(result.metadata.published).toBe(true);
  });

  it('should handle gateway as alias for pressureRoom', async () => {
    const markdown = `---
id: gateway-test
gateway: 3
---

## Chapter 1

### Slide 1
Content`;

    const result = await parseCourseMarkdown(markdown);

    expect(result.metadata.pressureRoom).toBe(3);
  });

  it('should set published to false when explicitly set', async () => {
    const markdown = `---
id: unpublished
published: false
---

## Chapter 1

### Slide 1
Content`;

    const result = await parseCourseMarkdown(markdown);

    expect(result.metadata.published).toBe(false);
  });

  it('should handle empty content sections', async () => {
    const markdown = `---
id: empty-sections
---

## Chapter 1

### Empty Slide

### Slide with Content
Some content here`;

    const result = await parseCourseMarkdown(markdown);

    expect(result.chapters[0].slides.length).toBe(2);
  });

  it('should maintain slide order within chapters', async () => {
    const markdown = `---
id: slide-order
---

## Chapter 1

### First
Content 1

### Second
Content 2

### Third
Content 3`;

    const result = await parseCourseMarkdown(markdown);

    const slides = result.chapters[0].slides;
    expect(slides[0].order).toBe(0);
    expect(slides[1].order).toBe(1);
    expect(slides[2].order).toBe(2);
    expect(slides[0].title).toBe('First');
    expect(slides[1].title).toBe('Second');
    expect(slides[2].title).toBe('Third');
  });

  it('should maintain chapter order', async () => {
    const markdown = `---
id: chapter-order
---

## First Chapter

### Slide
Content

## Second Chapter

### Slide
Content

## Third Chapter

### Slide
Content`;

    const result = await parseCourseMarkdown(markdown);

    expect(result.chapters[0].order).toBe(0);
    expect(result.chapters[1].order).toBe(1);
    expect(result.chapters[2].order).toBe(2);
  });
});

describe('estimateReadingTime', () => {
  it('should estimate reading time based on word count', () => {
    const content = '<p>' + 'word '.repeat(200) + '</p>';
    const time = estimateReadingTime(content);
    expect(time).toBe(1); // 200 words = 1 minute at 200 wpm
  });

  it('should strip HTML tags for word counting', () => {
    const content = '<div><p>one two <strong>three</strong> four</p></div>';
    const time = estimateReadingTime(content);
    expect(time).toBe(1); // 4 words, rounds up to 1 minute
  });

  it('should round up fractional minutes', () => {
    const content = '<p>' + 'word '.repeat(250) + '</p>';
    const time = estimateReadingTime(content);
    expect(time).toBe(2); // 250 words = 1.25 minutes, rounds up to 2
  });

  it('should handle empty content', () => {
    const time = estimateReadingTime('');
    // Note: ''.trim().split(/\s+/) returns [''] with length 1, so Math.ceil(1/200) = 1
    expect(time).toBe(1);
  });

  it('should handle content with only HTML tags', () => {
    const time = estimateReadingTime('<div></div><p></p>');
    // Note: After stripping tags, result is empty string which splits to [''] with length 1
    expect(time).toBe(1);
  });
});
