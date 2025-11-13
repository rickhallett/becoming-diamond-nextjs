#!/usr/bin/env tsx
import { config } from 'dotenv';
import { createClient } from '@libsql/client';

config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function listRecentUsers() {
  console.log('Recent users (last 10):\n');

  const result = await client.execute({
    sql: `SELECT u.id, u.name, u.email, u.created_at,
                 (SELECT COUNT(*) FROM user_profiles WHERE user_id = u.id) as has_profile
          FROM users u
          ORDER BY u.created_at DESC
          LIMIT 10`,
  });

  if (result.rows.length === 0) {
    console.log('No users found');
    return;
  }

  for (const user of result.rows) {
    console.log(`ID: ${user.id}`);
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Profile: ${user.has_profile ? '✓' : '❌'}`);
    console.log(`Created: ${new Date((user.created_at as number) * 1000).toISOString()}`);
    console.log('---');
  }
}

listRecentUsers().catch(console.error);
