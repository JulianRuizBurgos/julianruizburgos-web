# Photography workflow

End-to-end reference: from camera card to live on julianruizburgos.net.

---

## Tools

| Tool | Purpose |
|------|---------|
| **digiKam** | Library management, culling, rating, tagging, metadata editing |
| **Darktable** | RAW editing and JPEG export |
| **Nextcloud desktop client** | Syncs local folders to remote Nextcloud automatically |
| **ExifTool** | Called by the generate script to read EXIF from exported JPEGs |
| **Claude (enrich script)** | AI vision — generates titles, descriptions, renames files |

---

## Nextcloud folder structure

```
Photography/
  Workspace/
    01_Inbox/          ← fresh imports, unsorted batches
    02_Active/         ← batches mid-edit
    03_Exports/
        Shop/          ← full resolution JPEG exports — source for website + print orders (flat)
        Personal/      ← personal exports — subfolders by subject (Friends, Cats, etc.)
    04_Printing/       ← printer templates, ICC profiles, invoices
    05_Archive/        ← finished batches (RAWs kept, editing done)
```

Batch folders (`Norway 2021/`, `Georgia 2022/`) live flat inside `01_Inbox/` or `02_Active/`.
Exports always go to `03_Exports/Shop/` — never inside a batch folder.

---

## Full workflow

### Phase 1 — Ingest and cull (digiKam)

1. **Import** — copy RAW files from camera card into `01_Inbox/` or directly into `02_Active/<batch>/`
2. **Organise** — move batches from `01_Inbox/` into `02_Active/<batch-name>/` (e.g. `Czech Republic 2025/`)
3. **Cull** — mark rejects as Rejected (red flag); mark selects as Pending (yellow flag)
4. **Rate** — assign star rating to selects (see rating conventions below)
5. **Tag and title** — set XMP Title, Description, Location, and Subject tags for each keeper
   - Do this **before** exporting — tags set after export are not embedded in the JPEG
   - See metadata conventions and tag list below

### Phase 2 — Edit and export (Darktable)

6. **Edit** — from digiKam, right-click a keeper → Open with → Darktable
7. **Export** — in Darktable lighttable, select edited images → Export using the `Shop export` preset
   - Output lands in `~/Nextcloud/Photography/Workspace/03_Exports/Shop/`
   - Nextcloud syncs it to the server automatically in the background
8. **Mark as Accepted** — back in digiKam, flag exported photos as Accepted (green)

### Phase 3 — Publish to website

Run these from the repo root (`~/Documents/GitHub/julianruizburgos-web`).

```bash
# 1. Scan Shop folder — reads EXIF, updates photos.json with new files
#    Use --sync to also copy photos.json to Nextcloud Shop folder
bash scripts/generate-photos-json.sh \
  ~/Nextcloud/Photography/Workspace/03_Exports/Shop \
  content/photography/photos.json --sync

# 2. Enrich with AI vision — generates titles/descriptions, renames files, writes EXIF
#    Safe to re-run: skips photos that already have a title
ANTHROPIC_API_KEY=sk-ant-... node scripts/enrich-photo-metadata.mjs \
  ~/Nextcloud/Photography/Workspace/03_Exports/Shop \
  content/photography/photos.json \
  content/photography/collections.json --sync

# 3. Auto-generate/update collections from filename prefixes
#    Merges with existing collections — preserves descriptions, badges, coverPhoto
node scripts/generate-collections.mjs \
  content/photography/photos.json \
  content/photography/collections.json \
  --sync ~/Nextcloud/Photography/Workspace/03_Exports/Shop

# 4. (Optional) If you manually edited tags in photos.json, sync them back to EXIF
#    Prevents generate-photos-json.sh from overwriting your edits on the next run
node scripts/sync-tags-to-exif.mjs \
  ~/Nextcloud/Photography/Workspace/03_Exports/Shop \
  content/photography/photos.json

# 5. Commit updated photos.json and collections.json to the repo
git add content/photography/photos.json content/photography/collections.json
git commit -m "photos: add <batch description>"
git push origin main   # triggers Coolify auto-deploy

# 6. Force immediate cache revalidation (instead of waiting up to 5 min)
curl -X POST "https://julianruizburgos.net/api/revalidate?secret=YOUR_ADMIN_SECRET"

# 7. Pre-warm the Next.js image cache (avoids slow first loads for visitors)
bash scripts/warm-cache.sh
```

### Phase 4 — Archive

8. **Archive** — move finished batch folder from `02_Active/` to `05_Archive/`

---

## Metadata conventions

### Pick flags (workflow state)

| Flag | Meaning |
|------|---------|
| No flag | Not yet reviewed |
| Rejected (red) | To be deleted |
| Pending (yellow) | Selected, not yet edited |
| Accepted (green) | Edited and exported to `Shop/` |

### Star ratings (quality)

| Stars | Meaning |
|-------|---------|
| Unrated | Not yet reviewed |
| ★★ | Keep but low priority / won't edit soon |
| ★★★ | Keep, edit this |
| ★★★★★ | Hero shot / best of batch |

### Per-photo metadata (set in digiKam before export)

| Field | XMP/IPTC field | Example |
|-------|----------------|---------|
| Title | `XMP:Title` | "Leenderbos at Dusk" |
| Description | `XMP:Description` | "Golden hour light filtering through oak forest" |
| Location | `IPTC:Location` | "Leenderbos, Netherlands" |
| Tags | `XMP:Subject` | see tag conventions below |

### Tag conventions

- Always **singular** (`mountain` not `mountains`, `cloud` not `clouds`)
- Always **lowercase**
- **High-level only** — no species names (use `insect` not `crane fly`), no colours, no material details
- Target: ~100 unique tags across the full gallery; 1-count tags should be rare

**Broad subject:** `animal`, `landscape`, `plant`

**Specific subject:** `bird`, `mammal`, `insect`, `reptile`, `amphibian`

**Habitat:** `forest`, `coast`, `wetland`, `mountain`, `grassland`, `urban`, `desert`

**Conditions:** `snow`, `fog`, `rain`, `storm`, `night`, `golden-hour`, `blue-hour`

**Style:** `macro`, `aerial`, `panoramic`, `abstract`

---

## Darktable export preset — `Shop export`

| Setting | Value |
|---------|-------|
| Target storage | File on disk |
| Output folder | `~/Nextcloud/Photography/Workspace/03_Exports/Shop/` |
| Filename | `$(FILE_NAME)` (keep original name — enrich script renames) |
| On conflict | Create unique filename |
| File format | JPEG (8-bit) |
| Quality | 95 |
| Chroma subsampling | 4:4:4 |
| Set size | 0×0 (full resolution) |
| High quality resampling | Yes |
| Profile | sRGB |
| Creator | Julian Ruiz Burgos |
| Rights | © Julian Ruiz Burgos. All rights reserved. |

---

## digiKam configuration

- **Collections**: `~/Nextcloud/Photography/Workspace/` (local collection)
- **Metadata backend**: ExifTool (delegated)
- **Sidecars**: Write to XMP sidecar only — never write into RAW files
- **GPS / Face tags**: not written to XMP sidecars

---

## photos.json — EXIF field mapping

The generate script (`scripts/generate-photos-json.sh`) reads these fields:

| `photos.json` field | Source |
|---------------------|--------|
| `filename` | Filename |
| `title` | `XMP:Title` |
| `description` | `XMP:Description` |
| `location` | `IPTC:Location` |
| `tags` | `XMP:Subject` |
| `date` | `EXIF:DateTimeOriginal` |
| `camera` | `EXIF:Model` + `EXIF:LensModel` |
| `widthPx` / `heightPx` | `EXIF:PixelXDimension` / `PixelYDimension` |
| `aspectRatio` | Computed: `widthPx / heightPx` |

`aspectRatio` is always stored as `width/height` — this means portrait photos have values < 1 (e.g. 0.75 for a 4:3 portrait). The website handles both orientations correctly.

---

## Filename convention (after enrich script)

```
<category>_<location>_<descriptive-title>.jpg
```

Examples:
- `landscape_norway_glacier_descending_through_autumn_valley.jpg`
- `wildlife_netherlands_heron_stalking_through_reeds.jpg`
- `macro_belgium_dewdrop_on_spider_silk.jpg`
