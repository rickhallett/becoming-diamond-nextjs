#!/usr/bin/env tsx

/**
 * Pre-deployment Environment Validation Script
 *
 * Validates that all critical environment variables are configured
 * before deployment. Run this before `npm run build` to catch
 * configuration errors early.
 *
 * Usage:
 *   npx tsx scripts/validate-env.ts
 *   npm run validate:env
 */

import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

interface ValidationResult {
  name: string;
  status: 'ok' | 'missing' | 'empty';
  required: boolean;
}

// Define all environment variables to check
const ENV_VARS = {
  // Database (Required)
  TURSO_DATABASE_URL: { required: true, description: 'Turso database URL' },
  TURSO_AUTH_TOKEN: { required: true, description: 'Turso authentication token' },

  // Authentication (Required)
  AUTH_SECRET: { required: true, description: 'NextAuth secret (min 32 chars)' },
  GMAIL_USER: { required: true, description: 'Gmail address for magic links' },
  GMAIL_APP_PASSWORD: { required: true, description: 'Gmail app password' },
  AUTH_GOOGLE_ID: { required: true, description: 'Google OAuth client ID' },
  AUTH_GOOGLE_SECRET: { required: true, description: 'Google OAuth client secret' },

  // Payments (Required)
  STRIPE_SECRET_KEY: { required: true, description: 'Stripe secret key' },
  STRIPE_WEBHOOK_SECRET: { required: true, description: 'Stripe webhook secret' },

  // Video Platform (Required for course content)
  BUNNY_STREAM_LIBRARY_ID: { required: true, description: 'Bunny Stream library ID' },
  BUNNY_STREAM_API_KEY: { required: true, description: 'Bunny Stream API key' },
  BUNNY_STREAM_CDN_HOSTNAME: { required: true, description: 'Bunny CDN hostname' },

  // CMS (Required for content management)
  GITHUB_CLIENT_ID: { required: true, description: 'GitHub OAuth client ID for CMS' },
  GITHUB_CLIENT_SECRET: { required: true, description: 'GitHub OAuth client secret for CMS' },

  // Admin (Required)
  ADMIN_EMAIL: { required: true, description: 'Admin email for docs-site access' },

  // Optional: GitHub Auth
  AUTH_GITHUB_ID: { required: false, description: 'GitHub OAuth client ID (optional)' },
  AUTH_GITHUB_SECRET: { required: false, description: 'GitHub OAuth client secret (optional)' },

  // Optional: Analytics
  AXIOM_DATASET: { required: false, description: 'Axiom dataset name' },
  AXIOM_TOKEN: { required: false, description: 'Axiom API token' },

  // Optional: Base URL
  NEXT_PUBLIC_BASE_URL: { required: false, description: 'Public base URL' },
};

function validateEnvironment(): ValidationResult[] {
  const results: ValidationResult[] = [];

  for (const [name, config] of Object.entries(ENV_VARS)) {
    const value = process.env[name];

    let status: 'ok' | 'missing' | 'empty';
    if (value === undefined) {
      status = 'missing';
    } else if (value.trim() === '') {
      status = 'empty';
    } else {
      status = 'ok';
    }

    results.push({
      name,
      status,
      required: config.required,
    });
  }

  return results;
}

function main() {
  console.log('Validating environment variables...\n');

  const results = validateEnvironment();

  // Group results
  const required = results.filter(r => r.required);
  const optional = results.filter(r => !r.required);

  // Check required variables
  console.log('Required Variables:');
  console.log('-------------------');

  let hasErrors = false;

  for (const result of required) {
    const config = ENV_VARS[result.name as keyof typeof ENV_VARS];
    if (result.status === 'ok') {
      console.log(`  [OK] ${result.name}`);
    } else {
      console.log(`  [MISSING] ${result.name} - ${config.description}`);
      hasErrors = true;
    }
  }

  console.log('\nOptional Variables:');
  console.log('-------------------');

  for (const result of optional) {
    const config = ENV_VARS[result.name as keyof typeof ENV_VARS];
    if (result.status === 'ok') {
      console.log(`  [OK] ${result.name}`);
    } else {
      console.log(`  [--] ${result.name} - ${config.description}`);
    }
  }

  console.log('');

  // Summary
  const missingRequired = required.filter(r => r.status !== 'ok');
  const missingOptional = optional.filter(r => r.status !== 'ok');

  if (hasErrors) {
    console.log('VALIDATION FAILED');
    console.log(`Missing ${missingRequired.length} required variable(s):\n`);

    for (const result of missingRequired) {
      const config = ENV_VARS[result.name as keyof typeof ENV_VARS];
      console.log(`  - ${result.name}: ${config.description}`);
    }

    console.log('\nPlease add these variables to your .env.local file.');
    console.log('See README.md for setup instructions.\n');

    process.exit(1);
  }

  console.log('VALIDATION PASSED');
  console.log(`All ${required.length} required variables are configured.`);

  if (missingOptional.length > 0) {
    console.log(`${missingOptional.length} optional variable(s) not configured.`);
  }

  console.log('');
  process.exit(0);
}

main();
