#!/bin/bash

# Middleware Incremental Deployment Script
# Deploys current branch to Vercel preview environment

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_header "Middleware Preview Deployment"

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI is not installed"
    echo ""
    echo "Install with:"
    echo "  npm install -g vercel"
    exit 1
fi

# Get current branch and phase
CURRENT_BRANCH=$(git branch --show-current)
CURRENT_COMMIT=$(git rev-parse --short HEAD)

print_info "Branch: $CURRENT_BRANCH"
print_info "Commit: $CURRENT_COMMIT"

# Ensure we're not on main (safety check)
if [ "$CURRENT_BRANCH" == "main" ]; then
    print_error "Cannot deploy preview from main branch"
    echo "Create a feature branch first:"
    echo "  git checkout -b middleware-phase-X"
    exit 1
fi

# Ensure working directory is clean
if ! git diff-index --quiet HEAD --; then
    print_error "Working directory has uncommitted changes"
    echo "Commit or stash changes first:"
    echo "  git add ."
    echo "  git commit -m 'Phase X: description'"
    exit 1
fi

print_header "Deploying to Vercel Preview"

# Deploy to Vercel preview (not production)
print_info "Starting deployment..."

# Ensure we're in the project directory (where vercel.json is located)
cd /home/mrkai/code/becoming-diamond-nextjs/becoming-diamond-nextjs

# Deploy and capture output
DEPLOYMENT_OUTPUT=$(vercel --yes 2>&1)

# Extract deployment URL
PREVIEW_URL=$(echo "$DEPLOYMENT_OUTPUT" | grep -o 'https://[^[:space:]]*vercel.app' | head -1)

if [ -z "$PREVIEW_URL" ]; then
    print_error "Failed to extract preview URL"
    echo "$DEPLOYMENT_OUTPUT"
    exit 1
fi

print_success "Deployment complete"
print_info "Preview URL: $PREVIEW_URL"

# Save URL to file for test script
echo "$PREVIEW_URL" > .vercel-preview-url

print_header "Next Steps"
echo "1. Run automated tests:"
echo "   ./scripts/test-preview.sh"
echo ""
echo "2. Manual inspection:"
echo "   Open: $PREVIEW_URL"
echo ""
echo "3. If tests pass, proceed to next phase or merge"
echo ""

print_success "Preview deployment ready for testing"
