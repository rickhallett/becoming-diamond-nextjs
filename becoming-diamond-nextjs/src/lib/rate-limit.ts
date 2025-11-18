/**
 * Rate Limiting Abstraction Layer
 *
 * IMPORTANT: The in-memory implementation is NOT suitable for serverless environments.
 * In production on Vercel/serverless platforms, you MUST use a distributed solution
 * like Vercel KV, Redis, or Upstash.
 *
 * To migrate to Vercel KV:
 * 1. Install: npm install @vercel/kv
 * 2. Set up Vercel KV in dashboard
 * 3. Add KV_REST_API_URL and KV_REST_API_TOKEN to environment variables
 * 4. Uncomment the VercelKVRateLimiter implementation below
 * 5. Update DEFAULT_RATE_LIMITER to use VercelKVRateLimiter
 */

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
 * In-Memory Rate Limiter
 * WARNING: Only works in single-instance environments. Does NOT work in serverless.
 * Use only for development/testing.
 */
class InMemoryRateLimiter implements RateLimiter {
  private store = new Map<string, { count: number; resetAt: number }>();

  async checkLimit(
    key: string,
    limit: number,
    windowMs: number
  ): Promise<RateLimitResult> {
    const now = Date.now();
    const record = this.store.get(key);

    // No record or window expired - create new window
    if (!record || now > record.resetAt) {
      const resetAt = now + windowMs;
      this.store.set(key, { count: 1, resetAt });
      return {
        allowed: true,
        remaining: limit - 1,
        resetAt,
      };
    }

    // Check if limit exceeded
    if (record.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: record.resetAt,
      };
    }

    // Increment count
    record.count++;
    return {
      allowed: true,
      remaining: limit - record.count,
      resetAt: record.resetAt,
    };
  }

  async reset(key: string): Promise<void> {
    this.store.delete(key);
  }

  // Cleanup old entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.store.entries()) {
      if (now > record.resetAt) {
        this.store.delete(key);
      }
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
 * PRODUCTION: Change this to VercelKVRateLimiter
 * DEVELOPMENT: InMemoryRateLimiter is acceptable
 */
const DEFAULT_RATE_LIMITER: RateLimiter = new InMemoryRateLimiter();

// Start cleanup interval for in-memory limiter (development only)
if (DEFAULT_RATE_LIMITER instanceof InMemoryRateLimiter) {
  // Cleanup every 5 minutes
  setInterval(() => {
    (DEFAULT_RATE_LIMITER as InMemoryRateLimiter).cleanup();
  }, 5 * 60 * 1000);
}

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
