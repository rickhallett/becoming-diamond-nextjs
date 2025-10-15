#!/usr/bin/env tsx

/**
 * Verify Database Tables
 *
 * Lists all tables in the Turso database to verify migrations
 */

import { createClient } from "@libsql/client";
import { config } from "dotenv";

config({ path: ".env.local" });

async function verifyTables() {
  const turso = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  console.log("📊 Verifying database tables...\n");

  // Get all tables
  const result = await turso.execute(`
    SELECT name FROM sqlite_master
    WHERE type='table'
    ORDER BY name;
  `);

  console.log("Tables found:");
  for (const row of result.rows) {
    console.log(`  ✓ ${row.name}`);
  }

  console.log("\n📈 Getting table counts...\n");

  // Count records in each table
  for (const row of result.rows) {
    const tableName = row.name as string;
    const count = await turso.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
    console.log(`  ${tableName}: ${count.rows[0].count} records`);
  }

  console.log("\n✅ Database verification complete!");
}

verifyTables()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Verification failed:", error);
    process.exit(1);
  });
