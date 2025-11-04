import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '@/app/api/chat/route';
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

describe('GET /api/chat', () => {
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

  it('should return chat sessions with messages for authenticated user', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    vi.mocked(mockTurso.execute)
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'session-1',
            title: 'Test Session',
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
          },
        ],
      } as any)
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'msg-1',
            role: 'user',
            content: 'Hello',
            timestamp: '2024-01-01T10:00:00Z',
          },
          {
            id: 'msg-2',
            role: 'assistant',
            content: 'Hi there!',
            timestamp: '2024-01-01T10:00:05Z',
          },
        ],
      } as any);

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('sessions');
    expect(data.sessions).toHaveLength(1);
    expect(data.sessions[0]).toMatchObject({
      id: 'session-1',
      title: 'Test Session',
      messages: [
        {
          id: 'msg-1',
          role: 'user',
          content: 'Hello',
        },
        {
          id: 'msg-2',
          role: 'assistant',
          content: 'Hi there!',
        },
      ],
    });
  });

  it('should return empty array when no sessions', async () => {
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
    expect(data.sessions).toEqual([]);
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

describe('POST /api/chat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 for unauthenticated request', async () => {
    mockAuth.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3003/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New Chat' }),
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Unauthorized');
  });

  it('should create new chat session with title', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    vi.mocked(mockTurso.execute).mockResolvedValue({} as any);

    const request = new NextRequest('http://localhost:3003/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'My New Chat' }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('session');
    expect(data.session).toMatchObject({
      id: expect.stringContaining('session_'),
      title: 'My New Chat',
      messages: [],
    });
  });

  it('should create new chat session with default title', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    vi.mocked(mockTurso.execute).mockResolvedValue({} as any);

    const request = new NextRequest('http://localhost:3003/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('session');
    expect(data.session).toMatchObject({
      title: 'New Conversation',
      messages: [],
    });
  });

  it('should return 500 on database error', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    vi.mocked(mockTurso.execute).mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost:3003/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test' }),
    });

    const response = await POST(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Internal server error');
  });
});
