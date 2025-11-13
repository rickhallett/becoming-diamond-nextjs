#!/usr/bin/env tsx
import { config } from 'dotenv';
import { createClient } from '@libsql/client';

config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function cleanup() {
  const corruptUserId = 'a74d467b-7a46-4daf-8244-d7501511680c';

  console.log('Cleaning up corrupt user...\n');

  // Delete sessions first (foreign key)
  const sessions = await client.execute({
    sql: `DELETE FROM sessions WHERE user_id = ?`,
    args: [corruptUserId],
  });
  console.log(`✓ Deleted ${sessions.rowsAffected} sessions`);

  // Delete profile (foreign key)
  const profile = await client.execute({
    sql: `DELETE FROM user_profiles WHERE user_id = ?`,
    args: [corruptUserId],
  });
  console.log(`✓ Deleted ${profile.rowsAffected} profiles`);

  // Delete user
  const user = await client.execute({
    sql: `DELETE FROM users WHERE id = ?`,
    args: [corruptUserId],
  });
  console.log(`✓ Deleted ${user.rowsAffected} users`);

  console.log('\n✓ Cleanup complete!');
  console.log('\nYou can now try signing in again with rickhallett@icloud.com');
}

cleanup().catch(console.error);
