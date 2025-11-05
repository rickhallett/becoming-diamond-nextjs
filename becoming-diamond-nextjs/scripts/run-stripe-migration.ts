import { config } from 'dotenv';
import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local
config({ path: path.join(process.cwd(), '.env.local') });

// Create Turso client after env vars are loaded
const turso = createClient({
  url: process.env.TURSO_DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN || '',
});

async function runStripeMigration() {
  console.log('Running Stripe payments migration...\n');

  const migrationPath = path.join(process.cwd(), 'migrations', '004_stripe_payments.sql');

  if (!fs.existsSync(migrationPath)) {
    console.error('Migration file not found:', migrationPath);
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationPath, 'utf-8');

  // Split by semicolon, remove comments, and filter out empty statements
  const statements = sql
    .split(';')
    .map(s => {
      // Remove comment lines that start with --
      const lines = s.split('\n').filter(line => !line.trim().startsWith('--'));
      return lines.join('\n').trim();
    })
    .filter(s => s.length > 0);

  try {
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      const preview = statement.substring(0, 80).replace(/\s+/g, ' ');
      console.log(`[${i + 1}/${statements.length}] Executing: ${preview}...`);

      try {
        await turso.execute(statement);
      } catch (error: any) {
        console.error(`Failed at statement ${i + 1}:`, statement.substring(0, 200));
        throw error;
      }
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('\nTables created:');
    console.log('  • payments');
    console.log('  • subscriptions');
    console.log('  • webhook_events');
    console.log('\nIndexes created:');
    console.log('  • 10 indexes for query performance');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

runStripeMigration();
