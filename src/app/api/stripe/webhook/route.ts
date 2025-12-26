import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { turso } from '@/lib/turso';
import { log } from '@/lib/axiom-logger';

/**
 * Validates that required Stripe credentials are present.
 * Implements fail-fast pattern to prevent silent misconfiguration.
 *
 * @throws {Error} If required Stripe credentials are missing
 */
function validateStripeCredentials(): { secretKey: string; webhookSecret: string } {
  const secretKey = process.env.STRIPE_SECRET_KEY_TEST || process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_TEST || process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || secretKey.trim() === '') {
    throw new Error(
      'STRIPE_SECRET_KEY or STRIPE_SECRET_KEY_TEST is not configured. ' +
      'Please set this environment variable. See README.md for setup instructions.'
    );
  }

  if (!webhookSecret || webhookSecret.trim() === '') {
    throw new Error(
      'STRIPE_WEBHOOK_SECRET or STRIPE_WEBHOOK_SECRET_TEST is not configured. ' +
      'Please set this environment variable. See README.md for setup instructions.'
    );
  }

  return { secretKey, webhookSecret };
}

// Validate credentials at module load time (fail-fast)
const credentials = validateStripeCredentials();

const stripe = new Stripe(credentials.secretKey, {
  apiVersion: '2025-10-29.clover',
});

const WEBHOOK_SECRET = credentials.webhookSecret;

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

    await log.info('Course access granted', {
      paymentId,
      userId: userId || 'anonymous',
      customerEmail: customerEmail || 'not provided',
      sessionId,
      amount: amountTotal ? amountTotal / 100 : 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    await log.error('Failed to grant course access', {
      userId: userId || 'anonymous',
      customerEmail: customerEmail || 'not provided',
      sessionId,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
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

    await log.info('Subscription updated', {
      subscriptionId,
      status,
      currentPeriodEnd: currentPeriodEnd.toISOString(),
      userId: userId || 'anonymous',
      stripeCustomerId: stripeCustomerId || 'not provided',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    await log.error('Failed to update subscription', {
      subscriptionId,
      userId: userId || 'anonymous',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
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

    await log.info('Access revoked', {
      userId: userId || 'anonymous',
      subscriptionId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    await log.error('Failed to revoke access', {
      userId: userId || 'anonymous',
      subscriptionId,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    await log.warn('Stripe webhook: Missing signature', {
      ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  // WEBHOOK_SECRET is validated at module load time, no need for runtime check

  let event: Stripe.Event;

  // Verify webhook signature (CRITICAL for security)
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      WEBHOOK_SECRET
    );

    await log.info('Stripe webhook received', {
      eventType: event.type,
      eventId: event.id,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    await log.error('Stripe webhook signature verification failed', {
      error: err instanceof Error ? err.message : String(err),
      hasSignature: !!signature,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle different event types
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        await log.info('Stripe checkout completed', {
          eventType: 'checkout.session.completed',
          stripeEventId: event.id,
          sessionId: session.id,
          customerId: session.customer as string,
          customerEmail: session.customer_email || session.customer_details?.email || 'not provided',
          amount: session.amount_total ? session.amount_total / 100 : 0,
          currency: session.currency || 'usd',
          userId: session.metadata?.userId || 'not provided',
          paymentStatus: session.payment_status,
          timestamp: new Date().toISOString(),
        });

        // Grant access to user
        await grantCourseAccess({
          userId: session.metadata?.userId,
          customerEmail: session.customer_email || session.customer_details?.email || null,
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
          // Stripe Subscription type doesn't expose current_period_end directly, but it's always present
          currentPeriodEnd: new Date((subscription as unknown as { current_period_end: number }).current_period_end * 1000),
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

        await log.error('Payment failed', {
          eventType: 'payment_intent.payment_failed',
          stripeEventId: event.id,
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          customerEmail: paymentIntent.receipt_email || 'not provided',
          failureMessage: paymentIntent.last_payment_error?.message || 'not provided',
          timestamp: new Date().toISOString(),
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

        await log.error('Invoice payment failed', {
          eventType: 'invoice.payment_failed',
          stripeEventId: event.id,
          invoiceId: invoice.id,
          customerEmail: invoice.customer_email || 'not provided',
          amountDue: invoice.amount_due / 100,
          currency: invoice.currency,
          timestamp: new Date().toISOString(),
        });

        // TODO: Send dunning email
        break;
      }

      default:
        await log.info('Unhandled Stripe webhook event', {
          eventType: event.type,
          stripeEventId: event.id,
          timestamp: new Date().toISOString(),
        });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    await log.error('Webhook processing error', {
      error: err instanceof Error ? err.message : String(err),
      eventType: event?.type || 'unknown',
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
