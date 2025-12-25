#!/bin/bash

# Complete Deploy → Test → Inspect Cycle
# Combines deployment, testing, and inspection in one command

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Parse arguments
PHASE=${1:-"unknown"}

print_header "Middleware Phase $PHASE - Full Test Cycle"

# Change to project root
cd /home/mrkai/code/becoming-diamond-nextjs/becoming-diamond-nextjs

# Step 1: Deploy
print_info "Step 1: Deploying to preview..."
if ! ./scripts/deploy-preview.sh; then
    print_error "Deployment failed"
    exit 1
fi

PREVIEW_URL=$(cat .vercel-preview-url)

# Step 2: Test
print_info "Step 2: Running automated tests..."
if ! ./scripts/test-preview.sh; then
    print_error "Tests failed"
    echo ""
    echo "Rollback command:"
    echo "  git revert HEAD && ./scripts/deploy-test-cycle.sh rollback"
    exit 1
fi

# Step 3: Manual inspection guide
print_header "Step 3: Manual Inspection Required"
echo "Preview URL: $PREVIEW_URL"
echo ""
echo "Phase $PHASE manual test checklist:"

case $PHASE in
  1)
    echo "  [ ] Check middleware logs for cookie detection"
    echo "  [ ] Verify no behavior changes (all routes accessible)"
    ;;
  2)
    echo "  [ ] Check logs for correct route classification"
    echo "  [ ] Verify shouldBlock logic in logs"
    echo "  [ ] Verify no redirects yet"
    ;;
  3)
    echo "  [ ] Anonymous user → /app (should redirect to signin)"
    echo "  [ ] Authenticated user → /app (should load normally)"
    echo "  [ ] Verify callbackUrl in redirect"
    ;;
  4)
    echo "  [ ] Admin user → /docs-site (should load)"
    echo "  [ ] Regular user → /docs-site (should redirect to /)"
    echo "  [ ] Anonymous → /docs-site (should redirect to /)"
    echo "  [ ] Verify Phase 3 protection still works"
    ;;
  5)
    echo "  [ ] Authenticated user → /auth/signin (should redirect to /app/profile)"
    echo "  [ ] Anonymous user → /auth/signin (should load normally)"
    echo "  [ ] Verify Phases 3-4 protection still works"
    ;;
  6)
    echo "  [ ] Test with invalid session cookie"
    echo "  [ ] Verify graceful error handling"
    echo "  [ ] Check error logs are descriptive"
    echo "  [ ] Verify all previous phases still work"
    ;;
  7)
    echo "  [ ] All route protection working"
    echo "  [ ] No __dirname or edge runtime errors"
    echo "  [ ] Performance benchmarks met"
    echo "  [ ] Ready for production merge"
    ;;
  *)
    echo "  [ ] Perform manual testing appropriate for this phase"
    ;;
esac

echo ""
echo "After manual verification:"
echo "  ✓ If PASS: Continue to next phase or merge to production"
echo "  ✗ If FAIL: git revert HEAD && ./scripts/deploy-test-cycle.sh rollback"
