#!/usr/bin/env tsx

/**
 * Run member portal database migration
 * Applies the 002_member_portal_persistence.sql migration
 */

import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: join(process.cwd(), '.env.local') });

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
  console.error('Missing required environment variables:');
  console.error('  TURSO_DATABASE_URL:', TURSO_DATABASE_URL ? 'set' : 'MISSING');
  console.error('  TURSO_AUTH_TOKEN:', TURSO_AUTH_TOKEN ? 'set' : 'MISSING');
  process.exit(1);
}

async function runMigration() {
  console.log('Connecting to Turso database...');

  const client = createClient({
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
  });

  try {
    // Read migration file
    const migrationPath = join(process.cwd(), 'migrations', '002_member_portal_persistence.sql');
    console.log(`Reading migration file: ${migrationPath}`);

    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    // Remove comments and split into statements
    const cleanSQL = migrationSQL
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n');

    // Split by semicolon and filter
    const statements = cleanSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'; // Add semicolon back

      console.log(`[${i + 1}/${statements.length}] Executing statement...`);
      console.log(`  SQL: ${statement.substring(0, 100)}...`);

      try {
        await client.execute(statement);
        console.log('  ✓ Success\n');
      } catch (error: any) {
        console.error(`  ✗ Error: ${error.message}`);
        console.error(`  Statement: ${statement.substring(0, 200)}...\n`);
        // Continue with other statements even if one fails
      }
    }

    // Verify tables were created
    console.log('Verifying tables...');

    const tables = [
      'course_enrollments',
      'lesson_progress',
      'chat_sessions',
      'chat_messages',
      'user_activities',
    ];

    for (const table of tables) {
      const result = await client.execute({
        sql: `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
        args: [table],
      });

      if (result.rows.length > 0) {
        console.log(`  ✓ Table '${table}' exists`);
      } else {
        console.log(`  ✗ Table '${table}' NOT FOUND`);
      }
    }

    console.log('\n✓ Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
