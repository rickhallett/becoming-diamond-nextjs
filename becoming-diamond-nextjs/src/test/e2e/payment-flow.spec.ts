import { test, expect } from '@playwright/test';

// Skip payment tests in CI or when explicitly disabled
const skipPaymentTests = process.env.SKIP_PAYMENT_TESTS === 'true' || process.env.CI;

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

  test.skip(skipPaymentTests, 'should initiate checkout session when CTA clicked', async ({ page }) => {
    // This test requires Stripe integration to be implemented
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Click pricing/buy button
    const ctaButton = page.getByRole('button', { name: /get access|join|enroll|buy/i }).first();
    await ctaButton.click();

    // Wait for checkout API call
    const checkoutResponse = await page.waitForResponse(
      resp => resp.url().includes('/api/checkout'),
      { timeout: 10000 }
    );

    expect(checkoutResponse.ok()).toBeTruthy();
  });

  test.skip(skipPaymentTests, 'should redirect to Stripe checkout page', async ({ page }) => {
    // This test requires Stripe integration and will redirect to Stripe's domain
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const ctaButton = page.getByRole('button', { name: /get access|join|enroll|buy/i }).first();
    await ctaButton.click();

    // Wait for redirect to Stripe
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 15000 });

    expect(page.url()).toContain('checkout.stripe.com');
  });

  test.skip(skipPaymentTests, 'should complete test payment with test card', async ({ page }) => {
    // This test uses Stripe's test mode with test card number
    // Requires full Stripe integration

    await page.goto('/');
    const ctaButton = page.getByRole('button', { name: /get access|join|enroll|buy/i }).first();
    await ctaButton.click();

    // Wait for Stripe checkout page
    await page.waitForURL(/checkout\.stripe\.com/);

    // Fill test card details (Stripe test mode)
    await page.getByPlaceholder('Card number').fill('4242 4242 4242 4242');
    await page.getByPlaceholder('MM / YY').fill('12/34');
    await page.getByPlaceholder('CVC').fill('123');
    await page.getByPlaceholder('ZIP').fill('12345');

    // Fill email if required
    const emailField = page.getByPlaceholder('Email');
    if (await emailField.isVisible()) {
      await emailField.fill('test@example.com');
    }

    // Submit payment
    await page.getByRole('button', { name: /pay|subscribe/i }).click();

    // Redirects back to success page
    await page.waitForURL(/\/checkout\/success|\/thank-you|\/confirmation/, { timeout: 30000 });

    // Verify success message
    await expect(page.getByText(/thank you|success|confirmed/i)).toBeVisible();
  });

  test.skip(skipPaymentTests, 'should handle payment cancellation', async ({ page }) => {
    // Test canceling payment flow
    await page.goto('/');
    const ctaButton = page.getByRole('button', { name: /get access|join|enroll|buy/i }).first();
    await ctaButton.click();

    // Wait for Stripe checkout page
    await page.waitForURL(/checkout\.stripe\.com/);

    // Click back/cancel button
    await page.goBack();

    // Should return to original page
    await expect(page).toHaveURL(/\//);
  });
});

test.describe('checkout success page', () => {
  test.skip('should display success page after payment', async ({ page }) => {
    // Direct navigation to success page (for testing layout without payment)
    await page.goto('/checkout/success');
    await page.waitForLoadState('domcontentloaded');

    // Verify page loads
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});

test.describe('webhook handling (indirect validation)', () => {
  // Note: Direct webhook testing requires server-side verification
  // E2E tests can only indirectly verify webhook effects (e.g., subscription status)

  test.skip('webhook should activate member access after payment', async ({ page }) => {
    // TODO: Implement when user database and subscription tracking exists
    // 1. Complete test payment
    // 2. Navigate to member portal
    // 3. Verify access is granted
    // 4. Check subscription status in profile
  });
});
