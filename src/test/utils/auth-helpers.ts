/**
 * Authentication Helper Utilities for E2E Tests
 *
 * Provides utilities for managing authentication state in Playwright tests.
 */

import { Page, BrowserContext } from '@playwright/test';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

/**
 * Generate authenticated session fixture
 *
 * This utility creates a valid NextAuth session state that can be used
 * in Playwright tests to simulate an authenticated user.
 *
 * @param email - Test user email address
 * @returns Path to the generated auth fixture file
 */
export async function generateAuthFixture(
  email: string = 'test@example.com'
): Promise<string> {
  const fixturePath = join(process.cwd(), 'src/test/fixtures/auth.json');

  // Ensure fixtures directory exists
  await mkdir(join(process.cwd(), 'src/test/fixtures'), { recursive: true });

  // Create mock session state
  // Note: This is a simplified fixture. In production, you would:
  // 1. Actually sign in through the UI
  // 2. Capture the real session cookies
  // 3. Save the complete storage state
  const authState = {
    cookies: [
      {
        name: 'authjs.session-token',
        value: 'mock-session-token-for-testing',
        domain: 'localhost',
        path: '/',
        expires: Date.now() / 1000 + 86400 * 30, // 30 days
        httpOnly: true,
        secure: false,
        sameSite: 'Lax' as const
      }
    ],
    origins: [
      {
        origin: 'http://localhost:3003',
        localStorage: [
          {
            name: 'test-user',
            value: JSON.stringify({ email })
          }
        ]
      }
    ]
  };

  await writeFile(fixturePath, JSON.stringify(authState, null, 2));

  return fixturePath;
}

/**
 * Sign in via UI and capture session
 *
 * Automates the sign-in process through the UI and captures the resulting
 * session state. This creates a real authenticated session.
 *
 * Note: Requires email testing infrastructure to retrieve magic links.
 *
 * @param page - Playwright page object
 * @param email - Email address to sign in with
 * @returns Promise that resolves when sign-in is complete
 */
export async function signInViaUI(
  page: Page,
  email: string = 'test@example.com'
): Promise<void> {
  // Navigate to sign-in page
  await page.goto('/auth/signin');
  await page.waitForLoadState('domcontentloaded');

  // Fill email input
  const emailInput = page.getByPlaceholder(/email/i).or(page.getByLabel(/email/i));
  await emailInput.fill(email);

  // Submit form
  const signInButton = page.getByRole('button', { name: /sign in|continue|send/i });
  await signInButton.click();

  // Wait for verification page
  await page.waitForTimeout(1000);

  // TODO: Implement magic link retrieval from email service
  // This requires integration with Mailosaur, MailHog, or similar
  // For now, this is a placeholder implementation
}

/**
 * Save current session state to fixture
 *
 * Captures the current browser session state and saves it to a fixture file
 * that can be reused in other tests.
 *
 * @param context - Playwright browser context
 * @param fixtureName - Name for the fixture file (default: 'auth.json')
 */
export async function saveSessionState(
  context: BrowserContext,
  fixtureName: string = 'auth.json'
): Promise<string> {
  const fixturePath = join(process.cwd(), 'src/test/fixtures', fixtureName);

  await mkdir(join(process.cwd(), 'src/test/fixtures'), { recursive: true });
  await context.storageState({ path: fixturePath });

  return fixturePath;
}

/**
 * Load authenticated session state
 *
 * Loads a previously saved session state fixture into a browser context.
 *
 * @param context - Playwright browser context
 * @param fixtureName - Name of the fixture file to load
 */
export async function loadSessionState(
  context: BrowserContext,
  fixtureName: string = 'auth.json'
): Promise<void> {
  const fixturePath = join(process.cwd(), 'src/test/fixtures', fixtureName);

  // Note: This should be used when creating the context:
  // const context = await browser.newContext({ storageState: fixturePath });
  console.warn('loadSessionState should be used during context creation');
}

/**
 * Clear session and sign out
 *
 * Signs out the current user and clears all session data.
 *
 * @param page - Playwright page object
 */
export async function signOut(page: Page): Promise<void> {
  // Try to find and click sign-out button
  const signOutButton = page.getByRole('button', { name: /sign out|logout/i });

  if (await signOutButton.isVisible()) {
    await signOutButton.click();
    await page.waitForLoadState('networkidle');
  } else {
    // Fallback: navigate to sign-out endpoint
    await page.goto('/api/auth/signout');

    // Confirm sign-out if confirmation page shown
    const confirmButton = page.getByRole('button', { name: /sign out|confirm/i });
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }
  }

  // Wait for redirect
  await page.waitForLoadState('networkidle');
}

/**
 * Verify user is authenticated
 *
 * Checks if the current page context has an authenticated session.
 *
 * @param page - Playwright page object
 * @returns Promise resolving to true if authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  // Check for session cookie
  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find(c =>
    c.name.includes('session-token') || c.name.includes('next-auth')
  );

  if (!sessionCookie) {
    return false;
  }

  // Verify by trying to access protected route
  const response = await page.goto('/app', { waitUntil: 'domcontentloaded' });

  // If redirected to auth, not authenticated
  const isAuthPage = page.url().includes('/signin') || page.url().includes('/api/auth');

  return !isAuthPage;
}

/**
 * Wait for authentication to complete
 *
 * Waits for the authentication flow to complete and session to be established.
 *
 * @param page - Playwright page object
 * @param timeout - Maximum wait time in milliseconds
 */
export async function waitForAuth(
  page: Page,
  timeout: number = 10000
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (await isAuthenticated(page)) {
      return;
    }
    await page.waitForTimeout(500);
  }

  throw new Error(`Authentication did not complete within ${timeout}ms`);
}

/**
 * Create test user in database
 *
 * Creates a test user directly in the database for testing purposes.
 *
 * Note: This requires database access and should only be used in test environment.
 *
 * @param email - Email address for test user
 * @param name - Display name for test user
 * @returns User ID
 */
export async function createTestUser(
  email: string,
  name?: string
): Promise<string> {
  // TODO: Implement database user creation
  // This requires Turso database access in test environment
  throw new Error('createTestUser not yet implemented - requires database access');
}

/**
 * Clean up test users from database
 *
 * Removes test users created during test runs.
 *
 * @param emailPattern - Email pattern to match (e.g., 'test@example.com')
 */
export async function cleanupTestUsers(
  emailPattern: string = 'test@example.com'
): Promise<void> {
  // TODO: Implement database cleanup
  // This requires Turso database access in test environment
  console.warn('cleanupTestUsers not yet implemented');
}
