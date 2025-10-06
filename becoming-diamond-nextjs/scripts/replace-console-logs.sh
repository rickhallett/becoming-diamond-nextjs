#!/bin/bash

# Script to replace console.log/error statements with file-based logging
# Usage: ./scripts/replace-console-logs.sh

SRC_DIR="/Users/richardhallett/Documents/code/becoming-diamond/becoming-diamond-nextjs/src"

# Find all TypeScript/JavaScript files with console statements (excluding ui components and logger itself)
FILES=$(grep -r "console\." "$SRC_DIR" --include="*.ts" --include="*.tsx" -l | grep -v "/ui/" | grep -v "logger.ts" | grep -v "test-parser.ts")

echo "Files to update:"
echo "$FILES"
echo ""
echo "Total files: $(echo "$FILES" | wc -l)"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    exit 1
fi

# Process each file
for file in $FILES; do
    echo "Processing: $file"

    # Check if file already imports logger
    if ! grep -q "from '@/lib/logger'" "$file"; then
        # Add import after other imports
        if grep -q "^import" "$file"; then
            # Find last import line and add logger import after it
            sed -i '' '/^import/,/^[^import]/{/^[^import]/i\
import { log } from '\''@/lib/logger'\'';
}' "$file"
        fi
    fi

    # Replace console.error with await log.error (will need manual context addition)
    sed -i '' 's/console\.error(/await log.error(/g' "$file"

    # Replace console.log with await log.info
    sed -i '' 's/console\.log(/await log.info(/g' "$file"

    # Replace console.warn with await log.warn
    sed -i '' 's/console\.warn(/await log.warn(/g' "$file"

    # Replace console.debug with await log.debug
    sed -i '' 's/console\.debug(/await log.debug(/g' "$file"
done

echo ""
echo "Done! Please review changes and add context parameters where appropriate."
echo "Pattern: await log.error('message', 'Context', data)"
