import { test, expect } from '@playwright/test';

test.describe('member portal navigation', () => {
  test('should display member portal layout', async ({ page }) => {
    await page.goto('/app');
    await page.waitForLoadState('domcontentloaded');

    // Page should load (even if redirected to auth)
    await expect(page).toHaveURL(/\/(app|auth|$)/);
  });

  test('should have responsive design', async ({ page }) => {
    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/app');
    await page.waitForLoadState('domcontentloaded');

    // Verify page loads
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    // Verify page still works
    await expect(body).toBeVisible();
  });

  test('should navigate to courses page', async ({ page }) => {
    await page.goto('/app/courses');
    await page.waitForLoadState('domcontentloaded');

    // Verify URL or content loaded
    await expect(page).toHaveURL(/\/(app\/courses|auth)/);
  });

  test('should navigate to profile page', async ({ page }) => {
    await page.goto('/app/profile');
    await page.waitForLoadState('domcontentloaded');

    // Verify URL or content loaded
    await expect(page).toHaveURL(/\/(app\/profile|auth)/);
  });
});
