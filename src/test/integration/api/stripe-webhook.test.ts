import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/stripe/webhook/route';
import { NextRequest } from 'next/server';
import Stripe from 'stripe';

// Mock stripe, turso, and email service
vi.mock('@/lib/stripe', () => ({
  stripe: {
    webhooks: {
      constructEvent: vi.fn(),
    },
  },
}));

vi.mock('@/lib/turso', () => ({
  turso: {
    execute: vi.fn(),
  },
}));

vi.mock('@/lib/email-service', () => ({
  sendBookPurchaseEmail: vi.fn(),
}));

vi.mock('@/lib/logger', () => ({
  log: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

const mockStripe = vi.mocked((await import('@/lib/stripe')).stripe);
const mockTurso = vi.mocked((await import('@/lib/turso')).turso);
const mockEmailService = vi.mocked((await import('@/lib/email-service')).sendBookPurchaseEmail);

describe('POST /api/stripe/webhook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 for missing signature', async () => {
    const request = new NextRequest('http://localhost:3003/api/stripe/webhook', {
      method: 'POST',
      body: JSON.stringify({ test: 'data' }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'No signature provided');
  });

  it('should return 400 for invalid signature', async () => {
    vi.mocked(mockStripe.webhooks.constructEvent).mockImplementation(() => {
      throw new Error('Invalid signature');
    });

    const request = new NextRequest('http://localhost:3003/api/stripe/webhook', {
      method: 'POST',
      headers: { 'stripe-signature': 'invalid-signature' },
      body: JSON.stringify({ test: 'data' }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Invalid signature');
  });

  it('should handle checkout.session.completed event', async () => {
    const mockEvent: Stripe.Event = {
      id: 'evt_test_123',
      object: 'event',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_123',
          object: 'checkout.session',
          amount_total: 1999, // $19.99 in cents
          customer_email: 'buyer@example.com',
        } as any,
      },
    } as Stripe.Event;

    vi.mocked(mockStripe.webhooks.constructEvent).mockReturnValue(mockEvent);
    vi.mocked(mockTurso.execute).mockResolvedValue({} as any);
    vi.mocked(mockEmailService).mockResolvedValue({
      success: true,
      emailId: 'email-123',
    } as any);

    const request = new NextRequest('http://localhost:3003/api/stripe/webhook', {
      method: 'POST',
      headers: { 'stripe-signature': 'valid-signature' },
      body: JSON.stringify(mockEvent),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('received', true);

    // Verify database insert was called
    expect(mockTurso.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining('INSERT INTO book_orders'),
      args: expect.arrayContaining([
        expect.any(String), // orderId (UUID)
        'buyer@example.com',
        'cs_test_123',
        19.99, // Converted from cents
        'completed',
        expect.any(Number),
      ]),
    });

    // Verify email was sent
    expect(mockEmailService).toHaveBeenCalledWith({
      email: 'buyer@example.com',
      downloadUrl: expect.stringContaining('/api/download/'),
      orderNumber: expect.any(String),
    });
  });

  it('should handle checkout.session.completed with customer_details', async () => {
    const mockEvent: Stripe.Event = {
      id: 'evt_test_123',
      object: 'event',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_123',
          object: 'checkout.session',
          amount_total: 2500,
          customer_details: {
            email: 'customer@example.com',
          },
        } as any,
      },
    } as Stripe.Event;

    vi.mocked(mockStripe.webhooks.constructEvent).mockReturnValue(mockEvent);
    vi.mocked(mockTurso.execute).mockResolvedValue({} as any);
    vi.mocked(mockEmailService).mockResolvedValue({
      success: true,
      emailId: 'email-123',
    } as any);

    const request = new NextRequest('http://localhost:3003/api/stripe/webhook', {
      method: 'POST',
      headers: { 'stripe-signature': 'valid-signature' },
      body: JSON.stringify(mockEvent),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);

    // Verify customer_details.email was used
    expect(mockTurso.execute).toHaveBeenCalledWith({
      sql: expect.any(String),
      args: expect.arrayContaining(['customer@example.com']),
    });
  });

  it('should continue if email sending fails', async () => {
    const mockEvent: Stripe.Event = {
      id: 'evt_test_123',
      object: 'event',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_123',
          object: 'checkout.session',
          amount_total: 1999,
          customer_email: 'buyer@example.com',
        } as any,
      },
    } as Stripe.Event;

    vi.mocked(mockStripe.webhooks.constructEvent).mockReturnValue(mockEvent);
    vi.mocked(mockTurso.execute).mockResolvedValue({} as any);
    vi.mocked(mockEmailService).mockResolvedValue({
      success: false,
      error: 'Email delivery failed',
    } as any);

    const request = new NextRequest('http://localhost:3003/api/stripe/webhook', {
      method: 'POST',
      headers: { 'stripe-signature': 'valid-signature' },
      body: JSON.stringify(mockEvent),
    });

    const response = await POST(request);

    // Should still return success even if email failed
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('received', true);

    // Verify database insert still happened
    expect(mockTurso.execute).toHaveBeenCalled();
  });

  it('should ignore unhandled event types', async () => {
    const mockEvent: Stripe.Event = {
      id: 'evt_test_123',
      object: 'event',
      type: 'payment_intent.succeeded',
      data: {
        object: {} as any,
      },
    } as Stripe.Event;

    vi.mocked(mockStripe.webhooks.constructEvent).mockReturnValue(mockEvent);

    const request = new NextRequest('http://localhost:3003/api/stripe/webhook', {
      method: 'POST',
      headers: { 'stripe-signature': 'valid-signature' },
      body: JSON.stringify(mockEvent),
    });

    const response = await POST(request);

    // Should still return success for unhandled events
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('received', true);

    // Database should not be called for unhandled events
    expect(mockTurso.execute).not.toHaveBeenCalled();
  });

  it('should return 500 on database error', async () => {
    const mockEvent: Stripe.Event = {
      id: 'evt_test_123',
      object: 'event',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_123',
          object: 'checkout.session',
          amount_total: 1999,
          customer_email: 'buyer@example.com',
        } as any,
      },
    } as Stripe.Event;

    vi.mocked(mockStripe.webhooks.constructEvent).mockReturnValue(mockEvent);
    vi.mocked(mockTurso.execute).mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost:3003/api/stripe/webhook', {
      method: 'POST',
      headers: { 'stripe-signature': 'valid-signature' },
      body: JSON.stringify(mockEvent),
    });

    const response = await POST(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Webhook processing failed');
  });
});
