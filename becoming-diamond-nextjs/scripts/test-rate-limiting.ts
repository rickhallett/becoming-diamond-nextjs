#!/usr/bin/env tsx

/**
 * Test script for database-backed rate limiting
 *
 * Tests that the rate limiter correctly:
 * 1. Allows requests within limit
 * 2. Blocks requests exceeding limit
 * 3. Persists state in database
 */

import { createClient } from '@libsql/client';
import { config } from 'dotenv';

config({ path: '.env.local' });

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Inline rate limiter for testing (same logic as src/lib/rate-limit.ts)
async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const now = Date.now();
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const resetAt = windowStart + windowMs;
  const id = `${key}_${windowStart}`;

  try {
    const result = await turso.execute({
      sql: 'SELECT count FROM rate_limits WHERE id = ?',
      args: [id],
    });

    const currentCount = result.rows.length > 0
      ? Number(result.rows[0].count)
      : 0;

    if (currentCount >= limit) {
      return { allowed: false, remaining: 0, resetAt };
    }

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

    return {
      allowed: true,
      remaining: limit - currentCount - 1,
      resetAt,
    };
  } catch (error) {
    console.error('Rate limit error:', error);
    return { allowed: true, remaining: limit, resetAt };
  }
}

async function runTests() {
  console.log('Testing database-backed rate limiting...\n');

  const testKey = `test-${Date.now()}`;
  const limit = 5;
  const windowMs = 60000; // 1 minute

  console.log(`Configuration: ${limit} requests per ${windowMs/1000}s window`);
  console.log(`Test identifier: ${testKey}\n`);

  // Test 1: Requests within limit should be allowed
  console.log('Test 1: Requests within limit');
  let passed = true;

  for (let i = 1; i <= limit; i++) {
    const result = await checkRateLimit(testKey, limit, windowMs);
    const status = result.allowed ? 'ALLOWED' : 'BLOCKED';
    console.log(`  Request ${i}: ${status} (remaining: ${result.remaining})`);

    if (!result.allowed) {
      console.log(`  FAIL: Request ${i} should be allowed`);
      passed = false;
    }
  }

  if (passed) {
    console.log('  PASS: All requests within limit allowed\n');
  }

  // Test 2: Request exceeding limit should be blocked
  console.log('Test 2: Request exceeding limit');
  const exceededResult = await checkRateLimit(testKey, limit, windowMs);
  const exceededStatus = exceededResult.allowed ? 'ALLOWED' : 'BLOCKED';
  console.log(`  Request ${limit + 1}: ${exceededStatus} (remaining: ${exceededResult.remaining})`);

  if (!exceededResult.allowed) {
    console.log('  PASS: Request exceeding limit blocked\n');
  } else {
    console.log('  FAIL: Request exceeding limit should be blocked\n');
  }

  // Test 3: Verify database persistence
  console.log('Test 3: Database persistence');
  const dbResult = await turso.execute({
    sql: 'SELECT * FROM rate_limits WHERE identifier = ?',
    args: [testKey],
  });

  if (dbResult.rows.length > 0) {
    const row = dbResult.rows[0];
    console.log(`  Record found: count=${row.count}, window_start=${row.window_start}`);
    console.log('  PASS: Rate limit state persisted to database\n');
  } else {
    console.log('  FAIL: No record found in database\n');
  }

  // Cleanup test data
  await turso.execute({
    sql: 'DELETE FROM rate_limits WHERE identifier = ?',
    args: [testKey],
  });
  console.log('Test data cleaned up.');

  console.log('\n=== Rate Limiting Tests Complete ===');
}

runTests().catch(console.error);
