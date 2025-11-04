import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/download/route';
import { NextRequest } from 'next/server';

// Mock stripe and turso
vi.mock('@/lib/stripe', () => ({
  stripe: {
    checkout: {
      sessions: {
        retrieve: vi.fn(),
      },
    },
  },
}));

vi.mock('@/lib/turso', () => ({
  turso: {
    execute: vi.fn(),
  },
}));

const mockStripe = vi.mocked((await import('@/lib/stripe')).stripe);
const mockTurso = vi.mocked((await import('@/lib/turso')).turso);

describe('GET /api/download', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 when no session_id provided', async () => {
    const request = new NextRequest('http://localhost:3003/api/download');

    const response = await GET(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'No session ID provided');
  });

  it('should return download URL for valid paid session', async () => {
    const mockSession = {
      id: 'cs_test_123',
      payment_status: 'paid',
      customer_email: 'buyer@example.com',
    };

    const mockOrder = {
      id: 'order-123',
      stripe_session_id: 'cs_test_123',
      email: 'buyer@example.com',
      amount: 29.99,
      status: 'completed',
    };

    vi.mocked(mockStripe.checkout.sessions.retrieve).mockResolvedValue(mockSession as any);
    vi.mocked(mockTurso.execute).mockResolvedValue({
      rows: [mockOrder],
    } as any);

    const request = new NextRequest('http://localhost:3003/api/download?session_id=cs_test_123');

    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('downloadUrl', '/book.pdf');

    // Verify Stripe session was retrieved
    expect(mockStripe.checkout.sessions.retrieve).toHaveBeenCalledWith('cs_test_123');

    // Verify database was queried
    expect(mockTurso.execute).toHaveBeenCalledWith({
      sql: 'SELECT * FROM book_orders WHERE stripe_session_id = ?',
      args: ['cs_test_123'],
    });
  });

  it('should return 400 for unpaid session', async () => {
    const mockSession = {
      id: 'cs_test_456',
      payment_status: 'unpaid',
      customer_email: 'buyer@example.com',
    };

    vi.mocked(mockStripe.checkout.sessions.retrieve).mockResolvedValue(mockSession as any);

    const request = new NextRequest('http://localhost:3003/api/download?session_id=cs_test_456');

    const response = await GET(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Invalid or unpaid session');

    // Database should not be queried for unpaid sessions
    expect(mockTurso.execute).not.toHaveBeenCalled();
  });

  it('should return 400 for null session', async () => {
    vi.mocked(mockStripe.checkout.sessions.retrieve).mockResolvedValue(null as any);

    const request = new NextRequest('http://localhost:3003/api/download?session_id=cs_invalid');

    const response = await GET(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Invalid or unpaid session');
  });

  it('should return 404 when order not found in database', async () => {
    const mockSession = {
      id: 'cs_test_789',
      payment_status: 'paid',
      customer_email: 'buyer@example.com',
    };

    vi.mocked(mockStripe.checkout.sessions.retrieve).mockResolvedValue(mockSession as any);
    vi.mocked(mockTurso.execute).mockResolvedValue({
      rows: [],
    } as any);

    const request = new NextRequest('http://localhost:3003/api/download?session_id=cs_test_789');

    const response = await GET(request);

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Order not found');
  });

  it('should return 500 on Stripe API error', async () => {
    vi.mocked(mockStripe.checkout.sessions.retrieve).mockRejectedValue(
      new Error('Stripe API error')
    );

    const request = new NextRequest('http://localhost:3003/api/download?session_id=cs_error');

    const response = await GET(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Failed to generate download');
  });

  it('should return 500 on database error', async () => {
    const mockSession = {
      id: 'cs_test_123',
      payment_status: 'paid',
      customer_email: 'buyer@example.com',
    };

    vi.mocked(mockStripe.checkout.sessions.retrieve).mockResolvedValue(mockSession as any);
    vi.mocked(mockTurso.execute).mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost:3003/api/download?session_id=cs_test_123');

    const response = await GET(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Failed to generate download');
  });

  it('should handle Stripe session with open status', async () => {
    const mockSession = {
      id: 'cs_test_open',
      payment_status: 'open',
      customer_email: 'buyer@example.com',
    };

    vi.mocked(mockStripe.checkout.sessions.retrieve).mockResolvedValue(mockSession as any);

    const request = new NextRequest('http://localhost:3003/api/download?session_id=cs_test_open');

    const response = await GET(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Invalid or unpaid session');
  });

  it('should handle expired Stripe session', async () => {
    vi.mocked(mockStripe.checkout.sessions.retrieve).mockRejectedValue(
      new Error('No such checkout.session: cs_expired')
    );

    const request = new NextRequest('http://localhost:3003/api/download?session_id=cs_expired');

    const response = await GET(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Failed to generate download');
  });

  it('should verify session_id parameter is properly extracted', async () => {
    const mockSession = {
      id: 'cs_test_param',
      payment_status: 'paid',
    };

    const mockOrder = {
      id: 'order-param',
      stripe_session_id: 'cs_test_param',
    };

    vi.mocked(mockStripe.checkout.sessions.retrieve).mockResolvedValue(mockSession as any);
    vi.mocked(mockTurso.execute).mockResolvedValue({
      rows: [mockOrder],
    } as any);

    const request = new NextRequest(
      'http://localhost:3003/api/download?session_id=cs_test_param&other=value'
    );

    await GET(request);

    // Verify correct session_id was extracted and used
    expect(mockStripe.checkout.sessions.retrieve).toHaveBeenCalledWith('cs_test_param');
  });

  it('should return consistent download URL path', async () => {
    const mockSession = {
      id: 'cs_test_url',
      payment_status: 'paid',
    };

    const mockOrder = {
      id: 'order-url',
      stripe_session_id: 'cs_test_url',
    };

    vi.mocked(mockStripe.checkout.sessions.retrieve).mockResolvedValue(mockSession as any);
    vi.mocked(mockTurso.execute).mockResolvedValue({
      rows: [mockOrder],
    } as any);

    const request = new NextRequest('http://localhost:3003/api/download?session_id=cs_test_url');

    const response = await GET(request);

    const data = await response.json();
    // Verify URL is absolute path (not relative, not full URL)
    expect(data.downloadUrl).toBe('/book.pdf');
    expect(data.downloadUrl).toMatch(/^\/[^/]/); // Starts with / but not //
  });

  it('should handle multiple orders for same session (duplicate prevention)', async () => {
    const mockSession = {
      id: 'cs_test_duplicate',
      payment_status: 'paid',
    };

    const mockOrders = [
      {
        id: 'order-1',
        stripe_session_id: 'cs_test_duplicate',
        created_at: 1704067200,
      },
      {
        id: 'order-2',
        stripe_session_id: 'cs_test_duplicate',
        created_at: 1704067300,
      },
    ];

    vi.mocked(mockStripe.checkout.sessions.retrieve).mockResolvedValue(mockSession as any);
    vi.mocked(mockTurso.execute).mockResolvedValue({
      rows: mockOrders,
    } as any);

    const request = new NextRequest(
      'http://localhost:3003/api/download?session_id=cs_test_duplicate'
    );

    const response = await GET(request);

    // Should still return download URL even with multiple orders
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('downloadUrl', '/book.pdf');
  });
});
