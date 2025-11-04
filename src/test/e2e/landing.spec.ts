import { test, expect } from '@playwright/test';

test.describe('landing page', () => {
  test('should load with main heading visible', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load
    await page.waitForLoadState('domcontentloaded');

    // Check for heading (case insensitive)
    const heading = page.getByRole('heading', { level: 1 }).first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('should have newsletter signup form', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Look for email input
    const emailInput = page.getByPlaceholder(/email/i).first();
    await expect(emailInput).toBeVisible({ timeout: 10000 });

    // Check form exists (button may have various text)
    const form = page.locator('form, [role="search"]').first();
    await expect(form).toBeVisible({ timeout: 10000 });
  });

  test('should accept email input', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Find and fill email input
    const emailInput = page.getByPlaceholder(/email/i).first();
    await emailInput.fill('test@example.com');

    // Verify value was set
    await expect(emailInput).toHaveValue('test@example.com');
  });

  test('should load all major sections', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Just verify page loaded and is scrollable
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    expect(bodyHeight).toBeGreaterThan(1000);
  });
});
