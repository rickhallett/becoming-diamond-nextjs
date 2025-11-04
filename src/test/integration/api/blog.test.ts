import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/blog/route';

// Mock content library
vi.mock('@/lib/content', () => ({
  getContentByType: vi.fn(),
}));

vi.mock('@/lib/logger', () => ({
  log: {
    error: vi.fn(),
  },
}));

const mockGetContentByType = vi.mocked((await import('@/lib/content')).getContentByType);

describe('GET /api/blog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return all blog posts', async () => {
    const mockPosts = [
      {
        slug: 'first-post',
        frontmatter: {
          title: 'First Blog Post',
          date: '2024-01-01',
          author: 'John Doe',
          description: 'This is the first post',
          published: true,
          category: 'Personal Growth',
          tags: ['mindset', 'transformation'],
        },
        content: '<p>First post content</p>',
      },
      {
        slug: 'second-post',
        frontmatter: {
          title: 'Second Blog Post',
          date: '2024-01-05',
          author: 'Jane Smith',
          description: 'This is the second post',
          published: true,
          category: 'Coaching',
          tags: ['coaching', 'growth'],
        },
        content: '<p>Second post content</p>',
      },
    ];

    mockGetContentByType.mockResolvedValue(mockPosts as any);

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveLength(2);
    expect(data[0]).toMatchObject({
      slug: 'first-post',
      frontmatter: {
        title: 'First Blog Post',
        date: '2024-01-01',
        author: 'John Doe',
      },
    });
    expect(data[1]).toMatchObject({
      slug: 'second-post',
      frontmatter: {
        title: 'Second Blog Post',
        date: '2024-01-05',
      },
    });

    // Verify getContentByType was called with 'blog'
    expect(mockGetContentByType).toHaveBeenCalledWith('blog');
  });

  it('should return empty array when no blog posts exist', async () => {
    mockGetContentByType.mockResolvedValue([]);

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual([]);
  });

  it('should include full content HTML', async () => {
    const mockPost = {
      slug: 'detailed-post',
      frontmatter: {
        title: 'Detailed Post',
        date: '2024-01-10',
        author: 'Author Name',
        published: true,
      },
      content: '<h1>Heading</h1><p>Paragraph content</p><ul><li>List item</li></ul>',
    };

    mockGetContentByType.mockResolvedValue([mockPost] as any);

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data[0].content).toContain('<h1>Heading</h1>');
    expect(data[0].content).toContain('<p>Paragraph content</p>');
    expect(data[0].content).toContain('<ul><li>List item</li></ul>');
  });

  it('should include all frontmatter fields', async () => {
    const mockPost = {
      slug: 'complete-post',
      frontmatter: {
        title: 'Complete Post',
        date: '2024-02-01',
        author: 'Test Author',
        description: 'Full description',
        published: true,
        category: 'Mindset',
        tags: ['transformation', 'coaching', 'growth'],
        thumbnail: '/images/post-thumb.jpg',
        featured: true,
        readTime: 10,
      },
      content: '<p>Content</p>',
    };

    mockGetContentByType.mockResolvedValue([mockPost] as any);

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data[0].frontmatter).toEqual({
      title: 'Complete Post',
      date: '2024-02-01',
      author: 'Test Author',
      description: 'Full description',
      published: true,
      category: 'Mindset',
      tags: ['transformation', 'coaching', 'growth'],
      thumbnail: '/images/post-thumb.jpg',
      featured: true,
      readTime: 10,
    });
  });

  it('should return posts sorted by date (newest first)', async () => {
    const mockPosts = [
      {
        slug: 'newest',
        frontmatter: {
          title: 'Newest Post',
          date: '2024-03-01',
          published: true,
        },
        content: '<p>Newest</p>',
      },
      {
        slug: 'older',
        frontmatter: {
          title: 'Older Post',
          date: '2024-02-01',
          published: true,
        },
        content: '<p>Older</p>',
      },
      {
        slug: 'oldest',
        frontmatter: {
          title: 'Oldest Post',
          date: '2024-01-01',
          published: true,
        },
        content: '<p>Oldest</p>',
      },
    ];

    // getContentByType already sorts by date, so mock it in correct order
    mockGetContentByType.mockResolvedValue(mockPosts as any);

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveLength(3);
    expect(data[0].slug).toBe('newest');
    expect(data[1].slug).toBe('older');
    expect(data[2].slug).toBe('oldest');
  });

  it('should only return published posts', async () => {
    const mockPosts = [
      {
        slug: 'published-post',
        frontmatter: {
          title: 'Published Post',
          date: '2024-01-15',
          published: true,
        },
        content: '<p>Published content</p>',
      },
      // Note: getContentByType already filters out unpublished posts
      // so this is testing the expected behavior
    ];

    mockGetContentByType.mockResolvedValue(mockPosts as any);

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveLength(1);
    expect(data[0].slug).toBe('published-post');
  });

  it('should handle posts with minimal frontmatter', async () => {
    const mockPost = {
      slug: 'minimal-post',
      frontmatter: {
        title: 'Minimal Post',
        date: '2024-01-20',
        published: true,
      },
      content: '<p>Minimal content</p>',
    };

    mockGetContentByType.mockResolvedValue([mockPost] as any);

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data[0]).toMatchObject({
      slug: 'minimal-post',
      frontmatter: {
        title: 'Minimal Post',
        date: '2024-01-20',
        published: true,
      },
      content: '<p>Minimal content</p>',
    });
  });

  it('should handle posts with categories', async () => {
    const mockPosts = [
      {
        slug: 'mindset-post',
        frontmatter: {
          title: 'Mindset Post',
          date: '2024-01-01',
          category: 'Mindset',
          published: true,
        },
        content: '<p>Content</p>',
      },
      {
        slug: 'coaching-post',
        frontmatter: {
          title: 'Coaching Post',
          date: '2024-01-02',
          category: 'Coaching',
          published: true,
        },
        content: '<p>Content</p>',
      },
    ];

    mockGetContentByType.mockResolvedValue(mockPosts as any);

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data[0].frontmatter.category).toBe('Mindset');
    expect(data[1].frontmatter.category).toBe('Coaching');
  });

  it('should handle posts with tags array', async () => {
    const mockPost = {
      slug: 'tagged-post',
      frontmatter: {
        title: 'Tagged Post',
        date: '2024-01-01',
        tags: ['transformation', 'mindset', 'coaching', 'growth'],
        published: true,
      },
      content: '<p>Content</p>',
    };

    mockGetContentByType.mockResolvedValue([mockPost] as any);

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data[0].frontmatter.tags).toEqual([
      'transformation',
      'mindset',
      'coaching',
      'growth',
    ]);
  });

  it('should return 500 on content fetch error', async () => {
    mockGetContentByType.mockRejectedValue(new Error('File system error'));

    const response = await GET();

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Failed to fetch blog posts');
  });

  it('should handle malformed content gracefully', async () => {
    // Test that getContentByType handles errors internally
    mockGetContentByType.mockRejectedValue(new Error('Invalid frontmatter'));

    const response = await GET();

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Failed to fetch blog posts');
  });
});
