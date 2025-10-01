#!/bin/bash

# Fix line 204
sed -i '' '204s/Everyone'"'"'s/Everyone\&apos;s/' src/app/page.tsx
sed -i '' '205s/We'"'"'re/We\&apos;re/' src/app/page.tsx

# Fix line 243
sed -i '' '243s/"I'"'"'m/"I\&apos;m/' src/app/page.tsx
sed -i '' '243s/\&quot;I/\&ldquo;I/' src/app/page.tsx
sed -i '' '243s/ago."/ago.\&rdquo;/' src/app/page.tsx

# Fix line 289
sed -i '' '289s/You'"'"'re/You\&apos;re/' src/app/page.tsx
sed -i '' '289s/Isn'"'"'t/Isn\&apos;t/' src/app/page.tsx

# Fix line 291
sed -i '' '291s/It'"'"'s/It\&apos;s/' src/app/page.tsx
sed -i '' '291s/isn'"'"'t/isn\&apos;t/' src/app/page.tsx

# Fix line 299
sed -i '' "299s/You're/You\&apos;re/" src/app/page.tsx
sed -i '' "299s/ is '/ is \&lsquo;/" src/app/page.tsx
sed -i '' "299s/' but/ \&rsquo; but/" src/app/page.tsx
sed -i '' "299s/can't/can\&apos;t/" src/app/page.tsx

# Fix line 303
sed -i '' "303s/you're/you\&apos;re/" src/app/page.tsx

# Fix line 315
sed -i '' "315s/You're/You\&apos;re/" src/app/page.tsx
sed -i '' "315s/can't/can\&apos;t/" src/app/page.tsx

# Fix line 319
sed -i '' "319s/You're/You\&apos;re/" src/app/page.tsx

# Fix line 344
sed -i '' '344s/"You/\&ldquo;You/' src/app/page.tsx
sed -i '' "344s/can't/can\&apos;t/" src/app/page.tsx

# Fix line 346
sed -i '' "346s/That's/That\&apos;s/" src/app/page.tsx
sed -i '' '346s/fails."/fails.\&rdquo;/' src/app/page.tsx

echo "Fixed landing-alt-all/page.tsx"
