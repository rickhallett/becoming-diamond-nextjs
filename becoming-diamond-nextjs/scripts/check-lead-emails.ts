import { createClient } from '@libsql/client';
import { config } from 'dotenv';
import path from 'path';

config({ path: path.join(process.cwd(), '.env.local') });

async function checkLeadEmails() {
  const turso = createClient({
    url: process.env.TURSO_DATABASE_URL || '',
    authToken: process.env.TURSO_AUTH_TOKEN || '',
  });

  const result = await turso.execute({
    sql: 'SELECT id, email, email_status, email_sent_at, email_id, created_at FROM leads ORDER BY created_at DESC LIMIT 10',
    args: []
  });

  console.log('\n=== Recent Lead Email Status ===\n');

  if (result.rows.length === 0) {
    console.log('No leads found in database');
    return;
  }

  for (const row of result.rows) {
    console.log(`Email: ${row.email}`);
    console.log(`  Status: ${row.email_status || 'NOT SET'}`);
    console.log(`  Sent At: ${row.email_sent_at || 'NOT SENT'}`);
    console.log(`  Email ID: ${row.email_id || 'N/A'}`);
    console.log(`  Created: ${row.created_at}`);
    console.log('---');
  }

  // Summary stats
  const stats = await turso.execute({
    sql: `
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN email_status = 'sent' THEN 1 ELSE 0 END) as sent,
        SUM(CASE WHEN email_status = 'failed' THEN 1 ELSE 0 END) as failed,
        SUM(CASE WHEN email_status IS NULL THEN 1 ELSE 0 END) as no_status
      FROM leads
    `,
    args: []
  });

  console.log('\n=== Email Status Summary ===\n');
  console.log(`Total leads: ${stats.rows[0]?.total || 0}`);
  console.log(`Sent: ${stats.rows[0]?.sent || 0}`);
  console.log(`Failed: ${stats.rows[0]?.failed || 0}`);
  console.log(`No status: ${stats.rows[0]?.no_status || 0}`);
}

checkLeadEmails().catch(console.error);
