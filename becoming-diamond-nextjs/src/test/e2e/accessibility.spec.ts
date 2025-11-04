import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('accessibility', () => {
  test('landing page should have no critical a11y violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a'])
      .analyze();

    // Report all violations but only fail on critical/serious
    const criticalViolations = accessibilityScanResults.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );

    // Log all violations for awareness
    if (accessibilityScanResults.violations.length > 0) {
      console.log(`Found ${accessibilityScanResults.violations.length} total a11y issues`);
      console.log(`Critical/Serious: ${criticalViolations.length}`);
    }

    expect(criticalViolations).toEqual([]);
  });

  test('member portal should be accessible', async ({ page }) => {
    await page.goto('/app');
    await page.waitForLoadState('domcontentloaded');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a'])
      // Exclude document-title for now (known issue)
      .disableRules(['document-title'])
      .analyze();

    const criticalViolations = accessibilityScanResults.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );

    // Log violations for tracking
    if (accessibilityScanResults.violations.length > 0) {
      console.log(`Found ${accessibilityScanResults.violations.length} a11y issues on member portal`);
    }

    expect(criticalViolations).toEqual([]);
  });
});
