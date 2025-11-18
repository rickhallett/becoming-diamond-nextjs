/**
 * Centralized Validation Utilities
 *
 * Uses Zod for runtime type validation and data sanitization.
 * This ensures consistent validation across the application.
 */

import { z } from 'zod';

/**
 * Email validation schema
 *
 * Validates:
 * - Valid email format
 * - Minimum length (5 characters: a@b.c)
 * - Maximum length (255 characters, RFC 5321 limit)
 * - Trims whitespace
 * - Converts to lowercase
 */
export const emailSchema = z.string()
  .email('Invalid email address')
  .min(5, 'Email is too short')
  .max(255, 'Email is too long')
  .toLowerCase()
  .trim();

/**
 * Validate an email address
 *
 * @param email - Email address to validate
 * @returns Validation result with sanitized email or error message
 *
 * @example
 * const result = validateEmail('user@example.com');
 * if (result.valid) {
 *   console.log('Sanitized email:', result.email);
 * } else {
 *   console.error('Error:', result.error);
 * }
 */
export function validateEmail(email: string): { valid: true; email: string } | { valid: false; error: string } {
  try {
    const sanitizedEmail = emailSchema.parse(email);
    return { valid: true, email: sanitizedEmail };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return { valid: false, error: firstError?.message || 'Invalid email' };
    }
    return { valid: false, error: 'Invalid email' };
  }
}

/**
 * User profile update validation schema
 */
export const userProfileUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long').optional(),
  email: emailSchema.optional(),
  bio: z.string().max(500, 'Bio is too long').optional(),
  location: z.string().max(100, 'Location is too long').optional(),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
}).strict(); // Reject unknown fields

export type UserProfileUpdate = z.infer<typeof userProfileUpdateSchema>;

/**
 * Lead capture validation schema
 */
export const leadCaptureSchema = z.object({
  email: emailSchema,
  consentGiven: z.boolean().refine(val => val === true, {
    message: 'Consent is required to subscribe',
  }),
  noLiabilityAccepted: z.boolean().refine(val => val === true, {
    message: 'Terms acknowledgment is required',
  }),
}).strict();

export type LeadCapture = z.infer<typeof leadCaptureSchema>;

/**
 * Generic validation helper
 *
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validation result with parsed data or error details
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { valid: true; data: T } | { valid: false; errors: z.ZodIssue[] } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { valid: true, data: result.data };
  }

  return { valid: false, errors: result.error.issues };
}

/**
 * Format Zod validation errors for API responses
 *
 * @param errors - Array of Zod issues
 * @returns Human-readable error message
 */
export function formatValidationErrors(errors: z.ZodIssue[]): string {
  return errors.map(error => `${error.path.join('.')}: ${error.message}`).join('; ');
}

/**
 * Validate and sanitize email with backward compatibility
 *
 * @param email - Email to validate
 * @returns true if valid, false otherwise (for backward compatibility)
 *
 * @deprecated Use validateEmail() instead for better error messages
 */
export function isValidEmail(email: string): boolean {
  try {
    emailSchema.parse(email);
    return true;
  } catch {
    return false;
  }
}
