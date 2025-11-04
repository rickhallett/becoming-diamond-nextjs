import { test, expect } from '@playwright/test';

test.describe('decap cms oauth flow', () => {
  test('should load CMS admin page', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('domcontentloaded');

    // Verify admin page loads
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should display CMS interface', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Look for Decap CMS elements (may take time to load)
    // CMS typically injects content into body
    const bodyContent = await page.locator('body').textContent();

    // Should contain CMS-related content (login, collections, etc.)
    expect(bodyContent).toBeTruthy();
    expect(bodyContent!.length).toBeGreaterThan(0);
  });

  test.skip('should initiate GitHub OAuth flow on login', async ({ page, context }) => {
    // This test requires GitHub OAuth to be properly configured
    await page.goto('/admin');
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Look for GitHub login button
    const loginButton = page.getByRole('button', { name: /login.*github|github.*login|authenticate/i });

    if (await loginButton.isVisible()) {
      // Click login and expect popup
      const [popup] = await Promise.all([
        context.waitForEvent('page'),
        loginButton.click()
      ]);

      // Popup should navigate to OAuth URL
      await popup.waitForLoadState();

      // Verify it's an OAuth endpoint
      expect(popup.url()).toMatch(/\/api\/auth|github\.com\/login\/oauth/);

      await popup.close();
    }
  });

  test.skip('should handle OAuth callback', async ({ page }) => {
    // This test simulates returning from GitHub OAuth
    // Requires test OAuth credentials

    // Navigate directly to callback with test code
    await page.goto('/api/callback?code=test_auth_code&state=test_state');

    // Callback should return HTML with postMessage script
    const content = await page.content();

    // Should contain postMessage or script tags
    expect(content).toContain('postMessage');
  });

  test.skip('should complete OAuth and show CMS interface', async ({ page, context }) => {
    // Full OAuth flow test - requires real GitHub test OAuth app
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    const loginButton = page.getByRole('button', { name: /login.*github/i });

    if (await loginButton.isVisible()) {
      const [popup] = await Promise.all([
        context.waitForEvent('page'),
        loginButton.click()
      ]);

      // In test environment, mock the OAuth flow
      // In production, this would require actual GitHub authorization

      // Simulate successful callback
      await popup.goto('/api/callback?code=mock_code&state=mock_state');

      // Wait for parent window to receive auth message
      await page.waitForTimeout(2000);

      // CMS should now show authenticated interface
      const newEntryButton = page.getByRole('button', { name: /new|create/i });
      await expect(newEntryButton).toBeVisible({ timeout: 10000 });
    }
  });
});

test.describe('cms content management', () => {
  test.skip('authenticated user can create new content', async ({ page }) => {
    // Requires authenticated session
    // Load auth state if available
    await page.goto('/admin');

    // Navigate to collections
    await page.getByText(/news|blog|collections/i).first().click();

    // Click new entry
    await page.getByRole('button', { name: /new|create/i }).click();

    // Fill in content fields
    await page.getByLabel(/title/i).fill('Test Article');

    // Save draft
    await page.getByRole('button', { name: /save|publish/i }).click();

    // Verify success
    await expect(page.getByText(/saved|published|success/i)).toBeVisible({ timeout: 5000 });
  });

  test.skip('authenticated user can edit existing content', async ({ page }) => {
    // Requires authenticated session and existing content
    await page.goto('/admin');

    // Navigate to collections
    await page.getByText(/news|blog/i).first().click();

    // Click on first entry
    await page.locator('.cms-card, .entry-card').first().click();

    // Edit title
    const titleField = page.getByLabel(/title/i);
    await titleField.fill('Updated Title');

    // Save changes
    await page.getByRole('button', { name: /save|publish/i }).click();

    await expect(page.getByText(/saved|updated/i)).toBeVisible({ timeout: 5000 });
  });
});
