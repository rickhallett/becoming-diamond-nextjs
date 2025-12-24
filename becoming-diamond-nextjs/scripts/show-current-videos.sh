#!/bin/bash
# Show video GUIDs currently used in sprint markdown files
# Usage: ./scripts/show-current-videos.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "Current videos in sprint markdown files:"
echo ""

for file in "$PROJECT_ROOT/content/sprint"/day-*.md; do
  day=$(basename "$file" .md | sed 's/day-//')
  guid=$(grep "^video:" "$file" 2>/dev/null | cut -d: -f2 | tr -d ' ')
  title=$(grep "^title:" "$file" 2>/dev/null | cut -d: -f2- | sed 's/^ *//')

  # Remove leading zeros to avoid octal interpretation
  day_num=$((10#$day))

  if [ -n "$guid" ]; then
    printf "Day %02d: %s  # %s\n" "$day_num" "$guid" "$title"
  else
    printf "Day %02d: (no video)  # %s\n" "$day_num" "$title"
  fi
done
