import { test, expect } from '@playwright/test';

// Visual regression tests use Playwright's screenshot comparison
// Run `npm run test:e2e -- --update-snapshots` to create/update baselines

test.describe('visual regression', () => {
  test('landing page hero section matches baseline', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Wait for animations to settle
    await page.waitForTimeout(2000);

    // Take screenshot of hero section (first viewport)
    await expect(page).toHaveScreenshot('landing-hero.png', {
      animations: 'disabled',
      fullPage: false,
      mask: [
        // Mask dynamic content that changes between runs
        page.locator('video').first(),
        page.locator('[data-dynamic]').first(),
      ],
    });
  });

  test('landing page full page matches baseline', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Wait for all sections to load
    await page.waitForTimeout(3000);

    // Full page screenshot (may be large)
    await expect(page).toHaveScreenshot('landing-full.png', {
      fullPage: true,
      animations: 'disabled',
      // Increase threshold slightly for minor rendering differences
      maxDiffPixels: 100,
    });
  });

  test('member portal dashboard matches baseline', async ({ page }) => {
    await page.goto('/app');
    await page.waitForLoadState('domcontentloaded');

    // Wait for layout to render
    await page.waitForTimeout(1000);

    // Take screenshot (will show login if not authenticated)
    await expect(page).toHaveScreenshot('dashboard.png', {
      animations: 'disabled',
      mask: [
        // Mask user-specific content if authenticated
        page.locator('[data-user-avatar]').first(),
        page.locator('[data-user-name]').first(),
      ],
    });
  });

  test('courses page matches baseline', async ({ page }) => {
    await page.goto('/app/courses');
    await page.waitForLoadState('domcontentloaded');

    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('courses-page.png', {
      animations: 'disabled',
      fullPage: false,
    });
  });

  test.skip('course viewer matches baseline', async ({ page }) => {
    // Requires authentication
    await page.goto('/app/courses/pr1-stabilize-snowflakes-to-diamonds');
    await page.waitForLoadState('networkidle');

    await page.waitForTimeout(2000);

    await expect(page).toHaveScreenshot('course-viewer.png', {
      animations: 'disabled',
      mask: [
        // Mask video player
        page.locator('video'),
        // Mask progress indicators
        page.locator('[data-progress]'),
      ],
    });
  });

  test('mobile landing page matches baseline', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    await page.waitForTimeout(2000);

    await expect(page).toHaveScreenshot('landing-mobile.png', {
      animations: 'disabled',
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('tablet viewport matches baseline', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto('/');
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    await page.waitForTimeout(2000);

    await expect(page).toHaveScreenshot('landing-tablet.png', {
      animations: 'disabled',
      fullPage: false,
      maxDiffPixels: 100,
    });
  });
});

test.describe('dark mode visual regression', () => {
  test.skip('landing page in dark mode matches baseline', async ({ page }) => {
    // This assumes dark mode is default or can be toggled
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Toggle dark mode if needed
    // const darkModeToggle = page.getByRole('button', { name: /dark mode|theme/i });
    // if (await darkModeToggle.isVisible()) {
    //   await darkModeToggle.click();
    // }

    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('landing-dark.png', {
      animations: 'disabled',
      fullPage: false,
    });
  });
});

test.describe('component-specific visual regression', () => {
  test.skip('navigation menu matches baseline', async ({ page }) => {
    await page.goto('/app');
    await page.waitForLoadState('domcontentloaded');

    // Screenshot just the navigation area
    const nav = page.locator('nav').first();
    await expect(nav).toHaveScreenshot('navigation.png', {
      animations: 'disabled',
    });
  });

  test.skip('newsletter form matches baseline', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Find and screenshot newsletter form
    const form = page.locator('form').first();
    await expect(form).toHaveScreenshot('newsletter-form.png', {
      animations: 'disabled',
    });
  });
});
