import { createClient } from '@libsql/client';
import fs from 'fs';
import { config } from 'dotenv';

config({ path: '.env.local' });

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function run() {
  const sql = fs.readFileSync('./migrations/006_rate_limiting.sql', 'utf8');
  // Remove comment lines and split by semicolon
  const cleanSql = sql.split('\n').filter(line => !line.trim().startsWith('--')).join('\n');
  const statements = cleanSql.split(';').filter(s => s.trim());

  console.log('Running 006_rate_limiting.sql...\n');

  for (const stmt of statements) {
    if (stmt.trim()) {
      try {
        await turso.execute(stmt);
        console.log('✓', stmt.trim().split('\n')[0].substring(0, 60));
      } catch (err: unknown) {
        const error = err as Error;
        if (error.message.includes('already exists')) {
          console.log('⏭', stmt.trim().split('\n')[0].substring(0, 60), '(already exists)');
        } else {
          console.error('✗', error.message);
        }
      }
    }
  }

  // Verify
  const result = await turso.execute('SELECT name FROM sqlite_master WHERE type="table" AND name="rate_limits"');
  console.log('\nTable exists:', result.rows.length > 0 ? 'Yes' : 'No');
}

run().catch(console.error);
