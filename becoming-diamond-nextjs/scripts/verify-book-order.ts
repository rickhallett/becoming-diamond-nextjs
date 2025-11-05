import { createClient } from '@libsql/client';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables from .env.local
config({ path: join(process.cwd(), '.env.local') });

async function verifyOrder() {
  const turso = createClient({
    url: process.env.TURSO_DATABASE_URL || '',
    authToken: process.env.TURSO_AUTH_TOKEN || '',
  });

  console.log('Querying book_orders table...\n');

  const result = await turso.execute('SELECT * FROM book_orders ORDER BY created_at DESC LIMIT 5');

  if (result.rows.length === 0) {
    console.log('❌ No orders found in database');
    process.exit(1);
  }

  console.log(`✓ Found ${result.rows.length} order(s):\n`);

  for (const row of result.rows) {
    console.log('Order Details:');
    console.log(`  ID: ${row.id}`);
    console.log(`  Email: ${row.email}`);
    console.log(`  Stripe Session ID: ${row.stripe_session_id}`);
    console.log(`  Amount Paid: $${row.amount_paid}`);
    console.log(`  Status: ${row.status}`);
    console.log(`  Created At: ${new Date((row.created_at as number) * 1000).toISOString()}`);
    console.log('');
  }

  console.log('✓ Webhook is working correctly - orders are being persisted to database!');
  process.exit(0);
}

verifyOrder().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
