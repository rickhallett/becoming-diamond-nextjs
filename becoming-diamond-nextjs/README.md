# Becoming Diamond - Next.js Application

A modern web application built with Next.js 15, featuring a stunning landing page with Aceternity UI components, a member portal with authentication, and a Git-based content management system powered by Decap CMS.

## Overview

This application combines a public-facing marketing website with a protected member portal, offering:

- **Public Landing Page**: Modern, animated landing page with 3D graphics and interactive elements
- **Member Portal**: Protected dashboard with courses, AI chat, profile management, and support
- **Content Management**: Git-based CMS for managing news, blog posts, and site content
- **Authentication**: GitHub OAuth integration for CMS access and member authentication

## Technology Stack

### Core Framework
- **Next.js 15.5.3** with App Router and React 19
- **Turbopack** for fast development and production builds
- **TypeScript** for type safety

### Styling & UI
- **Tailwind CSS 4** with inline configuration
- **Aceternity UI** - 89 pre-built animated components featuring:
  - Framer Motion for animations
  - React Three Fiber for 3D graphics
  - Radix UI primitives
- **tw-animate-css** for additional animations

### Content Management
- **Decap CMS** (formerly Netlify CMS) with GitHub backend
- **Gray-matter** for frontmatter parsing
- **Remark** for markdown to HTML conversion
- Git-based storage for version-controlled content

### Other Key Dependencies
- **@tabler/icons-react** for UI icons
- **next-themes** for theme management
- **@vercel/speed-insights** for performance monitoring

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm, yarn, pnpm, or bun package manager
- GitHub account (for CMS authentication)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd becoming-diamond-nextjs
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
# GitHub OAuth (Required for Decap CMS)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

To get GitHub OAuth credentials:
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL to: `http://localhost:3003/api/callback` (for development)
4. Copy the Client ID and generate a Client Secret

4. Update Decap CMS configuration:

Edit `/public/admin/config.yml` and update the `repo` field with your GitHub username/repo:

```yaml
backend:
  name: github
  repo: your-username/your-repo-name
  branch: main
```

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3003](http://localhost:3003)

The page auto-updates as you edit files thanks to Fast Refresh.

### Building for Production

```bash
npm run build
```

This command:
1. Runs the `prebuild` script to copy Decap CMS assets to `/public/admin/`
2. Creates an optimized production build using Turbopack

Start the production server:

```bash
npm start
```

### Linting

```bash
npm run lint        # Run ESLint
npm run lint:fix    # Auto-fix linting issues
npm run lint:next   # Run Next.js linter
```

Note: The `src/components/ui/` directory (Aceternity components) is excluded from linting.

## Project Structure

```
becoming-diamond-nextjs/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Public landing page
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Global styles & Tailwind config
│   │   ├── app/               # Protected member portal
│   │   │   ├── layout.tsx     # Sidebar layout
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── courses/       # Courses page
│   │   │   ├── chat/          # AI chat interface
│   │   │   ├── profile/       # User profile
│   │   │   ├── settings/      # Account settings
│   │   │   └── support/       # Support resources
│   │   ├── auth/              # Authentication pages
│   │   ├── news/              # News articles
│   │   │   ├── page.tsx       # News listing
│   │   │   └── [slug]/        # Individual articles
│   │   ├── blog/              # Blog posts
│   │   │   ├── page.tsx       # Blog listing
│   │   │   └── [slug]/        # Individual posts
│   │   └── api/               # API routes
│   │       ├── auth/          # OAuth authentication
│   │       └── callback/      # OAuth callback handler
│   ├── components/
│   │   └── ui/                # Aceternity UI components (89 files)
│   ├── lib/
│   │   ├── content.ts         # Content management API
│   │   └── utils.ts           # Utility functions
│   └── hooks/
│       └── use-outside-click.tsx
├── content/                    # Git-based content storage
│   ├── news/                  # News updates (markdown)
│   ├── blog/                  # Blog posts (markdown)
│   ├── pages/                 # Static pages (markdown)
│   └── settings/              # Site settings (YAML)
├── public/
│   ├── admin/                 # Decap CMS admin interface
│   │   ├── index.html
│   │   ├── config.yml         # CMS configuration
│   │   └── decap-cms.js       # CMS bundle (auto-copied)
│   └── uploads/               # User-uploaded media
├── CLAUDE.md                   # Architecture documentation
└── package.json
```

## Key Features

### Public Website

**Landing Page** (`/`)
- Hero section with spotlight effect and gradient text
- Bento grid feature showcase
- Animated timeline showcasing program phases
- Testimonials carousel
- 3D globe visualization with arcs
- Background beam effects
- Fully responsive with mobile navigation

**Content Pages**
- News section (`/news`) with article listings
- Blog section (`/blog`) with post listings
- Dynamic routes for individual articles and posts
- Static site generation for optimal performance

### Member Portal (`/app/*`)

**Dashboard** (`/app`)
- User statistics and progress tracking
- Upcoming sessions
- Quick access to key features

**Features**
- Courses catalog and enrollment
- DiamondMindAI chat interface
- User profile and progress
- Account settings
- Support resources

**Layout**
- Fixed sidebar navigation (desktop)
- Mobile drawer navigation
- Active route highlighting
- Logout functionality

### Content Management System

**Access**: Navigate to `/admin` to access Decap CMS

**Features**:
- Visual content editor
- Markdown support with live preview
- Media library for image uploads
- Draft and publish workflow
- Git-based version control

**Content Collections**:
1. **News Updates** - Date-stamped news items with thumbnails and tags
2. **Blog Posts** - Author-attributed articles with categories
3. **Pages** - Static pages (About, Contact)
4. **Site Settings** - Global configuration and social media links

**Content API**:

```typescript
import { getContentByType, getContentBySlug } from '@/lib/content';

// Fetch all news items (published only, sorted by date)
const news = await getContentByType('news');

// Fetch single item by slug
const article = await getContentBySlug('news', 'article-slug');

// Access frontmatter and content
article.frontmatter.title
article.frontmatter.date
article.content // HTML string
```

### Authentication

**GitHub OAuth Flow**:
1. User clicks "Login with GitHub" in CMS
2. OAuth popup redirects to GitHub authorization
3. User authorizes the application
4. Callback handler sends authorization code via postMessage
5. Token exchange returns GitHub access token
6. CMS uses token for Git operations

**API Routes**:
- `/api/auth?provider=github` - OAuth initiation
- `/api/auth` (POST) - Token exchange
- `/api/callback` - OAuth callback handler

## Path Aliases

The project uses TypeScript path mapping for cleaner imports:

```typescript
import { Component } from '@/components/ui/component'
import { getContentByType } from '@/lib/content'
import { cn } from '@/lib/utils'
```

`@/*` maps to `./src/*`

## Styling

### Tailwind CSS 4

This project uses the new Tailwind CSS 4 inline configuration format. Configuration is located in `src/app/globals.css` using the `@theme` directive instead of a separate config file.

**Theme Colors**:
- `--primary`: `#4fc3f7` (Diamond Blue)
- `--background`: `#000000` (Pure Black)
- `--foreground`: `#ffffff` (White)
- `--secondary`, `--accent`, `--muted`, etc.

### Using Components

Aceternity UI components are self-contained and ready to use:

```typescript
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { Spotlight } from '@/components/ui/spotlight';

// Use directly with minimal configuration
<Spotlight className="..." />
```

For heavy 3D components, use dynamic imports:

```typescript
import dynamic from 'next/dynamic';

const World = dynamic(
  () => import("@/components/ui/globe").then(m => m.World),
  { ssr: false }
);
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Required for Decap CMS
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
```

For production deployment (`.env.prod` or Vercel environment variables):
- Update `base_url` in `/public/admin/config.yml` to your production domain
- Set the same GitHub OAuth variables
- Update OAuth callback URL in GitHub OAuth App settings

## Development Workflow

### Creating Content

1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3003/admin`
3. Log in with GitHub
4. Create/edit content using the visual editor
5. Content is committed to the repository
6. Changes appear immediately in development

### Adding New Pages

1. Create `src/app/[page-name]/page.tsx`
2. Export a React component
3. Use Server Components by default, add `"use client"` only when needed
4. Import Aceternity components for consistent UI

### Adding Member Portal Pages

1. Create `src/app/app/[page-name]/page.tsx`
2. Add navigation item to `src/app/app/layout.tsx`
3. Import icon from `@tabler/icons-react`
4. Follow existing page structure and styling

### Working with Content API

```typescript
// In a Server Component (default in App Router)
import { getContentByType } from '@/lib/content';

export default async function NewsPage() {
  const news = await getContentByType('news');

  return (
    <div>
      {news.map(item => (
        <article key={item.slug}>
          <h2>{item.frontmatter.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: item.content }} />
        </article>
      ))}
    </div>
  );
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Update `/public/admin/config.yml` with production URL
5. Deploy

Vercel automatically detects Next.js and configures the build.

### Other Platforms

Ensure your platform supports:
- Node.js 20+
- Build command: `npm run build`
- Start command: `npm start`
- Environment variables for GitHub OAuth

## Architecture & Patterns

For detailed architecture information, see [CLAUDE.md](/Users/richardhallett/Documents/code/becoming-diamond/becoming-diamond-nextjs/CLAUDE.md), which includes:

- Complete architecture overview
- Rendering strategies (SSR, SSG, CSR)
- Content management workflow
- Authentication flow diagrams
- Component organization patterns
- Performance optimization strategies
- Security considerations
- Future enhancement recommendations

## Troubleshooting

**CMS Not Loading**:
- Verify `/admin/decap-cms.js` exists (run `npm run build` or the prebuild script manually)
- Check GitHub OAuth credentials in `.env.local`
- Ensure `config.yml` has correct repo information
- Check browser console for errors

**Build Errors**:
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run lint:next`

**OAuth Issues**:
- Verify callback URL in GitHub OAuth App matches your domain
- Check that `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are set
- Ensure `base_url` in `config.yml` matches your current environment

**Development Server Issues**:
- Default port is 3003 (see `package.json`)
- Check for port conflicts
- Try restarting the server

## Contributing

See [CLAUDE.md](/Users/richardhallett/Documents/code/becoming-diamond/becoming-diamond-nextjs/CLAUDE.md) for:
- Code organization conventions
- Component patterns
- File naming standards
- Import order conventions
- Development best practices

## License

[Add your license information here]

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Aceternity UI Components](https://ui.aceternity.com)
- [Decap CMS Documentation](https://decapcms.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
