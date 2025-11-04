import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST, PUT } from '@/app/api/courses/route';
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

describe('GET /api/courses', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 for unauthenticated request', async () => {
    mockAuth.mockResolvedValue(null);

    const response = await GET();

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Unauthorized');
  });

  it('should return course enrollments for authenticated user', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    vi.mocked(mockTurso.execute)
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'enroll-1',
            course_id: 'pr1-stabilize',
            enrolled_date: '2024-01-01',
            completed_date: null,
            progress: 45,
            last_accessed_date: '2024-01-15',
            current_lesson: 'lesson-3',
            time_spent: 3600,
          },
        ],
      } as any)
      .mockResolvedValueOnce({
        rows: [
          { lesson_id: 'lesson-1' },
          { lesson_id: 'lesson-2' },
        ],
      } as any);

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('enrollments');
    expect(data.enrollments).toHaveLength(1);
    expect(data.enrollments[0]).toMatchObject({
      courseId: 'pr1-stabilize',
      progress: 45,
      lessonsCompleted: ['lesson-1', 'lesson-2'],
      currentLesson: 'lesson-3',
      timeSpent: 3600,
    });
  });

  it('should return empty array when no enrollments', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    vi.mocked(mockTurso.execute).mockResolvedValueOnce({
      rows: [],
    } as any);

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.enrollments).toEqual([]);
  });

  it('should return 500 on database error', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    vi.mocked(mockTurso.execute).mockRejectedValue(new Error('Database error'));

    const response = await GET();

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Internal server error');
  });
});

describe('POST /api/courses', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 for unauthenticated request', async () => {
    mockAuth.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3003/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId: 'pr1-stabilize' }),
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Unauthorized');
  });

  it('should create course enrollment', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    vi.mocked(mockTurso.execute).mockResolvedValue({} as any);

    const request = new NextRequest('http://localhost:3003/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId: 'pr1-stabilize' }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('enrollment');
    expect(data.enrollment).toMatchObject({
      courseId: 'pr1-stabilize',
      progress: 0,
      lessonsCompleted: [],
      timeSpent: 0,
    });
  });

  it('should return 400 for missing courseId', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    const request = new NextRequest('http://localhost:3003/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'courseId is required');
  });
});

describe('PUT /api/courses', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 for unauthenticated request', async () => {
    mockAuth.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3003/api/courses', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId: 'pr1-stabilize',
        updates: { progress: 50 },
      }),
    });

    const response = await PUT(request);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Unauthorized');
  });

  it('should update course progress', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    vi.mocked(mockTurso.execute)
      .mockResolvedValueOnce({
        rows: [{ id: 'enroll-1' }],
      } as any)
      .mockResolvedValueOnce({} as any);

    const request = new NextRequest('http://localhost:3003/api/courses', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId: 'pr1-stabilize',
        updates: { progress: 75, currentLesson: 'lesson-5' },
      }),
    });

    const response = await PUT(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('success', true);
  });

  it('should return 404 when enrollment not found', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    vi.mocked(mockTurso.execute).mockResolvedValueOnce({
      rows: [],
    } as any);

    const request = new NextRequest('http://localhost:3003/api/courses', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId: 'pr1-stabilize',
        updates: { progress: 75 },
      }),
    });

    const response = await PUT(request);

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Enrollment not found');
  });

  it('should return 400 for missing courseId', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    const request = new NextRequest('http://localhost:3003/api/courses', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates: { progress: 75 } }),
    });

    const response = await PUT(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'courseId is required');
  });
});
