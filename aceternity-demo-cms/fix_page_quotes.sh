#!/bin/bash

# Fix src/app/page.tsx
sed -i '' "s/You've/You\&apos;ve/g" src/app/page.tsx
sed -i '' 's/"Unlock/\&ldquo;Unlock/g' src/app/page.tsx
sed -i '' 's/Identity."/Identity.\&rdquo;/g' src/app/page.tsx
sed -i '' "s/It's/It\&apos;s/g" src/app/page.tsx
sed -i '' "s/you're/you\&apos;re/g" src/app/page.tsx
sed -i '' 's/\&quot;/\&ldquo;/1' src/app/page.tsx
sed -i '' 's/\&quot;/\&rdquo;/1' src/app/page.tsx

# Fix line 907 and 910 console.log - comment them out
sed -i '' '907s/^/\/\/ /' src/app/landing-alt-all/page.tsx
sed -i '' '910s/^/\/\/ /' src/app/landing-alt-all/page.tsx

echo "Fixed page.tsx and console.logs"
