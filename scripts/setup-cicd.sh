#!/bin/bash

# CI/CD Pipeline Setup Script
# This script sets up the complete CI/CD pipeline for local, staging, and production

set -e

echo "==================================="
echo "CI/CD Pipeline Setup"
echo "==================================="

# Check required CLI tools
echo "Checking required CLI tools..."
command -v vercel >/dev/null 2>&1 || { echo "Error: vercel CLI not installed"; exit 1; }
command -v gh >/dev/null 2>&1 || { echo "Error: gh CLI not installed"; exit 1; }

# Check authentication
echo "Verifying authentication..."
vercel whoami || { echo "Error: Not logged into Vercel. Run: vercel login"; exit 1; }
gh auth status || { echo "Error: Not logged into GitHub. Run: gh auth login"; exit 1; }

# Get repository info
REPO_OWNER=$(gh repo view --json owner -q .owner.login)
REPO_NAME=$(gh repo view --json name -q .name)
echo "Repository: $REPO_OWNER/$REPO_NAME"

# Get Vercel project info
VERCEL_ORG_ID=$(jq -r '.orgId' .vercel/project.json)
VERCEL_PROJECT_ID=$(jq -r '.projectId' .vercel/project.json)
echo "Vercel Project ID: $VERCEL_PROJECT_ID"
echo "Vercel Org ID: $VERCEL_ORG_ID"

# Create/update GitHub secrets
echo "Setting up GitHub Actions secrets..."
gh secret set VERCEL_TOKEN --body "$VERCEL_TOKEN"
gh secret set VERCEL_ORG_ID --body "$VERCEL_ORG_ID"
gh secret set VERCEL_PROJECT_ID --body "$VERCEL_PROJECT_ID"
gh secret set NEXTAUTH_SECRET --body "$(grep NEXTAUTH_SECRET .env.production | cut -d'=' -f2 | tr -d '\"')"

# Create GitHub environments
echo "Creating GitHub environments..."
gh api repos/$REPO_OWNER/$REPO_NAME/environments/staging -X PUT || true
gh api repos/$REPO_OWNER/$REPO_NAME/environments/production -X PUT --input - <<EOF
{
  "wait_timer": 0,
  "prevent_self_review": false,
  "reviewers": []
}
EOF

# Upload environment variables to Vercel
echo "Uploading environment variables to Vercel..."
bash scripts/upload-env-to-vercel.sh preview .env.staging
bash scripts/upload-env-to-vercel.sh production .env.production

echo ""
echo "==================================="
echo "CI/CD Pipeline Setup Complete!"
echo "==================================="
echo ""
echo "Next steps:"
echo "1. Commit and push the changes"
echo "2. GitHub Actions will automatically deploy:"
echo "   - Pushes to 'staging' branch → https://staging.becomingdiamond.com"
echo "   - Pushes to 'main' branch → https://www.becomingdiamond.com"
echo ""
echo "Test the pipeline:"
echo "  git checkout staging"
echo "  git push origin staging"
echo ""
