import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/video/[videoId]/token/route';
import { NextRequest } from 'next/server';

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

const mockAuth = vi.mocked((await import('@/auth')).auth);

describe('GET /api/video/[videoId]/token', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 for unauthenticated request', async () => {
    mockAuth.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3003/api/video/abc123/token');
    const response = await GET(request, { params: Promise.resolve({ videoId: 'abc123' }) });

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Unauthorized');
  });

  it('should return signed stream URL for authenticated user', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    const request = new NextRequest('http://localhost:3003/api/video/abc123/token');
    const response = await GET(request, { params: Promise.resolve({ videoId: 'abc123' }) });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('streamUrl');
    expect(data).toHaveProperty('token');
    expect(data).toHaveProperty('expiresAt');

    // Verify URL structure
    expect(data.streamUrl).toContain('abc123');
    expect(data.streamUrl).toContain('playlist.m3u8');
    expect(data.streamUrl).toContain('token=');
    expect(data.streamUrl).toContain('expires=');

    // Verify expiration is ~24 hours from now
    const expiresAt = new Date(data.expiresAt);
    const now = new Date();
    const hoursDiff = (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60);
    expect(hoursDiff).toBeGreaterThan(23);
    expect(hoursDiff).toBeLessThan(25);
  });

  it('should allow test auth header', async () => {
    mockAuth.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3003/api/video/test-video/token', {
      headers: { 'x-test-auth': 'true' },
    });
    const response = await GET(request, { params: Promise.resolve({ videoId: 'test-video' }) });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('streamUrl');
    expect(data.streamUrl).toContain('test-video');
  });

  it('should generate different tokens for different videos', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    const request1 = new NextRequest('http://localhost:3003/api/video/video-1/token');
    const response1 = await GET(request1, { params: Promise.resolve({ videoId: 'video-1' }) });
    const data1 = await response1.json();

    const request2 = new NextRequest('http://localhost:3003/api/video/video-2/token');
    const response2 = await GET(request2, { params: Promise.resolve({ videoId: 'video-2' }) });
    const data2 = await response2.json();

    // Tokens should be different
    expect(data1.token).not.toBe(data2.token);

    // URLs should contain respective video IDs
    expect(data1.streamUrl).toContain('video-1');
    expect(data2.streamUrl).toContain('video-2');
  });

  it('should include library ID in token generation', async () => {
    mockAuth.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      expires: '2099-12-31',
    });

    const request = new NextRequest('http://localhost:3003/api/video/abc123/token');
    const response = await GET(request, { params: Promise.resolve({ videoId: 'abc123' }) });

    expect(response.status).toBe(200);
    const data = await response.json();

    // Token should be a valid sha256 hash
    expect(data.token).toMatch(/^[a-f0-9]{64}$/);
  });
});
