#!/usr/bin/env tsx
import { config } from 'dotenv';
import { createClient } from '@libsql/client';

config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function deleteUser(userId: string) {
  console.log(`Deleting user: ${userId}\n`);

  // Delete sessions
  const sessions = await client.execute({
    sql: `DELETE FROM sessions WHERE user_id = ?`,
    args: [userId],
  });
  console.log(`✓ Deleted ${sessions.rowsAffected} sessions`);

  // Delete profile
  const profile = await client.execute({
    sql: `DELETE FROM user_profiles WHERE user_id = ?`,
    args: [userId],
  });
  console.log(`✓ Deleted ${profile.rowsAffected} profiles`);

  // Delete user
  const user = await client.execute({
    sql: `DELETE FROM users WHERE id = ?`,
    args: [userId],
  });
  console.log(`✓ Deleted ${user.rowsAffected} users`);

  console.log('\n✓ Cleanup complete!');
}

const userId = process.argv[2];
if (!userId) {
  console.error('Usage: npx tsx delete-user-by-id.ts <user-id>');
  process.exit(1);
}

deleteUser(userId).catch(console.error);
