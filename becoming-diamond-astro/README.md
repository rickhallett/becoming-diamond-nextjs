# Becoming Diamond Astro

Modern Astro project with Decap CMS integration and Aceternity-style UI components.

## Features

- 🚀 Astro 5.14+ with SSR support
- 🎨 Tailwind CSS with custom purple theme
- 📝 Decap CMS with GitHub OAuth authentication
- 🔐 Secure content management workflow
- ⚡ Vercel deployment ready

## Prerequisites

- Node.js 18+
- GitHub account
- GitHub repository for the project
- Vercel account (for deployment)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. GitHub OAuth App Configuration

Create a GitHub OAuth App for CMS authentication:

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in the form:
   - **Application name**: `Becoming Diamond Astro CMS (Development)`
   - **Homepage URL**: `http://localhost:4321`
   - **Authorization callback URL**: `http://localhost:4321/oauth/callback`
4. Click "Register application"
5. Copy the **Client ID** and generate a new **Client Secret**

### 3. Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your OAuth credentials in `.env`:
   ```bash
   OAUTH_GITHUB_CLIENT_ID=your_client_id_here
   OAUTH_GITHUB_CLIENT_SECRET=your_client_secret_here
   OAUTH_TOKEN_SECRET=your_random_secret_here
   GITHUB_REPO=your-org/your-repo
   ```

3. Generate a random token secret:
   ```bash
   openssl rand -base64 32
   ```

4. Update `public/admin/config.yml` with your GitHub repository:
   ```yaml
   backend:
     repo: YOUR_GITHUB_ORG/becoming-diamond-astro
   ```

## Development

### Start Dev Server

```bash
npm run dev
```

The site will be available at `http://localhost:4321`

### Access CMS Admin

Navigate to `http://localhost:4321/admin` and login with GitHub

## Build

```bash
npm run build
```

The build process will:
1. Copy Decap CMS files to `public/admin/`
2. Build the Astro site for SSR deployment

## Commands

| Command | Action |
| :-- | :-- |
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview build locally |
| `npm run check` | Run TypeScript check |

## Project Structure

```
becoming-diamond-astro/
├── public/
│   ├── admin/           # Decap CMS admin interface
│   │   ├── config.yml   # CMS configuration
│   │   └── index.html   # CMS admin page
│   └── uploads/         # Media uploads from CMS
├── src/
│   ├── components/
│   │   ├── ui/          # Aceternity UI components
│   │   └── landing/     # Landing page components
│   ├── content/
│   │   └── pages/       # CMS-managed content
│   ├── layouts/
│   │   └── Layout.astro # Base layout
│   ├── pages/
│   │   ├── index.astro  # Redirects to /landing
│   │   └── landing.astro # Main landing page
│   ├── styles/
│   │   └── global.css   # Global styles
│   └── lib/
│       └── utils.ts     # Utility functions
├── astro.config.mjs     # Astro configuration
├── tailwind.config.mjs  # Tailwind configuration
└── package.json         # Dependencies and scripts
```

## CMS Usage

### Creating Content

1. Navigate to `/admin`
2. Login with GitHub
3. Click "New Pages"
4. Fill in:
   - Title
   - Description (optional)
   - Published status
   - Body (Markdown)
5. Click "Publish"

Content will be saved to `src/content/pages/`

### Media Uploads

Upload images through the CMS interface - they'll be saved to `public/uploads/`

## Deployment

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `OAUTH_GITHUB_CLIENT_ID`
   - `OAUTH_GITHUB_CLIENT_SECRET`
   - `OAUTH_TOKEN_SECRET`
4. Update GitHub OAuth App callback URL to your Vercel domain
5. Deploy

## Troubleshooting

### OAuth Callback URL Mismatch

Ensure the GitHub OAuth App callback URL exactly matches `http://localhost:4321/oauth/callback` for development.

### Environment Variables Not Loaded

- Verify `.env` file exists in project root
- Restart dev server after adding environment variables
- Check for typos in variable names

### CMS Doesn't Load

- Verify `npm run build` was executed (runs prebuild automatically)
- Check that `public/admin/decap-cms.js` exists
- Verify `public/admin/index.html` and `config.yml` are present

## Learn More

- [Astro Documentation](https://docs.astro.build)
- [Decap CMS Documentation](https://decapcms.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
