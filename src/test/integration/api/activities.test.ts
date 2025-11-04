import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '@/app/api/activities/route';
import { NextRequest } from 'next/server';

// Mock auth and turso
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('@/lib/turso-adapter', () => ({
  getTursoClient: vi.fn(() => ({
    execute: vi.fn(),
  })),
}));

const mockAuth = vi.mocked((await import('@/auth')).auth);
const mockTurso = vi.mocked((await import('@/lib/turso-adapter')).getTursoClient)();

describe('GET /api/activities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 for unauthenticated request', async () => {
    mockAuth.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3003/api/activities');
    const response = await GET(request);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Unauthorized');
  });

  it('should return activities with default limit of 10', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    const mockActivities = [
      {
        id: 'activity_1',
        user_id: 'user-123',
        type: 'course_completed',
        description: 'Completed Day 1',
        timestamp: '2024-01-10T10:00:00Z',
        metadata: '{"courseId":"day-1"}',
      },
      {
        id: 'activity_2',
        user_id: 'user-123',
        type: 'login',
        description: 'Logged in',
        timestamp: '2024-01-09T10:00:00Z',
        metadata: null,
      },
    ];

    vi.mocked(mockTurso.execute).mockResolvedValue({
      rows: mockActivities,
    } as any);

    const request = new NextRequest('http://localhost:3003/api/activities');
    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('activities');
    expect(data.activities).toHaveLength(2);
    expect(data.activities[0]).toMatchObject({
      id: 'activity_1',
      userId: 'user-123',
      type: 'course_completed',
      description: 'Completed Day 1',
      timestamp: '2024-01-10T10:00:00Z',
      metadata: { courseId: 'day-1' },
    });
    expect(data.activities[1]).toMatchObject({
      id: 'activity_2',
      metadata: {},
    });

    // Verify query with default limit
    expect(mockTurso.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining('LIMIT ?'),
      args: ['user-123', 10],
    });
  });

  it('should respect custom limit parameter', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    vi.mocked(mockTurso.execute).mockResolvedValue({
      rows: [],
    } as any);

    const request = new NextRequest('http://localhost:3003/api/activities?limit=25');
    const response = await GET(request);

    expect(response.status).toBe(200);

    // Verify query with custom limit
    expect(mockTurso.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining('LIMIT ?'),
      args: ['user-123', 25],
    });
  });

  it('should parse metadata JSON correctly', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    const mockActivities = [
      {
        id: 'activity_1',
        user_id: 'user-123',
        type: 'video_watched',
        description: 'Watched video',
        timestamp: '2024-01-10T10:00:00Z',
        metadata: '{"videoId":"abc123","progress":75,"duration":120}',
      },
    ];

    vi.mocked(mockTurso.execute).mockResolvedValue({
      rows: mockActivities,
    } as any);

    const request = new NextRequest('http://localhost:3003/api/activities');
    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.activities[0].metadata).toEqual({
      videoId: 'abc123',
      progress: 75,
      duration: 120,
    });
  });

  it('should return empty array when no activities', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    vi.mocked(mockTurso.execute).mockResolvedValue({
      rows: [],
    } as any);

    const request = new NextRequest('http://localhost:3003/api/activities');
    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.activities).toEqual([]);
  });

  it('should return 500 on database error', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    vi.mocked(mockTurso.execute).mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost:3003/api/activities');
    const response = await GET(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Internal server error');
  });
});

describe('POST /api/activities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 for unauthenticated request', async () => {
    mockAuth.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3003/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'login',
        description: 'User logged in',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Unauthorized');
  });

  it('should return 400 when type is missing', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    const request = new NextRequest('http://localhost:3003/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: 'User logged in',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'type and description are required');
  });

  it('should return 400 when description is missing', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    const request = new NextRequest('http://localhost:3003/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'login',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'type and description are required');
  });

  it('should log activity without metadata', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    vi.mocked(mockTurso.execute).mockResolvedValue({} as any);

    const request = new NextRequest('http://localhost:3003/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'login',
        description: 'User logged in',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('activity');
    expect(data.activity).toMatchObject({
      id: expect.stringContaining('activity_'),
      userId: 'user-123',
      type: 'login',
      description: 'User logged in',
      timestamp: expect.any(String),
      metadata: {},
    });

    // Verify database insert
    expect(mockTurso.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining('INSERT INTO user_activities'),
      args: expect.arrayContaining([
        expect.stringContaining('activity_'),
        'user-123',
        'login',
        'User logged in',
        expect.any(String),
        null,
      ]),
    });
  });

  it('should log activity with metadata', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    vi.mocked(mockTurso.execute).mockResolvedValue({} as any);

    const metadata = {
      courseId: 'day-5',
      progress: 100,
      score: 95,
    };

    const request = new NextRequest('http://localhost:3003/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'course_completed',
        description: 'Completed Day 5',
        metadata,
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.activity).toMatchObject({
      id: expect.stringContaining('activity_'),
      userId: 'user-123',
      type: 'course_completed',
      description: 'Completed Day 5',
      metadata: {
        courseId: 'day-5',
        progress: 100,
        score: 95,
      },
    });

    // Verify metadata was stringified
    expect(mockTurso.execute).toHaveBeenCalledWith({
      sql: expect.any(String),
      args: expect.arrayContaining([
        expect.stringContaining('activity_'),
        'user-123',
        'course_completed',
        'Completed Day 5',
        expect.any(String),
        JSON.stringify(metadata),
      ]),
    });
  });

  it('should generate unique activity IDs', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    vi.mocked(mockTurso.execute).mockResolvedValue({} as any);

    const request1 = new NextRequest('http://localhost:3003/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'login',
        description: 'First login',
      }),
    });

    const response1 = await POST(request1);
    const data1 = await response1.json();

    const request2 = new NextRequest('http://localhost:3003/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'login',
        description: 'Second login',
      }),
    });

    const response2 = await POST(request2);
    const data2 = await response2.json();

    // IDs should be different
    expect(data1.activity.id).not.toBe(data2.activity.id);
  });

  it('should return 500 on database error', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    vi.mocked(mockTurso.execute).mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost:3003/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'login',
        description: 'User logged in',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Internal server error');
  });
});
