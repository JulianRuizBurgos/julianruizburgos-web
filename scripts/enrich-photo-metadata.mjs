#!/usr/bin/env node
/**
 * enrich-photo-metadata.mjs
 *
 * Analyzes photos with Claude vision (Sonnet 4.6) and:
 *   1. Converts PNG/TIF files (including misnamed .jpg files) to proper JPEG
 *   2. Writes title, description, and tags to EXIF via exiftool
 *   3. Renames files to: <category>_<location>_<title>.jpg
 *   4. Updates photos.json and collections.json with new filenames + metadata
 *
 * Requirements:
 *   npm install @anthropic-ai/sdk   (once, in the project root)
 *   exiftool                         (apt install libimage-exiftool-perl)
 *   convert                          (apt install imagemagick)
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-ant-... node scripts/enrich-photo-metadata.mjs \
 *     /path/to/photos/dir \
 *     content/photography/photos.json \
 *     [content/photography/collections.json] \
 *     [--sync]
 *
 * --sync: copy photos.json (and collections.json if provided) into the photos
 *         directory after processing, so Nextcloud picks them up automatically.
 *
 * Only processes photos where title is null in photos.json.
 */

import Anthropic from "@anthropic-ai/sdk";
import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import os from "os";

const execFileAsync = promisify(execFile);

// ── Args ──────────────────────────────────────────────────────────────────────

const args       = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const flags      = process.argv.slice(2).filter((a) => a.startsWith("--"));
const PHOTOS_DIR  = args[0];
const PHOTOS_JSON = args[1];
const COLL_JSON   = args[2] ?? null;
const SYNC        = flags.includes("--sync");

if (!PHOTOS_DIR || !PHOTOS_JSON) {
  console.error(
    "Usage: ANTHROPIC_API_KEY=sk-ant-... node scripts/enrich-photo-metadata.mjs " +
    "<photos-dir> <photos.json> [collections.json] [--sync]"
  );
  process.exit(1);
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("Error: ANTHROPIC_API_KEY environment variable is not set.");
  process.exit(1);
}

const client = new Anthropic();

// ── File format helpers ───────────────────────────────────────────────────────

/** Returns the actual file type as reported by exiftool: "JPEG", "PNG", "TIFF", etc. */
async function detectFileType(filePath) {
  const { stdout } = await execFileAsync("exiftool", ["-FileType", "-s3", filePath]);
  return stdout.trim().toUpperCase();
}

/**
 * Ensures the file at filePath is a proper JPEG.
 * - If it's already JPEG: returns filePath unchanged.
 * - If it's PNG or TIFF (regardless of extension): converts in place to JPEG,
 *   strips all EXIF (to avoid TIFF-format metadata causing exiftool write errors),
 *   deletes the original, and returns the new .jpg path.
 */
async function ensureJpeg(filePath) {
  const fileType = await detectFileType(filePath);
  if (fileType === "JPEG") return filePath;

  const jpegPath = filePath.replace(/\.(jpg|jpeg|png|tif|tiff)$/i, ".jpg");
  const isSamePath = jpegPath.toLowerCase() === filePath.toLowerCase();

  console.log(`  Converting ${fileType} → JPEG...`);
  const tmpOut = isSamePath
    ? path.join(os.tmpdir(), `claude-convert-${Date.now()}.jpg`)
    : jpegPath;

  await execFileAsync("convert", [filePath, "-strip", "-quality", "90", tmpOut]);

  if (isSamePath) {
    // Overwrite the misnamed file
    await fs.rename(tmpOut, filePath);
    return filePath;
  } else {
    // Delete original (e.g. .tif) and return new .jpg path
    await fs.unlink(filePath);
    return jpegPath;
  }
}

// ── Image resize helper ───────────────────────────────────────────────────────

const MAX_SIZE_BYTES = 3 * 1024 * 1024; // base64 adds ~33%, so 3 MB file → ~4 MB encoded, well under the 5 MB API limit

async function prepareForApi(filePath) {
  const stat = await fs.stat(filePath);
  let sourceFile = filePath;
  let tmpFile = null;

  if (stat.size > MAX_SIZE_BYTES) {
    tmpFile = path.join(os.tmpdir(), `claude-resize-${Date.now()}.jpg`);
    await execFileAsync("convert", [filePath, "-resize", "1500x>", "-quality", "82", tmpFile]);
    sourceFile = tmpFile;
  }

  try {
    const data = await fs.readFile(sourceFile);
    return data.toString("base64");
  } finally {
    if (tmpFile) await fs.unlink(tmpFile).catch(() => {});
  }
}

// ── Claude analysis ───────────────────────────────────────────────────────────

async function analyzePhoto(imagePath, existingLocation) {
  const base64 = await prepareForApi(imagePath);

  const locationHint = existingLocation && existingLocation !== "Unknown"
    ? `The photo's location is known to be: "${existingLocation}".`
    : "The location is unknown — include a location field only if you can confidently identify it from the image (a recognisable landmark, city, or natural feature), otherwise set it to null.";

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: "image/jpeg", data: base64 },
          },
          {
            type: "text",
            text: `Analyze this photograph and return a JSON object with exactly these fields:

- "title": a concise, evocative title (3–7 words, Title Case, no punctuation at the end)
- "description": 1–2 sentences describing subject, mood, and/or context
- "tags": array of 3–8 lowercase keyword tags
- "category": a short photography genre prefix, lowercase with underscores if needed
  (e.g. "landscape", "wildlife", "urban", "astrophotography", "macro", "architecture", "portrait")
- "location": place name if identifiable, otherwise null

${locationHint}

Return only the JSON object. No markdown, no explanation, no code fences.`,
          },
        ],
      },
    ],
  });

  const text = response.content.find((b) => b.type === "text")?.text ?? "";
  const cleaned = text.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();
  return JSON.parse(cleaned);
}

// ── Filename generation ───────────────────────────────────────────────────────

function sanitize(str) {
  return str
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/[^a-z0-9\s_]/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_");
}

function generateFilename(category, location, title) {
  const parts = [sanitize(category)];
  if (location && location !== "Unknown") parts.push(sanitize(location));
  parts.push(sanitize(title));
  return parts.join("_") + ".jpg";
}

/** If a file with the target name already exists, append _2, _3, etc. */
async function uniqueFilename(dir, filename) {
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);
  let candidate = filename;
  let counter = 2;
  while (true) {
    try {
      await fs.access(path.join(dir, candidate));
      candidate = `${base}_${counter}${ext}`;
      counter++;
    } catch {
      return candidate; // doesn't exist yet — safe to use
    }
  }
}

// ── EXIF write ────────────────────────────────────────────────────────────────

async function writeExifMetadata(filePath, { title, description, tags }) {
  const subjectArgs = tags.map((t) => `-Subject=${t}`);
  await execFileAsync("exiftool", [
    "-overwrite_original",
    `-Title=${title}`,
    `-Description=${description}`,
    `-XMP-dc:Title=${title}`,
    `-XMP-dc:Description=${description}`,
    ...subjectArgs,
    filePath,
  ]);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const photosRaw = JSON.parse(await fs.readFile(PHOTOS_JSON, "utf-8"));

  let collectionsRaw = null;
  if (COLL_JSON) {
    try {
      collectionsRaw = JSON.parse(await fs.readFile(COLL_JSON, "utf-8"));
    } catch {
      console.warn(`⚠ Could not read ${COLL_JSON} — collection filenames won't be updated.`);
    }
  }

  const toProcess = photosRaw.filter(
    (p) => p.title === null || p.title === p.filename
  );

  const total = toProcess.length;
  console.log(`Found ${total} photo(s) without titles (out of ${photosRaw.length} total).\n`);

  if (total === 0) {
    console.log("Nothing to do.");
    return;
  }

  let processed = 0;
  let errors = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const photo = toProcess[i];
    const progress = `[${i + 1}/${total}]`;
    let currentPath = path.join(PHOTOS_DIR, photo.filename);

    // Check file exists
    try {
      await fs.access(currentPath);
    } catch {
      console.warn(`${progress} ⚠ Skipping ${photo.filename} — file not found`);
      continue;
    }

    process.stdout.write(`${progress} ${photo.filename}... `);

    try {
      // 1. Convert to JPEG if needed (handles PNG, TIFF, misnamed files)
      const convertedPath = await ensureJpeg(currentPath);
      if (convertedPath !== currentPath) {
        // File was renamed on disk (e.g. .tif → .jpg) — update our reference
        const newFilename = path.basename(convertedPath);
        if (collectionsRaw) {
          for (const col of collectionsRaw) {
            col.photos = col.photos.map((f) => f === photo.filename ? newFilename : f);
            if (col.coverPhoto === photo.filename) col.coverPhoto = newFilename;
          }
        }
        photo.filename = newFilename;
        currentPath = convertedPath;
      }

      // 2. Analyze with Claude
      const metadata = await analyzePhoto(currentPath, photo.location);

      // 3. Generate new filename
      const location = metadata.location ?? photo.location;
      const newFilename = await uniqueFilename(
        PHOTOS_DIR,
        generateFilename(metadata.category, location, metadata.title)
      );
      const newPath = path.join(PHOTOS_DIR, newFilename);
      const oldFilename = photo.filename;

      const pct = Math.round(((i + 1) / total) * 100);
      console.log(`✓  (${pct}% complete)`);
      console.log(`  Title:       ${metadata.title}`);
      console.log(`  Description: ${metadata.description}`);
      console.log(`  Tags:        ${metadata.tags.join(", ")}`);
      console.log(`  Renamed:     ${oldFilename} → ${newFilename}`);

      // 4. Write EXIF metadata (before rename to avoid path confusion)
      await writeExifMetadata(currentPath, metadata);

      // 5. Rename file
      if (newPath !== currentPath) {
        await fs.rename(currentPath, newPath);
      }

      // 6. Update photos.json entry
      photo.filename = newFilename;
      photo.title = metadata.title;
      photo.description = metadata.description;
      photo.tags = metadata.tags;
      if (metadata.location) photo.location = metadata.location;

      // 7. Update collections.json references
      if (collectionsRaw && oldFilename !== newFilename) {
        for (const col of collectionsRaw) {
          col.photos = col.photos.map((f) => f === oldFilename ? newFilename : f);
          if (col.coverPhoto === oldFilename) col.coverPhoto = newFilename;
        }
      }

      processed++;
    } catch (err) {
      console.log(`✗`);
      console.error(`  Error: ${err.message}`);
      errors++;
    }

    // Small pause between API calls
    await new Promise((r) => setTimeout(r, 600));
  }

  // Write updated JSON files
  await fs.writeFile(PHOTOS_JSON, JSON.stringify(photosRaw, null, 2) + "\n");
  if (collectionsRaw && COLL_JSON) {
    await fs.writeFile(COLL_JSON, JSON.stringify(collectionsRaw, null, 2) + "\n");
  }

  console.log(`\n─────────────────────────────────────`);
  console.log(`Processed: ${processed}  Errors: ${errors}`);
  console.log(`Updated:   ${PHOTOS_JSON}`);
  if (collectionsRaw && COLL_JSON) console.log(`Updated:   ${COLL_JSON}`);

  if (SYNC) {
    console.log(`\nSyncing JSON files to ${PHOTOS_DIR}...`);
    await fs.copyFile(PHOTOS_JSON, path.join(PHOTOS_DIR, "photos.json"));
    console.log(`  ✓ photos.json`);
    if (collectionsRaw && COLL_JSON) {
      await fs.copyFile(COLL_JSON, path.join(PHOTOS_DIR, "collections.json"));
      console.log(`  ✓ collections.json`);
    }
    console.log(`  Nextcloud will sync automatically.`);
  } else if (processed > 0) {
    console.log(`\nNext steps:`);
    console.log(`  cp ${PHOTOS_JSON} ${PHOTOS_DIR}/photos.json`);
    if (COLL_JSON) console.log(`  cp ${COLL_JSON} ${PHOTOS_DIR}/collections.json`);
    console.log(`  (or re-run with --sync to do this automatically)`);
  }
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
