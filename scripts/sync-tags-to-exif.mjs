#!/usr/bin/env node
/**
 * sync-tags-to-exif.mjs
 * Writes the tags from photos.json back into each JPEG's EXIF Subject field.
 * Run this after any tag cleanup to keep the source files in sync — otherwise
 * re-running generate-photos-json.sh would overwrite cleaned tags with old ones.
 *
 * Requirements: exiftool
 * Usage: node scripts/sync-tags-to-exif.mjs <photos-dir> <photos.json>
 *
 * Example:
 *   node scripts/sync-tags-to-exif.mjs \
 *     ~/Nextcloud/Photography/Workspace/03_Exports/Shop \
 *     content/photography/photos.json
 */

import { readFile } from "fs/promises";
import { join } from "path";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

const [, , photosDir, jsonPath] = process.argv;
if (!photosDir || !jsonPath) {
  console.error("Usage: node sync-tags-to-exif.mjs <photos-dir> <photos.json>");
  process.exit(1);
}

const photos = JSON.parse(await readFile(jsonPath, "utf-8"));
const total = photos.length;
let done = 0;
let skipped = 0;

for (const photo of photos) {
  const filePath = join(photosDir, photo.filename);
  const tags = photo.tags ?? [];

  // Build exiftool args: clear Subject then add each tag
  const args = [
    "-overwrite_original",
    "-Subject=",                      // clear existing
    ...tags.map((t) => `-Subject=${t}`),
    filePath,
  ];

  try {
    await execFileAsync("exiftool", args);
  } catch {
    console.warn(`  ⚠ skipped ${photo.filename} (file not found or exiftool error)`);
    skipped++;
    done++;
    process.stdout.write(`\r[${done}/${total}] ${skipped} skipped`);
    continue;
  }

  done++;
  process.stdout.write(`\r[${done}/${total}] ${photo.filename.slice(0, 60).padEnd(60)}`);
}

console.log(`\n\nDone. ${done - skipped} updated, ${skipped} skipped.`);
