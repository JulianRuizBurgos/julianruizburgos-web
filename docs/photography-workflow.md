# Photography workflow

## Tools
- **digiKam** — library management, culling, rating, tagging, metadata editing
- **Darktable** — RAW editing and JPEG export
- **Nextcloud desktop client** — syncs local folders to remote Nextcloud

---

## Folder structure (Nextcloud)

```
Photography/
  Camera workspace/
    01_Inbox/          ← fresh imports, unsorted
    02_Active/         ← batches mid-edit (subfolders by project/trip)
    03_Exports/
        Shop/          ← full resolution JPEG exports — source for website + print orders
        Personal/      ← personal exports (family, friends, etc.)
    04_Printing/       ← printer templates, ICC profiles, invoices
    05_Archive/        ← finished batches (RAWs kept, editing done)
```

---

## Workflow steps

1. **Import** — copy RAW files from camera card into `01_Inbox/` or directly into a named subfolder in `02_Active/`
2. **Organise** — move batches from `01_Inbox/` into `02_Active/<project>/` (e.g. `Czech Republic 2025/`)
3. **Cull + rate + tag** — in digiKam (see metadata conventions below)
4. **Edit** — open keepers in Darktable from digiKam (right-click → open with Darktable)
5. **Export** — from Darktable lighttable, use the `Print export` preset → JPEG lands in `03_Exports/Shop/`
6. **Update photos.json** — run the generation script to update the website manifest
7. **Archive** — move finished batches from `02_Active/` to `05_Archive/`

**Important:** tag and title photos in digiKam *before* exporting. Tags set after export are not embedded in the JPEG.

---

## Metadata conventions

### Pick flags (workflow state)
| Flag | Meaning |
|---|---|
| No flag | Not yet reviewed |
| Rejected (red) | To be deleted |
| Pending (yellow) | Selected, not yet edited |
| Accepted (green) | Edited and exported to `03_Exports/Shop/` |

### Star ratings (quality)
| Stars | Meaning |
|---|---|
| Unrated | Not yet reviewed |
| ★★ | Keep but low priority / won't edit soon |
| ★★★ | Keep, edit this |
| ★★★★★ | Hero shot / best of batch |

### Per-photo metadata fields (set in digiKam before export)
| Field | XMP field | Example |
|---|---|---|
| Title | `XMP:Title` | "Leenderbos at Dusk" |
| Description | `XMP:Description` | "Golden hour light filtering through oak forest" |
| Location | `IPTC:Location` | "Leenderbos, Netherlands" |
| Tags | `XMP:Subject` | see tag list below |

### Tag list (flat, singular)

**Broad subject:** `animal`, `landscape`, `plant`

**Specific subject:** `bird`, `mammal`, `insect`, `reptile`

**Habitat:** `forest`, `coast`, `wetland`, `mountain`, `grassland`, `urban`

**Style:** `macro`, `aerial`

Assign both broad and specific tags — e.g. a duck photo gets `animal` + `bird`.

---

## Darktable export preset — `Print export`

| Setting | Value |
|---|---|
| Target storage | file on disk |
| Output folder | `~/Nextcloud/Photography/Camera workspace/03_Exports/Shop/` |
| Filename | `$(FILE_NAME)` (keep original name) |
| On conflict | create unique filename |
| File format | JPEG (8-bit) |
| Quality | 95 |
| Chroma subsampling | 4:4:4 |
| Set size | 0×0 (full resolution) |
| High quality resampling | yes |
| Profile | sRGB (web-safe) |
| Creator | Julian Ruiz Burgos |
| Rights | © Julian Ruiz Burgos. All rights reserved. |

---

## digiKam configuration summary

- **Collections**: `~/Nextcloud/Photography/Camera workspace/` (local collection)
- **Metadata backend**: ExifTool (delegated)
- **Sidecars**: Write to XMP sidecar only — never write into RAW files
- **GPS / Face tags**: not written to XMP sidecars
- **RAW editor**: Darktable (via "Always open Raw Import Tool → Raw Import using DarkTable")

---

## photos.json generation

Script: `scripts/generate-photos-json.sh` — reads all JPEGs in `03_Exports/Shop/` via ExifTool, outputs `content/photography/photos.json`.

Field mapping:

| `photos.json` field | Source |
|---|---|
| `filename` | filename |
| `title` | `XMP:Title` |
| `description` | `XMP:Description` |
| `location` | `IPTC:Location` |
| `tags` | `XMP:Subject` |
| `date` | `EXIF:DateTimeOriginal` |
| `camera` | `EXIF:Model` + `EXIF:LensModel` |
| `widthPx` / `heightPx` | `EXIF:PixelXDimension` / `PixelYDimension` |
| `aspectRatio` | computed from width/height |
