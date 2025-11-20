/**
 * Rate Limiting Abstraction Layer
 *
 * Uses Turso database for persistent rate limiting that works in serverless environments.
 * The database-backed implementation ensures rate limits are enforced across all
 * serverless function invocations.
 */

import { turso } from './turso';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export interface RateLimiter {
  checkLimit(key: string, limit: number, windowMs: number): Promise<RateLimitResult>;
  reset(key: string): Promise<void>;
}

/**
 * Turso Database Rate Limiter
 * Production-ready implementation for serverless environments.
 * Persists rate limit data in Turso database for cross-invocation consistency.
 */
class TursoRateLimiter implements RateLimiter {
  async checkLimit(
    key: string,
    limit: number,
    windowMs: number
  ): Promise<RateLimitResult> {
    const now = Date.now();
    const windowStart = Math.floor(now / windowMs) * windowMs;
    const resetAt = windowStart + windowMs;
    const id = `${key}_${windowStart}`;

    try {
      // Get current count for this window
      const result = await turso.execute({
        sql: 'SELECT count FROM rate_limits WHERE id = ?',
        args: [id],
      });

      const currentCount = result.rows.length > 0
        ? Number(result.rows[0].count)
        : 0;

      // Check if limit exceeded
      if (currentCount >= limit) {
        return {
          allowed: false,
          remaining: 0,
          resetAt,
        };
      }

      // Increment or create record
      if (result.rows.length > 0) {
        await turso.execute({
          sql: 'UPDATE rate_limits SET count = count + 1, updated_at = ? WHERE id = ?',
          args: [now, id],
        });
      } else {
        await turso.execute({
          sql: 'INSERT INTO rate_limits (id, identifier, window_start, count, created_at, updated_at) VALUES (?, ?, ?, 1, ?, ?)',
          args: [id, key, windowStart, now, now],
        });
      }

      // Cleanup old entries (older than 1 hour) - run occasionally
      if (Math.random() < 0.01) { // 1% chance on each request
        await turso.execute({
          sql: 'DELETE FROM rate_limits WHERE window_start < ?',
          args: [now - 3600000], // 1 hour ago
        });
      }

      return {
        allowed: true,
        remaining: limit - currentCount - 1,
        resetAt,
      };
    } catch (error) {
      // Fail open (allow request) rather than fail closed (deny all)
      // This prevents rate limiting from breaking the app if DB is down
      console.error('Rate limit database error:', error);
      return {
        allowed: true,
        remaining: limit,
        resetAt,
      };
    }
  }

  async reset(key: string): Promise<void> {
    try {
      await turso.execute({
        sql: 'DELETE FROM rate_limits WHERE identifier = ?',
        args: [key],
      });
    } catch (error) {
      console.error('Rate limit reset error:', error);
    }
  }
}

/**
 * Vercel KV Rate Limiter
 * Production-ready implementation for serverless environments.
 *
 * To use:
 * 1. Uncomment this implementation
 * 2. Install @vercel/kv
 * 3. Set up environment variables
 * 4. Update DEFAULT_RATE_LIMITER below
 */
// import { kv } from '@vercel/kv';
//
// class VercelKVRateLimiter implements RateLimiter {
//   async checkLimit(
//     key: string,
//     limit: number,
//     windowMs: number
//   ): Promise<RateLimitResult> {
//     const rateLimitKey = `rate-limit:${key}`;
//     const now = Date.now();
//     const windowSeconds = Math.ceil(windowMs / 1000);
//
//     // Get current count
//     const requests = await kv.get<number[]>(rateLimitKey) || [];
//     const windowStart = now - windowMs;
//
//     // Filter requests within current window
//     const recentRequests = requests.filter(timestamp => timestamp > windowStart);
//
//     // Check if limit exceeded
//     if (recentRequests.length >= limit) {
//       const oldestRequest = recentRequests[0];
//       const resetAt = oldestRequest + windowMs;
//       return {
//         allowed: false,
//         remaining: 0,
//         resetAt,
//       };
//     }
//
//     // Add current request
//     recentRequests.push(now);
//     await kv.set(rateLimitKey, recentRequests, { ex: windowSeconds });
//
//     const resetAt = now + windowMs;
//     return {
//       allowed: true,
//       remaining: limit - recentRequests.length,
//       resetAt,
//     };
//   }
//
//   async reset(key: string): Promise<void> {
//     const rateLimitKey = `rate-limit:${key}`;
//     await kv.del(rateLimitKey);
//   }
// }

/**
 * Default rate limiter instance
 *
 * Uses Turso database for serverless-compatible rate limiting.
 * This ensures rate limits work correctly across all serverless invocations.
 */
const DEFAULT_RATE_LIMITER: RateLimiter = new TursoRateLimiter();

/**
 * Check rate limit for a given key
 *
 * @param key - Unique identifier (e.g., IP address, user ID)
 * @param limit - Maximum number of requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns Rate limit result
 *
 * @example
 * const result = await checkRateLimit(ipAddress, 5, 60000); // 5 requests per minute
 * if (!result.allowed) {
 *   return NextResponse.json(
 *     { error: 'Too many requests' },
 *     { status: 429, headers: { 'Retry-After': Math.ceil((result.resetAt - Date.now()) / 1000).toString() } }
 *   );
 * }
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  return DEFAULT_RATE_LIMITER.checkLimit(key, limit, windowMs);
}

/**
 * Reset rate limit for a given key
 *
 * @param key - Unique identifier to reset
 */
export async function resetRateLimit(key: string): Promise<void> {
  return DEFAULT_RATE_LIMITER.reset(key);
}

/**
 * Get rate limiter instance for direct access
 */
export function getRateLimiter(): RateLimiter {
  return DEFAULT_RATE_LIMITER;
}
