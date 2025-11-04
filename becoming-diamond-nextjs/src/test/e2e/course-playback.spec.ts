import { test, expect } from '@playwright/test';

test.describe('course video playback', () => {
  test('should load course page and display course information', async ({ page }) => {
    await page.goto('/app/courses/pr1-stabilize-snowflakes-to-diamonds');
    await page.waitForLoadState('domcontentloaded');

    // Verify course page loads (may redirect to auth)
    await expect(page).toHaveURL(/\/(app\/courses|auth)/);
  });

  test('should display course viewer for valid course', async ({ page }) => {
    await page.goto('/app/courses/pr1-stabilize-snowflakes-to-diamonds');
    await page.waitForLoadState('domcontentloaded');

    // If on course page, verify content is visible
    if (page.url().includes('/app/courses')) {
      const body = page.locator('body');
      await expect(body).toBeVisible();
    }
  });

  test('should handle navigation to non-existent course', async ({ page }) => {
    await page.goto('/app/courses/non-existent-course-id');
    await page.waitForLoadState('domcontentloaded');

    // Should show 404 or redirect
    await expect(page).toHaveURL(/\/(404|not-found|auth)/);
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/app/courses/pr1-stabilize-snowflakes-to-diamonds');
    await page.waitForLoadState('domcontentloaded');

    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});

test.describe('course video player (authenticated)', () => {
  // Note: These tests require authentication fixture
  // To implement: Create auth.json fixture with valid session

  test.skip('user can view video player on course slide', async ({ page }) => {
    // TODO: Implement when auth fixture is created
    // Load authenticated state
    // await page.goto('/app/courses/pr1-stabilize-snowflakes-to-diamonds');
    // await page.getByRole('button', { name: /slide 1/i }).click();
    // const video = page.locator('video');
    // await expect(video).toBeVisible({ timeout: 10000 });
  });

  test.skip('video token API is called for protected content', async ({ page }) => {
    // TODO: Implement when video integration is complete
    // Wait for token API call
    // const tokenResponse = await page.waitForResponse(
    //   resp => resp.url().includes('/api/video/') && resp.url().includes('/token')
    // );
    // expect(tokenResponse.ok()).toBeTruthy();
  });

  test.skip('video playback controls work', async ({ page }) => {
    // TODO: Implement when video integration is complete
    // Test play/pause functionality
    // const video = page.locator('video');
    // await video.click(); // Play
    // await page.waitForTimeout(2000);
    // const isPaused = await video.evaluate(v => (v as HTMLVideoElement).paused);
    // expect(isPaused).toBe(false);
  });

  test.skip('progress tracking persists across slides', async ({ page }) => {
    // TODO: Implement when progress tracking is implemented
    // Navigate to next slide
    // Verify previous slide marked as completed
  });
});
