import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/sprint/days/route';

// Mock content library
vi.mock('@/lib/content', () => ({
  getSprintDays: vi.fn(),
}));

vi.mock('@/lib/logger', () => ({
  log: {
    error: vi.fn(),
  },
}));

const mockGetSprintDays = vi.mocked((await import('@/lib/content')).getSprintDays);

describe('GET /api/sprint/days', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return all sprint days (1-30)', async () => {
    const mockDays = Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      slug: `day-${i + 1}`,
      frontmatter: {
        title: `Day ${i + 1}`,
        date: `2024-01-${String(i + 1).padStart(2, '0')}`,
        description: `Description for day ${i + 1}`,
        published: true,
      },
      content: `<p>Content for day ${i + 1}</p>`,
    }));

    mockGetSprintDays.mockResolvedValue(mockDays as any);

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('days');
    expect(data.days).toHaveLength(30);
    expect(data.days[0]).toMatchObject({
      day: 1,
      slug: 'day-1',
      frontmatter: {
        title: 'Day 1',
      },
    });
    expect(data.days[29]).toMatchObject({
      day: 30,
      slug: 'day-30',
    });

    // Verify getSprintDays was called
    expect(mockGetSprintDays).toHaveBeenCalledOnce();
  });

  it('should return empty array when no sprint days exist', async () => {
    mockGetSprintDays.mockResolvedValue([]);

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.days).toEqual([]);
  });

  it('should include full day metadata', async () => {
    const mockDays = [
      {
        day: 1,
        slug: 'day-1',
        frontmatter: {
          title: 'Day 1: Foundation',
          date: '2024-01-01',
          description: 'Begin your transformation',
          thumbnail: '/images/day-1-thumb.jpg',
          duration: 30,
          difficulty: 'beginner',
          published: true,
          tags: ['foundation', 'mindset'],
        },
        content: '<h2>Welcome</h2><p>Start your journey</p>',
      },
    ];

    mockGetSprintDays.mockResolvedValue(mockDays as any);

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.days[0].frontmatter).toEqual({
      title: 'Day 1: Foundation',
      date: '2024-01-01',
      description: 'Begin your transformation',
      thumbnail: '/images/day-1-thumb.jpg',
      duration: 30,
      difficulty: 'beginner',
      published: true,
      tags: ['foundation', 'mindset'],
    });
  });

  it('should include full HTML content for each day', async () => {
    const mockDays = [
      {
        day: 5,
        slug: 'day-5',
        frontmatter: {
          title: 'Day 5',
          published: true,
        },
        content: '<h1>Day 5 Content</h1><p>Detailed content with <strong>formatting</strong></p><ul><li>Item 1</li><li>Item 2</li></ul>',
      },
    ];

    mockGetSprintDays.mockResolvedValue(mockDays as any);

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.days[0].content).toContain('<h1>Day 5 Content</h1>');
    expect(data.days[0].content).toContain('<strong>formatting</strong>');
    expect(data.days[0].content).toContain('<ul><li>Item 1</li><li>Item 2</li></ul>');
  });

  it('should return days in sequential order', async () => {
    const mockDays = [
      { day: 1, slug: 'day-1', frontmatter: { title: 'Day 1' }, content: '' },
      { day: 2, slug: 'day-2', frontmatter: { title: 'Day 2' }, content: '' },
      { day: 3, slug: 'day-3', frontmatter: { title: 'Day 3' }, content: '' },
      { day: 10, slug: 'day-10', frontmatter: { title: 'Day 10' }, content: '' },
      { day: 30, slug: 'day-30', frontmatter: { title: 'Day 30' }, content: '' },
    ];

    mockGetSprintDays.mockResolvedValue(mockDays as any);

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.days[0].day).toBe(1);
    expect(data.days[1].day).toBe(2);
    expect(data.days[2].day).toBe(3);
    expect(data.days[3].day).toBe(10);
    expect(data.days[4].day).toBe(30);
  });

  it('should handle days with minimal frontmatter', async () => {
    const mockDays = [
      {
        day: 15,
        slug: 'day-15',
        frontmatter: {
          title: 'Day 15',
          published: true,
        },
        content: '<p>Minimal content</p>',
      },
    ];

    mockGetSprintDays.mockResolvedValue(mockDays as any);

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.days[0]).toMatchObject({
      day: 15,
      slug: 'day-15',
      frontmatter: {
        title: 'Day 15',
        published: true,
      },
      content: '<p>Minimal content</p>',
    });
  });

  it('should only return published days', async () => {
    // Note: getSprintDays already filters to only published days
    const mockDays = [
      {
        day: 1,
        slug: 'day-1',
        frontmatter: {
          title: 'Day 1',
          published: true,
        },
        content: '<p>Published</p>',
      },
      {
        day: 2,
        slug: 'day-2',
        frontmatter: {
          title: 'Day 2',
          published: true,
        },
        content: '<p>Published</p>',
      },
    ];

    mockGetSprintDays.mockResolvedValue(mockDays as any);

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.days).toHaveLength(2);
    expect(data.days.every((day: any) => day.frontmatter.published === true)).toBe(true);
  });

  it('should handle days with custom metadata fields', async () => {
    const mockDays = [
      {
        day: 7,
        slug: 'day-7',
        frontmatter: {
          title: 'Day 7: Rest Day',
          published: true,
          isRestDay: true,
          completionTime: 15,
          prerequisites: ['day-1', 'day-6'],
          resources: ['video-123', 'pdf-456'],
        },
        content: '<p>Rest day content</p>',
      },
    ];

    mockGetSprintDays.mockResolvedValue(mockDays as any);

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.days[0].frontmatter).toEqual({
      title: 'Day 7: Rest Day',
      published: true,
      isRestDay: true,
      completionTime: 15,
      prerequisites: ['day-1', 'day-6'],
      resources: ['video-123', 'pdf-456'],
    });
  });

  it('should return 500 on content fetch error', async () => {
    mockGetSprintDays.mockRejectedValue(new Error('File system error'));

    const response = await GET();

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Failed to fetch sprint days');
  });

  it('should handle missing content directory gracefully', async () => {
    mockGetSprintDays.mockRejectedValue(new Error('ENOENT: no such file or directory'));

    const response = await GET();

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Failed to fetch sprint days');
  });

  it('should handle partial sprint days (less than 30)', async () => {
    // Simulate a sprint in progress with only first 10 days published
    const mockDays = Array.from({ length: 10 }, (_, i) => ({
      day: i + 1,
      slug: `day-${i + 1}`,
      frontmatter: {
        title: `Day ${i + 1}`,
        published: true,
      },
      content: `<p>Day ${i + 1} content</p>`,
    }));

    mockGetSprintDays.mockResolvedValue(mockDays as any);

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.days).toHaveLength(10);
    expect(data.days[0].day).toBe(1);
    expect(data.days[9].day).toBe(10);
  });

  it('should preserve day order even if files are named inconsistently', async () => {
    const mockDays = [
      { day: 3, slug: 'day-3', frontmatter: { title: 'Day 3' }, content: '' },
      { day: 1, slug: 'day-1', frontmatter: { title: 'Day 1' }, content: '' },
      { day: 2, slug: 'day-2', frontmatter: { title: 'Day 2' }, content: '' },
    ];

    // getSprintDays should return them in correct order (1, 2, 3)
    mockGetSprintDays.mockResolvedValue([
      mockDays[1], // day-1
      mockDays[2], // day-2
      mockDays[0], // day-3
    ] as any);

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.days[0].day).toBe(1);
    expect(data.days[1].day).toBe(2);
    expect(data.days[2].day).toBe(3);
  });
});
