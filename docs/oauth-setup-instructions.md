# OAuth Client Setup Instructions

## New Google Cloud Project Created

**Project**: `becoming-diamond-master`
**Project Number**: `307181021676`
**Account**: `support@becomingdiamond.com`

## Setup Steps

### 1. Configure OAuth Consent Screen

1. Go to: https://console.cloud.google.com/apis/credentials/consent?project=becoming-diamond-master

2. Click "CONFIGURE CONSENT SCREEN"

3. Select "External" (for public access)

4. Fill in the consent screen details:
   - **App name**: Becoming Diamond
   - **User support email**: support@becomingdiamond.com
   - **App logo**: (optional, can upload later)
   - **Application home page**: https://www.becomingdiamond.com
   - **Application privacy policy**: https://www.becomingdiamond.com/privacy
   - **Application terms of service**: https://www.becomingdiamond.com/terms
   - **Authorized domains**:
     - becomingdiamond.com
   - **Developer contact email**: support@becomingdiamond.com

5. Click "SAVE AND CONTINUE"

6. On the "Scopes" page:
   - Add scopes (if needed):
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
   - Click "SAVE AND CONTINUE"

7. On "Test users" page:
   - Click "SAVE AND CONTINUE"

8. Review and click "BACK TO DASHBOARD"

### 2. Create OAuth 2.0 Clients

Go to: https://console.cloud.google.com/apis/credentials?project=becoming-diamond-master

#### A. Production OAuth Client

1. Click "CREATE CREDENTIALS" → "OAuth client ID"
2. Configure:
   - **Application type**: Web application
   - **Name**: `Becoming Diamond - Production`
   - **Authorized JavaScript origins**:
     ```
     https://www.becomingdiamond.com
     ```
   - **Authorized redirect URIs**:
     ```
     https://www.becomingdiamond.com/api/auth/callback/google
     ```
3. Click "CREATE"
4. **SAVE THE CREDENTIALS**:
   - Client ID: `307181021676-XXXXXXX.apps.googleusercontent.com`
   - Client Secret: `GOCSPX-XXXXXXX`

#### B. Staging OAuth Client

1. Click "CREATE CREDENTIALS" → "OAuth client ID"
2. Configure:
   - **Application type**: Web application
   - **Name**: `Becoming Diamond - Staging`
   - **Authorized JavaScript origins**:
     ```
     https://staging.becomingdiamond.com
     ```
   - **Authorized redirect URIs**:
     ```
     https://staging.becomingdiamond.com/api/auth/callback/google
     ```
3. Click "CREATE"
4. **SAVE THE CREDENTIALS**:
   - Client ID: `307181021676-XXXXXXX.apps.googleusercontent.com`
   - Client Secret: `GOCSPX-XXXXXXX`

#### C. Development OAuth Client

1. Click "CREATE CREDENTIALS" → "OAuth client ID"
2. Configure:
   - **Application type**: Web application
   - **Name**: `Becoming Diamond - Development`
   - **Authorized JavaScript origins**:
     ```
     http://localhost:3003
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:3003/api/auth/callback/google
     ```
3. Click "CREATE"
4. **SAVE THE CREDENTIALS**:
   - Client ID: `307181021676-XXXXXXX.apps.googleusercontent.com`
   - Client Secret: `GOCSPX-XXXXXXX`

### 3. Update Environment Variables

#### Production (.env.production)

```bash
# Update these values
AUTH_GOOGLE_ID="<production-client-id>"
AUTH_GOOGLE_SECRET="<production-client-secret>"
```

#### Staging (.env.staging)

```bash
# Update these values
AUTH_GOOGLE_ID="<staging-client-id>"
AUTH_GOOGLE_SECRET="<staging-client-secret>"
```

#### Development (.env.local)

```bash
# Create this file if it doesn't exist
AUTH_GOOGLE_ID="<development-client-id>"
AUTH_GOOGLE_SECRET="<development-client-secret>"
```

### 4. Upload to Vercel

```bash
# Upload staging credentials
bash scripts/upload-env-to-vercel.sh preview .env.staging

# Upload production credentials
bash scripts/upload-env-to-vercel.sh production .env.production
```

### 5. Trigger Deployments

```bash
# Deploy to staging
git checkout staging
git commit --allow-empty -m "chore: trigger staging deployment with new OAuth"
git push origin staging

# Deploy to production
git checkout main
git commit --allow-empty -m "chore: trigger production deployment with new OAuth"
git push origin main
```

### 6. Test OAuth Flow

#### Test Staging
1. Visit: https://staging.becomingdiamond.com
2. Click "Sign In"
3. Select "Sign in with Google"
4. Verify successful authentication

#### Test Production
1. Visit: https://www.becomingdiamond.com
2. Click "Sign In"
3. Select "Sign in with Google"
4. Verify successful authentication

#### Test Local
1. Run: `npm run dev`
2. Visit: http://localhost:3003
3. Click "Sign In"
4. Select "Sign in with Google"
5. Verify successful authentication

## Quick Links

- **Credentials Page**: https://console.cloud.google.com/apis/credentials?project=becoming-diamond-master
- **Consent Screen**: https://console.cloud.google.com/apis/credentials/consent?project=becoming-diamond-master
- **Project Dashboard**: https://console.cloud.google.com/home/dashboard?project=becoming-diamond-master

## Security Best Practices

1. **Never commit OAuth secrets** to git (already in `.gitignore`)
2. **Rotate secrets every 90 days**
3. **Use separate clients** for each environment
4. **Review authorized domains** regularly
5. **Monitor OAuth usage** in Google Cloud Console
6. **Set up alerts** for unusual authentication activity

## Troubleshooting

### Error: "redirect_uri_mismatch"
- The redirect URI in the request doesn't match
- Solution: Add the exact URI shown in error to OAuth client

### Error: "invalid_client"
- Client ID or secret is incorrect
- Solution: Verify credentials match in .env files

### OAuth Loop (Continuous Redirects)
- `NEXTAUTH_URL` doesn't match deployment URL
- Solution: Ensure `NEXTAUTH_URL` is correct for each environment

## Notes

- Project number: `307181021676` (prefix for all client IDs)
- All OAuth clients start with: `307181021676-`
- This is separate from the old project (596915529062)
- **Migration Status (December 29, 2025)**: COMPLETE
  - All three environments successfully migrated to new OAuth clients
  - Production verified: `307181021676-m8l4b0dudkk59sn5ffej4s74ckse80sd`
  - Staging verified: `307181021676-jpq6a199e39po5uaomqbqqa81dhit4rt`
  - Development verified: `307181021676-e9ig7opv0hf20ohutre91cga8462i1bi`
  - Old OAuth client (917577831263) can now be safely disabled
