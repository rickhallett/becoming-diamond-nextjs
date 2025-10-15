import { createClient } from '@libsql/client';
import { nanoid } from 'nanoid';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({ path: join(process.cwd(), '.env.local') });

async function insertTestLead() {
  const turso = createClient({
    url: process.env.TURSO_DATABASE_URL || '',
    authToken: process.env.TURSO_AUTH_TOKEN || '',
  });

  const email = 'test-playwright@example.com';
  const id = `lead_${nanoid()}`;
  const unsubscribeToken = nanoid(32);
  const now = new Date().toISOString();

  console.log('Inserting test lead...');
  console.log('Email:', email);
  console.log('Unsubscribe Token:', unsubscribeToken);

  try {
    await turso.execute({
      sql: `INSERT INTO leads (
        id, email, created_at, updated_at,
        referrer, landing_page, user_agent, ip_address,
        consent_given, subscribed, status, unsubscribe_token
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        email.toLowerCase(),
        now,
        now,
        'http://localhost:3000',
        'http://localhost:3000',
        'Playwright Test',
        '127.0.0.1',
        1, // consent_given
        1, // subscribed
        'new', // status
        unsubscribeToken,
      ],
    });

    console.log('\n✓ Test lead inserted successfully!');
    console.log('\nUnsubscribe URL:');
    console.log(`http://localhost:3000/api/unsubscribe?token=${unsubscribeToken}`);

    process.exit(0);
  } catch (error) {
    console.error('Error inserting test lead:', error);
    process.exit(1);
  }
}

insertTestLead();
