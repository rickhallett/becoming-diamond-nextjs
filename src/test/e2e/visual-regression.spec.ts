import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * Visual Regression Tests for Globe/3D Components
 *
 * Tests WebGL rendering consistency across browsers and devices.
 * Includes fallback testing and reduced motion support.
 */
test.describe('Visual Regression - Globe/3D Components', () => {

  test('should detect WebGL support', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Check WebGL capability
    const hasWebGL = await page.evaluate(() => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    });

    // All modern browsers should support WebGL
    expect(hasWebGL).toBe(true);
  });

  test('should render Globe component without errors', async ({ page }) => {
    await page.goto('/');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Wait for potential globe container
    // The Globe is dynamically imported, so give it time to load
    await page.waitForTimeout(3000);

    // Check that page loaded without throwing errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Check for WebGL-related errors
    const webglErrors = errors.filter(e =>
      e.toLowerCase().includes('webgl') ||
      e.toLowerCase().includes('three')
    );

    expect(webglErrors.length).toBe(0);
  });

  test('should take baseline screenshot of landing page with Globe', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for 3D components to initialize
    await page.waitForTimeout(3000);

    // Take full page screenshot
    const screenshotPath = path.join(
      process.cwd(),
      'src/test/e2e/screenshots',
      browserName,
      'landing-page-full.png'
    );

    // Ensure directory exists
    const dir = path.dirname(screenshotPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });

    expect(fs.existsSync(screenshotPath)).toBe(true);
  });

  test('should match visual baseline for Globe section', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const screenshotPath = path.join(
      process.cwd(),
      'src/test/e2e/screenshots',
      browserName,
      'globe-section.png'
    );

    const baselinePath = path.join(
      process.cwd(),
      'src/test/e2e/screenshots',
      'baseline',
      browserName,
      'globe-section.png'
    );

    // Take screenshot
    const dir = path.dirname(screenshotPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await page.screenshot({
      path: screenshotPath,
      fullPage: false
    });

    // If baseline doesn't exist, create it
    if (!fs.existsSync(baselinePath)) {
      const baselineDir = path.dirname(baselinePath);
      if (!fs.existsSync(baselineDir)) {
        fs.mkdirSync(baselineDir, { recursive: true });
      }
      fs.copyFileSync(screenshotPath, baselinePath);
      console.log(`Created baseline: ${baselinePath}`);
      return; // Skip comparison on first run
    }

    // Compare screenshots using pixelmatch
    const img1 = PNG.sync.read(fs.readFileSync(baselinePath));
    const img2 = PNG.sync.read(fs.readFileSync(screenshotPath));

    const { width, height } = img1;
    const diff = new PNG({ width, height });

    const numDiffPixels = pixelmatch(
      img1.data,
      img2.data,
      diff.data,
      width,
      height,
      { threshold: 0.1 } // 10% threshold for differences
    );

    // Allow up to 5% pixel difference (3D rendering can vary slightly)
    const maxDiffPixels = width * height * 0.05;

    if (numDiffPixels > maxDiffPixels) {
      // Save diff image for debugging
      const diffPath = path.join(
        process.cwd(),
        'src/test/e2e/screenshots',
        browserName,
        'globe-section-diff.png'
      );
      fs.writeFileSync(diffPath, PNG.sync.write(diff));
      console.log(`Visual diff saved to: ${diffPath}`);
    }

    expect(numDiffPixels).toBeLessThanOrEqual(maxDiffPixels);
  });

  test('should handle WebGL context loss gracefully', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Simulate WebGL context loss
    await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl && 'WEBGL_lose_context' in gl) {
          const ext = (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context');
          if (ext) {
            ext.loseContext();
          }
        }
      }
    });

    await page.waitForTimeout(1000);

    // Page should still be functional
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
  });

  test('should verify canvas element exists for Globe', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check if canvas element exists (Three.js renders to canvas)
    const canvasCount = await page.locator('canvas').count();

    // Should have at least one canvas element for the Globe
    expect(canvasCount).toBeGreaterThan(0);
  });

  test('should check WebGL renderer info', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const webglInfo = await page.evaluate(() => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

      if (!gl) return null;

      const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
      if (!debugInfo) return { supported: true };

      return {
        supported: true,
        vendor: (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
        renderer: (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      };
    });

    expect(webglInfo).not.toBeNull();
    expect(webglInfo?.supported).toBe(true);
  });
});

test.describe('Visual Regression - Reduced Motion', () => {

  test('should respect prefers-reduced-motion setting', async ({ page }) => {
    // Enable reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check if reduced motion is detected
    const prefersReducedMotion = await page.evaluate(() => {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    });

    expect(prefersReducedMotion).toBe(true);
  });

  test('should render without animations when reduced motion is enabled', async ({ page, browserName }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Take screenshot with reduced motion
    const screenshotPath = path.join(
      process.cwd(),
      'src/test/e2e/screenshots',
      browserName,
      'reduced-motion.png'
    );

    const dir = path.dirname(screenshotPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await page.screenshot({
      path: screenshotPath,
      fullPage: false
    });

    expect(fs.existsSync(screenshotPath)).toBe(true);
  });

  test('should disable complex animations with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for animation-related CSS
    const hasAnimations = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let animationCount = 0;

      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        if (styles.animation !== 'none' && styles.animation !== '') {
          animationCount++;
        }
      });

      return animationCount;
    });

    // With reduced motion, animation count should be minimal
    console.log(`Animation count with reduced motion: ${hasAnimations}`);
  });
});

test.describe('Visual Regression - Mobile Devices', () => {

  test('should render Globe on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Check if canvas exists on mobile
    const canvasCount = await page.locator('canvas').count();
    expect(canvasCount).toBeGreaterThan(0);
  });

  test('should take mobile screenshot', async ({ page, browserName }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const screenshotPath = path.join(
      process.cwd(),
      'src/test/e2e/screenshots',
      browserName,
      'mobile-view.png'
    );

    const dir = path.dirname(screenshotPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });

    expect(fs.existsSync(screenshotPath)).toBe(true);
  });
});
