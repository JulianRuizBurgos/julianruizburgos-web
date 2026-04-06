#!/usr/bin/env bash
# generate-photos-json.sh
# Reads JPEG metadata from a folder and generates/updates content/photography/photos.json
#
# Requirements: exiftool, jq
# Usage: bash scripts/generate-photos-json.sh <photos-dir> <photos.json>
# Example:
#   bash scripts/generate-photos-json.sh \
#     ~/Nextcloud/Photography/Camera\ workspace/03_Exports/Shop \
#     content/photography/photos.json

set -euo pipefail

PHOTOS_DIR="${1:?Usage: $0 <photos-dir> <photos.json>}"
JSON_FILE="${2:?Usage: $0 <photos-dir> <photos.json>}"

for cmd in exiftool jq; do
  if ! command -v "$cmd" &>/dev/null; then
    echo "Error: '$cmd' not found. Install with: sudo apt install $cmd"
    exit 1
  fi
done

echo "Reading metadata from: $PHOTOS_DIR"
echo "Writing to:            $JSON_FILE"
echo ""

# Preserve existing sortOrder values (keyed by filename) and warn about removed photos
EXISTING_SORT="{}"
EXISTING_FILENAMES="[]"
if [[ -f "$JSON_FILE" ]]; then
  EXISTING=$(cat "$JSON_FILE")
  EXISTING_SORT=$(echo "$EXISTING" | jq 'map(select(.sortOrder != null)) | map({(.filename): .sortOrder}) | add // {}')
  EXISTING_FILENAMES=$(echo "$EXISTING" | jq '[.[].filename]')
fi

# Read all JPEG metadata in one exiftool pass
RAW_META=$(exiftool -json \
  -FileName -Title -Description -Location -Subject \
  -DateTimeOriginal -Make -Model -LensModel \
  -ImageWidth -ImageHeight \
  -ext jpg -ext JPG -ext jpeg -ext JPEG \
  "$PHOTOS_DIR" 2>/dev/null)

if [[ -z "$RAW_META" || "$RAW_META" == "[]" ]]; then
  echo "No JPEG files found in $PHOTOS_DIR"
  exit 0
fi

NEW_FILENAMES=$(echo "$RAW_META" | jq '[.[].FileName]')

# Transform exiftool JSON → photos.json format, sorted by date descending
NEW_JSON=$(echo "$RAW_META" | jq --argjson existing "$EXISTING_SORT" '
  map({
    filename: .FileName,
    title: (.Title // null),
    description: (.Description // null),
    location: (.Location // null),
    tags: (
      if .Subject == null then []
      elif (.Subject | type) == "string" then [.Subject]
      else .Subject
      end
    ),
    date: (
      if (.DateTimeOriginal != null and (.DateTimeOriginal | type) == "string" and .DateTimeOriginal != "")
      then (.DateTimeOriginal | split(" ")[0] | gsub(":"; "-"))
      else null
      end
    ),
    camera: (
      if .Model and .LensModel then "\(.Model) · \(.LensModel)"
      elif .Model then .Model
      else null
      end
    ),
    widthPx: (.ImageWidth // null),
    heightPx: (.ImageHeight // null),
    aspectRatio: (
      if .ImageWidth and .ImageHeight
      then (.ImageWidth / .ImageHeight * 10000 | round / 10000)
      else null
      end
    ),
    sortOrder: ($existing[.FileName] // null)
  })
  | sort_by(.date // "")
  | reverse
')

echo "$NEW_JSON" > "$JSON_FILE"

COUNT=$(echo "$NEW_JSON" | jq 'length')
echo "Done. $COUNT photos written to $JSON_FILE"

# Warn about photos in existing JSON that were not found in the folder
REMOVED=$(jq -n \
  --argjson existing "$EXISTING_FILENAMES" \
  --argjson new "$NEW_FILENAMES" \
  '($existing - $new)')

if [[ "$REMOVED" != "[]" ]]; then
  echo ""
  echo "Warning: the following entries were in the existing JSON but not found in $PHOTOS_DIR:"
  echo "$REMOVED" | jq -r '.[]'
  echo "They have been removed from $JSON_FILE. Re-add manually if needed."
fi
