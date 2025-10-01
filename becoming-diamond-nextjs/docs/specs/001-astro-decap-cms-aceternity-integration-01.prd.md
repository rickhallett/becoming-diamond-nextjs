# PRD 001-01: Decap CMS Integration with GitHub OAuth

**Version:** 1.0
**Date:** 2025-10-01
**Parent PRD:** 001-astro-decap-cms-aceternity-integration
**Status:** Ready for Implementation
**Estimated Complexity:** Medium
**Duration:** 4-6 hours

---

## 1. Scope

This chunk adds Decap CMS integration with GitHub OAuth authentication to the existing Astro project. The focus is on establishing a working CMS admin interface that can be accessed at `/admin` with proper authentication.

### What's Included
- Decap CMS installation and configuration
- GitHub OAuth integration using `astro-decap-cms-oauth`
- Vercel adapter for server-side rendering
- Admin interface setup
- Basic content collection for pages
- Environment variable configuration
- OAuth flow testing

### What's NOT Included
- React components (saved for chunk 02)
- Aceternity UI components (saved for chunk 02)
- Complex animations (saved for chunk 03)
- Production deployment (saved for chunk 04)
- Content management beyond basic pages collection

### Dependencies
**Requires:** PRD 001-00 (Project Foundation) to be completed
**Blocks:** PRD 001-02 (UI Components)

---

## 2. Requirements

### 2.1 Additional Dependencies

Add to existing `package.json`:
```json
{
  "dependencies": {
    "@astrojs/vercel": "^8.2.7",
    "astro-decap-cms-oauth": "^0.5.1",
    "decap-cms": "^3.8.3"
  }
}
```

### 2.2 Astro Configuration Update

**astro.config.mjs:**
```javascript
import { defineConfig } from "astro/config";
import decapCmsOauth from "astro-decap-cms-oauth";
import vercel from "@astrojs/vercel";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "server", // Enable SSR for OAuth
  adapter: vercel(),
  integrations: [
    decapCmsOauth({
      adminPath: '/admin',
      oauthLoginRoute: '/oauth'
    }),
    tailwind()
  ],
  server: {
    host: true,
    port: 4321,
    allowedHosts: ["localhost", "127.0.0.1"]
  }
});
```

### 2.3 Directory Structure Updates

Add these files/directories to the existing structure:
```
public/
├── admin/
│   ├── index.html
│   └── config.yml
└── uploads/ (for CMS media uploads)
    └── .gitkeep

src/
└── content/
    └── pages/
        └── .gitkeep
```

### 2.4 Decap CMS Configuration

**public/admin/config.yml:**
```yaml
backend:
  name: github
  repo: [YOUR_GITHUB_ORG]/becoming-diamond-astro
  branch: main
  site_domain: localhost:4321
  base_url: http://localhost:4321
  auth_endpoint: oauth

media_folder: "public/uploads"
public_folder: "/uploads"

collections:
  - name: "pages"
    label: "Pages"
    folder: "src/content/pages"
    create: true
    slug: "{{slug}}"
    fields:
      - label: "Title"
        name: "title"
        widget: "string"
        required: true
      - label: "Description"
        name: "description"
        widget: "text"
        required: false
      - label: "Published"
        name: "published"
        widget: "boolean"
        default: false
      - label: "Body"
        name: "body"
        widget: "markdown"
        required: true
```

**public/admin/index.html:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Content Manager</title>
</head>
<body>
  <script src="decap-cms.js"></script>
</body>
</html>
```

### 2.5 Build Script Updates

Update `package.json` scripts:
```json
{
  "scripts": {
    "dev": "astro dev",
    "prebuild": "cp node_modules/decap-cms/dist/decap-cms.js public/admin/decap-cms.js",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check"
  }
}
```

### 2.6 Environment Variables

**Create `.env.example`:**
```bash
# GitHub OAuth Configuration
# Get these values from: https://github.com/settings/developers
OAUTH_GITHUB_CLIENT_ID=your_github_oauth_client_id_here
OAUTH_GITHUB_CLIENT_SECRET=your_github_oauth_client_secret_here

# Random secret for OAuth token encryption (generate with: openssl rand -base64 32)
OAUTH_TOKEN_SECRET=your_random_secret_string_here

# GitHub Repository (format: org/repo)
GITHUB_REPO=your-org/becoming-diamond-astro
```

**Create `.env` (not committed to git):**
```bash
# Copy from .env.example and fill in your actual values
OAUTH_GITHUB_CLIENT_ID=
OAUTH_GITHUB_CLIENT_SECRET=
OAUTH_TOKEN_SECRET=
GITHUB_REPO=
```

### 2.7 GitHub OAuth App Setup

**Required steps (documented in implementation):**

1. Go to GitHub Settings → Developer settings → OAuth Apps → New OAuth App
2. Fill in the form:
   - **Application name**: `Becoming Diamond Astro CMS (Development)`
   - **Homepage URL**: `http://localhost:4321`
   - **Authorization callback URL**: `http://localhost:4321/oauth/callback`
3. Click "Register application"
4. Copy the **Client ID** and generate a new **Client Secret**
5. Add these values to your `.env` file

### 2.8 Git Configuration Update

Update `.gitignore` to include:
```
# CMS uploads (optional - depends on workflow)
public/uploads/*
!public/uploads/.gitkeep

# Decap CMS admin build artifact
public/admin/decap-cms.js
```

---

## 3. Implementation Details

### 3.1 OAuth Flow

The authentication flow works as follows:

1. User navigates to `http://localhost:4321/admin`
2. Decap CMS redirects to GitHub OAuth login
3. User authorizes the app on GitHub
4. GitHub redirects back to `/oauth/callback` with authorization code
5. `astro-decap-cms-oauth` exchanges code for access token
6. User is redirected back to `/admin` with authenticated session
7. CMS loads with GitHub backend access

### 3.2 Testing the Integration

**Manual test sequence:**

1. **Environment Setup**
   ```bash
   # Generate OAuth token secret
   openssl rand -base64 32

   # Add to .env file
   ```

2. **GitHub OAuth App Configuration**
   - Follow steps in section 2.7
   - Verify callback URL matches exactly

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Test Admin Access**
   - Navigate to `http://localhost:4321/admin`
   - Should see Decap CMS login screen
   - Click "Login with GitHub"
   - Authorize the OAuth app
   - Should redirect back to CMS admin interface

5. **Test Content Creation**
   - Click "New Pages" in CMS
   - Create a test page with:
     - Title: "Test Page"
     - Description: "Testing CMS integration"
     - Published: true
     - Body: "# Test Content\n\nThis is a test."
   - Click "Publish"
   - Verify file created in `src/content/pages/`

6. **Test Media Upload**
   - Try uploading an image in the CMS
   - Verify it appears in `public/uploads/`

---

## 4. Success Criteria

### Testing Checkpoints

1. **Installation**
   - [ ] `npm install` completes without errors
   - [ ] New dependencies are installed correctly

2. **Environment Configuration**
   - [ ] `.env` file created with all required variables
   - [ ] GitHub OAuth App created and configured
   - [ ] Client ID and Secret added to `.env`
   - [ ] OAuth token secret generated and added

3. **Build Process**
   - [ ] `npm run prebuild` copies decap-cms.js to public/admin/
   - [ ] `npm run build` completes without errors
   - [ ] `npm run dev` starts successfully

4. **Admin Interface**
   - [ ] Navigate to `/admin` without errors
   - [ ] Decap CMS interface loads
   - [ ] "Login with GitHub" button visible

5. **OAuth Authentication**
   - [ ] Click "Login with GitHub" initiates OAuth flow
   - [ ] GitHub authorization page appears
   - [ ] After authorization, redirects back to CMS admin
   - [ ] User is logged in to CMS successfully

6. **Content Management**
   - [ ] Can create new page in CMS
   - [ ] Can save content
   - [ ] Can publish content
   - [ ] File appears in `src/content/pages/` directory
   - [ ] Can edit existing content
   - [ ] Can upload media to `/uploads/`

7. **Error Handling**
   - [ ] No console errors in browser
   - [ ] No server errors in terminal
   - [ ] Helpful error messages if OAuth fails

---

## 5. Common Issues and Solutions

### Issue: OAuth Callback URL Mismatch
**Symptom**: OAuth fails with redirect URI mismatch error
**Solution**: Ensure GitHub OAuth App callback URL exactly matches `http://localhost:4321/oauth/callback`

### Issue: Environment Variables Not Loaded
**Symptom**: OAuth fails with missing credentials error
**Solution**:
- Verify `.env` file exists in project root
- Restart dev server after adding environment variables
- Check for typos in variable names

### Issue: CMS Doesn't Load
**Symptom**: Blank page at `/admin`
**Solution**:
- Verify `npm run prebuild` was executed
- Check that `public/admin/decap-cms.js` exists
- Verify `public/admin/index.html` and `config.yml` are present

### Issue: GitHub Backend Authentication Fails
**Symptom**: CMS loads but can't connect to GitHub
**Solution**:
- Verify `GITHUB_REPO` in config.yml matches your actual repo
- Ensure you have write access to the repository
- Check that OAuth app has necessary permissions

---

## 6. Defensive Programming Practices

### Environment Validation
Add a startup check (optional, in a separate script):
```javascript
// scripts/validate-env.js
const required = [
  'OAUTH_GITHUB_CLIENT_ID',
  'OAUTH_GITHUB_CLIENT_SECRET',
  'OAUTH_TOKEN_SECRET'
];

for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}
```

### Error Boundaries
- CMS is isolated in `/admin` route - errors won't affect main site
- OAuth failures return user to login screen
- Keep CMS configuration minimal to reduce error surface

### Security Considerations
- Never commit `.env` file
- Rotate `OAUTH_TOKEN_SECRET` if exposed
- Use different OAuth apps for development and production
- Limit OAuth app repository access to necessary repos only

---

## 7. Acceptance Criteria Summary

**This chunk is complete when:**

1. A developer can access `/admin` and authenticate via GitHub OAuth
2. Content can be created, edited, and published through the CMS
3. Files are correctly saved to `src/content/pages/`
4. Media uploads work and save to `public/uploads/`
5. No errors appear in browser console or server logs
6. All environment variables are documented in `.env.example`
7. GitHub OAuth app is properly configured

**Manual Testing Checklist:**
- [ ] Clean install (`rm -rf node_modules && npm install`)
- [ ] Environment setup completed
- [ ] GitHub OAuth app created
- [ ] Dev server starts without errors
- [ ] Can access `/admin` route
- [ ] OAuth login flow works end-to-end
- [ ] Can create a test page
- [ ] Can publish content
- [ ] Can upload an image
- [ ] Can edit existing content

**Ready for Next Chunk:**
Once CMS integration is stable and content management works, proceed to chunk 02 for React and UI components.

---

## 8. Documentation Requirements

Create or update `README.md` with:

### Setup Instructions
```markdown
## Decap CMS Setup

### 1. GitHub OAuth App Configuration

1. Create a GitHub OAuth App:
   - Go to https://github.com/settings/developers
   - Click "New OAuth App"
   - Application name: `Becoming Diamond Astro CMS (Development)`
   - Homepage URL: `http://localhost:4321`
   - Callback URL: `http://localhost:4321/oauth/callback`

2. Copy the Client ID and generate a Client Secret

### 2. Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your OAuth credentials in `.env`

3. Generate a random token secret:
   ```bash
   openssl rand -base64 32
   ```

### 3. Start Development

```bash
npm install
npm run dev
```

### 4. Access CMS

Navigate to http://localhost:4321/admin and login with GitHub
```

---

**End of PRD 001-01**
