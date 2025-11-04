import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { turso } from '@/lib/turso';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST || process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET_TEST || process.env.STRIPE_WEBHOOK_SECRET || '';

/**
 * Grant course access to user after successful payment
 */
async function grantCourseAccess(params: {
  userId?: string;
  customerEmail: string | null;
  sessionId: string;
  amountTotal: number | null;
}) {
  const { userId, customerEmail, sessionId, amountTotal } = params;

  try {
    const paymentId = crypto.randomUUID();

    await turso.execute({
      sql: `INSERT INTO payments (id, user_id, stripe_session_id, amount, status, product_type, created_at)
            VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
      args: [
        paymentId,
        userId || 'anonymous',
        sessionId,
        amountTotal || 0,
        'succeeded',
        'course',
      ],
    });

    console.log('[Webhook] Course access granted:', {
      paymentId,
      userId,
      customerEmail,
      sessionId,
    });
  } catch (error) {
    console.error('[Webhook] Failed to grant course access:', error);
    throw error;
  }
}

/**
 * Update user subscription status
 */
async function updateSubscription(params: {
  userId?: string;
  subscriptionId: string;
  stripeCustomerId?: string;
  status: string;
  currentPeriodEnd: Date;
}) {
  const { userId, subscriptionId, stripeCustomerId, status, currentPeriodEnd } = params;

  try {
    const subId = crypto.randomUUID();

    await turso.execute({
      sql: `INSERT INTO subscriptions (id, user_id, stripe_subscription_id, stripe_customer_id, status, current_period_end, created_at)
            VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
            ON CONFLICT(stripe_subscription_id) DO UPDATE SET
              status = excluded.status,
              current_period_end = excluded.current_period_end,
              updated_at = datetime('now')`,
      args: [
        subId,
        userId || 'anonymous',
        subscriptionId,
        stripeCustomerId || null,
        status,
        currentPeriodEnd.toISOString(),
      ],
    });

    console.log('[Webhook] Subscription updated:', {
      subscriptionId,
      status,
      currentPeriodEnd,
    });
  } catch (error) {
    console.error('[Webhook] Failed to update subscription:', error);
    throw error;
  }
}

/**
 * Revoke user access when subscription ends
 */
async function revokeAccess(params: {
  userId?: string;
  subscriptionId: string;
}) {
  const { userId, subscriptionId } = params;

  try {
    await turso.execute({
      sql: `UPDATE subscriptions
            SET status = 'canceled', updated_at = datetime('now')
            WHERE stripe_subscription_id = ?`,
      args: [subscriptionId],
    });

    console.log('[Webhook] Access revoked:', {
      userId,
      subscriptionId,
    });
  } catch (error) {
    console.error('[Webhook] Failed to revoke access:', error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  if (!WEBHOOK_SECRET) {
    console.error('[Webhook] STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  // Verify webhook signature (CRITICAL for security)
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('[Webhook] Signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  console.log('[Webhook] Event received:', event.type);

  // Handle different event types
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Grant access to user
        await grantCourseAccess({
          userId: session.metadata?.userId,
          customerEmail: session.customer_email || session.customer_details?.email,
          sessionId: session.id,
          amountTotal: session.amount_total,
        });

        // TODO: Send confirmation email
        // await sendPurchaseConfirmationEmail({
        //   email: session.customer_email || session.customer_details?.email,
        //   productType: session.mode === 'subscription' ? 'membership' : 'course',
        // });

        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

        await updateSubscription({
          userId: subscription.metadata?.userId,
          subscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        });

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        await revokeAccess({
          userId: subscription.metadata?.userId,
          subscriptionId: subscription.id,
        });

        // TODO: Send cancellation email
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        console.error('[Webhook] Payment failed:', {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          customerEmail: paymentIntent.receipt_email,
        });

        // TODO: Send payment failed email
        // await sendPaymentFailedEmail({
        //   email: paymentIntent.receipt_email,
        //   amount: paymentIntent.amount,
        // });

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;

        console.error('[Webhook] Invoice payment failed:', {
          invoiceId: invoice.id,
          customerEmail: invoice.customer_email,
          amountDue: invoice.amount_due,
        });

        // TODO: Send dunning email
        break;
      }

      default:
        console.log('[Webhook] Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[Webhook] Error processing event:', err);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
