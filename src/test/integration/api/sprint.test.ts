import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/sprint/[dayNumber]/route';
import { NextRequest } from 'next/server';
import * as contentLib from '@/lib/content';

vi.mock('@/lib/content', () => ({
  getSprintDay: vi.fn(),
}));

vi.mock('@/lib/logger', () => ({
  log: {
    error: vi.fn(),
  },
}));

describe('GET /api/sprint/[dayNumber]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 200 and day content for valid day number', async () => {
    const mockDay = {
      slug: 'day-01',
      frontmatter: {
        title: 'Day 1: Introduction',
        day: 1,
        published: true,
      },
      content: '<h1>Day 1</h1>',
    };

    vi.mocked(contentLib.getSprintDay).mockResolvedValue(mockDay);

    const request = new NextRequest('http://localhost:3003/api/sprint/1');
    const response = await GET(request, { params: Promise.resolve({ dayNumber: '1' }) });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('day');
    expect(data.day).toMatchObject({
      slug: 'day-01',
      frontmatter: expect.objectContaining({
        title: expect.any(String),
        day: 1,
      }),
      content: expect.any(String),
    });
    expect(contentLib.getSprintDay).toHaveBeenCalledWith(1);
  });

  it('should return 404 for non-existent day', async () => {
    vi.mocked(contentLib.getSprintDay).mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3003/api/sprint/999');
    const response = await GET(request, { params: Promise.resolve({ dayNumber: '999' }) });

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Day not found');
  });

  it('should return 400 for invalid day number format', async () => {
    const request = new NextRequest('http://localhost:3003/api/sprint/abc');
    const response = await GET(request, { params: Promise.resolve({ dayNumber: 'abc' }) });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Invalid day number');
  });

  it('should return 400 for day number less than 1', async () => {
    const request = new NextRequest('http://localhost:3003/api/sprint/0');
    const response = await GET(request, { params: Promise.resolve({ dayNumber: '0' }) });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Invalid day number');
  });

  it('should return 400 for day number greater than 30', async () => {
    const request = new NextRequest('http://localhost:3003/api/sprint/31');
    const response = await GET(request, { params: Promise.resolve({ dayNumber: '31' }) });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Invalid day number');
  });

  it('should return 500 on internal error', async () => {
    vi.mocked(contentLib.getSprintDay).mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost:3003/api/sprint/1');
    const response = await GET(request, { params: Promise.resolve({ dayNumber: '1' }) });

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Failed to fetch sprint day');
  });
});
