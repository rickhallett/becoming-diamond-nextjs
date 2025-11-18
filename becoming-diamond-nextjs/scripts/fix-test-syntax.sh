#!/bin/bash
# Fix invalid control characters in E2E test files

echo "Fixing test file syntax errors..."

# List of files with syntax errors
files=(
  "src/test/e2e/chat-interaction.spec.ts"
  "src/test/e2e/course-interactions.spec.ts"
  "src/test/e2e/profile.spec.ts"
  "src/test/e2e/settings.spec.ts"
  "src/test/e2e/sprint.spec.ts"
  "src/test/e2e/auth-flow.spec.ts"
  "src/test/e2e/content-pages.spec.ts"
  "src/test/e2e/course-playback.spec.ts"
  "src/test/e2e/landing-extended.spec.ts"
  "src/test/e2e/member-portal.spec.ts"
  "src/test/e2e/member-portal-extended.spec.ts"
  "src/test/e2e/oauth-flow.spec.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing: $file"
    # Remove SOH (0x01) characters using tr
    tr -d '\001' < "$file" > "$file.tmp"
    mv "$file.tmp" "$file"
    echo "  Fixed: $file"
  else
    echo "  Skipped (not found): $file"
  fi
done

echo "Done! All syntax errors should be fixed."
echo "Run 'npm run test:e2e' to verify."
