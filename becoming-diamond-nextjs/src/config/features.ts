/**
 * Feature Flag Configuration - Simplified MVP Scope
 *
 * This file controls which features are enabled/disabled in the application.
 * Simplified to focus on core features: Sprint, Blog, Book, Lead Gen
 */

export interface FeatureFlags {
  // Core Features
  sprint: boolean;
  leadGen: boolean;
  bookSales: boolean;
  dashboard: boolean;

  // Sprint Features
  sprintWatchPlaylist: boolean;

  // Authentication Features
  githubAuth: boolean;
}

/**
 * Current Feature Configuration - Simplified MVP
 *
 * Active Features:
 * - Sprint (30-day sprint tracking)
 * - Lead Gen (email capture)
 * - Book Sales (Stripe checkout)
 * - Dashboard (basic stats)
 */
export const FEATURES: FeatureFlags = {
  // Core Features
  sprint: true,
  leadGen: true,
  bookSales: true,
  dashboard: true,

  // Sprint Features
  sprintWatchPlaylist: false,

  // Authentication Features
  githubAuth: false,
};

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  return FEATURES[feature];
}

/**
 * Get list of disabled routes for middleware/protection
 */
export function getDisabledRoutes(): string[] {
  const routes: string[] = [];

  if (!FEATURES.dashboard) routes.push('/app');
  if (!FEATURES.sprint) routes.push('/app/sprint');

  return routes;
}

/**
 * Get redirect path for disabled features
 * Users attempting to access disabled features will be redirected here
 */
export const FEATURE_REDIRECT_PATH = '/app/profile';

/**
 * Authentication Configuration
 */
export const AUTH_CONFIG = {
  /**
   * Redirect URI after successful authentication (login or signup)
   * Users will be directed here after completing authentication flow
   */
  successRedirectUri: '/app/profile',

  /**
   * GitHub OAuth feature flag
   */
  githubAuth: FEATURES.githubAuth,
} as const;
