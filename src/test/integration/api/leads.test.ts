import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST, GET } from '@/app/api/leads/route';
import { NextRequest } from 'next/server';

// Mock turso and email services
vi.mock('@/lib/turso', () => ({
  turso: {
    execute: vi.fn(),
  },
}));

vi.mock('@/lib/resend', () => ({
  sendWelcomeEmail: vi.fn(),
  sendAdminNotification: vi.fn(),
}));

vi.mock('@/lib/logger', () => ({
  log: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

const mockTurso = vi.mocked((await import('@/lib/turso')).turso);
const mockResend = await import('@/lib/resend');

describe('POST /api/leads', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create new lead with valid email and consent', async () => {
    vi.mocked(mockTurso.execute)
      .mockResolvedValueOnce({ rows: [] } as any) // Duplicate check
      .mockResolvedValueOnce({} as any) // Insert
      .mockResolvedValueOnce({} as any); // Update after email

    vi.mocked(mockResend.sendWelcomeEmail).mockResolvedValue({
      success: true,
      emailId: 'email-123',
    } as any);

    const request = new NextRequest('http://localhost:3003/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '192.168.1.1',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        consentGiven: true,
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data).toMatchObject({
      success: true,
      message: expect.stringContaining('Thanks'),
      leadId: expect.stringContaining('lead_'),
    });
  });

  it('should return 400 for invalid email', async () => {
    const request = new NextRequest('http://localhost:3003/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'invalid-email',
        consentGiven: true,
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toMatchObject({
      success: false,
      error: 'Invalid email address',
    });
  });

  it('should return 400 for missing consent', async () => {
    const request = new NextRequest('http://localhost:3003/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        consentGiven: false,
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toMatchObject({
      success: false,
      error: 'Consent required to subscribe',
    });
  });

  it('should return 409 for duplicate email within 24 hours', async () => {
    vi.mocked(mockTurso.execute).mockResolvedValueOnce({
      rows: [{ id: 'existing-lead' }],
    } as any);

    const request = new NextRequest('http://localhost:3003/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        consentGiven: true,
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(409);
    const data = await response.json();
    expect(data).toMatchObject({
      success: false,
      error: expect.stringContaining('already registered'),
    });
  });

  it('should return 429 for rate limit exceeded', async () => {
    const ip = '192.168.1.1';

    // Make 6 requests (limit is 5 per minute)
    for (let i = 0; i < 6; i++) {
      if (i < 5) {
        vi.mocked(mockTurso.execute)
          .mockResolvedValueOnce({ rows: [] } as any)
          .mockResolvedValueOnce({} as any)
          .mockResolvedValueOnce({} as any);

        vi.mocked(mockResend.sendWelcomeEmail).mockResolvedValue({
          success: true,
          emailId: `email-${i}`,
        } as any);
      }

      const request = new NextRequest('http://localhost:3003/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': ip,
        },
        body: JSON.stringify({
          email: `test${i}@example.com`,
          consentGiven: true,
        }),
      });

      const response = await POST(request);

      if (i === 5) {
        expect(response.status).toBe(429);
        const data = await response.json();
        expect(data).toMatchObject({
          success: false,
          error: expect.stringContaining('Too many requests'),
        });
      }
    }
  });
});

describe('GET /api/leads', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 for missing auth header', async () => {
    const request = new NextRequest('http://localhost:3003/api/leads');
    const response = await GET(request);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toMatchObject({
      success: false,
      error: 'Unauthorized',
    });
  });

  it('should return 401 for invalid auth header', async () => {
    const request = new NextRequest('http://localhost:3003/api/leads', {
      headers: { authorization: 'Bearer invalid-key' },
    });
    const response = await GET(request);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toMatchObject({
      success: false,
      error: 'Unauthorized',
    });
  });

  it('should return leads with valid auth', async () => {
    vi.mocked(mockTurso.execute)
      .mockResolvedValueOnce({
        rows: [
          {
            email: 'test1@example.com',
            created_at: '2024-01-01',
            status: 'new',
          },
          {
            email: 'test2@example.com',
            created_at: '2024-01-02',
            status: 'new',
          },
        ],
      } as any)
      .mockResolvedValueOnce({
        rows: [{ total: 2 }],
      } as any);

    const request = new NextRequest('http://localhost:3003/api/leads', {
      headers: { authorization: `Bearer ${process.env.ADMIN_API_KEY}` },
    });
    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('leads');
    expect(data).toHaveProperty('total', 2);
    expect(data).toHaveProperty('page', 1);
    expect(data).toHaveProperty('pageSize', 100);
  });

  it('should return CSV format when requested', async () => {
    vi.mocked(mockTurso.execute)
      .mockResolvedValueOnce({
        rows: [
          {
            email: 'test@example.com',
            created_at: '2024-01-01',
            status: 'new',
            referrer: 'google.com',
            landing_page: 'homepage',
          },
        ],
      } as any)
      .mockResolvedValueOnce({
        rows: [{ total: 1 }],
      } as any);

    const request = new NextRequest('http://localhost:3003/api/leads?format=csv', {
      headers: { authorization: `Bearer ${process.env.ADMIN_API_KEY}` },
    });
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/csv');
    expect(response.headers.get('Content-Disposition')).toContain('attachment');

    const csv = await response.text();
    expect(csv).toContain('email,created_at,status,referrer,landing_page');
    expect(csv).toContain('test@example.com');
  });
});
