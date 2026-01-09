/**
 * Password Hashing Utilities
 *
 * Uses bcryptjs for secure password hashing and verification.
 * bcryptjs is a pure JavaScript implementation that works in all environments.
 */

import bcrypt from 'bcryptjs';

// Cost factor for bcrypt (12 is a good balance of security and performance)
const SALT_ROUNDS = 12;

// Minimum password requirements
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

/**
 * Hash a password using bcrypt
 * @param password - Plain text password to hash
 * @returns Promise<string> - The hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 * @param password - Plain text password to verify
 * @param hash - The stored hash to compare against
 * @returns Promise<boolean> - True if password matches
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Validate password meets requirements
 * @param password - Password to validate
 * @returns Object with isValid boolean and optional error message
 */
export function validatePassword(password: string): {
  isValid: boolean;
  error?: string;
} {
  if (!password || password.length < PASSWORD_MIN_LENGTH) {
    return {
      isValid: false,
      error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
    };
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    return {
      isValid: false,
      error: `Password must be less than ${PASSWORD_MAX_LENGTH} characters`,
    };
  }

  // Check for at least one letter and one number for basic complexity
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasLetter || !hasNumber) {
    return {
      isValid: false,
      error: 'Password must contain at least one letter and one number',
    };
  }

  return { isValid: true };
}
