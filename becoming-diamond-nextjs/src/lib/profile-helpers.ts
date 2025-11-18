/**
 * Profile Data Transformation Helpers
 *
 * Centralized logic for transforming raw database records into UserProfile objects.
 * This eliminates code duplication between GET and PUT handlers.
 */

import { UserProfile } from "@/contexts/UserContext";

/**
 * Raw database user record from users table
 * Using index signature to allow any database row
 */
export type DatabaseUser = {
  id?: unknown;
  name?: unknown;
  email?: unknown;
  image?: unknown;
  created_at?: unknown;
  [key: string]: unknown;
}

/**
 * Raw database profile record from user_profiles table
 */
export interface DatabaseProfile {
  bio?: unknown;
  location?: unknown;
  website?: unknown;
  current_pr?: unknown;
  completed_prs?: unknown;
  level?: unknown;
  xp?: unknown;
  streak?: unknown;
  [key: string]: unknown; // Allow additional fields from database
}

/**
 * Transform raw database records into a properly typed UserProfile object
 *
 * @param user - Raw user record from users table
 * @param profileData - Raw profile record from user_profiles table (nullable)
 * @returns Typed UserProfile object with proper defaults
 *
 * @example
 * const user = await turso.execute({ sql: 'SELECT * FROM users WHERE id = ?', args: [userId] });
 * const profile = await turso.execute({ sql: 'SELECT * FROM user_profiles WHERE user_id = ?', args: [userId] });
 * const userProfile = transformDatabaseToProfile(user.rows[0], profile.rows[0] || null);
 */
export function transformDatabaseToProfile(
  user: DatabaseUser,
  profileData: DatabaseProfile | null
): UserProfile {
  // Parse completed_prs JSON string to array
  let completedPRs: number[] = [];
  if (profileData?.completed_prs) {
    try {
      completedPRs = JSON.parse(profileData.completed_prs as string);
    } catch (e) {
      console.error('Failed to parse completed_prs:', e);
      completedPRs = [];
    }
  }

  // Transform to UserProfile format with proper defaults
  return {
    id: user.id as string,
    name: (user.name as string) || (user.email as string)?.split('@')[0] || 'User',
    email: (user.email as string) || '',
    avatar: (user.image as string) || '/profile-placeholder-2.webp',
    bio: (profileData?.bio as string) || '',
    location: (profileData?.location as string) || '',
    website: (profileData?.website as string) || '',
    joinedDate: new Date((user.created_at as number) * 1000).toISOString(),
    currentPR: (profileData?.current_pr as number) || 1,
    completedPRs,
    level: (profileData?.level as string) || 'Initiate',
    xp: (profileData?.xp as number) || 0,
    streak: (profileData?.streak as number) || 0,
  };
}

/**
 * Validate profile update fields
 *
 * @param updates - Partial profile updates
 * @returns Validation result with error message if invalid
 */
export function validateProfileUpdates(
  updates: Partial<UserProfile>
): { valid: boolean; error?: string } {
  // Name validation
  if (updates.name !== undefined) {
    if (typeof updates.name !== 'string' || updates.name.trim().length === 0) {
      return { valid: false, error: 'Name must be a non-empty string' };
    }
    if (updates.name.length > 100) {
      return { valid: false, error: 'Name must be less than 100 characters' };
    }
  }

  // Bio validation
  if (updates.bio !== undefined) {
    if (typeof updates.bio !== 'string') {
      return { valid: false, error: 'Bio must be a string' };
    }
    if (updates.bio.length > 500) {
      return { valid: false, error: 'Bio must be less than 500 characters' };
    }
  }

  // Location validation
  if (updates.location !== undefined) {
    if (typeof updates.location !== 'string') {
      return { valid: false, error: 'Location must be a string' };
    }
    if (updates.location.length > 100) {
      return { valid: false, error: 'Location must be less than 100 characters' };
    }
  }

  // Website validation
  if (updates.website !== undefined) {
    if (typeof updates.website !== 'string') {
      return { valid: false, error: 'Website must be a string' };
    }
    if (updates.website.length > 0) {
      // Basic URL validation
      try {
        new URL(updates.website);
      } catch {
        return { valid: false, error: 'Website must be a valid URL' };
      }
    }
  }

  return { valid: true };
}
