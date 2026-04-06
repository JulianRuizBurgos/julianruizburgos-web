#!/usr/bin/env node
/**
 * enrich-photo-metadata.mjs
 *
 * Analyzes photos with Claude vision (Opus 4.6) and writes title, description,
 * and tags back to EXIF metadata via exiftool. Also updates photos.json in place.
 *
 * Requirements:
 *   npm install @anthropic-ai/sdk   (once, in the project root)
 *   exiftool                         (apt install libimage-exiftool-perl)
 *   convert                          (apt install imagemagick) — for resizing large images
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-ant-... node scripts/enrich-photo-metadata.mjs \
 *     /path/to/photos/dir content/photography/photos.json
 *
 * Only processes photos where title is null in photos.json.
 * Afterwards, copy photos.json to Nextcloud to publish the changes.
 */

import Anthropic from "@anthropic-ai/sdk";
import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import os from "os";

const execFileAsync = promisify(execFile);

// ── Args ──────────────────────────────────────────────────────────────────────

const PHOTOS_DIR = process.argv[2];
const PHOTOS_JSON = process.argv[3];

if (!PHOTOS_DIR || !PHOTOS_JSON) {
  console.error(
    "Usage: ANTHROPIC_API_KEY=sk-ant-... node scripts/enrich-photo-metadata.mjs <photos-dir> <photos.json>"
  );
  process.exit(1);
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("Error: ANTHROPIC_API_KEY environment variable is not set.");
  process.exit(1);
}

const client = new Anthropic();

// ── Image helpers ─────────────────────────────────────────────────────────────

const MAX_SIZE_BYTES = 4 * 1024 * 1024; // 4 MB — safe margin for base64 encoding

async function getFileSizeBytes(filePath) {
  const stat = await fs.stat(filePath);
  return stat.size;
}

/** Resize image to max 1500px wide using ImageMagick convert. Returns temp path. */
async function resizeImage(inputPath) {
  const tmpFile = path.join(os.tmpdir(), `claude-resize-${Date.now()}.jpg`);
  await execFileAsync("convert", [
    inputPath,
    "-resize", "1500x>",  // only downscale, never upscale
    "-quality", "82",
    tmpFile,
  ]);
  return tmpFile;
}

/** Returns base64-encoded JPEG ready for the API, resizing if needed. */
async function prepareImage(filePath) {
  const size = await getFileSizeBytes(filePath);

  if (size <= MAX_SIZE_BYTES) {
    const data = await fs.readFile(filePath);
    return data.toString("base64");
  }

  // Try to resize with ImageMagick
  let tmpFile = null;
  try {
    tmpFile = await resizeImage(filePath);
    const data = await fs.readFile(tmpFile);
    return data.toString("base64");
  } finally {
    if (tmpFile) await fs.unlink(tmpFile).catch(() => {});
  }
}

// ── Claude analysis ───────────────────────────────────────────────────────────

async function analyzePhoto(imagePath) {
  const base64 = await prepareImage(imagePath);

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
- "description": 1–2 sentences describing subject, mood, and/or location context
- "tags": an array of 3–8 lowercase keyword tags (e.g. ["wildlife", "heron", "canal", "mist"])

Return only the JSON object. No markdown, no explanation, no code fences.`,
          },
        ],
      },
    ],
  });

  const text = response.content.find((b) => b.type === "text")?.text ?? "";
  // Strip accidental markdown fences
  const cleaned = text.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();
  return JSON.parse(cleaned);
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
  const raw = JSON.parse(await fs.readFile(PHOTOS_JSON, "utf-8"));

  const toProcess = raw.filter(
    (p) => p.title === null || p.title === p.filename
  );

  console.log(
    `Found ${toProcess.length} photo(s) without titles (out of ${raw.length} total).\n`
  );

  if (toProcess.length === 0) {
    console.log("Nothing to do.");
    return;
  }

  let processed = 0;
  let errors = 0;
  const total = toProcess.length;

  for (let i = 0; i < toProcess.length; i++) {
    const photo = toProcess[i];
    const filePath = path.join(PHOTOS_DIR, photo.filename);
    const progress = `[${i + 1}/${total}]`;

    // Check the file exists locally
    try {
      await fs.access(filePath);
    } catch {
      console.warn(`${progress} ⚠ Skipping ${photo.filename} — file not found`);
      continue;
    }

    process.stdout.write(`${progress} ${photo.filename}... `);

    try {
      const metadata = await analyzePhoto(filePath);

      const pct = Math.round(((i + 1) / total) * 100);
      console.log(`✓  (${pct}% complete)`);
      console.log(`  Title:       ${metadata.title}`);
      console.log(`  Description: ${metadata.description}`);
      console.log(`  Tags:        ${metadata.tags.join(", ")}`);

      await writeExifMetadata(filePath, metadata);

      // Update in-memory record
      photo.title = metadata.title;
      photo.description = metadata.description;
      photo.tags = metadata.tags;

      processed++;
    } catch (err) {
      console.log(`✗`);
      console.error(`  Error: ${err.message}`);
      errors++;
    }

    // Small pause between API calls
    await new Promise((r) => setTimeout(r, 600));
  }

  // Write updated photos.json
  await fs.writeFile(PHOTOS_JSON, JSON.stringify(raw, null, 2) + "\n");

  console.log(`\n─────────────────────────────────────`);
  console.log(`Processed: ${processed}  Errors: ${errors}`);
  console.log(`Updated:   ${PHOTOS_JSON}`);
  if (processed > 0) {
    console.log(`\nNext steps:`);
    console.log(`  1. Review the updated photos.json`);
    console.log(`  2. cp ${PHOTOS_JSON} ${PHOTOS_DIR}/photos.json`);
    console.log(`     (Nextcloud will sync it automatically)`);
  }
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
