#!/usr/bin/env tsx
import { config } from 'dotenv';
import { createClient } from '@libsql/client';

config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function checkUserById(userId: string) {
  console.log(`Checking user by ID: ${userId}\n`);

  // Check user
  const userResult = await client.execute({
    sql: `SELECT id, name, email, created_at FROM users WHERE id = ?`,
    args: [userId],
  });

  if (userResult.rows.length === 0) {
    console.log('❌ User not found');
    return;
  }

  const user = userResult.rows[0];
  console.log('✓ User found:');
  console.log(`  ID: ${user.id}`);
  console.log(`  Name: ${user.name || '(NULL)'}`);
  console.log(`  Email: ${user.email || '(NULL)'}`);
  console.log(`  Created: ${new Date((user.created_at as number) * 1000).toISOString()}\n`);

  // Check profile
  const profileResult = await client.execute({
    sql: `SELECT * FROM user_profiles WHERE user_id = ?`,
    args: [user.id],
  });

  if (profileResult.rows.length === 0) {
    console.log('❌ Profile NOT FOUND');
  } else {
    const profile = profileResult.rows[0];
    console.log('✓ Profile found:');
    console.log(`  Bio: ${profile.bio || '(empty)'}`);
    console.log(`  Location: ${profile.location || '(empty)'}`);
    console.log(`  Current PR: ${profile.current_pr}`);
    console.log(`  Level: ${profile.level}`);
  }

  // Check sessions
  const sessionResult = await client.execute({
    sql: `SELECT COUNT(*) as count FROM sessions WHERE user_id = ?`,
    args: [user.id],
  });

  console.log(`\nSessions: ${sessionResult.rows[0].count}`);
}

const userId = process.argv[2];
if (!userId) {
  console.error('Usage: npx tsx check-user-by-id.ts <user-id>');
  process.exit(1);
}

checkUserById(userId).catch(console.error);
