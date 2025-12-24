#!/bin/bash
# Analyze ALL videos grouped by upload date ranges
# No regex filtering - shows complete picture

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=== ALL VIDEOS BY UPLOAD DATE ==="
echo ""
echo "Format: [Upload Date] GUID | Title"
echo ""

./scripts/fetch-videos.sh | jq -r '.videos[] | "\(.dateUploaded)|\(.guid)|\(.title)"' | sort | while IFS='|' read -r date guid title; do
  # Color code by month
  month=$(echo "$date" | cut -d- -f2)
  case "$month" in
    10) label="[OCT]" ;;
    11) label="[NOV]" ;;
    12) label="[DEC]" ;;
    *) label="[???]" ;;
  esac

  printf "%s %s | %s | %s\n" "$label" "$date" "$guid" "$title"
done

echo ""
echo "=== SUMMARY BY MONTH ==="
echo ""
./scripts/fetch-videos.sh | jq -r '
  .videos
  | group_by(.dateUploaded[0:7])
  | map({
      month: .[0].dateUploaded[0:7],
      count: length,
      videos: map(.title)
    })
  | .[]
  | "[\(.month)] \(.count) videos:\n  " + (.videos | join("\n  "))
'

echo ""
echo "=== VIDEOS NOT MATCHING 'Day N' PATTERN ==="
echo ""
./scripts/fetch-videos.sh | jq -r '.videos[] | select(.title | test("day [0-9]+"; "i") | not) | "  \(.dateUploaded) | \(.title)"' | sort
