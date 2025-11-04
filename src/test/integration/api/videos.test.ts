import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/videos/route';

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

const mockAuth = vi.mocked((await import('@/auth')).auth);

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

describe('GET /api/videos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear module cache to reset video cache between tests
    vi.resetModules();
  });

  it('should return 401 for unauthenticated request', async () => {
    mockAuth.mockResolvedValue(null);

    const response = await GET();

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Unauthorized');
  });

  it('should fetch videos from Bunny API on cache miss', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    const mockVideos = [
      {
        guid: 'video-1',
        title: 'Introduction to Diamond Transformation',
        dateUploaded: '2024-01-01T00:00:00Z',
        length: 600,
        status: 4,
        views: 150,
        thumbnailFileName: 'thumb-1.jpg',
        width: 1920,
        height: 1080,
        availableResolutions: '1080p,720p,480p',
      },
      {
        guid: 'video-2',
        title: 'Day 1: Foundation',
        dateUploaded: '2024-01-02T00:00:00Z',
        length: 900,
        status: 4,
        views: 200,
        thumbnailFileName: 'thumb-2.jpg',
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        items: mockVideos,
        totalItems: 2,
        currentPage: 1,
      }),
    } as any);

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('videos');
    expect(data).toHaveProperty('cached', false);
    expect(data).toHaveProperty('totalCount', 2);
    expect(data).toHaveProperty('currentPage', 1);
    expect(data.videos).toHaveLength(2);
    expect(data.videos[0]).toMatchObject({
      guid: 'video-1',
      title: 'Introduction to Diamond Transformation',
      length: 600,
    });

    // Verify Bunny API was called
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('video.bunnycdn.com/library/'),
      expect.objectContaining({
        headers: expect.objectContaining({
          AccessKey: expect.any(String),
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  it('should return cached videos on subsequent requests within 5 minutes', async () => {
    // First request - populates cache
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    const mockVideos = [
      {
        guid: 'video-1',
        title: 'Test Video',
        dateUploaded: '2024-01-01T00:00:00Z',
        length: 600,
        status: 4,
        views: 100,
        thumbnailFileName: 'thumb.jpg',
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        items: mockVideos,
        totalItems: 1,
        currentPage: 1,
      }),
    } as any);

    const response1 = await GET();
    const data1 = await response1.json();

    expect(data1.cached).toBe(false);
    expect(mockFetch).toHaveBeenCalledTimes(1);

    // Second request - should use cache
    const response2 = await GET();
    const data2 = await response2.json();

    expect(data2.cached).toBe(true);
    expect(data2).toHaveProperty('cachedAt');
    expect(data2.videos).toEqual(mockVideos);
    // Fetch should not be called again
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should handle Bunny API errors', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    } as any);

    const response = await GET();

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Failed to fetch videos');
  });

  it('should handle Bunny API unauthorized error', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
    } as any);

    const response = await GET();

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Failed to fetch videos');
  });

  it('should handle empty video list', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        items: [],
        totalItems: 0,
        currentPage: 1,
      }),
    } as any);

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.videos).toEqual([]);
    expect(data.totalCount).toBe(0);
  });

  it('should handle response without items field', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
    } as any);

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.videos).toEqual([]);
  });

  it('should handle network errors', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const response = await GET();

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Failed to fetch videos');
  });

  it('should include all video metadata fields', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    const mockVideo = {
      guid: 'video-123',
      title: 'Complete Video',
      dateUploaded: '2024-01-15T10:30:00Z',
      length: 1200,
      status: 4,
      views: 500,
      thumbnailFileName: 'complete-thumb.jpg',
      collectionId: 'collection-1',
      width: 3840,
      height: 2160,
      availableResolutions: '2160p,1080p,720p,480p,360p',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        items: [mockVideo],
        totalItems: 1,
        currentPage: 1,
      }),
    } as any);

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.videos[0]).toEqual(mockVideo);
  });

  it('should request up to 1000 videos per page', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        items: [],
        totalItems: 0,
        currentPage: 1,
      }),
    } as any);

    await GET();

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('page=1&itemsPerPage=1000'),
      expect.any(Object)
    );
  });
});
