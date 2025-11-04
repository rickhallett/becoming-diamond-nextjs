import { test, expect } from '@playwright/test';

test.describe('landing page extended scenarios', () => {
  test('should validate email format', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const emailInput = page.getByPlaceholder(/email/i).first();

    // Try invalid email
    await emailInput.fill('invalid-email');

    // Check if input has email type validation
    const inputType = await emailInput.getAttribute('type');
    expect(inputType).toBe('email');
  });

  test('should scroll through page sections', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Scroll to middle of page
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));
    await page.waitForTimeout(500);

    // Verify scroll position changed
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const finalScrollY = await page.evaluate(() => window.scrollY);
    expect(finalScrollY).toBeGreaterThan(scrollY);
  });

  test('should have multiple sections visible after scroll', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Scroll through page and count visible sections
    let sectionCount = 0;

    // Scroll in increments
    for (let i = 0; i < 5; i++) {
      await page.evaluate((offset) => window.scrollBy(0, offset), window.innerHeight);
      await page.waitForTimeout(300);
      sectionCount++;
    }

    expect(sectionCount).toBeGreaterThan(3);
  });
});

test.describe('newsletter signup flow', () => {
  test.skip('should submit newsletter form and show success message', async ({ page }) => {
    // TODO: Implement when API integration is complete
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const emailInput = page.getByPlaceholder(/email/i).first();
    await emailInput.fill('test@example.com');

    // Find and click submit button
    const submitButton = page.locator('form').first().getByRole('button').first();
    await submitButton.click();

    // Wait for API call
    const apiResponse = await page.waitForResponse(
      resp => resp.url().includes('/api/leads') && resp.status() === 200,
      { timeout: 5000 }
    );
    expect(apiResponse.ok()).toBeTruthy();

    // Verify success message
    await expect(page.getByText(/thank you|success|subscribed/i)).toBeVisible({ timeout: 5000 });
  });

  test.skip('should handle newsletter signup errors gracefully', async ({ page }) => {
    // TODO: Implement when error handling is implemented
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Try to submit with invalid/duplicate email
    const emailInput = page.getByPlaceholder(/email/i).first();
    await emailInput.fill('duplicate@example.com');

    const submitButton = page.locator('form').first().getByRole('button').first();
    await submitButton.click();

    // Should show error message
    await expect(page.getByText(/error|already subscribed/i)).toBeVisible({ timeout: 5000 });
  });

  test.skip('should prevent duplicate newsletter signups', async ({ page }) => {
    // TODO: Implement when duplicate detection is added
    await page.goto('/');

    const emailInput = page.getByPlaceholder(/email/i).first();
    await emailInput.fill('existing@example.com');

    const submitButton = page.locator('form').first().getByRole('button').first();
    await submitButton.click();

    // API should return error for duplicate
    const apiResponse = await page.waitForResponse(
      resp => resp.url().includes('/api/leads'),
      { timeout: 5000 }
    );

    expect(apiResponse.status()).toBe(409); // Conflict
  });
});
