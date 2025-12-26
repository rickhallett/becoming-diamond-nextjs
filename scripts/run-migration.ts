import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: join(process.cwd(), '.env.local') });

async function runMigration() {
  const turso = createClient({
    url: process.env.TURSO_DATABASE_URL || '',
    authToken: process.env.TURSO_AUTH_TOKEN || '',
  });

  // Get migration file from command line argument or default to book_orders
  const migrationFile = process.argv[2] || '001_create_book_orders.sql';
  const migrationPath = join(process.cwd(), 'migrations', migrationFile);

  console.log(`Running migration: ${migrationFile}`);
  const migrationSQL = readFileSync(migrationPath, 'utf-8');

  // Remove comments and split by semicolons
  const lines = migrationSQL.split('\n');
  const cleanedSQL = lines
    .filter(line => !line.trim().startsWith('--'))
    .join('\n');

  const statements = cleanedSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  console.log(`Executing ${statements.length} SQL statements...\n`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    try {
      await turso.execute(statement);
      console.log(`✓ [${i + 1}/${statements.length}] ${statement.substring(0, 60)}...`);
    } catch (error: any) {
      // Table already exists is OK
      if (error.message?.includes('already exists')) {
        console.log(`⚠ [${i + 1}/${statements.length}] Already exists: ${statement.substring(0, 60)}...`);
      } else {
        console.error(`✗ [${i + 1}/${statements.length}] Failed: ${statement.substring(0, 60)}...`);
        console.error('Error:', error.message);
        // Continue with other statements instead of stopping
      }
    }
  }

  console.log('Migration complete!');
  process.exit(0);
}

runMigration().catch(console.error);
