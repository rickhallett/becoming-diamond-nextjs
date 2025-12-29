# OAuth Project Investigation

## Issue Found

The OAuth client ID used in the application does **NOT** match the Google Cloud project we have access to.

### Current Application OAuth Client ID
```
917577831263-fplvt9t2ad5rci4d00gu8tksrcid77j8.apps.googleusercontent.com
```
- Project Number: **917577831263**

### Google Cloud Project We Have Access To
- Project ID: `becoming-diamond`
- Project Number: **596915529062**
- Account: `support@becomingdiamond.com`

### Available Client IDs in `becoming-diamond` Project
1. `596915529062-l6h0c9gch7dr7da2b19cu18rcu25u8n2.apps.googleusercontent.com`
2. `596915529062-8ahslk3logachtijkcjbgu3uk78i4u4q.apps.googleusercontent.com`
3. `596915529062-dsbkmvbildbadn9nu2aqqc8ejlopfc55.apps.googleusercontent.com`

## Possible Scenarios

### Scenario 1: Different Google Account
The OAuth app (917577831263) might be under a different Google account (not `support@becomingdiamond.com`)

**To Find**:
1. Check if there's another Google account associated with the project
2. Look for emails like:
   - `admin@becomingdiamond.com`
   - `dev@becomingdiamond.com`
   - Personal Gmail account of the developer

### Scenario 2: Different Project Name
The OAuth app might be in a Google Cloud project with a different name

**To Find**:
1. Login to Google Cloud Console with `support@becomingdiamond.com`
2. Click project dropdown (top left)
3. Look for other projects
4. Search for project number: 917577831263

### Scenario 3: OAuth App Created by Different Owner
Someone else might have created this OAuth app and shared the credentials

**To Find**:
1. Check with the team/developer who set up the initial authentication
2. Check for documentation or notes about OAuth setup
3. Review commit history for when AUTH_GOOGLE_ID was first added

## Recommended Actions

### Option A: Find the Existing OAuth App (Preferred)
1. **Try to locate the project**:
   - Login to https://console.cloud.google.com with `support@becomingdiamond.com`
   - Click "Select a project" dropdown
   - Look for all available projects
   - Search for project number: 917577831263

2. **Check for other Google accounts**:
   - Review `.env.agent` for other email accounts
   - Check password manager for Google Cloud credentials
   - Ask team members if they know which account was used

3. **Verify OAuth app is working**:
   ```bash
   # Test production OAuth
   curl https://www.becomingdiamond.com/api/auth/signin
   ```

### Option B: Create New OAuth Apps (Alternative)
If we can't find the existing OAuth app, create new ones in the `becoming-diamond` project:

1. **Use one of the existing client IDs** from the project (596915529062)
2. **Or create new OAuth apps**:
   - Production: `Becoming Diamond - Production`
   - Staging: `Becoming Diamond - Staging`
   - Development: `Becoming Diamond - Development`

3. **Update environment variables**:
   ```bash
   # Update .env.production
   AUTH_GOOGLE_ID="596915529062-XXXXX.apps.googleusercontent.com"
   AUTH_GOOGLE_SECRET="GOCSPX-XXXXX"

   # Upload to Vercel
   bash scripts/upload-env-to-vercel.sh production .env.production
   ```

4. **Configure authorized redirect URIs**:
   - Production: `https://www.becomingdiamond.com/api/auth/callback/google`
   - Staging: `https://staging.becomingdiamond.com/api/auth/callback/google`
   - Development: `http://localhost:3003/api/auth/callback/google`

## Testing OAuth Configuration

### Test if Current OAuth Still Works
```bash
# Check production
curl -I https://www.becomingdiamond.com/api/auth/signin

# Try to sign in manually
# Visit: https://www.becomingdiamond.com
# Click "Sign In"
# Try Google OAuth
```

### If OAuth is Working
- The existing OAuth app (917577831263) is still active and functional
- We just need to find which Google account/project it belongs to
- Priority: Locate the account to add staging callback URL

### If OAuth is NOT Working
- We need to create new OAuth apps immediately
- Use the `becoming-diamond` project (596915529062)
- Update all environment variables

## Next Steps

1. **Immediate**: Test if current production OAuth works
2. **High Priority**: Locate the Google account/project for client ID 917577831263
3. **Fallback**: Prepare to create new OAuth apps if needed
4. **Document**: Once found, update .env.agent with correct account info

## Questions to Answer

- [ ] Is production OAuth currently working?
- [ ] Can you access Google Cloud Console with support@becomingdiamond.com?
- [ ] Do you see multiple projects in the project dropdown?
- [ ] Is there another Google account with access to the OAuth apps?
- [ ] When was the AUTH_GOOGLE_ID first added to the project?

## Commands to Run

```bash
# Check git history for when AUTH_GOOGLE_ID was added
git log -p --all -S "917577831263" | head -50

# Check if there are other email accounts referenced
grep -r "@.*\.com" .env.agent | grep -v "becomingdiamond"

# Test current production OAuth
curl -v https://www.becomingdiamond.com/api/auth/signin 2>&1 | grep -i "location\|redirect"
```

## Resources

- Google Cloud Console: https://console.cloud.google.com
- OAuth 2.0 Playground: https://developers.google.com/oauthplayground
- NextAuth.js Docs: https://next-auth.js.org/providers/google
