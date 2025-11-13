#!/usr/bin/env tsx
import { config } from 'dotenv';
import { createClient } from '@libsql/client';

config({ path: '.env.local' });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function checkSessions() {
  const userId = 'a74d467b-7a46-4daf-8244-d7501511680c';

  console.log(`Checking sessions for user: ${userId}\n`);

  const result = await client.execute({
    sql: `SELECT id, session_token, user_id, expires FROM sessions WHERE user_id = ?`,
    args: [userId],
  });

  if (result.rows.length === 0) {
    console.log('No sessions found');
    return;
  }

  for (const session of result.rows) {
    const expires = new Date((session.expires as number) * 1000);
    const isExpired = expires < new Date();

    console.log(`Session ID: ${session.id}`);
    console.log(`Token: ${(session.session_token as string).substring(0, 16)}...`);
    console.log(`Expires: ${expires.toISOString()}`);
    console.log(`Status: ${isExpired ? '❌ EXPIRED' : '✓ ACTIVE'}`);
    console.log('---');
  }

  // Check verification tokens
  console.log('\nChecking verification tokens:');
  const tokens = await client.execute({
    sql: `SELECT identifier, token, expires FROM verification_tokens ORDER BY expires DESC LIMIT 5`,
  });

  if (tokens.rows.length === 0) {
    console.log('No verification tokens found');
  } else {
    for (const token of tokens.rows) {
      const expires = new Date((token.expires as number) * 1000);
      console.log(`Email: ${token.identifier}`);
      console.log(`Token: ${(token.token as string).substring(0, 16)}...`);
      console.log(`Expires: ${expires.toISOString()}`);
      console.log('---');
    }
  }
}

checkSessions().catch(console.error);
