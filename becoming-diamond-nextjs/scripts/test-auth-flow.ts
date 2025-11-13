#!/usr/bin/env tsx
/**
 * Authentication Flow Integrity Test
 *
 * Tests the complete magic link authentication workflow:
 * 1. Database connection
 * 2. User creation with email-derived name
 * 3. User lookup by email
 * 4. Profile creation with database defaults
 * 5. Profile retrieval with default values
 * 6. Profile updates (bio/location) without overwriting defaults
 * 7. Repeated sign-in preserves profile data
 * 8. Duplicate email prevention via UNIQUE constraint
 * 9. NULL value handling for edge cases
 *
 * Usage: npx tsx scripts/test-auth-flow.ts
 */

import { config } from 'dotenv';
import { createClient } from '@libsql/client';

// Load environment variables
config({ path: '.env.local' });

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

interface TestResult {
  passed: boolean;
  message: string;
  duration?: number;
}

class AuthFlowTester {
  private client: ReturnType<typeof createClient>;
  private testEmail = `test-${Date.now()}@example.com`;
  private testUserId: string | null = null;

  constructor() {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url || !authToken) {
      throw new Error('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set');
    }

    console.log(`${YELLOW}[Config]${RESET} Database URL: ${url}`);
    console.log(`${YELLOW}[Config]${RESET} Test email: ${this.testEmail}\n`);

    this.client = createClient({ url, authToken });
  }

  private log(test: string, result: TestResult) {
    const icon = result.passed ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
    const duration = result.duration ? ` (${result.duration}ms)` : '';
    console.log(`${icon} ${test}${duration}`);
    if (!result.passed) {
      console.log(`  ${RED}${result.message}${RESET}`);
    }
  }

  private async measure<T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
    const start = Date.now();
    const result = await fn();
    const duration = Date.now() - start;
    return { result, duration };
  }

  async testDatabaseConnection(): Promise<TestResult> {
    try {
      const { duration } = await this.measure(async () => {
        return await this.client.execute('SELECT 1 as test');
      });

      if (duration > 5000) {
        return {
          passed: false,
          message: `Connection very slow (${duration}ms). Network issues likely.`,
          duration,
        };
      }

      return {
        passed: true,
        message: 'Database connection successful',
        duration,
      };
    } catch (error: any) {
      return {
        passed: false,
        message: `Database connection failed: ${error.message}`,
      };
    }
  }

  async testUserCreation(): Promise<TestResult> {
    try {
      const { duration } = await this.measure(async () => {
        const userId = crypto.randomUUID();
        const now = Math.floor(Date.now() / 1000);
        const name = this.testEmail.split('@')[0]; // Derive name from email

        await this.client.execute({
          sql: `INSERT INTO users (id, name, email, email_verified, image, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          args: [userId, name, this.testEmail, null, null, now, now],
        });

        this.testUserId = userId;
        return userId;
      });

      return {
        passed: true,
        message: `User created with email-derived name`,
        duration,
      };
    } catch (error: any) {
      return {
        passed: false,
        message: `User creation failed: ${error.message}`,
      };
    }
  }

  async testUserLookupByEmail(): Promise<TestResult> {
    try {
      const { result, duration } = await this.measure(async () => {
        return await this.client.execute({
          sql: `SELECT * FROM users WHERE email = ?`,
          args: [this.testEmail],
        });
      });

      if (result.rows.length === 0) {
        return {
          passed: false,
          message: 'User not found by email',
          duration,
        };
      }

      const user = result.rows[0];
      const expectedName = this.testEmail.split('@')[0];

      if (user.name !== expectedName) {
        return {
          passed: false,
          message: `Name mismatch: expected '${expectedName}', got '${user.name}'`,
          duration,
        };
      }

      return {
        passed: true,
        message: `User found with correct name: '${user.name}'`,
        duration,
      };
    } catch (error: any) {
      return {
        passed: false,
        message: `User lookup failed: ${error.message}`,
      };
    }
  }

  async testProfileCreation(): Promise<TestResult> {
    try {
      if (!this.testUserId) {
        return {
          passed: false,
          message: 'No user ID available (previous test failed)',
        };
      }

      const { duration } = await this.measure(async () => {
        const profileId = crypto.randomUUID();
        const now = Math.floor(Date.now() / 1000);

        await this.client.execute({
          sql: `INSERT INTO user_profiles (id, user_id, created_at, updated_at)
                VALUES (?, ?, ?, ?)`,
          args: [profileId, this.testUserId, now, now],
        });
      });

      return {
        passed: true,
        message: 'User profile created',
        duration,
      };
    } catch (error: any) {
      return {
        passed: false,
        message: `Profile creation failed: ${error.message}`,
      };
    }
  }

  async testProfileRetrieval(): Promise<TestResult> {
    try {
      if (!this.testUserId) {
        return {
          passed: false,
          message: 'No user ID available (previous test failed)',
        };
      }

      const { result, duration } = await this.measure(async () => {
        return await this.client.execute({
          sql: `SELECT bio, location, website, current_pr, completed_prs, level, xp, streak
                FROM user_profiles WHERE user_id = ?`,
          args: [this.testUserId],
        });
      });

      if (result.rows.length === 0) {
        return {
          passed: false,
          message: 'Profile not found',
          duration,
        };
      }

      const profile = result.rows[0];

      // Check default values
      if (profile.current_pr !== 1) {
        return {
          passed: false,
          message: `current_pr should be 1, got ${profile.current_pr}`,
          duration,
        };
      }

      if (profile.level !== 'Initiate') {
        return {
          passed: false,
          message: `level should be 'Initiate', got '${profile.level}'`,
          duration,
        };
      }

      return {
        passed: true,
        message: 'Profile retrieved with correct defaults',
        duration,
      };
    } catch (error: any) {
      return {
        passed: false,
        message: `Profile retrieval failed: ${error.message}`,
      };
    }
  }

  async testProfileUpdate(): Promise<TestResult> {
    try {
      if (!this.testUserId) {
        return {
          passed: false,
          message: 'No user ID available (previous test failed)',
        };
      }

      const testBio = 'Test bio for auth flow';
      const testLocation = 'Test City';

      const { duration } = await this.measure(async () => {
        const now = Math.floor(Date.now() / 1000);
        await this.client.execute({
          sql: `UPDATE user_profiles SET bio = ?, location = ?, updated_at = ? WHERE user_id = ?`,
          args: [testBio, testLocation, now, this.testUserId],
        });
      });

      // Verify update - fetch ALL fields to ensure defaults weren't overwritten
      const result = await this.client.execute({
        sql: `SELECT bio, location, current_pr, level, xp, streak FROM user_profiles WHERE user_id = ?`,
        args: [this.testUserId],
      });

      if (result.rows.length === 0) {
        return {
          passed: false,
          message: 'Profile not found after update',
          duration,
        };
      }

      const profile = result.rows[0];

      // Verify updated fields
      if (profile.bio !== testBio || profile.location !== testLocation) {
        return {
          passed: false,
          message: `Profile update did not persist. Expected bio='${testBio}', location='${testLocation}', got bio='${profile.bio}', location='${profile.location}'`,
          duration,
        };
      }

      // Verify default fields remained unchanged (regression test)
      if (profile.current_pr !== 1 || profile.level !== 'Initiate' || profile.xp !== 0 || profile.streak !== 0) {
        return {
          passed: false,
          message: `Profile defaults were overwritten. Expected current_pr=1, level='Initiate', xp=0, streak=0, got current_pr=${profile.current_pr}, level='${profile.level}', xp=${profile.xp}, streak=${profile.streak}`,
          duration,
        };
      }

      return {
        passed: true,
        message: 'Profile updates persisted correctly, defaults preserved',
        duration,
      };
    } catch (error: any) {
      return {
        passed: false,
        message: `Profile update failed: ${error.message}`,
      };
    }
  }

  async testDuplicateEmailPrevention(): Promise<TestResult> {
    try {
      const userId = crypto.randomUUID();
      const now = Math.floor(Date.now() / 1000);
      let duplicateAllowed = true;
      let duration = 0;

      const start = Date.now();
      try {
        await this.client.execute({
          sql: `INSERT INTO users (id, name, email, email_verified, image, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          args: [userId, 'duplicate', this.testEmail, null, null, now, now],
        });
      } catch (error: any) {
        if (error.message.includes('UNIQUE constraint failed')) {
          duplicateAllowed = false;
        } else {
          throw error;
        }
      }
      duration = Date.now() - start;

      if (duplicateAllowed) {
        return {
          passed: false,
          message: 'Duplicate email was allowed (UNIQUE constraint not working)',
          duration,
        };
      }

      return {
        passed: true,
        message: 'Duplicate email correctly prevented',
        duration,
      };
    } catch (error: any) {
      return {
        passed: false,
        message: `Duplicate email test failed: ${error.message}`,
      };
    }
  }

  async testRepeatedSignIn(): Promise<TestResult> {
    try {
      if (!this.testUserId) {
        return {
          passed: false,
          message: 'No user ID available (previous test failed)',
        };
      }

      const { duration } = await this.measure(async () => {
        // Simulate a second sign-in by looking up user by email
        // This mimics what NextAuth does during authentication
        const userResult = await this.client.execute({
          sql: `SELECT id FROM users WHERE email = ?`,
          args: [this.testEmail],
        });

        if (userResult.rows.length === 0) {
          throw new Error('User not found on repeated sign-in');
        }

        const foundUserId = userResult.rows[0].id;

        // Verify it's the same user ID (not a new user created)
        if (foundUserId !== this.testUserId) {
          throw new Error(`Different user ID on sign-in: expected ${this.testUserId}, got ${foundUserId}`);
        }

        // Verify profile still exists with previous data
        const profileResult = await this.client.execute({
          sql: `SELECT bio, location, current_pr, level FROM user_profiles WHERE user_id = ?`,
          args: [this.testUserId],
        });

        if (profileResult.rows.length === 0) {
          throw new Error('Profile lost after repeated sign-in');
        }

        const profile = profileResult.rows[0];

        // Check that our previous test updates are still there
        if (profile.bio !== 'Test bio for auth flow' || profile.location !== 'Test City') {
          throw new Error(`Profile data lost: bio='${profile.bio}', location='${profile.location}'`);
        }

        // Check defaults are still intact
        if (profile.current_pr !== 1 || profile.level !== 'Initiate') {
          throw new Error(`Profile defaults changed: current_pr=${profile.current_pr}, level='${profile.level}'`);
        }
      });

      return {
        passed: true,
        message: 'Profile persists correctly across sign-ins',
        duration,
      };
    } catch (error: any) {
      return {
        passed: false,
        message: `Repeated sign-in test failed: ${error.message}`,
      };
    }
  }

  async testNullHandling(): Promise<TestResult> {
    try {
      // Create a user with NULL name (edge case)
      const testUserId = crypto.randomUUID();
      const testEmail = `null-test-${Date.now()}@example.com`;
      const now = Math.floor(Date.now() / 1000);

      const { duration } = await this.measure(async () => {
        // Insert user with NULL name
        await this.client.execute({
          sql: `INSERT INTO users (id, name, email, email_verified, image, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          args: [testUserId, null, testEmail, null, null, now, now],
        });

        // Create profile
        const profileId = crypto.randomUUID();
        await this.client.execute({
          sql: `INSERT INTO user_profiles (id, user_id, created_at, updated_at)
                VALUES (?, ?, ?, ?)`,
          args: [profileId, testUserId, now, now],
        });

        // Fetch profile and verify defaults applied even with NULL user name
        const result = await this.client.execute({
          sql: `SELECT p.level, p.current_pr, p.xp, u.name
                FROM user_profiles p
                JOIN users u ON p.user_id = u.id
                WHERE p.user_id = ?`,
          args: [testUserId],
        });

        if (result.rows.length === 0) {
          throw new Error('Profile not found for NULL name user');
        }

        const data = result.rows[0];

        // Verify NULL handling
        if (data.name !== null) {
          throw new Error(`Expected NULL name, got '${data.name}'`);
        }

        // Verify defaults still apply
        if (data.level !== 'Initiate' || data.current_pr !== 1 || data.xp !== 0) {
          throw new Error(`Defaults not applied: level='${data.level}', current_pr=${data.current_pr}, xp=${data.xp}`);
        }

        // Cleanup this test user
        await this.client.execute({
          sql: `DELETE FROM user_profiles WHERE user_id = ?`,
          args: [testUserId],
        });
        await this.client.execute({
          sql: `DELETE FROM users WHERE id = ?`,
          args: [testUserId],
        });
      });

      return {
        passed: true,
        message: 'NULL values handled correctly, defaults still applied',
        duration,
      };
    } catch (error: any) {
      return {
        passed: false,
        message: `NULL handling test failed: ${error.message}`,
      };
    }
  }

  async cleanup() {
    if (this.testUserId) {
      try {
        // Delete profile first, then user
        // Order matters: foreign key has ON DELETE CASCADE, so deleting user would
        // automatically delete profile, but explicit order is clearer for testing
        await this.client.execute({
          sql: `DELETE FROM user_profiles WHERE user_id = ?`,
          args: [this.testUserId],
        });
        await this.client.execute({
          sql: `DELETE FROM users WHERE id = ?`,
          args: [this.testUserId],
        });
        console.log(`\n${YELLOW}[Cleanup]${RESET} Test user and profile deleted`);
      } catch (error: any) {
        console.log(`\n${RED}[Cleanup Error]${RESET} ${error.message}`);
      }
    }
  }

  async runAllTests() {
    console.log(`${YELLOW}=== Authentication Flow Integrity Test ===${RESET}\n`);

    const tests = [
      { name: '1. Database Connection', fn: () => this.testDatabaseConnection() },
      { name: '2. User Creation (email-derived name)', fn: () => this.testUserCreation() },
      { name: '3. User Lookup by Email', fn: () => this.testUserLookupByEmail() },
      { name: '4. Profile Creation', fn: () => this.testProfileCreation() },
      { name: '5. Profile Retrieval (defaults)', fn: () => this.testProfileRetrieval() },
      { name: '6. Profile Update (persistence)', fn: () => this.testProfileUpdate() },
      { name: '7. Repeated Sign-In (profile persistence)', fn: () => this.testRepeatedSignIn() },
      { name: '8. Duplicate Email Prevention', fn: () => this.testDuplicateEmailPrevention() },
      { name: '9. NULL Value Handling', fn: () => this.testNullHandling() },
    ];

    const results: Array<{ name: string; result: TestResult }> = [];

    for (const test of tests) {
      const result = await test.fn();
      this.log(test.name, result);
      results.push({ name: test.name, result });

      // Stop on first critical failure
      if (!result.passed && test.name.includes('Database Connection')) {
        console.log(`\n${RED}Critical failure: Cannot proceed without database connection${RESET}`);
        break;
      }
    }

    await this.cleanup();

    // Summary
    const passed = results.filter(r => r.result.passed).length;
    const total = results.length;
    const icon = passed === total ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;

    console.log(`\n${YELLOW}=== Summary ===${RESET}`);
    console.log(`${icon} ${passed}/${total} tests passed\n`);

    if (passed !== total) {
      console.log(`${RED}Auth flow has issues that need to be resolved.${RESET}`);
      process.exit(1);
    } else {
      console.log(`${GREEN}All tests passed! Auth flow is working correctly.${RESET}`);
      process.exit(0);
    }
  }
}

// Run tests
const tester = new AuthFlowTester();
tester.runAllTests().catch(error => {
  console.error(`${RED}Fatal error:${RESET}`, error.message);
  process.exit(1);
});
