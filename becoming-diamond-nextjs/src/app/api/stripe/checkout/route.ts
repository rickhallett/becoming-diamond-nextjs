import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST || process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-10-29.clover',
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3003';

// Allowed price IDs (prevent price manipulation)
const ALLOWED_PRICE_IDS = [
  process.env.STRIPE_PRICE_DIAMOND_SPRINT_TEST,
  process.env.STRIPE_PRICE_DIAMOND_SPRINT,
  process.env.STRIPE_PRICE_MONTHLY_TEST,
  process.env.STRIPE_PRICE_MONTHLY,
  process.env.STRIPE_PRICE_ANNUAL_TEST,
  process.env.STRIPE_PRICE_ANNUAL,
].filter(Boolean); // Remove undefined values

export async function POST(req: NextRequest) {
  try {
    // Check if Stripe is enabled
    if (process.env.STRIPE_ENABLED !== 'true') {
      return NextResponse.json(
        { error: 'Payment processing is temporarily unavailable' },
        { status: 503 }
      );
    }

    const { priceId, successUrl, cancelUrl, customerEmail, metadata } = await req.json();

    // Validate price ID
    if (!priceId || !ALLOWED_PRICE_IDS.includes(priceId)) {
      return NextResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      );
    }

    // TODO: Get user session when authentication is implemented
    // const session = await getSession();
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Determine mode (payment or subscription)
    const price = await stripe.prices.retrieve(priceId);
    const mode = price.type === 'recurring' ? 'subscription' : 'payment';

    // Create Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode,
      customer_email: customerEmail,
      // client_reference_id: session?.user?.id, // Link to user when auth is ready
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${BASE_URL}/pricing?cancelled=true`,
      metadata: {
        // userId: session?.user?.id,
        ...metadata,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      ...(mode === 'subscription' && {
        subscription_data: {
          metadata: {
            // userId: session?.user?.id,
            ...metadata,
          },
        },
      }),
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error('[Stripe Checkout] Error:', error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Retrieve session details (for success page)
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session_id' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      id: session.id,
      status: session.status,
      payment_status: session.payment_status,
      customer_email: session.customer_email,
      amount_total: session.amount_total,
      currency: session.currency,
    });
  } catch (error) {
    console.error('[Stripe Checkout] Retrieve error:', error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to retrieve session' },
      { status: 500 }
    );
  }
}
