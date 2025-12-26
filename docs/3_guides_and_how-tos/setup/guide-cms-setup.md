# Becoming Diamond with Decap CMS Integration

This project integrates Decap CMS (formerly Netlify CMS) into the Becoming Diamond Next.js application for content management.

## Setup Instructions

### 1. GitHub OAuth App Configuration

1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: Becoming Diamond CMS
   - **Homepage URL**: `http://localhost:3003` (for development)
   - **Authorization callback URL**: `http://localhost:3003/api/callback`
4. Click "Register application"
5. Copy the **Client ID** and generate a **Client Secret**

### 2. Environment Configuration

Update the `.env.local` file with your GitHub OAuth credentials:

```env
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
```

**Note:** This project uses custom OAuth handlers in `/api/auth` and `/api/callback` routes, not NextAuth for CMS authentication.

### 3. Update CMS Configuration

Edit `public/admin/config.yml` and update the repository information:

```yaml
backend:
  name: github
  repo: your-username/your-repo-name # Update this
  branch: main
```

## Running the Application

1. Install dependencies:
```bash
npm install
```

2. Run the development server with Turbopack:
```bash
npm run dev
```

This runs `next dev --turbopack` on port 3003.

3. Access the application:
   - Main site: [http://localhost:3003](http://localhost:3003)
   - Admin panel: [http://localhost:3003/admin](http://localhost:3003/admin)
   - News page: [http://localhost:3003/news](http://localhost:3003/news)

## Features

- **Decap CMS Integration**: Full-featured content management system
- **GitHub Authentication**: Secure OAuth-based authentication
- **Content Collections**:
  - News updates
  - Blog posts
  - Static pages
  - Site settings
- **Media Management**: Upload and manage images
- **Markdown Support**: Write content in Markdown format
- **Dynamic Routes**: Automatic page generation for content

## Content Structure

```
content/
├── news/          # News articles
├── blog/          # Blog posts
├── pages/         # Static pages (about, contact)
└── settings/      # Site configuration

public/
└── uploads/       # Media uploads
```

## Build Process

The build process includes:
1. Copying Decap CMS bundle to public directory
2. Building Next.js application
3. Static generation of content pages

```bash
npm run build
```

## Deployment

For production deployment:

1. Update GitHub OAuth App callback URL to your production domain
2. Set production environment variables
3. Update `config.yml` with production URLs
4. Deploy to your hosting platform (Vercel, Netlify, etc.)

## Troubleshooting

- **OAuth errors**: Ensure GitHub OAuth app settings match your environment
- **CMS not loading**: Check that decap-cms.js is properly copied to public/admin/
- **Content not appearing**: Verify content files are in correct directories and marked as published
- **Build errors**: Run `npm run prebuild` manually to copy CMS assets