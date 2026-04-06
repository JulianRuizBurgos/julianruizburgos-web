#!/usr/bin/env bash
# sync-photo-exif.sh
# Reads EXIF pixel dimensions from JPEGs and patches widthPx/heightPx in photos.json.
# Run from the repo root: bash scripts/sync-photo-exif.sh <path-to-photos-folder> <path-to-photos.json>
#
# Requirements: ImageMagick (identify command)
# Usage examples:
#   bash scripts/sync-photo-exif.sh ~/Nextcloud/Photography/03_Exports/Shop content/photography/photos.json
#   bash scripts/sync-photo-exif.sh public/photography/dev content/photography/photos.json

set -euo pipefail

PHOTOS_DIR="${1:?Usage: $0 <photos-dir> <photos.json>}"
JSON_FILE="${2:?Usage: $0 <photos-dir> <photos.json>}"

if ! command -v identify &>/dev/null; then
  echo "Error: ImageMagick 'identify' not found. Install with: sudo apt install imagemagick"
  exit 1
fi

if ! command -v jq &>/dev/null; then
  echo "Error: jq not found. Install with: sudo apt install jq"
  exit 1
fi

echo "Reading EXIF from: $PHOTOS_DIR"
echo "Updating: $JSON_FILE"
echo ""

# Build a temp file with updates
TMP=$(mktemp)
cp "$JSON_FILE" "$TMP"

UPDATED=0
SKIPPED=0

while IFS= read -r filename; do
  FILEPATH="$PHOTOS_DIR/$filename"
  if [[ ! -f "$FILEPATH" ]]; then
    echo "  SKIP (not found): $filename"
    ((SKIPPED++)) || true
    continue
  fi

  # Read pixel dimensions
  DIMS=$(identify -format "%wx%h" "$FILEPATH" 2>/dev/null | head -1)
  if [[ -z "$DIMS" ]]; then
    echo "  SKIP (identify failed): $filename"
    ((SKIPPED++)) || true
    continue
  fi

  WIDTH=$(echo "$DIMS" | cut -dx -f1)
  HEIGHT=$(echo "$DIMS" | cut -dx -f2)
  ASPECT=$(awk "BEGIN { printf \"%.4f\", $WIDTH / $HEIGHT }")

  echo "  $filename → ${WIDTH}×${HEIGHT} (aspect ${ASPECT})"

  # Patch the JSON entry for this filename
  TMP2=$(mktemp)
  jq --arg fn "$filename" \
     --argjson w "$WIDTH" \
     --argjson h "$HEIGHT" \
     --argjson a "$ASPECT" \
     'map(if .filename == $fn then . + {widthPx: $w, heightPx: $h, aspectRatio: $a} else . end)' \
     "$TMP" > "$TMP2"
  mv "$TMP2" "$TMP"
  ((UPDATED++)) || true

done < <(jq -r '.[].filename' "$JSON_FILE")

mv "$TMP" "$JSON_FILE"
echo ""
echo "Done. Updated: $UPDATED  Skipped: $SKIPPED"
