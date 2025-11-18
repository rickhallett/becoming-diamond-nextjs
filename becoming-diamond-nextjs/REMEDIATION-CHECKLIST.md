# Credential Validation Remediation Checklist

## File-by-File Implementation Guide

### 1. src/lib/turso.ts
- [ ] Add validation at top of file
- [ ] Check TURSO_DATABASE_URL is not empty
- [ ] Check TURSO_AUTH_TOKEN is not empty
- [ ] Replace empty string fallback with explicit throw
- [ ] Test that app fails to start without credentials

### 2. auth.ts
- [ ] Add validation block at module top
- [ ] Check GMAIL_USER is set
- [ ] Check GMAIL_APP_PASSWORD is set
- [ ] Check AUTH_GOOGLE_ID is set
- [ ] Check AUTH_GOOGLE_SECRET is set
- [ ] Replace non-null assertions (!) with checked values
- [ ] Handle AUTH_GITHUB_ID/SECRET (conditional on feature flag)
- [ ] Test each provider with missing credentials

### 3. src/lib/gmail-smtp.ts
- [ ] Review getGmailTransporter() function
- [ ] Consider moving validation to module top (optional improvement)
- [ ] Ensure FROM_EMAIL and ADMIN_EMAIL not assigned null
- [ ] Add null check before using in email payload

### 4. src/app/api/stripe/webhook/route.ts
- [ ] Add validation for STRIPE_SECRET_KEY
- [ ] Add validation for STRIPE_WEBHOOK_SECRET
- [ ] Support both TEST and production variable names
- [ ] Ensure WEBHOOK_SECRET checked before use (it is, but make explicit)
- [ ] Test webhook with missing credentials

### 5. src/app/api/stripe/checkout/route.ts
- [ ] Add validation for STRIPE_SECRET_KEY (use proper pattern)
- [ ] Ensure at least one STRIPE_PRICE_* configured
- [ ] Remove empty string fallback from Stripe initialization
- [ ] Test checkout with missing price IDs

### 6. src/app/api/cms-auth/route.ts
- [ ] Remove empty string fallbacks
- [ ] Add explicit validation for GITHUB_CLIENT_ID
- [ ] Add explicit validation for GITHUB_CLIENT_SECRET
- [ ] Test CMS auth with missing GitHub credentials

### 7. auth.config.ts
- [ ] Remove hardcoded fallback "support@becomingdiamond.com"
- [ ] Add explicit validation for ADMIN_EMAIL
- [ ] Require explicit configuration (fail-fast)
- [ ] Test that admin routes fail if ADMIN_EMAIL not set

### 8. src/app/api/video/[videoId]/token/route.ts
- [ ] Add validation at module top (not just non-null assertions)
- [ ] Check BUNNY_STREAM_LIBRARY_ID
- [ ] Check BUNNY_STREAM_API_KEY
- [ ] Check BUNNY_STREAM_CDN_HOSTNAME
- [ ] Test video token endpoint with missing credentials

---

## Centralized Validation Module

### Create src/lib/validate-credentials.ts
- [ ] Define all critical credential names
- [ ] Create validation function
- [ ] Return helpful error messages
- [ ] Include examples of missing credentials

### Call from instrumentation.ts
- [ ] Import validateCriticalCredentials
- [ ] Call in register() before app initialization
- [ ] Test that app fails to start without credentials

---

## Testing Checklist

### Unit Tests
- [ ] Create src/test/unit/lib/credential-validation.test.ts
- [ ] Test each critical credential validation
- [ ] Test with missing credentials
- [ ] Test with empty string credentials
- [ ] Test error messages are descriptive

### Integration Tests
- [ ] Test app fails to start with missing TURSO credentials
- [ ] Test app fails to start with missing STRIPE credentials
- [ ] Test app fails to start with missing AUTH credentials
- [ ] Test CMS endpoint fails with missing GitHub credentials
- [ ] Test video endpoint fails with missing Bunny credentials

### Manual Testing
- [ ] Remove TURSO_DATABASE_URL from .env.local
- [ ] Verify app fails to start with clear error
- [ ] Restore TURSO_DATABASE_URL
- [ ] Remove STRIPE_SECRET_KEY
- [ ] Verify app fails to start with clear error
- [ ] Restore STRIPE_SECRET_KEY
- [ ] Remove ADMIN_EMAIL
- [ ] Verify app fails to start with clear error

---

## Pre-Deployment Validation

### Create scripts/validate-credentials.sh
- [ ] Check all critical env vars are set
- [ ] Provide clear list of missing variables
- [ ] Return non-zero exit code if any missing
- [ ] Make script executable

### Add to deployment pipeline
- [ ] Call validation script before npm run build
- [ ] Call validation script before npm start
- [ ] Fail deployment if validation fails

---

## Documentation Updates

### README.md
- [ ] Add section: "Required Environment Variables"
- [ ] List all critical credentials
- [ ] Include descriptions and examples
- [ ] Link to environment setup guide

### .env.example
- [ ] Add all critical credentials (with empty values)
- [ ] Add all optional credentials (marked as optional)
- [ ] Include descriptions for each variable

### CLAUDE.md
- [ ] Add section: "Credential Handling Best Practices"
- [ ] Document fail-fast pattern
- [ ] Include examples of correct vs incorrect patterns

---

## Validation Results

### Before Remediation
- [ ] 9 credentials with empty string fallback
- [ ] 4 credentials with non-null assertions
- [ ] 0 files with centralized validation
- [ ] 0 pre-deployment checks
- [ ] Silent failures on misconfiguration

### After Remediation
- [ ] 0 credentials with empty string fallback
- [ ] 0 credentials with non-null assertions
- [ ] 1 centralized validation module
- [ ] Pre-deployment validation script
- [ ] Fail-fast on startup for all critical credentials

---

## Sign-Off

Once complete, verify:

- [ ] All files follow fail-fast pattern
- [ ] Centralized validation module created
- [ ] Tests passing for credential validation
- [ ] Pre-deployment script created and tested
- [ ] Documentation updated
- [ ] Manual testing completed
- [ ] Ready for production deployment

---

## Quick Reference: Before and After

### BEFORE (Dangerous)
```typescript
// src/lib/turso.ts
export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN || '',
});
```

### AFTER (Safe)
```typescript
// src/lib/turso.ts
if (!process.env.TURSO_DATABASE_URL) {
  throw new Error('TURSO_DATABASE_URL environment variable is required');
}
if (!process.env.TURSO_AUTH_TOKEN) {
  throw new Error('TURSO_AUTH_TOKEN environment variable is required');
}

export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
```

---

## Notes

- Non-null assertions (!) are TypeScript-only and provide ZERO runtime safety
- Empty string fallbacks mask configuration errors until production
- Fail-fast at module load time is the recommended pattern
- Centralized validation reduces code duplication
- Pre-deployment validation catches issues before they reach production

