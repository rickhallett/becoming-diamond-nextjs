# OAuth Callback URL Verification Guide

## Google OAuth Configuration

### Current OAuth Client IDs

**Production/Staging (Shared)**:
- Client ID: `917577831263-fplvt9t2ad5rci4d00gu8tksrcid77j8.apps.googleusercontent.com`
- Project: `becoming-diamond`

### Required Callback URLs

The following authorized redirect URIs must be configured in the Google Cloud Console:

#### Production
```
https://www.becomingdiamond.com/api/auth/callback/google
```

#### Staging
```
https://staging.becomingdiamond.com/api/auth/callback/google
```

#### Local Development
```
http://localhost:3003/api/auth/callback/google
```

### Verification Steps

1. **Access Google Cloud Console**:
   - Go to: https://console.cloud.google.com/apis/credentials?project=becoming-diamond
   - Login with: `support@becomingdiamond.com`

2. **Locate OAuth 2.0 Client**:
   - Find the OAuth 2.0 Client ID: `917577831263-fplvt9t2ad5rci4d00gu8tksrcid77j8`
   - Click to edit

3. **Verify Authorized Redirect URIs**:
   Check that the following URIs are listed:
   - [x] `https://www.becomingdiamond.com/api/auth/callback/google`
   - [ ] `https://staging.becomingdiamond.com/api/auth/callback/google` (ADD THIS)
   - [x] `http://localhost:3003/api/auth/callback/google`

4. **Update if Needed**:
   - Click "Add URI" button
   - Add: `https://staging.becomingdiamond.com/api/auth/callback/google`
   - Click "Save"

### Recommended: Separate OAuth Apps for Each Environment

For better security and isolation, create separate OAuth apps:

#### Production OAuth App
- Name: `Becoming Diamond - Production`
- Authorized JavaScript origins:
  - `https://www.becomingdiamond.com`
- Authorized redirect URIs:
  - `https://www.becomingdiamond.com/api/auth/callback/google`

#### Staging OAuth App
- Name: `Becoming Diamond - Staging`
- Authorized JavaScript origins:
  - `https://staging.becomingdiamond.com`
- Authorized redirect URIs:
  - `https://staging.becomingdiamond.com/api/auth/callback/google`

#### Development OAuth App
- Name: `Becoming Diamond - Development`
- Authorized JavaScript origins:
  - `http://localhost:3003`
- Authorized redirect URIs:
  - `http://localhost:3003/api/auth/callback/google`

### After Creating Separate OAuth Apps

1. **Update Environment Variables**:

   **Production** (`.env.production`):
   ```bash
   AUTH_GOOGLE_ID=<production-client-id>
   AUTH_GOOGLE_SECRET=<production-client-secret>
   ```

   **Staging** (`.env.staging`):
   ```bash
   AUTH_GOOGLE_ID=<staging-client-id>
   AUTH_GOOGLE_SECRET=<staging-client-secret>
   ```

   **Local** (`.env.local`):
   ```bash
   AUTH_GOOGLE_ID=<development-client-id>
   AUTH_GOOGLE_SECRET=<development-client-secret>
   ```

2. **Upload to Vercel**:
   ```bash
   # Update staging
   bash scripts/upload-env-to-vercel.sh preview .env.staging

   # Update production
   bash scripts/upload-env-to-vercel.sh production .env.production
   ```

3. **Redeploy**:
   ```bash
   # Trigger staging deployment
   git push origin staging --force

   # Trigger production deployment
   git push origin main --force
   ```

### Testing OAuth Flow

#### Test Staging
1. Visit: https://staging.becomingdiamond.com
2. Click "Sign In"
3. Select "Sign in with Google"
4. Verify successful redirect after authentication

#### Test Production
1. Visit: https://www.becomingdiamond.com
2. Click "Sign In"
3. Select "Sign in with Google"
4. Verify successful redirect after authentication

### Troubleshooting

#### Error: "redirect_uri_mismatch"
- The redirect URI in the request doesn't match any authorized URIs
- Solution: Add the exact URI shown in the error to Google Cloud Console

#### Error: "invalid_client"
- The client ID or secret is incorrect
- Solution: Verify credentials match between `.env` files and Google Cloud Console

#### OAuth Loop (Continuous Redirects)
- `NEXTAUTH_URL` doesn't match the deployment URL
- Solution: Ensure `NEXTAUTH_URL` is:
  - Production: `https://www.becomingdiamond.com`
  - Staging: `https://staging.becomingdiamond.com`
  - Local: `http://localhost:3003`

### Current Status

- [x] Production OAuth configured
- [ ] Staging callback URL needs to be added
- [ ] Consider creating separate OAuth apps per environment

### Manual Verification Script

Use Chrome DevTools MCP to verify OAuth configuration:

```bash
# Navigate to Google Cloud Console
# Login with support@becomingdiamond.com
# Check OAuth client settings
# Verify redirect URIs
```

### Security Best Practices

1. **Use separate OAuth apps per environment** (prod, staging, dev)
2. **Rotate OAuth secrets every 90 days**
3. **Restrict authorized domains** to only your verified domains
4. **Enable 2FA** on Google Cloud account
5. **Review OAuth scopes** - only request what's needed
6. **Monitor OAuth usage** in Google Cloud Console
7. **Use environment-specific client IDs/secrets**

### References

- NextAuth.js Google Provider: https://next-auth.js.org/providers/google
- Google OAuth 2.0: https://developers.google.com/identity/protocols/oauth2
- Vercel Environment Variables: https://vercel.com/docs/environment-variables
