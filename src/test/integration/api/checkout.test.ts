import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST as POST_LEGACY } from '@/app/api/checkout/route';
import { POST as POST_CREATE_SESSION } from '@/app/api/checkout/create-session/route';
import { NextRequest } from 'next/server';
import Stripe from 'stripe';

// Mock stripe library
vi.mock('@/lib/stripe', () => ({
  stripe: {
    checkout: {
      sessions: {
        create: vi.fn(),
      },
    },
  },
}));

vi.mock('@/lib/logger', () => ({
  log: {
    error: vi.fn(),
  },
}));

const mockStripe = vi.mocked((await import('@/lib/stripe')).stripe);

describe('POST /api/checkout (Legacy)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set environment variable for Stripe key
    process.env.STRIPE_SECRET_KEY = 'sk_test_mock_key';
  });

  it('should create checkout session with priceId', async () => {
    const mockSession = {
      id: 'cs_test_123',
      url: 'https://checkout.stripe.com/pay/cs_test_123',
    };

    vi.mocked(mockStripe.checkout.sessions.create).mockResolvedValue(mockSession as any);

    const request = new NextRequest('http://localhost:3003/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId: 'price_1234567890' }),
    });

    const response = await POST_LEGACY(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('url', 'https://checkout.stripe.com/pay/cs_test_123');

    // Verify Stripe checkout session was created
    expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith({
      mode: 'payment',
      line_items: [
        {
          price: 'price_1234567890',
          quantity: 1,
        },
      ],
      success_url: expect.stringContaining('/book/success?session_id={CHECKOUT_SESSION_ID}'),
      cancel_url: expect.stringContaining('/book'),
      automatic_tax: { enabled: true },
    });
  });

  it('should use correct origin for success/cancel URLs', async () => {
    const mockSession = {
      id: 'cs_test_123',
      url: 'https://checkout.stripe.com/pay/cs_test_123',
    };

    vi.mocked(mockStripe.checkout.sessions.create).mockResolvedValue(mockSession as any);

    const request = new NextRequest('https://example.com/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId: 'price_123' }),
    });

    await POST_LEGACY(request);

    expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        success_url: 'https://example.com/book/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'https://example.com/book',
      })
    );
  });

  it('should return 500 on Stripe error', async () => {
    vi.mocked(mockStripe.checkout.sessions.create).mockRejectedValue(
      new Error('Stripe API error')
    );

    const request = new NextRequest('http://localhost:3003/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId: 'price_123' }),
    });

    const response = await POST_LEGACY(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Error creating checkout session');
  });

  it('should handle invalid price ID', async () => {
    vi.mocked(mockStripe.checkout.sessions.create).mockRejectedValue(
      new Error('No such price: invalid_price')
    );

    const request = new NextRequest('http://localhost:3003/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId: 'invalid_price' }),
    });

    const response = await POST_LEGACY(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Error creating checkout session');
  });

  it('should enable automatic tax calculation', async () => {
    const mockSession = {
      id: 'cs_test_123',
      url: 'https://checkout.stripe.com/pay/cs_test_123',
    };

    vi.mocked(mockStripe.checkout.sessions.create).mockResolvedValue(mockSession as any);

    const request = new NextRequest('http://localhost:3003/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId: 'price_123' }),
    });

    await POST_LEGACY(request);

    expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        automatic_tax: { enabled: true },
      })
    );
  });
});

describe('POST /api/checkout/create-session', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create checkout session with fixed price', async () => {
    const mockSession = {
      id: 'cs_test_456',
      url: 'https://checkout.stripe.com/pay/cs_test_456',
    };

    vi.mocked(mockStripe.checkout.sessions.create).mockResolvedValue(mockSession as any);

    const request = new NextRequest('http://localhost:3003/api/checkout/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST_CREATE_SESSION(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('url', 'https://checkout.stripe.com/pay/cs_test_456');

    // Verify checkout session was created with price_data
    expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Your Book Title',
              description: 'Digital PDF',
              images: [],
            },
            unit_amount: 2900, // $29.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: expect.stringContaining('/book/success?session_id={CHECKOUT_SESSION_ID}'),
      cancel_url: expect.stringContaining('/book'),
      customer_email: undefined,
      billing_address_collection: 'auto',
    });
  });

  it('should use origin header for URLs', async () => {
    const mockSession = {
      id: 'cs_test_456',
      url: 'https://checkout.stripe.com/pay/cs_test_456',
    };

    vi.mocked(mockStripe.checkout.sessions.create).mockResolvedValue(mockSession as any);

    const request = new NextRequest('http://localhost:3003/api/checkout/create-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'https://example.com',
      },
    });

    await POST_CREATE_SESSION(request);

    expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        success_url: 'https://example.com/book/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'https://example.com/book',
      })
    );
  });

  it('should fall back to localhost when no origin header', async () => {
    const mockSession = {
      id: 'cs_test_456',
      url: 'https://checkout.stripe.com/pay/cs_test_456',
    };

    vi.mocked(mockStripe.checkout.sessions.create).mockResolvedValue(mockSession as any);

    const request = new NextRequest('http://localhost:3003/api/checkout/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    await POST_CREATE_SESSION(request);

    expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        success_url: expect.stringContaining('localhost:3003'),
        cancel_url: expect.stringContaining('localhost:3003'),
      })
    );
  });

  it('should create session with fixed $29 price', async () => {
    const mockSession = {
      id: 'cs_test_456',
      url: 'https://checkout.stripe.com/pay/cs_test_456',
    };

    vi.mocked(mockStripe.checkout.sessions.create).mockResolvedValue(mockSession as any);

    const request = new NextRequest('http://localhost:3003/api/checkout/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    await POST_CREATE_SESSION(request);

    expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [
          expect.objectContaining({
            price_data: expect.objectContaining({
              unit_amount: 2900, // $29.00 in cents
              currency: 'usd',
            }),
          }),
        ],
      })
    );
  });

  it('should enable billing address collection', async () => {
    const mockSession = {
      id: 'cs_test_456',
      url: 'https://checkout.stripe.com/pay/cs_test_456',
    };

    vi.mocked(mockStripe.checkout.sessions.create).mockResolvedValue(mockSession as any);

    const request = new NextRequest('http://localhost:3003/api/checkout/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    await POST_CREATE_SESSION(request);

    expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        billing_address_collection: 'auto',
      })
    );
  });

  it('should return 500 on Stripe error', async () => {
    vi.mocked(mockStripe.checkout.sessions.create).mockRejectedValue(
      new Error('Stripe API error')
    );

    const request = new NextRequest('http://localhost:3003/api/checkout/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST_CREATE_SESSION(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Failed to create checkout session');
  });

  it('should handle network timeout', async () => {
    vi.mocked(mockStripe.checkout.sessions.create).mockRejectedValue(
      new Error('Request timeout')
    );

    const request = new NextRequest('http://localhost:3003/api/checkout/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST_CREATE_SESSION(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toHaveProperty('error', 'Failed to create checkout session');
  });

  it('should only accept card payment method', async () => {
    const mockSession = {
      id: 'cs_test_456',
      url: 'https://checkout.stripe.com/pay/cs_test_456',
    };

    vi.mocked(mockStripe.checkout.sessions.create).mockResolvedValue(mockSession as any);

    const request = new NextRequest('http://localhost:3003/api/checkout/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    await POST_CREATE_SESSION(request);

    expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        payment_method_types: ['card'],
      })
    );
  });
});
