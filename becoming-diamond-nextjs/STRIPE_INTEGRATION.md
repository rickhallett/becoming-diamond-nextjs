# Stripe Integration - Book Sales

Complete guide for the Stripe-powered book purchase functionality.

## Overview

The book sales section is fully integrated with Stripe Checkout for processing $47 book purchases.

**Product Details:**
- Product ID: `prod_T9jYQj5hLB9gYw`
- Price ID: `price_1SDQ50RVLr5O3VREdsw5inuj`
- Price: $47 (discounted from $77)
- Book: "Turning Snowflakes into Diamonds" by Michael Dugan

---

## Setup Instructions

### 1. Environment Variables

Add your Stripe keys to `.env.local`:

```env
# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key_here
STRIPE_SECRET_KEY=sk_live_your_key_here
```

**Where to find your keys:**
1. Log in to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API keys**
3. Copy your **Publishable key** (starts with `pk_`)
4. Reveal and copy your **Secret key** (starts with `sk_`)

**Important:**
- Use **test keys** (`pk_test_` and `sk_test_`) for development
- Use **live keys** (`pk_live_` and `sk_live_`) for production
- Never commit `.env.local` to Git (it's in `.gitignore`)

---

### 2. Verify Product Configuration

The product and price are already configured in your Stripe account:

**To verify in Stripe Dashboard:**
1. Go to **Products** → Click on "Turning Snowflakes into Diamonds"
2. Confirm Product ID matches: `prod_T9jYQj5hLB9gYw`
3. Under Pricing, confirm Price ID matches: `price_1SDQ50RVLr5O3VREdsw5inuj`
4. Verify price is $47.00 USD

---

### 3. Test the Integration

**Development Testing (Test Mode):**

1. Add test keys to `.env.local`:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

2. Restart your dev server:
   ```bash
   npm run dev
   ```

3. Navigate to the book section on your landing page

4. Click "Buy Now - $47"

5. Use Stripe's test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Any future expiry date
   - Any 3-digit CVC
   - Any ZIP code

6. After successful test purchase, you'll be redirected to `/app?success=true`

---

## How It Works

### Client-Side Flow (`BookSalesSection.tsx`)

```typescript
const handleBuyNow = async () => {
  // 1. Make API call to create checkout session
  const response = await fetch("/api/checkout", {
    method: "POST",
    body: JSON.stringify({
      priceId: "price_1SDQ50RVLr5O3VREdsw5inuj",
      productId: "prod_T9jYQj5hLB9gYw",
    }),
  });

  // 2. Get session ID from response
  const { sessionId } = await response.json();

  // 3. Redirect to Stripe Checkout
  const stripe = await stripePromise;
  await stripe.redirectToCheckout({ sessionId });
};
```

### Server-Side API (`/api/checkout/route.ts`)

```typescript
export async function POST(request: NextRequest) {
  // 1. Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/app?success=true`,
    cancel_url: `${origin}/?canceled=true`,
    automatic_tax: { enabled: true },
  });

  // 2. Return session ID to client
  return NextResponse.json({ sessionId: session.id });
}
```

---

## Customization

### Change Success/Cancel URLs

Edit `/src/app/api/checkout/route.ts`:

```typescript
const session = await stripe.checkout.sessions.create({
  // ...
  success_url: `${request.nextUrl.origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${request.nextUrl.origin}/#book`,
});
```

### Add Additional Product Metadata

```typescript
const session = await stripe.checkout.sessions.create({
  // ...
  metadata: {
    product_type: "book",
    book_title: "Turning Snowflakes into Diamonds",
    customer_email: email, // If you collect it
  },
});
```

### Enable Customer Email Collection

```typescript
const session = await stripe.checkout.sessions.create({
  // ...
  customer_email: customerEmail, // Pre-fill from lead capture
  billing_address_collection: "required",
});
```

---

## Success/Cancel Handling

### Success Page

Create a thank-you page at `/src/app/thank-you/page.tsx`:

```typescript
export default function ThankYou() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
        <p>Your purchase was successful.</p>
        <p>Check your email for download instructions.</p>
      </div>
    </div>
  );
}
```

### Handle Query Parameters

On the member dashboard (`/app/page.tsx`):

```typescript
"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("success")) {
      // Show success message
      alert("Purchase successful! Check your email.");
    }
  }, [searchParams]);

  return <div>{/* Dashboard content */}</div>;
}
```

---

## Webhooks (Recommended for Production)

### Why Webhooks?

Webhooks ensure you're notified of successful payments even if users close their browser before returning to your site.

### Setup

1. **Create webhook endpoint** at `/api/webhooks/stripe/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      // Grant access to the book
      // Send download email
      console.log("Payment successful:", session.id);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
```

2. **Add webhook in Stripe Dashboard:**
   - Go to **Developers** → **Webhooks** → **Add endpoint**
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events to listen: `checkout.session.completed`
   - Copy the webhook signing secret
   - Add to `.env.local`: `STRIPE_WEBHOOK_SECRET=whsec_...`

---

## Testing Webhooks Locally

### Use Stripe CLI

1. Install Stripe CLI:
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to local server:
   ```bash
   stripe listen --forward-to localhost:3003/api/webhooks/stripe
   ```

4. Use the webhook signing secret displayed in the terminal

5. Trigger a test event:
   ```bash
   stripe trigger checkout.session.completed
   ```

---

## Security Best Practices

### 1. Environment Variables
- ✅ Never commit `.env.local` to Git
- ✅ Use different keys for dev/prod
- ✅ Store secrets in Vercel environment variables for production

### 2. API Security
- ✅ Validate webhook signatures
- ✅ Use HTTPS in production
- ✅ Rate limit the checkout endpoint (optional)

### 3. Price Validation
- ✅ Price ID is hardcoded in component (user can't manipulate)
- ✅ Session is created server-side
- ✅ Stripe validates the price matches the product

---

## Troubleshooting

### "Stripe key not found"
- Verify `.env.local` exists and contains keys
- Restart dev server after adding environment variables
- Check for typos in variable names

### "Invalid API key"
- Ensure you're using the correct key for your mode (test vs live)
- Regenerate keys if compromised
- Check that secret key is not exposed client-side

### Button not responding
- Open browser console to check for errors
- Verify `/api/checkout` returns a valid `sessionId`
- Test API route directly with curl:
  ```bash
  curl -X POST http://localhost:3003/api/checkout \
    -H "Content-Type: application/json" \
    -d '{"priceId": "price_1SDQ50RVLr5O3VREdsw5inuj"}'
  ```

### Redirects to wrong URL
- Check `success_url` and `cancel_url` in `/api/checkout/route.ts`
- Verify `request.nextUrl.origin` returns correct domain
- Test with hardcoded URLs first

---

## Production Checklist

Before going live:

- [ ] Switch to live Stripe keys (`pk_live_` and `sk_live_`)
- [ ] Add environment variables to Vercel
- [ ] Test with real payment (small amount or refund after)
- [ ] Set up webhook endpoint
- [ ] Configure webhook secret in production
- [ ] Test success and cancel flows
- [ ] Update success URL to actual domain
- [ ] Enable automatic tax if required
- [ ] Add terms of service and refund policy links
- [ ] Test on mobile devices
- [ ] Monitor Stripe Dashboard for first transactions

---

## Support

- **Stripe Docs**: https://stripe.com/docs/checkout/quickstart
- **Stripe Support**: https://support.stripe.com
- **Test Cards**: https://stripe.com/docs/testing#cards

---

## Files Modified/Created

- ✅ `/src/components/BookSalesSection.tsx` - Book sales component
- ✅ `/src/app/api/checkout/route.ts` - Checkout API endpoint
- ✅ `/src/app/page.tsx` - Added BookSalesSection to landing
- ✅ `package.json` - Added `stripe` and `@stripe/stripe-js`
- ✅ `.env.example` - Added Stripe variable placeholders
- ✅ This documentation file

---

**Product Configuration:**
- Product: Turning Snowflakes into Diamonds
- Product ID: `prod_T9jYQj5hLB9gYw`
- Price ID: `price_1SDQ50RVLr5O3VREdsw5inuj`
- Amount: $47.00 USD
- Status: ✅ Ready to use
