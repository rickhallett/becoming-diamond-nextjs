#!/usr/bin/env tsx
import { config } from 'dotenv';
import { createClient } from '@libsql/client';

config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function checkUser(email: string) {
  console.log(`Checking user: ${email}\n`);

  // Check user
  const userResult = await client.execute({
    sql: `SELECT id, name, email, created_at FROM users WHERE email = ?`,
    args: [email],
  });

  if (userResult.rows.length === 0) {
    console.log('❌ User not found');
    return;
  }

  const user = userResult.rows[0];
  console.log('✓ User found:');
  console.log(`  ID: ${user.id}`);
  console.log(`  Name: ${user.name}`);
  console.log(`  Email: ${user.email}`);
  console.log(`  Created: ${new Date((user.created_at as number) * 1000).toISOString()}\n`);

  // Check profile
  const profileResult = await client.execute({
    sql: `SELECT id, bio, location, website, current_pr, completed_prs, level, xp, streak, created_at
          FROM user_profiles WHERE user_id = ?`,
    args: [user.id],
  });

  if (profileResult.rows.length === 0) {
    console.log('❌ Profile NOT FOUND');
    console.log('   This is the issue - profile was not created during sign-up');
    return;
  }

  const profile = profileResult.rows[0];
  console.log('✓ Profile found:');
  console.log(`  ID: ${profile.id}`);
  console.log(`  Bio: ${profile.bio || '(empty)'}`);
  console.log(`  Location: ${profile.location || '(empty)'}`);
  console.log(`  Website: ${profile.website || '(empty)'}`);
  console.log(`  Current PR: ${profile.current_pr}`);
  console.log(`  Completed PRs: ${profile.completed_prs}`);
  console.log(`  Level: ${profile.level}`);
  console.log(`  XP: ${profile.xp}`);
  console.log(`  Streak: ${profile.streak}`);
  console.log(`  Created: ${new Date((profile.created_at as number) * 1000).toISOString()}`);
}

const email = process.argv[2] || 'rickhallett@icloud.com';
checkUser(email).catch(console.error);
