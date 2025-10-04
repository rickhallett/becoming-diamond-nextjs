/**
 * Feature Flag Configuration
 *
 * This file controls which features are enabled/disabled in the member portal.
 * Toggle these flags to enable or disable features across the application.
 *
 * Phase 1 (Current): Basic profile and dashboard
 * Phase 2 (Future): Courses, DiamondMindAI, Settings
 * Phase 3 (Future): XP system, Achievements, Advanced features
 */

export interface FeatureFlags {
  // Navigation & Route Features
  courses: boolean;
  diamondMindAI: boolean;
  settings: boolean;
  dashboard: boolean;
  support: boolean;

  // Profile Features
  achievements: boolean;
  xpPoints: boolean;
  coursesCompleted: boolean;

  // Dashboard Features
  courseStats: boolean;
  xpDisplay: boolean;

  // Book Sales Features
  readFreeSample: boolean;

  // Future Features
  communityForum: boolean;
  liveEvents: boolean;
  certifications: boolean;
}

/**
 * Current Feature Configuration
 *
 * Phase 1 (Active):
 * - Dashboard (basic stats)
 * - Profile (essential info only)
 * - Support
 * - Sprint tracking
 *
 * Phase 2+ (Disabled):
 * - Courses
 * - DiamondMindAI
 * - Settings
 * - XP/Achievements
 */
export const FEATURES: FeatureFlags = {
  // Navigation & Routes - Disabled for Phase 1
  courses: false,
  diamondMindAI: false,
  settings: false,
  dashboard: false,
  support: false,

  // Profile Features - Disabled for Phase 1
  achievements: false,
  xpPoints: false,
  coursesCompleted: false,

  // Dashboard Features - Disabled for Phase 1
  courseStats: false,
  xpDisplay: false,

  // Book Sales Features - Disabled for Phase 1
  readFreeSample: false,

  // Future Features - Disabled
  communityForum: false,
  liveEvents: false,
  certifications: false,
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

  if (!FEATURES.courses) routes.push('/app/courses');
  if (!FEATURES.diamondMindAI) routes.push('/app/chat');
  if (!FEATURES.settings) routes.push('/app/settings');
  if (!FEATURES.dashboard) routes.push('/app');
  if (!FEATURES.support) routes.push('/app/support');

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
} as const;
