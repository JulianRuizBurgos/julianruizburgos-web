#!/usr/bin/env bash
# warm-cache.sh — pre-warm the Next.js image cache for all photos
#
# Usage:
#   bash scripts/warm-cache.sh [base-url]
#
# Examples:
#   bash scripts/warm-cache.sh                          # defaults to https://julianruizburgos.net
#   bash scripts/warm-cache.sh http://localhost:3000    # local dev

set -euo pipefail

BASE_URL="${1:-https://julianruizburgos.net}"
PHOTOS_JSON="content/photography/photos.json"

if [[ ! -f "$PHOTOS_JSON" ]]; then
  echo "Error: $PHOTOS_JSON not found. Run from the repo root." >&2
  exit 1
fi

# Extract filenames from photos.json
filenames=$(node -e "
  const photos = JSON.parse(require('fs').readFileSync('$PHOTOS_JSON', 'utf8'));
  photos.forEach(p => console.log(p.filename));
")

total=$(echo "$filenames" | wc -l)
count=0

echo "Warming cache for $total photos at $BASE_URL"
echo ""

while IFS= read -r filename; do
  count=$((count + 1))
  url="${BASE_URL}/photography/images/${filename}"
  printf "[%d/%d] %s ... " "$count" "$total" "$filename"
  status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  if [[ "$status" == "200" ]]; then
    echo "ok"
  else
    echo "HTTP $status"
  fi
done <<< "$filenames"

echo ""
echo "Done. $total images warmed."
