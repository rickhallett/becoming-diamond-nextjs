# Stripe Discount Codes Setup Guide

**Last Updated:** December 20, 2024
**Stripe API Version:** 2025-10-29
**Status:** Production Ready

---

## Summary

**You're Already Set Up:**
- Code supports promotion codes (`allow_promotion_codes: true`)
- Just create codes in Stripe Dashboard
- No development work required

**To Create a Discount:**
1. Create Coupon (the discount)
2. Create Promotion Code (what customers enter)
3. Test and activate

**Common Use Cases:**
- Welcome discounts: `WELCOME10` (10% off new customers)
- Seasonal sales: `HOLIDAY20` (20% off limited time)
- Partner codes: `PARTNER15` (15% off referrals)
- VIP offers: `VIP50` (50% off special members)

**Quick Facts:**
- Takes 5 minutes to set up
- Works immediately after creation
- No code changes needed
- Track redemptions and revenue in Stripe Dashboard
- Can deactivate codes anytime

---

## Overview

Your checkout system already supports Stripe promotion codes. Customers can enter discount codes during checkout - you just need to create them in the Stripe Dashboard.

**Current Implementation:** `allow_promotion_codes: true` is enabled in `/src/app/api/stripe/checkout/route.ts:90`

---

## Quick Start

**3 Steps to Create a Discount Code:**

1. Create a Coupon (the discount itself)
2. Create a Promotion Code (the customer-facing code)
3. Test in checkout

**Time Required:** 5 minutes

---

## Step 1: Create a Coupon

Coupons define the actual discount amount or percentage.

### Via Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Products** → **Coupons**
3. Click **Create coupon**
4. Configure discount:

**Discount Type Options:**

| Type | Use Case | Example |
|------|----------|---------|
| Percentage | Most common | 20% off |
| Fixed amount | Specific dollar value | $10 off |
| Free shipping | Not applicable (digital product) | N/A |

**Configuration Fields:**

```
Name: Internal reference (e.g., "Holiday 2024 - 20% Off")
ID: Auto-generated or custom (e.g., "HOLIDAY2024")
Discount: 20% or $10
Duration: Once / Forever / Repeating
```

**Duration Options:**

- **Once:** Applies only to first payment (one-time purchases)
- **Forever:** Applies to all future payments (subscriptions)
- **Repeating:** Applies for X months (subscriptions)

**For Book Sales (One-Time Purchase):**
- Use **"Once"** duration
- Percentage or fixed amount both work

5. Click **Create coupon**

### Via Stripe API (Optional)

```bash
curl https://api.stripe.com/v1/coupons \
  -u sk_test_YOUR_SECRET_KEY: \
  -d percent_off=20 \
  -d duration=once \
  -d name="Holiday 2024 - 20% Off"
```

---

## Step 2: Create a Promotion Code

Promotion codes are customer-facing codes linked to coupons.

### Via Stripe Dashboard

1. Navigate to **Products** → **Promotion codes**
2. Click **Create promotion code**
3. Configure code:

```
Coupon: Select coupon created in Step 1
Code: HOLIDAY20 (customer enters this)
Active: Yes
Max redemptions: Optional (leave blank for unlimited)
Expiration date: Optional
Customer eligibility: All customers / Specific customers / First-time customers
```

**Best Practices for Codes:**
- Easy to type: `WELCOME10` not `W3lc0m3!10`
- Clear meaning: `HOLIDAY20` indicates 20% holiday discount
- Uppercase: More professional
- No special characters unless necessary

4. Click **Create promotion code**

### Via Stripe API (Optional)

```bash
curl https://api.stripe.com/v1/promotion_codes \
  -u sk_test_YOUR_SECRET_KEY: \
  -d coupon=HOLIDAY2024 \
  -d code=HOLIDAY20 \
  -d active=true
```

---

## Step 3: How It Works in Your Checkout

### Customer Experience

1. Customer clicks "Buy Now - $14.99" on your site
2. Redirected to Stripe Checkout
3. **Promotion code field appears automatically** (because `allow_promotion_codes: true`)
4. Customer enters code: `HOLIDAY20`
5. Discount applied immediately:
   - Original: $14.99
   - Discount: -$3.00 (20%)
   - **Total: $11.99**
6. Customer completes purchase

### Technical Flow

```
User clicks Buy Button
    ↓
POST /api/stripe/checkout
    ↓
Stripe Checkout Session created with allow_promotion_codes: true
    ↓
Customer redirected to Stripe
    ↓
Promotion code field visible
    ↓
Customer enters code → Stripe validates → Discount applied
    ↓
Payment processed with discounted amount
    ↓
Success page
```

**No code changes required** - promotion codes work automatically.

---

## Testing

### Test Mode Setup

1. Switch Stripe Dashboard to **Test Mode** (toggle in top right)
2. Create test coupon and promotion code (same steps as above)
3. Test the checkout flow:

**Test Card Numbers:**
```
Success: 4242 4242 4242 4242
Declined: 4000 0000 0000 0002
Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

4. Enter test promotion code during checkout
5. Verify discount appears correctly
6. Complete test purchase

### Verify in Dashboard

After test purchase:
1. Go to **Payments** → Find test payment
2. Check payment details show:
   - Original amount: $14.99
   - Discount applied: -$X.XX
   - Amount charged: $X.XX
   - Promotion code used: HOLIDAY20

---

## Common Discount Strategies

### New Customer Acquisition
```
Code: WELCOME10
Coupon: 10% off
Duration: Once
Max redemptions: Unlimited
Use: First-time buyer incentive
```

### Seasonal Promotions
```
Code: HOLIDAY20
Coupon: 20% off
Duration: Once
Expiration: End of season
Max redemptions: Unlimited
```

### Limited Time Offers
```
Code: FLASH25
Coupon: 25% off
Duration: Once
Expiration: 48 hours
Max redemptions: 100 (creates urgency)
```

### VIP/Referral Codes
```
Code: VIP50
Coupon: 50% off
Duration: Once
Customer eligibility: Specific customers (email list)
Max redemptions: 1 per customer
```

### Email List Discount
```
Code: SUBSCRIBER15
Coupon: 15% off
Duration: Once
Max redemptions: Unlimited
Use: Email newsletter incentive
```

---

## Managing Active Codes

### View All Codes

**Dashboard:** Products → Promotion codes

**Useful Views:**
- Active codes
- Expired codes
- Redemption statistics
- Revenue impact

### Deactivate a Code

1. Find code in **Promotion codes** list
2. Click code name
3. Click **Deactivate**
4. Code immediately stops working (existing uses unaffected)

**When to Deactivate:**
- Promotion ends
- Max budget reached
- Code being abused
- Campaign complete

### Track Performance

**Metrics Available:**
- Times redeemed
- Revenue generated
- Discount amount given
- Customer acquisition cost

**Access:** Click on promotion code → View statistics

---

## Advanced Features

### Minimum Purchase Amount

Require minimum order value for discount:

1. Edit coupon
2. Under **Advanced options**
3. Set "Minimum amount" (e.g., $25)
4. Discount only applies if order ≥ $25

**Note:** For $14.99 book, this would prevent any discount. Use for future products or bundles.

### Maximum Discount Amount

Cap the discount value:

1. Edit coupon
2. Set "Maximum amount" (e.g., $5)
3. Even with 50% off, maximum discount is $5

**Example:**
- 50% off coupon
- Maximum discount: $5
- Order: $14.99
- Discount: $5 (not $7.50)
- Total: $9.99

### First-Time Customer Only

Restrict to new customers:

1. Create promotion code
2. Customer eligibility: **First-time customers**
3. Stripe checks if email has prior purchases
4. Code only works for new email addresses

**Use Case:** Acquisition campaigns, prevent existing customers from reusing new customer discounts.

### Redemption Limits Per Customer

Prevent multiple uses:

1. Edit promotion code
2. Set **Max redemptions per customer: 1**
3. Each email can only use code once

---

## Integration with Your Code

### Current Implementation

Located in: `/src/app/api/stripe/checkout/route.ts`

```typescript
const checkoutSession = await stripe.checkout.sessions.create({
  mode,
  customer_email: customerEmail,
  line_items: [{ price: priceId, quantity: 1 }],
  success_url: successUrl || `${BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: cancelUrl || `${BASE_URL}/pricing?cancelled=true`,
  allow_promotion_codes: true, // ← Enables promotion codes
  billing_address_collection: 'required',
  // ... rest of configuration
});
```

**That's it.** No additional code needed.

### Retrieving Discount Information

If you want to track which codes are used, access session details:

```typescript
// In webhook or success page
const session = await stripe.checkout.sessions.retrieve(sessionId, {
  expand: ['total_details.breakdown']
});

const discountInfo = session.total_details.breakdown.discounts;
// Returns array of applied discounts with codes and amounts
```

### Optional: Custom Discount Logic

If you need custom validation beyond Stripe's features:

```typescript
// Before creating checkout session
const promotionCode = await stripe.promotionCodes.retrieve('CUSTOMCODE');

if (promotionCode.active && /* your custom logic */) {
  // Allow checkout
} else {
  // Return error
}
```

**Most use cases don't need this.** Stripe handles validation automatically.

---

## Troubleshooting

### Code Not Working in Checkout

**Check:**
1. Promotion code is **Active** in Stripe Dashboard
2. Code hasn't reached **Max redemptions**
3. Code hasn't **Expired**
4. Customer meets **Eligibility** requirements
5. Using correct **Test/Live mode** keys

### Discount Not Applied

**Check:**
1. Code entered correctly (case-sensitive if configured)
2. Minimum purchase amount met (if configured)
3. Product is eligible for discounts
4. Code valid for payment type (one-time vs subscription)

### Customer Can't Find Field

**Issue:** Promotion code field not showing

**Causes:**
- `allow_promotion_codes: false` in code
- Using embedded Checkout (promotion codes only work in redirect mode)
- Stripe account settings disabled promotion codes

**Fix:** Verify `allow_promotion_codes: true` in checkout creation

---

## Best Practices

### Security
- Don't share codes publicly unless intended for public use
- Use max redemptions for limited offers
- Monitor for abuse (too many uses too quickly)
- Deactivate expired codes

### Marketing
- Make codes memorable and easy to type
- Communicate expiration dates clearly
- Track ROI per promotion code
- A/B test different discount amounts

### Operational
- Document all active codes in spreadsheet
- Set calendar reminders for expiration dates
- Review redemption metrics monthly
- Archive old codes instead of deleting

### Naming Conventions
```
WELCOME10     - New customers, 10% off
HOLIDAY20     - Holiday sale, 20% off
FLASH25       - Flash sale, 25% off
VIP50         - VIP members, 50% off
PARTNER15     - Partner referrals, 15% off
```

Clear naming helps track campaigns.

---

## Migration: Test to Live

When ready for production:

1. Switch Stripe Dashboard to **Live Mode**
2. Recreate coupons and promotion codes (test mode data doesn't transfer)
3. Use same code names for consistency
4. Update any marketing materials with live codes
5. Test with real card in small amount first

**Important:** Test and Live modes are completely separate. Codes created in Test mode won't work in Live mode.

---

## FAQ

**Q: Can I edit a coupon after creation?**
A: No. You must create a new coupon. But you can create new promotion codes linked to the same coupon.

**Q: Can customers stack multiple codes?**
A: No. Stripe allows one promotion code per checkout session.

**Q: Do codes work for subscriptions?**
A: Yes, but configure duration appropriately (Once, Forever, or Repeating).

**Q: Can I create codes programmatically?**
A: Yes, via Stripe API. Useful for unique codes per customer.

**Q: What happens if code is deactivated during checkout?**
A: Code remains valid for that session. Deactivation only affects new sessions.

**Q: Can I see who used a specific code?**
A: Yes. View promotion code in Dashboard → Click code → View sessions/customers.

---

## Resources

**Stripe Documentation:**
- [Promotion Codes Guide](https://stripe.com/docs/billing/subscriptions/coupons)
- [Checkout with Promotion Codes](https://stripe.com/docs/payments/checkout/discounts)
- [Coupons API Reference](https://stripe.com/docs/api/coupons)
- [Promotion Codes API Reference](https://stripe.com/docs/api/promotion_codes)

**Stripe Dashboard:**
- [Live Mode](https://dashboard.stripe.com/coupons)
- [Test Mode](https://dashboard.stripe.com/test/coupons)

**Your Implementation:**
- Checkout API: `/src/app/api/stripe/checkout/route.ts`
- Stripe Integration Guide: `/docs/guides/stripe-integration.md`

---

## Summary

**You're Already Set Up:**
- Code supports promotion codes (`allow_promotion_codes: true`)
- Just create codes in Stripe Dashboard
- No development work required

**To Create a Discount:**
1. Create Coupon (the discount)
2. Create Promotion Code (what customers enter)
3. Test and activate

**Common Use Cases:**
- Welcome discounts: `WELCOME10`
- Seasonal sales: `HOLIDAY20`
- Partner codes: `PARTNER15`
- VIP offers: `VIP50`

**Next Steps:**
1. Switch to Test mode
2. Create test coupon and code
3. Test checkout flow
4. Create live codes when ready

---

**Questions?** Contact development team or refer to Stripe support documentation.
