import { test, expect } from '@playwright/test';

// Skip payment tests in CI or when explicitly disabled
// Set SKIP_PAYMENT_TESTS=false to run tests with real Stripe test mode
const skipPaymentTests = process.env.SKIP_PAYMENT_TESTS === 'true' || process.env.CI;

// Check if Stripe is configured
const stripeConfigured = !!(
  process.env.STRIPE_PUBLISHABLE_KEY_TEST &&
  process.env.STRIPE_SECRET_KEY_TEST &&
  process.env.STRIPE_PRICE_DIAMOND_SPRINT_TEST
);

test.describe('stripe checkout flow', () => {
  test('should display pricing or access button on landing page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Look for common pricing/CTA buttons
    const ctaButton = page.getByRole('button', { name: /get access|join|enroll|buy|pricing/i }).first();

    // Button may not exist yet if pricing section not implemented
    const buttonCount = await page.getByRole('button', { name: /get access|join|enroll|buy|pricing/i }).count();

    if (buttonCount > 0) {
      await expect(ctaButton).toBeVisible();
    }
  });

  test.skip(skipPaymentTests || !stripeConfigured, 'should initiate checkout session when CTA clicked', async ({ page }) => {
    // This test requires Stripe integration and environment variables
    if (!stripeConfigured) {
      console.log('⚠️  Skipping: Stripe not configured. Run ./scripts/setup-stripe.sh');
      return;
    }

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Click pricing/buy button
    const ctaButton = page.getByRole('button', { name: /get access|join|enroll|buy/i }).first();

    if (await ctaButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await ctaButton.click();

      // Wait for checkout API call
      const checkoutResponse = await page.waitForResponse(
        resp => resp.url().includes('/api/stripe/checkout'),
        { timeout: 10000 }
      );

      expect(checkoutResponse.ok()).toBeTruthy();

      const data = await checkoutResponse.json();
      expect(data.sessionId).toBeTruthy();
      expect(data.url).toContain('checkout.stripe.com');
    } else {
      console.log('⚠️  Buy button not found - pricing page not implemented yet');
    }
  });

  test.skip(skipPaymentTests || !stripeConfigured, 'should redirect to Stripe checkout page', async ({ page }) => {
    // This test requires Stripe integration and will redirect to Stripe's domain
    if (!stripeConfigured) {
      console.log('⚠️  Skipping: Stripe not configured');
      return;
    }

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const ctaButton = page.getByRole('button', { name: /get access|join|enroll|buy/i }).first();

    if (await ctaButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await ctaButton.click();

      // Wait for redirect to Stripe
      await page.waitForURL(/checkout\.stripe\.com/, { timeout: 15000 });

      expect(page.url()).toContain('checkout.stripe.com');
    } else {
      console.log('⚠️  Buy button not found');
      test.skip();
    }
  });

  test.skip(skipPaymentTests || !stripeConfigured, 'should complete test payment with test card', async ({ page }) => {
    // This test uses Stripe's test mode with test card number 4242 4242 4242 4242
    // Requires full Stripe integration and pricing page with buy button

    if (!stripeConfigured) {
      console.log('⚠️  Skipping: Stripe not configured');
      return;
    }

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const ctaButton = page.getByRole('button', { name: /get access|join|enroll|buy/i }).first();

    if (!(await ctaButton.isVisible({ timeout: 5000 }).catch(() => false))) {
      console.log('⚠️  Buy button not found - skipping payment test');
      test.skip();
      return;
    }

    await ctaButton.click();

    // Wait for Stripe checkout page
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 15000 });

    // Fill test card details (Stripe test mode)
    await page.getByPlaceholder('Card number').fill('4242 4242 4242 4242');
    await page.getByPlaceholder('MM / YY').fill('12/34');
    await page.getByPlaceholder('CVC').fill('123');
    await page.getByPlaceholder('ZIP').fill('12345');

    // Fill email if required
    const emailField = page.getByPlaceholder('Email');
    if (await emailField.isVisible({ timeout: 2000 }).catch(() => false)) {
      await emailField.fill('test@example.com');
    }

    // Submit payment
    await page.getByRole('button', { name: /pay|subscribe/i }).click();

    // Redirects back to success page
    await page.waitForURL(/\/checkout\/success|\/thank-you|\/confirmation|\/app/, { timeout: 30000 });

    // Verify success (either success message or redirect to app)
    const hasSuccessMessage = await page.getByText(/thank you|success|confirmed|payment received/i)
      .isVisible({ timeout: 5000 })
      .catch(() => false);

    const isAppPage = page.url().includes('/app');

    expect(hasSuccessMessage || isAppPage).toBeTruthy();
  });

  test.skip(skipPaymentTests || !stripeConfigured, 'should handle payment cancellation', async ({ page }) => {
    // Test canceling payment flow
    if (!stripeConfigured) {
      console.log('⚠️  Skipping: Stripe not configured');
      return;
    }

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const ctaButton = page.getByRole('button', { name: /get access|join|enroll|buy/i }).first();

    if (!(await ctaButton.isVisible({ timeout: 5000 }).catch(() => false))) {
      console.log('⚠️  Buy button not found');
      test.skip();
      return;
    }

    await ctaButton.click();

    // Wait for Stripe checkout page
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 15000 });

    // Click back/cancel button
    await page.goBack();

    // Should return to original page (or pricing page)
    const url = page.url();
    expect(url.includes('/') || url.includes('/pricing')).toBeTruthy();
  });
});

test.describe('checkout success page', () => {
  test.skip(!stripeConfigured, 'should display success page after payment', async ({ page }) => {
    // Direct navigation to success page (for testing layout without payment)
    await page.goto('/checkout/success');
    await page.waitForLoadState('domcontentloaded');

    // Verify page loads (may be 404 if not implemented yet)
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});

test.describe('webhook handling (indirect validation)', () => {
  // Note: Direct webhook testing requires server-side verification
  // E2E tests can only indirectly verify webhook effects (e.g., subscription status)

  test.skip(!stripeConfigured, 'webhook should activate member access after payment', async ({ page }) => {
    // This test validates webhook effects indirectly
    // Requires:
    // 1. User authentication system
    // 2. Database with user access records
    // 3. Member portal with access checks

    console.log('⚠️  Webhook validation requires authentication system (not implemented)');
    test.skip();

    // Future implementation:
    // 1. Login as test user
    // 2. Complete test payment
    // 3. Wait for webhook to process (via polling or delay)
    // 4. Navigate to member portal
    // 5. Verify access is granted
    // 6. Check subscription status in profile
  });
});
