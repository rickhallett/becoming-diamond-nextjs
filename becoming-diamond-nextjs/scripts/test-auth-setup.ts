#!/usr/bin/env tsx

/**
 * Authentication Setup Test Script
 *
 * Verifies that all authentication components are properly configured.
 * Run with: npm run test:auth
 */

import { config } from "dotenv";
import { createClient } from "@libsql/client";
import * as fs from "fs";
import * as path from "path";

config({ path: ".env.local" });

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

const results: TestResult[] = [];

function test(name: string, condition: boolean, message: string) {
  results.push({ name, passed: condition, message });
  const icon = condition ? "✅" : "❌";
  console.log(`${icon} ${name}: ${message}`);
}

async function runTests() {
  console.log("🔍 Testing NextAuth.js Authentication Setup\n");

  // Test 1: Environment Variables
  console.log("📋 Checking Environment Variables...\n");

  test(
    "AUTH_SECRET",
    !!process.env.AUTH_SECRET && process.env.AUTH_SECRET.length >= 32,
    process.env.AUTH_SECRET
      ? `Set (${process.env.AUTH_SECRET.length} characters)`
      : "Missing - generate with: openssl rand -base64 32"
  );

  test(
    "AUTH_URL",
    !!process.env.AUTH_URL,
    process.env.AUTH_URL || "Missing - should be http://localhost:3003"
  );

  test(
    "AUTH_RESEND_KEY",
    !!process.env.AUTH_RESEND_KEY,
    process.env.AUTH_RESEND_KEY?.substring(0, 15) + "..." || "Missing - get from resend.com"
  );

  test(
    "AUTH_GOOGLE_ID",
    !!process.env.AUTH_GOOGLE_ID,
    process.env.AUTH_GOOGLE_ID
      ? process.env.AUTH_GOOGLE_ID.substring(0, 20) + "..."
      : "Missing - create Google OAuth app"
  );

  test(
    "AUTH_GOOGLE_SECRET",
    !!process.env.AUTH_GOOGLE_SECRET,
    process.env.AUTH_GOOGLE_SECRET
      ? process.env.AUTH_GOOGLE_SECRET.substring(0, 15) + "..."
      : "Missing - create Google OAuth app"
  );

  test(
    "AUTH_GITHUB_ID",
    !!process.env.AUTH_GITHUB_ID,
    process.env.AUTH_GITHUB_ID
      ? process.env.AUTH_GITHUB_ID.substring(0, 20) + "..."
      : "Missing - create GitHub OAuth app"
  );

  test(
    "AUTH_GITHUB_SECRET",
    !!process.env.AUTH_GITHUB_SECRET,
    process.env.AUTH_GITHUB_SECRET
      ? process.env.AUTH_GITHUB_SECRET.substring(0, 15) + "..."
      : "Missing - create GitHub OAuth app"
  );

  test(
    "DATABASE_URL",
    !!process.env.DATABASE_URL,
    process.env.DATABASE_URL
      ? process.env.DATABASE_URL.substring(0, 30) + "..."
      : "Missing - configure Turso database"
  );

  test(
    "DATABASE_AUTH_TOKEN",
    !!process.env.DATABASE_AUTH_TOKEN,
    process.env.DATABASE_AUTH_TOKEN
      ? process.env.DATABASE_AUTH_TOKEN.substring(0, 15) + "..."
      : "Missing - configure Turso database"
  );

  // Test 2: File Structure
  console.log("\n📁 Checking File Structure...\n");

  const requiredFiles = [
    "auth.ts",
    "auth.config.ts",
    "middleware.ts",
    "migrations/001_create_auth_tables.sql",
    "src/lib/turso-adapter.ts",
    "src/app/api/auth/[...nextauth]/route.ts",
    "src/app/auth/signin/page.tsx",
    "src/app/auth/error/page.tsx",
    "src/app/auth/verify-request/page.tsx",
    "src/app/providers.tsx",
    "src/components/auth/SignOutButton.tsx",
    "src/components/auth/UserAvatar.tsx",
    "types/next-auth.d.ts",
  ];

  for (const file of requiredFiles) {
    const filePath = path.join(process.cwd(), file);
    const exists = fs.existsSync(filePath);
    test(
      file,
      exists,
      exists ? "Found" : "Missing"
    );
  }

  // Test 3: Database Connection
  console.log("\n🗄️  Testing Database Connection...\n");

  if (process.env.DATABASE_URL && process.env.DATABASE_AUTH_TOKEN) {
    try {
      const turso = createClient({
        url: process.env.DATABASE_URL,
        authToken: process.env.DATABASE_AUTH_TOKEN,
      });

      const result = await turso.execute("SELECT 1 as test");
      test(
        "Database Connection",
        result.rows.length === 1,
        "Successfully connected to Turso"
      );

      // Check if tables exist
      const tables = await turso.execute(
        "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
      );

      const tableNames = tables.rows.map((row) => row.name as string);
      const requiredTables = ["users", "accounts", "sessions", "verification_tokens", "user_profiles"];

      for (const tableName of requiredTables) {
        test(
          `Table: ${tableName}`,
          tableNames.includes(tableName),
          tableNames.includes(tableName)
            ? "Exists"
            : "Missing - run: npm run db:migrate"
        );
      }
    } catch (error) {
      test(
        "Database Connection",
        false,
        `Failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  } else {
    test(
      "Database Connection",
      false,
      "Skipped - DATABASE_URL or DATABASE_AUTH_TOKEN not set"
    );
  }

  // Test 4: Package Dependencies
  console.log("\n📦 Checking Dependencies...\n");

  const packageJson = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "package.json"), "utf-8")
  );

  const requiredDeps = [
    "next-auth",
    "resend",
    "@libsql/client",
    "tsx",
    "dotenv",
  ];

  for (const dep of requiredDeps) {
    const installed =
      packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep];
    test(
      `Dependency: ${dep}`,
      !!installed,
      installed ? `Installed (${installed})` : "Missing"
    );
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  const passed = results.filter((r) => r.passed).length;
  const total = results.length;
  const percentage = Math.round((passed / total) * 100);

  console.log(`\n📊 Test Results: ${passed}/${total} passed (${percentage}%)\n`);

  if (percentage === 100) {
    console.log("🎉 All checks passed! Authentication setup is complete.");
    console.log("\n✅ Next steps:");
    console.log("   1. Start dev server: npm run dev");
    console.log("   2. Navigate to: http://localhost:3003/app");
    console.log("   3. Test sign-in flows");
    console.log("\n📖 See AUTH_SETUP.md for detailed testing instructions");
  } else {
    console.log("⚠️  Some checks failed. Please review the issues above.\n");
    console.log("📖 See AUTH_SETUP.md for setup instructions");

    const failedTests = results.filter((r) => !r.passed);
    if (failedTests.length > 0) {
      console.log("\n❌ Failed checks:");
      failedTests.forEach((t) => {
        console.log(`   - ${t.name}: ${t.message}`);
      });
    }
  }

  console.log("\n" + "=".repeat(60) + "\n");
}

runTests()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Test script error:");
    console.error(error);
    process.exit(1);
  });
