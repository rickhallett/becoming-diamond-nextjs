# Becoming Diamond

This repository contains the Becoming Diamond Next.js application.

## Repository Structure

```
becoming-diamond/
├── .claude/              # Claude Code configuration
├── .git/                 # Git repository
├── becoming-diamond-nextjs/  # Next.js application (main project)
│   ├── src/             # Source code
│   ├── public/          # Static assets
│   ├── package.json     # Dependencies
│   └── ...
├── vercel.json          # Vercel deployment configuration
└── README.md            # This file
```

## Development

The Next.js application is located in the `becoming-diamond-nextjs/` directory.

```bash
cd becoming-diamond-nextjs
npm install
npm run dev
```

## Deployment

Vercel is configured to build from the `becoming-diamond-nextjs/` subdirectory via `vercel.json`.

The build commands automatically change to the correct directory before executing.

## Documentation

See `becoming-diamond-nextjs/CLAUDE.md` for full architecture documentation.
