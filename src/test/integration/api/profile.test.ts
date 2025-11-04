import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, PUT } from '@/app/api/profile/route';
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

describe('GET /api/profile', () => {
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

  it('should return 404 when user not found in database', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    vi.mocked(mockTurso.execute).mockResolvedValueOnce({
      rows: [],
    } as any);

    const response = await GET();

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'User not found');
  });

  it('should return user profile with default values when profile not found', async () => {
    const mockUser = {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      image: 'https://example.com/avatar.jpg',
      created_at: 1704067200, // 2024-01-01 00:00:00
    };

    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    vi.mocked(mockTurso.execute)
      .mockResolvedValueOnce({
        rows: [mockUser],
      } as any)
      .mockResolvedValueOnce({
        rows: [], // No profile data
      } as any);

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('profile');
    expect(data.profile).toMatchObject({
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      avatar: 'https://example.com/avatar.jpg',
      bio: '',
      location: '',
      website: '',
      currentPR: 1,
      level: 'Initiate',
      xp: 0,
      streak: 0,
    });
    expect(data.profile.joinedDate).toContain('2024-01-01');
  });

  it('should return complete user profile with all fields', async () => {
    const mockUser = {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      image: 'https://example.com/avatar.jpg',
      created_at: 1704067200,
    };

    const mockProfile = {
      bio: 'Software developer and diamond enthusiast',
      location: 'San Francisco, CA',
      website: 'https://example.com',
    };

    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    vi.mocked(mockTurso.execute)
      .mockResolvedValueOnce({
        rows: [mockUser],
      } as any)
      .mockResolvedValueOnce({
        rows: [mockProfile],
      } as any);

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.profile).toMatchObject({
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      bio: 'Software developer and diamond enthusiast',
      location: 'San Francisco, CA',
      website: 'https://example.com',
    });
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

describe('PUT /api/profile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 for unauthenticated request', async () => {
    mockAuth.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3003/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Updated Name' }),
    });

    const response = await PUT(request);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Unauthorized');
  });

  it('should update user name only', async () => {
    const mockUser = {
      id: 'user-123',
      name: 'Updated Name',
      email: 'test@example.com',
      image: 'https://example.com/avatar.jpg',
      created_at: 1704067200,
    };

    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    vi.mocked(mockTurso.execute)
      .mockResolvedValueOnce({} as any) // Name update
      .mockResolvedValueOnce({ rows: [mockUser] } as any) // Fetch user
      .mockResolvedValueOnce({ rows: [] } as any); // Fetch profile

    const request = new NextRequest('http://localhost:3003/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Updated Name' }),
    });

    const response = await PUT(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.profile.name).toBe('Updated Name');

    // Verify name update was called
    expect(mockTurso.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining('UPDATE users SET name'),
      args: expect.arrayContaining(['Updated Name', expect.any(Number), 'user-123']),
    });
  });

  it('should update profile fields (bio, location, website)', async () => {
    const mockUser = {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      image: 'https://example.com/avatar.jpg',
      created_at: 1704067200,
    };

    const updatedProfile = {
      bio: 'Updated bio',
      location: 'New York, NY',
      website: 'https://newsite.com',
    };

    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    vi.mocked(mockTurso.execute)
      .mockResolvedValueOnce({} as any) // Profile update
      .mockResolvedValueOnce({ rows: [mockUser] } as any) // Fetch user
      .mockResolvedValueOnce({ rows: [updatedProfile] } as any); // Fetch profile

    const request = new NextRequest('http://localhost:3003/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bio: 'Updated bio',
        location: 'New York, NY',
        website: 'https://newsite.com',
      }),
    });

    const response = await PUT(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.profile).toMatchObject({
      bio: 'Updated bio',
      location: 'New York, NY',
      website: 'https://newsite.com',
    });

    // Verify profile update was called
    expect(mockTurso.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining('UPDATE user_profiles SET'),
      args: expect.arrayContaining([
        'Updated bio',
        'New York, NY',
        'https://newsite.com',
        expect.any(Number),
        'user-123',
      ]),
    });
  });

  it('should update name and profile fields together', async () => {
    const mockUser = {
      id: 'user-123',
      name: 'Updated Name',
      email: 'test@example.com',
      image: 'https://example.com/avatar.jpg',
      created_at: 1704067200,
    };

    const updatedProfile = {
      bio: 'New bio',
      location: 'Los Angeles, CA',
      website: 'https://example.org',
    };

    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    vi.mocked(mockTurso.execute)
      .mockResolvedValueOnce({} as any) // Name update
      .mockResolvedValueOnce({} as any) // Profile update
      .mockResolvedValueOnce({ rows: [mockUser] } as any) // Fetch user
      .mockResolvedValueOnce({ rows: [updatedProfile] } as any); // Fetch profile

    const request = new NextRequest('http://localhost:3003/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Updated Name',
        bio: 'New bio',
        location: 'Los Angeles, CA',
        website: 'https://example.org',
      }),
    });

    const response = await PUT(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.profile).toMatchObject({
      name: 'Updated Name',
      bio: 'New bio',
      location: 'Los Angeles, CA',
      website: 'https://example.org',
    });
  });

  it('should handle partial profile updates', async () => {
    const mockUser = {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      image: 'https://example.com/avatar.jpg',
      created_at: 1704067200,
    };

    const updatedProfile = {
      bio: 'Only bio updated',
      location: 'Original Location',
      website: 'https://original.com',
    };

    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    vi.mocked(mockTurso.execute)
      .mockResolvedValueOnce({} as any) // Profile update (bio only)
      .mockResolvedValueOnce({ rows: [mockUser] } as any) // Fetch user
      .mockResolvedValueOnce({ rows: [updatedProfile] } as any); // Fetch profile

    const request = new NextRequest('http://localhost:3003/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bio: 'Only bio updated' }),
    });

    const response = await PUT(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.profile.bio).toBe('Only bio updated');

    // Verify only bio was in the update call
    expect(mockTurso.execute).toHaveBeenCalledWith({
      sql: expect.stringMatching(/UPDATE user_profiles SET bio = \?/),
      args: expect.arrayContaining(['Only bio updated', expect.any(Number), 'user-123']),
    });
  });

  it('should return 500 on database error', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    vi.mocked(mockTurso.execute).mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost:3003/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test' }),
    });

    const response = await PUT(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Internal server error');
  });
});
