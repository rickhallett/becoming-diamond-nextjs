/**
 * Authentication and Authorization Helpers
 *
 * Centralized logic for admin access control and authentication utilities.
 */

/**
 * List of admin email addresses
 *
 * IMPORTANT: For production, consider moving this to environment variables:
 * - Add ADMIN_EMAILS="email1@domain.com,email2@domain.com" to .env
 * - Parse with: process.env.ADMIN_EMAILS?.split(',').map(e => e.trim())
 *
 * For MVP with single admin, hardcoding is acceptable but centralized here.
 */
export const ADMIN_EMAILS = [
  'support@becomingdiamond.com',
  // Add more admin emails as needed
] as const;

/**
 * Check if an email address belongs to an admin user
 *
 * @param email - Email address to check (nullable for convenience with session data)
 * @returns true if the email is in the admin list (case-insensitive)
 *
 * @example
 * const session = await auth();
 * if (isAdminUser(session?.user?.email)) {
 *   // Show admin features
 * }
 */
export function isAdminUser(email: string | null | undefined): boolean {
  if (!email) return false;

  const normalizedEmail = email.toLowerCase().trim();
  return ADMIN_EMAILS.some(adminEmail =>
    adminEmail.toLowerCase() === normalizedEmail
  );
}

/**
 * Alternative implementation using environment variable
 *
 * To use this approach:
 * 1. Add to .env.local: ADMIN_EMAILS="email1@example.com,email2@example.com"
 * 2. Uncomment this function and comment out the hardcoded version above
 * 3. Update exports below
 */
// export function isAdminUser(email: string | null | undefined): boolean {
//   if (!email) return false;
//
//   const adminEmailsEnv = process.env.ADMIN_EMAILS || '';
//   const adminEmails = adminEmailsEnv.split(',').map(e => e.trim().toLowerCase());
//
//   if (adminEmails.length === 0) {
//     console.warn('No admin emails configured in ADMIN_EMAILS environment variable');
//     return false;
//   }
//
//   const normalizedEmail = email.toLowerCase().trim();
//   return adminEmails.includes(normalizedEmail);
// }

/**
 * Get list of all admin emails (for display purposes only)
 *
 * @returns Array of admin email addresses
 */
export function getAdminEmails(): readonly string[] {
  return ADMIN_EMAILS;
}

/**
 * Check if a user ID corresponds to an admin (requires database lookup)
 *
 * This is a placeholder for future implementation when you need to check
 * admin status by user ID instead of email.
 *
 * @param userId - User ID to check
 * @returns Promise resolving to true if user is admin
 */
export async function isAdminUserId(userId: string): Promise<boolean> {
  // TODO: Implement when moving to role-based access control
  // Example implementation:
  // const { turso } = await import('@/lib/turso');
  // const result = await turso.execute({
  //   sql: 'SELECT role FROM users WHERE id = ?',
  //   args: [userId]
  // });
  // return result.rows[0]?.role === 'admin';

  throw new Error('isAdminUserId not yet implemented. Use isAdminUser(email) instead.');
}
