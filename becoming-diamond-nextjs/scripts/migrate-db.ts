#!/usr/bin/env tsx

/**
 * Database Migration Runner for Turso
 *
 * Runs SQL migration files from the migrations/ directory
 * in order (based on filename sorting).
 *
 * Usage:
 *   npm run db:migrate
 */

import { createClient } from "@libsql/client";
import * as fs from "fs";
import * as path from "path";

// Load environment variables
import { config } from "dotenv";
config({ path: ".env.local" });

async function runMigrations() {
  // Check for required environment variables
  if (!process.env.DATABASE_URL) {
    console.error("❌ ERROR: DATABASE_URL environment variable is not set");
    process.exit(1);
  }

  if (!process.env.DATABASE_AUTH_TOKEN) {
    console.error("❌ ERROR: DATABASE_AUTH_TOKEN environment variable is not set");
    process.exit(1);
  }

  // Create Turso client
  const turso = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  console.log("🔄 Starting database migrations...\n");

  // Get migration files
  const migrationsDir = path.join(process.cwd(), "migrations");

  if (!fs.existsSync(migrationsDir)) {
    console.error(`❌ ERROR: Migrations directory not found: ${migrationsDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(migrationsDir).filter(file => file.endsWith(".sql")).sort();

  if (files.length === 0) {
    console.log("⚠️  No migration files found in migrations/ directory");
    return;
  }

  console.log(`Found ${files.length} migration file(s):\n`);

  // Run each migration file
  for (const file of files) {
    console.log(`📄 Running migration: ${file}`);

    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, "utf-8");

    // Remove comments and split by semicolon
    const cleanSql = sql
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n');

    const statements = cleanSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    let statementCount = 0;

    for (const statement of statements) {
      try {
        await turso.execute(statement);
        statementCount++;
      } catch (error) {
        console.error(`\n❌ ERROR executing statement in ${file}:`);
        console.error(`Statement: ${statement.substring(0, 200)}...`);
        console.error(`Error: ${error}`);
        process.exit(1);
      }
    }

    console.log(`   ✓ Executed ${statementCount} statement(s)\n`);
  }

  console.log("✅ All migrations completed successfully!");
}

// Run migrations
runMigrations()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Migration failed:");
    console.error(error);
    process.exit(1);
  });
