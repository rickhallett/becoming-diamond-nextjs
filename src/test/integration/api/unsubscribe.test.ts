import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/unsubscribe/route';
import { NextRequest } from 'next/server';

// Mock turso and logger
vi.mock('@/lib/turso', () => ({
  turso: {
    execute: vi.fn(),
  },
}));

vi.mock('@/lib/logger', () => ({
  log: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe('GET /api/unsubscribe', () => {
  let mockTurso: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    // Import turso after mocks are set up
    mockTurso = (await import('@/lib/turso')).turso;
  });

  it('should return 400 HTML when no token provided', async () => {
    const request = new NextRequest('http://localhost:3003/api/unsubscribe');

    const response = await GET(request);

    expect(response.status).toBe(400);
    expect(response.headers.get('Content-Type')).toBe('text/html');

    const html = await response.text();
    expect(html).toContain('Invalid Link');
    expect(html).toContain('Missing unsubscribe token');
    expect(html).toContain('<!DOCTYPE html>');
  });

  it('should return 404 HTML for invalid token', async () => {
    vi.mocked(mockTurso.execute).mockResolvedValue({
      rows: [],
    } as any);

    const request = new NextRequest('http://localhost:3003/api/unsubscribe?token=invalid_token');

    const response = await GET(request);

    expect(response.status).toBe(404);
    expect(response.headers.get('Content-Type')).toBe('text/html');

    const html = await response.text();
    expect(html).toContain('Invalid Link');
    expect(html).toContain('invalid or has expired');

    // Verify database was queried
    expect(mockTurso.execute).toHaveBeenCalledWith({
      sql: 'SELECT id, email, subscribed FROM leads WHERE unsubscribe_token = ?',
      args: ['invalid_token'],
    });
  });

  it('should return 200 HTML for already unsubscribed user', async () => {
    vi.mocked(mockTurso.execute).mockResolvedValue({
      rows: [
        {
          id: 'lead-123',
          email: 'test@example.com',
          subscribed: 0, // Already unsubscribed
        },
      ],
    } as any);

    const request = new NextRequest('http://localhost:3003/api/unsubscribe?token=valid_token');

    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/html');

    const html = await response.text();
    expect(html).toContain('Already Unsubscribed');
    expect(html).toContain('already been unsubscribed');
    expect(html).toContain('test@example.com');

    // Update should NOT be called for already unsubscribed
    expect(mockTurso.execute).toHaveBeenCalledTimes(1);
  });

  it('should successfully unsubscribe user and return 200 HTML', async () => {
    vi.mocked(mockTurso.execute)
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'lead-456',
            email: 'subscriber@example.com',
            subscribed: 1, // Currently subscribed
          },
        ],
      } as any)
      .mockResolvedValueOnce({} as any); // Update query

    const request = new NextRequest('http://localhost:3003/api/unsubscribe?token=valid_token_456');

    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/html');

    const html = await response.text();
    expect(html).toContain('Successfully Unsubscribed');
    expect(html).toContain('removed from our mailing list');
    expect(html).toContain('subscriber@example.com');

    // Verify update was called
    expect(mockTurso.execute).toHaveBeenCalledTimes(2);
    expect(mockTurso.execute).toHaveBeenNthCalledWith(2, {
      sql: 'UPDATE leads SET subscribed = 0, updated_at = ? WHERE id = ?',
      args: [expect.any(String), 'lead-456'],
    });
  });

  it('should return 500 HTML on database error', async () => {
    vi.mocked(mockTurso.execute).mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost:3003/api/unsubscribe?token=error_token');

    const response = await GET(request);

    expect(response.status).toBe(500);
    expect(response.headers.get('Content-Type')).toBe('text/html');

    const html = await response.text();
    expect(html).toContain('Error');
    expect(html).toContain('error occurred');
  });

  it('should include proper HTML structure', async () => {
    vi.mocked(mockTurso.execute).mockResolvedValue({
      rows: [],
    } as any);

    const request = new NextRequest('http://localhost:3003/api/unsubscribe?token=test');

    const response = await GET(request);
    const html = await response.text();

    // Verify HTML structure
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html lang="en">');
    expect(html).toContain('<head>');
    expect(html).toContain('<meta charset="UTF-8">');
    expect(html).toContain('<meta name="viewport"');
    expect(html).toContain('<title>');
    expect(html).toContain('Becoming Diamond');
    expect(html).toContain('<style>');
    expect(html).toContain('</style>');
    expect(html).toContain('</html>');
  });

  it('should display different icons for different message types', async () => {
    // Success icon
    vi.mocked(mockTurso.execute)
      .mockResolvedValueOnce({
        rows: [{ id: 'lead-1', email: 'test@example.com', subscribed: 1 }],
      } as any)
      .mockResolvedValueOnce({} as any);

    const requestSuccess = new NextRequest(
      'http://localhost:3003/api/unsubscribe?token=success_token'
    );
    const responseSuccess = await GET(requestSuccess);
    const htmlSuccess = await responseSuccess.text();
    expect(htmlSuccess).toContain('✓'); // Success icon

    // Error icon
    const requestError = new NextRequest('http://localhost:3003/api/unsubscribe');
    const responseError = await GET(requestError);
    const htmlError = await responseError.text();
    expect(htmlError).toContain('✕'); // Error icon

    // Info icon
    vi.mocked(mockTurso.execute).mockResolvedValue({
      rows: [{ id: 'lead-2', email: 'test@example.com', subscribed: 0 }],
    } as any);

    const requestInfo = new NextRequest('http://localhost:3003/api/unsubscribe?token=info_token');
    const responseInfo = await GET(requestInfo);
    const htmlInfo = await responseInfo.text();
    expect(htmlInfo).toContain('ℹ'); // Info icon
  });

  it('should include footer links in HTML response', async () => {
    const request = new NextRequest('http://localhost:3003/api/unsubscribe');

    const response = await GET(request);
    const html = await response.text();

    expect(html).toContain('Home');
    expect(html).toContain('Privacy Policy');
    expect(html).toContain('Terms of Service');
    expect(html).toContain('© 2025 Becoming Diamond');
  });

  it('should use base URL from environment or default to localhost', async () => {
    const originalEnv = process.env.NEXT_PUBLIC_BASE_URL;
    process.env.NEXT_PUBLIC_BASE_URL = 'https://example.com';

    const request = new NextRequest('http://localhost:3003/api/unsubscribe');

    const response = await GET(request);
    const html = await response.text();

    expect(html).toContain('https://example.com');

    // Restore original env
    if (originalEnv) {
      process.env.NEXT_PUBLIC_BASE_URL = originalEnv;
    } else {
      delete process.env.NEXT_PUBLIC_BASE_URL;
    }
  });

  it('should handle email with special characters', async () => {
    vi.mocked(mockTurso.execute)
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'lead-789',
            email: 'user+tag@example.com',
            subscribed: 1,
          },
        ],
      } as any)
      .mockResolvedValueOnce({} as any);

    const request = new NextRequest('http://localhost:3003/api/unsubscribe?token=special_token');

    const response = await GET(request);
    const html = await response.text();

    expect(html).toContain('user+tag@example.com');
  });

  it('should handle long email addresses', async () => {
    const longEmail = 'verylongemailaddress1234567890@subdomain.example.com';

    vi.mocked(mockTurso.execute)
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'lead-long',
            email: longEmail,
            subscribed: 1,
          },
        ],
      } as any)
      .mockResolvedValueOnce({} as any);

    const request = new NextRequest('http://localhost:3003/api/unsubscribe?token=long_token');

    const response = await GET(request);
    const html = await response.text();

    expect(html).toContain(longEmail);
    expect(html).toContain('word-break: break-all'); // CSS for long email handling
  });

  it('should include responsive CSS for mobile devices', async () => {
    const request = new NextRequest('http://localhost:3003/api/unsubscribe');

    const response = await GET(request);
    const html = await response.text();

    expect(html).toContain('@media (max-width: 640px)');
  });

  it('should update timestamp when unsubscribing', async () => {
    const beforeTime = new Date().toISOString();

    vi.mocked(mockTurso.execute)
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'lead-timestamp',
            email: 'timestamp@example.com',
            subscribed: 1,
          },
        ],
      } as any)
      .mockResolvedValueOnce({} as any);

    const request = new NextRequest('http://localhost:3003/api/unsubscribe?token=timestamp_token');

    await GET(request);

    // Verify update was called with ISO timestamp
    const updateCall = vi.mocked(mockTurso.execute).mock.calls[1][0];
    expect(updateCall.sql).toContain('updated_at = ?');
    expect(typeof updateCall.args[0]).toBe('string');
    // Timestamp should be recent
    const updatedAt = new Date(updateCall.args[0] as string);
    expect(updatedAt.getTime()).toBeGreaterThanOrEqual(new Date(beforeTime).getTime());
  });

  it('should handle token with special characters in URL', async () => {
    const encodedToken = 'token%2Bwith%2Bplus';

    vi.mocked(mockTurso.execute).mockResolvedValue({
      rows: [],
    } as any);

    const request = new NextRequest(
      `http://localhost:3003/api/unsubscribe?token=${encodedToken}`
    );

    await GET(request);

    // Verify decoded token was used in query
    expect(mockTurso.execute).toHaveBeenCalledWith({
      sql: expect.any(String),
      args: ['token+with+plus'], // URL-decoded
    });
  });
});
