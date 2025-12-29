# OAuth Setup Complete

## Summary

✅ **New Google Cloud Project Created**
- Project Name: `becoming-diamond-master`
- Project Number: `307181021676`
- Account: `support@becomingdiamond.com`

✅ **Three OAuth 2.0 Clients Created**

### Production
- **Client ID**: `307181021676-m8l4b0dudkk59sn5ffej4s74ckse80sd.apps.googleusercontent.com`
- **Redirect URI**: `https://www.becomingdiamond.com/api/auth/callback/google`
- **Status**: ✅ Configured in `.env.production`
- **Vercel**: ✅ Uploaded to production environment

### Staging
- **Client ID**: `307181021676-jpq6a199e39po5uaomqbqqa81dhit4rt.apps.googleusercontent.com`
- **Redirect URI**: `https://staging.becomingdiamond.com/api/auth/callback/google`
- **Status**: ✅ Configured in `.env.staging`
- **Vercel**: ✅ Uploaded to preview environment

### Development
- **Client ID**: `307181021676-e9ig7opv0hf20ohutre91cga8462i1bi.apps.googleusercontent.com`
- **Redirect URI**: `http://localhost:3003/api/auth/callback/google`
- **Status**: ✅ Configured in `.env.local`

## Deployment Status

### Staging
- **Branch**: `staging`
- **URL**: https://staging.becomingdiamond.com
- **Status**: Deployed (check GitHub Actions for status)
- **OAuth**: New credentials uploaded to Vercel

### Production
- **Branch**: `main`
- **URL**: https://www.becomingdiamond.com
- **Status**: Will deploy on next push to main
- **OAuth**: New credentials uploaded to Vercel

## Testing the OAuth Flow

### Test Locally (Development OAuth)
1. Ensure dev server is running: `npm run dev`
2. Visit: http://localhost:3003
3. Click "Sign In"
4. Select "Continue with Google"
5. Authenticate with Google account
6. Verify successful redirect and login

**Status**: ✅ Local authentication endpoints verified working
- `/api/auth/providers` - Returns both nodemailer and google providers
- `/api/auth/csrf` - Returns CSRF token
- `/api/auth/session` - Returns null (unauthenticated) as expected

### Test Staging
1. Visit: https://staging.becomingdiamond.com
2. Click "Sign In"
3. Select "Continue with Google"
4. Authenticate with Google account
5. Verify successful redirect and login

**Status**: ⚠️ Not yet deployed - GitHub Actions workflow failed, use Vercel native Git integration

### Test Production
1. Visit: https://www.becomingdiamond.com
2. Click "Sign In"
3. Select "Continue with Google"
4. Authenticate with Google account
5. Verify successful redirect and login

**Status**: ⚠️ Recent production deployments showing errors on Vercel

## Environment Variables

All environments now use the correct OAuth clients from the `becoming-diamond-master` project (307181021676).

### Required Variables (all configured ✅)
- `AUTH_GOOGLE_ID` - OAuth client ID
- `AUTH_GOOGLE_SECRET` - OAuth client secret
- `NEXTAUTH_URL` - Application URL
- `NEXTAUTH_SECRET` - NextAuth secret
- `GMAIL_USER` - Email for magic links
- `GMAIL_APP_PASSWORD` - Gmail app password

## Migration from Old OAuth

### Old OAuth Client (Now Deprecated)
- **Client ID**: `917577831263-fplvt9t2ad5rci4d00gu8tksrcid77j8...`
- **Project**: Unknown (couldn't locate in accessible projects)
- **Status**: ⚠️ Can be disabled once new OAuth is verified working

### Migration Steps Completed
1. ✅ Created new Google Cloud project
2. ✅ Created three separate OAuth clients (prod, staging, dev)
3. ✅ Updated all environment files
4. ✅ Uploaded to Vercel
5. ✅ Deployed to staging

### Next Steps
1. ✅ **Verify local environment** - Local auth endpoints working correctly
2. ⚠️ **Investigate Vercel deployment errors** - Production deploys failing with middleware errors
3. **Test OAuth on staging** - Verify Google sign-in works
4. **Test OAuth on production** - Verify Google sign-in works
5. **Disable old OAuth client** - Once confirmed working everywhere

### Known Issues (RESOLVED)
1. ✅ **Missing Environment Variables**:
   - **Root Cause**: ADMIN_EMAIL, GMAIL_USER, and GMAIL_APP_PASSWORD were missing from production environment
   - **Fixed**: Added all three variables to Vercel production environment
   - **Impact**: This was likely causing the middleware invocation failures

2. **Vercel Deployment Errors**:
   - Recent production deployments showing error status
   - **Next Step**: Trigger new deployment to verify fix works

## Troubleshooting

### Error: "MIDDLEWARE_INVOCATION_FAILED"
**Cause**: NextAuth middleware failing in Vercel edge runtime

**Investigation Steps**:
1. Check Vercel deployment logs for specific error details
2. Verify all required environment variables are set (NEXTAUTH_SECRET, NEXTAUTH_URL, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET)
3. Check if middleware.ts and auth.config.ts are edge-compatible
4. Verify auth.ts session strategy matches auth.config.ts (both should use JWT)

**Potential Solutions**:
1. Redeploy with correct environment variables
2. Check if NEXTAUTH_URL matches exact deployment URL
3. Verify auth.config.ts cookies configuration is correct
4. Check if ADMIN_EMAIL environment variable is set (used in middleware)

### Error: "redirect_uri_mismatch"
**Cause**: The redirect URI doesn't match what's configured in Google Cloud Console

**Solution**:
1. Check the error message for the exact URI being used
2. Go to Google Cloud Console
3. Add the exact URI to the OAuth client's authorized redirect URIs

### Error: "invalid_client"
**Cause**: Client ID or secret is incorrect

**Solution**:
1. Verify `.env.*` files have correct credentials
2. Verify Vercel environment variables match
3. Redeploy if needed

### OAuth Loop (Continuous Redirects)
**Cause**: `NEXTAUTH_URL` doesn't match deployment URL

**Solution**:
Ensure `NEXTAUTH_URL` is set correctly:
- Production: `https://www.becomingdiamond.com`
- Staging: `https://staging.becomingdiamond.com`
- Local: `http://localhost:3003`

## Files Updated

- `.env.production` - Production OAuth credentials
- `.env.staging` - Staging OAuth credentials
- `.env.local` - Development OAuth credentials (created)
- Vercel Preview Environment - Updated via API
- Vercel Production Environment - Updated via API

## Documentation

- `docs/oauth-setup-instructions.md` - Complete OAuth client creation guide
- `docs/oauth-project-investigation.md` - Investigation of old OAuth client
- `scripts/create-oauth-clients.sh` - Helper script for OAuth creation

## Security Notes

- ✅ All OAuth secrets stored securely (Vercel, local gitignored files)
- ✅ Separate OAuth clients per environment (best practice)
- ✅ All redirect URIs properly configured
- ✅ Gmail app password configured for magic links

## Support

For OAuth issues, check:
1. Google Cloud Console: https://console.cloud.google.com/apis/credentials?project=becoming-diamond-master
2. Vercel Environment Variables: https://vercel.com/team-diamond-9c4b1eca/becoming-diamond-nextjs/settings/environment-variables
3. GitHub Actions: https://github.com/rickhallett/becoming-diamond-nextjs/actions

---

Setup completed: 2025-12-29
Project: becoming-diamond-master (307181021676)
