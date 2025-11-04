import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '@/app/api/auth/route';
import { NextRequest } from 'next/server';

describe('GET /api/auth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect to GitHub OAuth for valid provider', async () => {
    const request = new NextRequest('http://localhost:3003/api/auth?provider=github');
    const response = await GET(request);

    expect(response.status).toBe(307); // Redirect status
    const location = response.headers.get('location');
    expect(location).toContain('github.com/login/oauth/authorize');
    expect(location).toContain('client_id=');
    expect(location).toContain('redirect_uri=');
    expect(location).toContain('scope=repo,user');
  });

  it('should return 400 for invalid provider', async () => {
    const request = new NextRequest('http://localhost:3003/api/auth?provider=invalid');
    const response = await GET(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('GitHub');
  });

  it('should return 400 for missing provider', async () => {
    const request = new NextRequest('http://localhost:3003/api/auth');
    const response = await GET(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });
});

describe('POST /api/auth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should exchange code for token and return user data', async () => {
    const request = new NextRequest('http://localhost:3003/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: 'test_auth_code',
        provider: 'github',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('token');
    expect(data).toHaveProperty('provider', 'github');
    expect(data).toHaveProperty('user');
    expect(data.user).toMatchObject({
      login: expect.any(String),
      name: expect.any(String),
      email: expect.any(String),
      avatar_url: expect.any(String),
    });
  });

  it('should return 400 for invalid provider', async () => {
    const request = new NextRequest('http://localhost:3003/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: 'test_auth_code',
        provider: 'invalid',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Invalid request');
  });

  it('should return 400 for missing code', async () => {
    const request = new NextRequest('http://localhost:3003/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'github',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  it('should return 400 for missing provider', async () => {
    const request = new NextRequest('http://localhost:3003/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: 'test_auth_code',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  it('should handle authentication failure from GitHub', async () => {
    const request = new NextRequest('http://localhost:3003/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: 'invalid_code',
        provider: 'github',
      }),
    });

    // Mock GitHub to return error (MSW will need handler override)
    const response = await POST(request);

    // Should handle error gracefully
    expect(response.status).toBeGreaterThanOrEqual(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });
});
