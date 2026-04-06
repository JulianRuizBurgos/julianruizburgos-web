#!/usr/bin/env node
/**
 * generate-collections.mjs
 *
 * Auto-generates collections.json by grouping photos from photos.json by
 * their filename category prefix (e.g. landscape_*, urban_*, macro_*).
 *
 * Merge behaviour (when collections.json already exists):
 *   - Existing collections: photo list is updated; description, title, badges,
 *     and coverPhoto are preserved (coverPhoto reset if photo no longer exists).
 *   - New categories: a skeleton collection is created for you to fill in.
 *   - Empty categories (0 photos left): collection is removed.
 *
 * Usage:
 *   node scripts/generate-collections.mjs \
 *     content/photography/photos.json \
 *     content/photography/collections.json \
 *     [--sync <photos-dir>]
 *
 * --sync <photos-dir>: also copy collections.json into <photos-dir> after writing.
 */

import fs from "fs/promises";
import path from "path";

// ── Args ──────────────────────────────────────────────────────────────────────

const args      = process.argv.slice(2);
const syncIdx   = args.indexOf("--sync");
const SYNC_DIR  = syncIdx !== -1 ? args[syncIdx + 1] : null;
const posArgs   = args.filter((a, i) => !a.startsWith("--") && i !== syncIdx + 1);

const PHOTOS_JSON = posArgs[0];
const COLL_JSON   = posArgs[1];

if (!PHOTOS_JSON || !COLL_JSON) {
  console.error(
    "Usage: node scripts/generate-collections.mjs <photos.json> <collections.json> [--sync <photos-dir>]"
  );
  process.exit(1);
}

// ── Category helpers ──────────────────────────────────────────────────────────

// Two-word prefixes that should be treated as a single category
const COMPOUND_PREFIXES = ["still_life", "urban_exploration"];

// Human-readable titles for known categories
const CATEGORY_TITLES = {
  landscape:         "Landscapes",
  urban:             "Urban Photography",
  macro:             "Macro & Nature",
  architecture:      "Architecture",
  still_life:        "Still Life",
  astrophotography:  "Astrophotography",
  wildlife:          "Wildlife",
  nature:            "Nature",
  portrait:          "Portraits",
  street:            "Street Photography",
  abstract:          "Abstract",
};

function extractCategory(filename) {
  const base  = path.basename(filename, path.extname(filename));
  const parts = base.split("_");
  const two   = parts.slice(0, 2).join("_");
  return COMPOUND_PREFIXES.includes(two) ? two : parts[0];
}

function slugify(category) {
  return category.toLowerCase().replace(/\s+/g, "_");
}

function humanTitle(category) {
  return (
    CATEGORY_TITLES[category] ??
    category
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const photosRaw = JSON.parse(await fs.readFile(PHOTOS_JSON, "utf-8"));

  // Group photos by category, preserving order from photos.json
  const groups = new Map(); // category → Photo[]
  for (const photo of photosRaw) {
    const cat = extractCategory(photo.filename);
    if (!groups.has(cat)) groups.set(cat, []);
    groups.get(cat).push(photo);
  }

  // Load existing collections (for merge)
  let existing = [];
  try {
    existing = JSON.parse(await fs.readFile(COLL_JSON, "utf-8"));
  } catch {
    // No existing file — start fresh
  }
  const existingBySlug = new Map(existing.map((c) => [c.slug, c]));

  const result = [];

  for (const [category, photos] of groups) {
    if (photos.length === 0) continue;

    const slug  = slugify(category);
    const prior = existingBySlug.get(slug);

    const photoFilenames = photos.map((p) => p.filename);

    // Determine cover photo: keep existing if still valid, else use first photo
    const coverPhoto =
      prior?.coverPhoto && photoFilenames.includes(prior.coverPhoto)
        ? prior.coverPhoto
        : photoFilenames[0];

    result.push({
      slug,
      title:       prior?.title       ?? humanTitle(category),
      description: prior?.description ?? "",
      coverPhoto,
      ...(prior?.badges ? { badges: prior.badges } : {}),
      photos: photoFilenames,
    });
  }

  // Sort: put existing collections first (preserving their order), new ones at end
  const existingSlugs = existing.map((c) => c.slug);
  result.sort((a, b) => {
    const ai = existingSlugs.indexOf(a.slug);
    const bi = existingSlugs.indexOf(b.slug);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  await fs.writeFile(COLL_JSON, JSON.stringify(result, null, 2) + "\n");

  // Summary
  const newCats    = result.filter((c) => !existingSlugs.includes(c.slug));
  const removed    = existing.filter((c) => !result.find((r) => r.slug === c.slug));
  const updated    = result.filter((c) =>  existingSlugs.includes(c.slug));

  console.log(`Written: ${COLL_JSON}`);
  console.log(`  ${updated.length} collection(s) updated`);
  if (newCats.length)  console.log(`  ${newCats.length} new collection(s): ${newCats.map((c) => c.slug).join(", ")}`);
  if (removed.length)  console.log(`  ${removed.length} collection(s) removed (no photos): ${removed.map((c) => c.slug).join(", ")}`);

  if (newCats.length) {
    console.log(`\nNew collections have empty descriptions — edit ${COLL_JSON} to fill them in.`);
  }

  if (SYNC_DIR) {
    await fs.copyFile(COLL_JSON, path.join(SYNC_DIR, "collections.json"));
    console.log(`\nSynced to ${SYNC_DIR}/collections.json`);
  }
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
