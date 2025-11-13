#!/usr/bin/env tsx
import { config } from 'dotenv';
import { createClient } from '@libsql/client';

config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function checkCorruptUser() {
  console.log('Checking for users with NULL email:\n');

  const userResult = await client.execute({
    sql: `SELECT id, name, email, created_at FROM users WHERE email IS NULL OR name IS NULL`,
  });

  if (userResult.rows.length === 0) {
    console.log('No corrupt users found');
    return;
  }

  for (const user of userResult.rows) {
    console.log(`User ID: ${user.id}`);
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Created: ${new Date((user.created_at as number) * 1000).toISOString()}`);

    // Check if profile exists
    const profileResult = await client.execute({
      sql: `SELECT * FROM user_profiles WHERE user_id = ?`,
      args: [user.id],
    });

    if (profileResult.rows.length > 0) {
      console.log(`Has profile: YES (ID: ${profileResult.rows[0].id})`);
    } else {
      console.log(`Has profile: NO`);
    }

    // Check if sessions exist
    const sessionResult = await client.execute({
      sql: `SELECT COUNT(*) as count FROM sessions WHERE user_id = ?`,
      args: [user.id],
    });

    console.log(`Sessions: ${sessionResult.rows[0].count}`);
    console.log('---\n');
  }

  // Offer to clean up
  console.log('\nTo delete corrupt users, run:');
  console.log('DELETE FROM users WHERE email IS NULL;');
}

checkCorruptUser().catch(console.error);
