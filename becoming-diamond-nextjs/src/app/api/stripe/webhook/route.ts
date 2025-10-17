import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { turso } from '@/lib/turso';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // Create order in database
      const orderId = crypto.randomUUID();
      
      await turso.execute({
        sql: `INSERT INTO book_orders (id, email, stripe_session_id, amount_paid, status, created_at)
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [
          orderId,
          session.customer_email || session.customer_details?.email || 'unknown@email.com',
          session.id,
          (session.amount_total || 0) / 100, // Convert cents to dollars
          'completed',
          Math.floor(Date.now() / 1000),
        ],
      });

      console.log('Order created:', orderId, 'for session:', session.id);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
