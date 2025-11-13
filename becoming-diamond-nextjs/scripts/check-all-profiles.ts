#!/usr/bin/env tsx
import { config } from 'dotenv';
import { createClient } from '@libsql/client';

config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function checkAllProfiles() {
  console.log('All user profiles:\n');

  const result = await client.execute({
    sql: `SELECT u.id, u.name, u.email,
                 p.bio, p.location, p.website,
                 p.current_pr, p.level, p.xp, p.streak,
                 (SELECT COUNT(*) FROM sessions WHERE user_id = u.id) as session_count
          FROM users u
          LEFT JOIN user_profiles p ON u.id = p.user_id
          ORDER BY u.created_at DESC`,
  });

  if (result.rows.length === 0) {
    console.log('No users found');
    return;
  }

  for (const row of result.rows) {
    console.log(`User ID: ${row.id}`);
    console.log(`Name: ${row.name || '(NULL)'}`);
    console.log(`Email: ${row.email || '(NULL)'}`);
    console.log(`Bio: ${row.bio || '(empty)'}`);
    console.log(`Location: ${row.location || '(empty)'}`);
    console.log(`Website: ${row.website || '(empty)'}`);
    console.log(`Current PR: ${row.current_pr}`);
    console.log(`Level: ${row.level}`);
    console.log(`XP: ${row.xp}`);
    console.log(`Streak: ${row.streak}`);
    console.log(`Sessions: ${row.session_count}`);
    console.log('---\n');
  }
}

checkAllProfiles().catch(console.error);
