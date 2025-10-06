/* eslint-disable */
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { log } from '@/lib/logger';

// Initialize Stripe only if key is provided
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-09-30.clover",
  });
};

export async function POST(request: NextRequest) {
  try {
    const { priceId } = await request.json();
    const stripe = getStripe();

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}/app?success=true`,
      cancel_url: `${request.nextUrl.origin}/?canceled=true`,
      automatic_tax: { enabled: true },
    });

    // Return the URL to redirect to
    return NextResponse.json({ url: session.url });
  } catch (error) {
    await log.error("Error creating checkout session:", 'API', error);
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    );
  }
}
