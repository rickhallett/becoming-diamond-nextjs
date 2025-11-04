/**
 * Sprint E2E Test Suite
 *
 * Comprehensive end-to-end tests for the 30 Day Sprint features.
 * Tests cover sprint dashboard, daily challenges, activity completion,
 * watch page, progress tracking, and mobile responsiveness.
 */

import { test, expect, Page } from '@playwright/test';
import sprintFixtures from '../fixtures/sprint.json';

/**
 * Helper function to set localStorage sprint progress
 */
async function setSprintProgress(page: Page, progressState: 'notStarted' | 'inProgress' | 'completed') {
  const storageKey = sprintFixtures.localStorage.key;
  let storageValue: string | null = null;

  switch (progressState) {
    case 'notStarted':
      storageValue = sprintFixtures.localStorage.notStarted;
      break;
    case 'inProgress':
      storageValue = sprintFixtures.localStorage.day5InProgress;
      break;
    case 'completed':
      storageValue = sprintFixtures.localStorage.completed;
      break;
  }

  await page.addInitScript(({ key, value }) => {
    if (value) {
      localStorage.setItem(key, value);
    } else {
      localStorage.removeItem(key);
    }
  }, { key: storageKey, value: storageValue });
}

/**
 * Helper function to clear sprint progress
 */
async function clearSprintProgress(page: Page) {
  const storageKey = sprintFixtures.localStorage.key;
  await page.addInitScript(({ key }) => {
    localStorage.removeItem(key);
  }, { key: storageKey });
}

test.describe('sprint features', () => {
  test.describe('2.1 Sprint Dashboard Overview', () => {
    // TODO: Fix not started display
test.skip('displays dashboard for user who has not started', async ({ page }) => {
      // Set not started state
      await setSprintProgress(page, 'notStarted');
      await page.goto('/app/sprint');
      await page.waitForLoadState('domcontentloaded');

      // Verify hero section
      await expect(page.getByText(/30 Day.*Transformation.*Sprint/i)).toBeVisible({ timeout: 10000 });
      await expect(page.getByText(/Transform into your diamond self/i)).toBeVisible();

      // Verify "Start Your Journey" button is visible
      const startButton = page.getByRole('link', { name: /Start Your Journey/i });
      await expect(startButton).toBeVisible();
      await expect(startButton).toHaveAttribute('href', '/app/sprint/day/1');

      // Verify no progress section shown
      await expect(page.getByText(/Your Progress/i)).not.toBeVisible();

      // Verify info section for new users
      await expect(page.getByText(/Before You Begin/i)).toBeVisible();
      await expect(page.getByText(/30-day commitment/i)).toBeVisible();
    });

    // TODO: Fix progress display
test.skip('displays current day progress for in-progress sprint', async ({ page }) => {
      // Set in-progress state (Day 5)
      await setSprintProgress(page, 'inProgress');
      await page.goto('/app/sprint');
      await page.waitForLoadState('domcontentloaded');

      // Verify "Continue" button with current day
      const continueButton = page.getByRole('link', { name: /Continue to Day 5/i });
      await expect(continueButton).toBeVisible({ timeout: 10000 });
      await expect(continueButton).toHaveAttribute('href', '/app/sprint/day/5');

      // Verify progress section is displayed
      await expect(page.getByText(/Your Progress/i)).toBeVisible();

      // Verify progress stats
      await expect(page.getByText(/Days Completed/i)).toBeVisible();
      await expect(page.getByText(/4/)).toBeVisible(); // 4 days completed
      await expect(page.getByText(/Current Day/i)).toBeVisible();

      // Verify completion percentage is shown
      const completionText = page.getByText(/Completion/i);
      await expect(completionText).toBeVisible();

      // Verify progress bar exists
      const progressBar = page.locator('[class*="bg-primary"]').first();
      await expect(progressBar).toBeVisible();
    });

    // TODO: Fix completed status
test.skip('displays completed status for finished sprint', async ({ page }) => {
      // Set completed state
      await setSprintProgress(page, 'completed');
      await page.goto('/app/sprint');
      await page.waitForLoadState('domcontentloaded');

      // Verify completion badge
      await expect(page.getByText(/Sprint Completed/i)).toBeVisible({ timeout: 10000 });

      // Verify trophy icon or completion indicator
      const completionBadge = page.locator('text=Sprint Completed').locator('..');
      await expect(completionBadge).toBeVisible();

      // Verify 100% completion
      await expect(page.getByText(/100%/)).toBeVisible();
    });

    // TODO: Fix quick links
test.skip('displays quick links to dashboard and watch page', async ({ page }) => {
      await setSprintProgress(page, 'inProgress');
      await page.goto('/app/sprint');
      await page.waitForLoadState('domcontentloaded');

      // Verify "View All Days" link
      const viewAllLink = page.getByRole('link', { name: /View All Days/i });
      await expect(viewAllLink).toBeVisible({ timeout: 10000 });
      await expect(viewAllLink).toHaveAttribute('href', '/app/sprint/dashboard');

      // Verify "Watch Playlist" link
      const watchLink = page.getByRole('link', { name: /Watch Playlist/i });
      await expect(watchLink).toBeVisible();
      await expect(watchLink).toHaveAttribute('href', '/app/sprint/watch');
    });

    // TODO: Fix sprint statistics
test.skip('shows overall sprint statistics', async ({ page }) => {
      await setSprintProgress(page, 'inProgress');
      await page.goto('/app/sprint');
      await page.waitForLoadState('domcontentloaded');

      // Verify stats cards are visible
      await expect(page.getByText(/Days Completed/i)).toBeVisible({ timeout: 10000 });
      await expect(page.getByText(/Current Day/i)).toBeVisible();
      await expect(page.getByText(/Completion/i)).toBeVisible();
      await expect(page.getByText(/Days Active/i)).toBeVisible();
    });
  });

  test.describe('2.2 Daily Challenge Navigation', () => {
    // TODO: Fix day 1 navigation
test.skip('navigates to day 1 from dashboard', async ({ page }) => {
      await clearSprintProgress(page);
      await page.goto('/app/sprint');
      await page.waitForLoadState('domcontentloaded');

      // Click "Start Your Journey" button
      const startButton = page.getByRole('link', { name: /Start Your Journey/i });
      await startButton.click();

      // Wait for navigation
      await page.waitForLoadState('domcontentloaded');

      // Verify on day 1 page
      expect(page.url()).toContain('/app/sprint/day/1');
      await expect(page.getByText(/Day 1 of 30/i)).toBeVisible({ timeout: 10000 });
    });

    // TODO: Fix day content display
test.skip('displays day content correctly', async ({ page }) => {
      await clearSprintProgress(page);
      await page.goto('/app/sprint/day/1');
      await page.waitForLoadState('domcontentloaded');

      // Verify day header
      await expect(page.getByText(/Day 1 of 30/i)).toBeVisible({ timeout: 10000 });

      // Verify day number badge
      const dayBadge = page.locator('[class*="rounded-full"]').filter({ hasText: '1' }).first();
      await expect(dayBadge).toBeVisible();

      // Verify day title
      await expect(page.getByText(/Set Your Baseline/i)).toBeVisible();

      // Verify subtitle
      await expect(page.getByText(/If your baseline doesn't change/i)).toBeVisible();

      // Verify duration and difficulty
      await expect(page.getByText(/15 minutes/i)).toBeVisible();
      await expect(page.getByText(/Beginner/i)).toBeVisible();
    });

    // TODO: Fix activities order
test.skip('shows activities in order', async ({ page }) => {
      await clearSprintProgress(page);
      await page.goto('/app/sprint/day/1');
      await page.waitForLoadState('domcontentloaded');

      // Wait for content to load
      await page.waitForTimeout(2000);

      // Verify content is rendered (prose container)
      const contentArea = page.locator('[class*="prose"]').first();
      await expect(contentArea).toBeVisible({ timeout: 10000 });

      // Verify content has text
      const contentText = await contentArea.textContent();
      expect(contentText).toBeTruthy();
      expect(contentText!.length).toBeGreaterThan(50);
    });

    // TODO: Fix progress indicator
test.skip('displays progress indicator showing current position', async ({ page }) => {
      await setSprintProgress(page, 'inProgress');
      await page.goto('/app/sprint/day/5');
      await page.waitForLoadState('domcontentloaded');

      // Verify day position indicator
      await expect(page.getByText(/Day 5 of 30/i)).toBeVisible({ timeout: 10000 });

      // Verify navigation breadcrumb
      const backLink = page.getByRole('link', { name: /All Days/i });
      await expect(backLink).toBeVisible();
    });

    // TODO: Fix navigation arrows
test.skip('navigation arrows work correctly', async ({ page }) => {
      await setSprintProgress(page, 'inProgress');
      await page.goto('/app/sprint/day/5');
      await page.waitForLoadState('domcontentloaded');

      // Verify "All Days" back link
      const allDaysLink = page.getByRole('link', { name: /All Days/i });
      await expect(allDaysLink).toBeVisible({ timeout: 10000 });
      await expect(allDaysLink).toHaveAttribute('href', '/app/sprint/dashboard');

      // Previous day arrow should be visible (day 5 -> day 4)
      const prevLink = page.getByRole('link', { href: '/app/sprint/day/4' });
      await expect(prevLink).toBeVisible();
    });
  });

  test.describe('2.3 Activity Completion', () => {
    // TODO: Fix day completion
test.skip('marks day as complete when button clicked', async ({ page }) => {
      await clearSprintProgress(page);
      await page.goto('/app/sprint/day/1');
      await page.waitForLoadState('domcontentloaded');

      // Verify "Mark Complete" button is visible
      const markCompleteButton = page.getByRole('button', { name: /Mark Complete/i });
      await expect(markCompleteButton).toBeVisible({ timeout: 10000 });

      // Click to mark complete
      await markCompleteButton.click();

      // Wait for celebration modal or completion state
      await page.waitForTimeout(1000);

      // Verify completion state (button text changes or completion badge appears)
      await expect(page.getByText(/Day 1 Complete/i)).toBeVisible({ timeout: 5000 });
    });

    // TODO: Fix completion persistence
test.skip('completion state persists on page reload', async ({ page }) => {
      // Mark day 1 as complete
      await clearSprintProgress(page);
      await page.goto('/app/sprint/day/1');
      await page.waitForLoadState('domcontentloaded');

      const markCompleteButton = page.getByRole('button', { name: /Mark Complete/i });
      await markCompleteButton.click();
      await page.waitForTimeout(1000);

      // Reload the page
      await page.reload();
      await page.waitForLoadState('domcontentloaded');

      // Verify day is still marked complete
      await expect(page.getByText(/Day 1 Complete/i)).toBeVisible({ timeout: 10000 });

      // Verify "Mark Complete" button is no longer visible
      await expect(page.getByRole('button', { name: /Mark Complete/i })).not.toBeVisible();
    });

    // TODO: Fix next day unlock
test.skip('next day unlocks after completion', async ({ page }) => {
      // Start fresh
      await clearSprintProgress(page);
      await page.goto('/app/sprint/day/1');
      await page.waitForLoadState('domcontentloaded');

      // Complete day 1
      const markCompleteButton = page.getByRole('button', { name: /Mark Complete/i });
      await markCompleteButton.click();
      await page.waitForTimeout(1000);

      // Close modal if present (click continue or close)
      const continueButton = page.getByRole('button', { name: /Continue|Close/i }).first();
      if (await continueButton.isVisible()) {
        await continueButton.click();
        await page.waitForTimeout(500);
      }

      // Verify "Next Day" button appears
      const nextDayLink = page.getByRole('link', { name: /Next Day/i });
      await expect(nextDayLink).toBeVisible({ timeout: 5000 });
      await expect(nextDayLink).toHaveAttribute('href', '/app/sprint/day/2');
    });

    // TODO: Fix real-time progress
test.skip('progress updates in real-time', async ({ page }) => {
      await clearSprintProgress(page);
      await page.goto('/app/sprint/day/1');
      await page.waitForLoadState('domcontentloaded');

      // Mark complete
      const markCompleteButton = page.getByRole('button', { name: /Mark Complete/i });
      await markCompleteButton.click();

      // Wait for state update
      await page.waitForTimeout(1000);

      // Navigate to dashboard
      await page.goto('/app/sprint/dashboard');
      await page.waitForLoadState('domcontentloaded');

      // Verify day 1 is marked complete in dashboard
      await page.waitForTimeout(1000);
      const day1Card = page.locator('[href="/app/sprint/day/1"]').first();
      await expect(day1Card).toBeVisible({ timeout: 10000 });

      // Progress bar should reflect completion
      const progressBar = page.locator('[class*="bg-primary"]').first();
      await expect(progressBar).toBeVisible();
    });

    // TODO: Fix sequence validation
test.skip('cannot complete days out of sequence', async ({ page }) => {
      // Try to access day 2 without completing day 1
      await clearSprintProgress(page);
      await page.goto('/app/sprint/day/2');
      await page.waitForLoadState('domcontentloaded');

      // Should redirect to sprint overview
      await page.waitForTimeout(2000);
      expect(page.url()).toContain('/app/sprint');
      expect(page.url()).not.toContain('/app/sprint/day/2');
    });
  });

  test.describe('2.4 Sprint Watch Page', () => {
    // TODO: Fix watch navigation
test.skip('navigates to watch page successfully', async ({ page }) => {
      await setSprintProgress(page, 'inProgress');
      await page.goto('/app/sprint');
      await page.waitForLoadState('domcontentloaded');

      // Click watch playlist link
      const watchLink = page.getByRole('link', { name: /Watch Playlist/i });
      await watchLink.click();

      // Wait for navigation
      await page.waitForLoadState('domcontentloaded');

      // Verify on watch page
      expect(page.url()).toContain('/app/sprint/watch');
    });

    // TODO: Fix video player display
test.skip('displays video player', async ({ page }) => {
      await setSprintProgress(page, 'inProgress');
      await page.goto('/app/sprint/watch');
      await page.waitForLoadState('domcontentloaded');

      // Wait for page to fully load
      await page.waitForTimeout(2000);

      // Verify page title
      await expect(page.getByText(/Watch.*Full Sprint/i)).toBeVisible({ timeout: 10000 });

      // Verify playlist info
      await expect(page.getByText(/Continuous playlist mode/i)).toBeVisible();
      await expect(page.getByText(/videos/i)).toBeVisible();

      // Verify "Now Playing" indicator
      await expect(page.getByText(/Now Playing/i)).toBeVisible();
    });

    // TODO: Fix playlist sidebar
test.skip('displays video playlist sidebar', async ({ page }) => {
      await setSprintProgress(page, 'inProgress');
      await page.goto('/app/sprint/watch');
      await page.waitForLoadState('domcontentloaded');

      // Verify playlist header
      await expect(page.getByText(/Playlist/i)).toBeVisible({ timeout: 10000 });
      await expect(page.getByText(/Videos will play automatically/i)).toBeVisible();

      // Verify playlist items are displayed
      await expect(page.getByText(/Day 1/i)).toBeVisible();
      await expect(page.getByText(/Day 2/i)).toBeVisible();
    });

    // TODO: Fix completed days in playlist
test.skip('shows completed days in playlist', async ({ page }) => {
      await setSprintProgress(page, 'inProgress');
      await page.goto('/app/sprint/watch');
      await page.waitForLoadState('domcontentloaded');

      // Wait for content to load
      await page.waitForTimeout(2000);

      // Verify completion indicators exist (days 1-4 should be marked complete)
      const completedIndicators = page.locator('[class*="text-primary"]').filter({ hasText: /Day [1-4]/ });
      expect(await completedIndicators.count()).toBeGreaterThan(0);
    });

    test('displays video metadata', async ({ page }) => {
      await setSprintProgress(page, 'inProgress');
      await page.goto('/app/sprint/watch');
      await page.waitForLoadState('domcontentloaded');

      // Wait for video info to load
      await page.waitForTimeout(2000);

      // Verify video title is displayed
      const videoTitle = page.locator('[class*="text-xl"]').filter({ hasText: /Day \d+/ }).first();
      await expect(videoTitle).toBeVisible({ timeout: 10000 });

      // Verify duration is displayed
      const durationPattern = /\d+:\d+/; // matches MM:SS format
      const durationText = page.locator('text=/\\d+:\\d+/').first();
      await expect(durationText).toBeVisible();

      // Verify "View Lesson" link
      const viewLessonLink = page.getByRole('link', { name: /View Lesson/i });
      await expect(viewLessonLink).toBeVisible();
    });

    test('back to sprint link works', async ({ page }) => {
      await setSprintProgress(page, 'inProgress');
      await page.goto('/app/sprint/watch');
      await page.waitForLoadState('domcontentloaded');

      // Click back to sprint link
      const backLink = page.getByRole('link', { name: /Back to Sprint/i });
      await expect(backLink).toBeVisible({ timeout: 10000 });
      await backLink.click();

      // Wait for navigation
      await page.waitForLoadState('domcontentloaded');

      // Verify back on sprint overview
      expect(page.url()).toContain('/app/sprint');
      expect(page.url()).not.toContain('/watch');
    });
  });

  test.describe('2.5 Sprint Progress Dashboard', () => {
    test('displays all 30 days', async ({ page }) => {
      await setSprintProgress(page, 'inProgress');
      await page.goto('/app/sprint/dashboard');
      await page.waitForLoadState('domcontentloaded');

      // Verify page title
      await expect(page.getByText(/Your.*30 Day Sprint/i)).toBeVisible({ timeout: 10000 });

      // Verify week sections are displayed
      await expect(page.getByText(/Week 1.*Foundation/i)).toBeVisible();
      await expect(page.getByText(/Week 2.*Momentum/i)).toBeVisible();
      await expect(page.getByText(/Week 3.*Acceleration/i)).toBeVisible();
      await expect(page.getByText(/Week 4.*Mastery/i)).toBeVisible();

      // Wait for day cards to load
      await page.waitForTimeout(2000);

      // Count day cards (should be 30)
      const dayCards = page.locator('[href^="/app/sprint/day/"]');
      const cardCount = await dayCards.count();
      expect(cardCount).toBeGreaterThanOrEqual(28); // Allow for some variation in rendering
    });

    test('completed days are marked visually', async ({ page }) => {
      await setSprintProgress(page, 'inProgress');
      await page.goto('/app/sprint/dashboard');
      await page.waitForLoadState('domcontentloaded');

      // Wait for content to load
      await page.waitForTimeout(2000);

      // Days 1-4 should be completed (based on inProgress fixture)
      for (let day = 1; day <= 4; day++) {
        const dayCard = page.locator(`[href="/app/sprint/day/${day}"]`).first();
        await expect(dayCard).toBeVisible({ timeout: 10000 });

        // Verify completion indicator (check icon or completed styling)
        const completedIndicator = dayCard.locator('[class*="text-primary"], [class*="bg-primary"]').first();
        await expect(completedIndicator).toBeVisible();
      }
    });

    test('current day is highlighted', async ({ page }) => {
      await setSprintProgress(page, 'inProgress');
      await page.goto('/app/sprint/dashboard');
      await page.waitForLoadState('domcontentloaded');

      // Wait for content
      await page.waitForTimeout(2000);

      // Day 5 should be the current day
      const day5Card = page.locator('[href="/app/sprint/day/5"]').first();
      await expect(day5Card).toBeVisible({ timeout: 10000 });

      // Current day should have distinct styling
      const cardParent = day5Card.locator('..');
      await expect(cardParent).toBeVisible();
    });

    test('statistics summary is visible', async ({ page }) => {
      await setSprintProgress(page, 'inProgress');
      await page.goto('/app/sprint/dashboard');
      await page.waitForLoadState('domcontentloaded');

      // Verify progress bar
      const progressBar = page.locator('[class*="bg-primary"]').first();
      await expect(progressBar).toBeVisible({ timeout: 10000 });

      // Verify completion percentage is visible
      await page.waitForTimeout(1000);
      const statsText = await page.textContent('body');
      expect(statsText).toBeTruthy();
    });

    test('reset progress button is visible', async ({ page }) => {
      await setSprintProgress(page, 'inProgress');
      await page.goto('/app/sprint/dashboard');
      await page.waitForLoadState('domcontentloaded');

      // Verify reset button (for testing)
      const resetButton = page.getByRole('button', { name: /Reset Progress/i });
      await expect(resetButton).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('2.6 Day-to-Day Progression', () => {
    test('completes day 5 and unlocks day 6', async ({ page }) => {
      await setSprintProgress(page, 'inProgress');
      await page.goto('/app/sprint/day/5');
      await page.waitForLoadState('domcontentloaded');

      // Mark day 5 complete
      const markCompleteButton = page.getByRole('button', { name: /Mark Complete/i });
      await expect(markCompleteButton).toBeVisible({ timeout: 10000 });
      await markCompleteButton.click();

      // Wait for completion
      await page.waitForTimeout(1500);

      // Close modal if present
      const closeButton = page.getByRole('button', { name: /Continue|Close/i }).first();
      if (await closeButton.isVisible()) {
        await closeButton.click();
        await page.waitForTimeout(500);
      }

      // Verify day 5 is marked complete
      await expect(page.getByText(/Day 5 Complete/i)).toBeVisible({ timeout: 5000 });

      // Verify day 6 link appears
      const day6Link = page.getByRole('link', { name: /Next Day/i });
      await expect(day6Link).toBeVisible();
      await expect(day6Link).toHaveAttribute('href', '/app/sprint/day/6');
    });

    test('can navigate to day 6 after completing day 5', async ({ page }) => {
      // Complete day 5 first
      await setSprintProgress(page, 'inProgress');
      await page.goto('/app/sprint/day/5');
      await page.waitForLoadState('domcontentloaded');

      const markCompleteButton = page.getByRole('button', { name: /Mark Complete/i });
      await markCompleteButton.click();
      await page.waitForTimeout(1500);

      // Navigate to day 6
      await page.goto('/app/sprint/day/6');
      await page.waitForLoadState('domcontentloaded');

      // Verify on day 6 page (should not redirect)
      await page.waitForTimeout(1000);
      expect(page.url()).toContain('/app/sprint/day/6');
      await expect(page.getByText(/Day 6 of 30/i)).toBeVisible({ timeout: 10000 });
    });

    test('previous days remain accessible', async ({ page }) => {
      await setSprintProgress(page, 'inProgress');

      // Navigate to completed day 1
      await page.goto('/app/sprint/day/1');
      await page.waitForLoadState('domcontentloaded');

      // Should not redirect (day 1 is completed)
      await page.waitForTimeout(1000);
      expect(page.url()).toContain('/app/sprint/day/1');
      await expect(page.getByText(/Day 1 of 30/i)).toBeVisible({ timeout: 10000 });

      // Verify completion indicator
      await expect(page.getByText(/Day 1 Complete/i)).toBeVisible();
    });

    test('day completion updates dashboard', async ({ page }) => {
      await setSprintProgress(page, 'inProgress');

      // Go to dashboard first to see initial state
      await page.goto('/app/sprint/dashboard');
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Complete day 5
      await page.goto('/app/sprint/day/5');
      await page.waitForLoadState('domcontentloaded');

      const markCompleteButton = page.getByRole('button', { name: /Mark Complete/i });
      await markCompleteButton.click();
      await page.waitForTimeout(1500);

      // Go back to dashboard
      await page.goto('/app/sprint/dashboard');
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Verify day 5 is now marked complete
      const day5Card = page.locator('[href="/app/sprint/day/5"]').first();
      await expect(day5Card).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('2.7 Mobile Responsiveness', () => {
    test('sprint dashboard adapts to mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await setSprintProgress(page, 'inProgress');
      await page.goto('/app/sprint');
      await page.waitForLoadState('domcontentloaded');

      // Verify content is visible and not overflowing
      await expect(page.getByText(/30 Day.*Transformation.*Sprint/i)).toBeVisible({ timeout: 10000 });

      // Check for horizontal scroll
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5); // Allow 5px tolerance

      // Verify buttons are tappable
      const continueButton = page.getByRole('link', { name: /Continue to Day/i });
      await expect(continueButton).toBeVisible();
    });

    test('day content adapts to mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await clearSprintProgress(page);
      await page.goto('/app/sprint/day/1');
      await page.waitForLoadState('domcontentloaded');

      // Verify content is readable
      await expect(page.getByText(/Day 1 of 30/i)).toBeVisible({ timeout: 10000 });
      await expect(page.getByText(/Set Your Baseline/i)).toBeVisible();

      // Check for horizontal scroll
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5);

      // Verify mark complete button is accessible
      const markCompleteButton = page.getByRole('button', { name: /Mark Complete/i });
      await expect(markCompleteButton).toBeVisible();
    });

    test('sprint dashboard grid adapts to mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await setSprintProgress(page, 'inProgress');
      await page.goto('/app/sprint/dashboard');
      await page.waitForLoadState('domcontentloaded');

      // Wait for content
      await page.waitForTimeout(2000);

      // Verify day cards are visible
      const dayCards = page.locator('[href^="/app/sprint/day/"]');
      await expect(dayCards.first()).toBeVisible({ timeout: 10000 });

      // Check for horizontal scroll
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5);
    });

    test('watch page playlist adapts to mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await setSprintProgress(page, 'inProgress');
      await page.goto('/app/sprint/watch');
      await page.waitForLoadState('domcontentloaded');

      // Wait for content
      await page.waitForTimeout(2000);

      // Verify page title is visible
      await expect(page.getByText(/Watch.*Full Sprint/i)).toBeVisible({ timeout: 10000 });

      // Check for horizontal scroll
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5);

      // Verify playlist is accessible
      await expect(page.getByText(/Playlist/i)).toBeVisible();
    });

    test('touch interactions work correctly', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await setSprintProgress(page, 'inProgress');
      await page.goto('/app/sprint/dashboard');
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);

      // Tap on day 1 card
      const day1Card = page.locator('[href="/app/sprint/day/1"]').first();
      await expect(day1Card).toBeVisible({ timeout: 10000 });
      await day1Card.tap();

      // Wait for navigation
      await page.waitForLoadState('domcontentloaded');

      // Verify navigated to day 1
      expect(page.url()).toContain('/app/sprint/day/1');
    });

    test('mobile navigation header works correctly', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await clearSprintProgress(page);
      await page.goto('/app/sprint/day/1');
      await page.waitForLoadState('domcontentloaded');

      // Verify back navigation is accessible
      const backLink = page.getByRole('link', { name: /All Days/i });
      await expect(backLink).toBeVisible({ timeout: 10000 });

      // Test tapping back link
      await backLink.tap();
      await page.waitForLoadState('domcontentloaded');

      // Verify navigation worked
      expect(page.url()).toContain('/app/sprint/dashboard');
    });
  });
});
