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

  const migrationPath = join(process.cwd(), 'migrations', '000_consolidated_schema.sql');
  const migrationSQL = readFileSync(migrationPath, 'utf-8');

  // Split by semicolons and execute each statement
  const statements = migrationSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`Executing ${statements.length} SQL statements...`);

  for (const statement of statements) {
    try {
      await turso.execute(statement);
      console.log('✓ Statement executed');
    } catch (error) {
      console.error('Error executing statement:', error);
      console.error('Statement:', statement.substring(0, 100) + '...');
    }
  }

  console.log('Migration complete!');
  process.exit(0);
}

runMigration().catch(console.error);
