import fs from "fs/promises";
import path from "path";

export type PrintSize = "A4" | "A3" | "A2" | "A1";

export interface Photo {
  filename: string;
  title: string;
  date: string;
  displayDate: string;
  location: string;
  description: string | null;
  tags: string[];
  printAvailable: boolean;
  printSizes: PrintSize[];
  priceInPence: number | null;
  aspectRatio: number;
  camera: string | null;
  sortOrder: number | null;
  imageUrl: string; // proxied: /photography/images/<filename>
}

export interface Collection {
  slug: string;
  title: string;
  description: string;
  coverPhoto: string;
  photos: string[]; // ordered filenames
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(isoDate: string): string {
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

function toPhoto(raw: Record<string, unknown>): Photo {
  const filename = String(raw.filename ?? "");
  return {
    filename,
    title: String(raw.title ?? filename),
    date: String(raw.date ?? ""),
    displayDate: formatDate(String(raw.date ?? "")),
    location: String(raw.location ?? ""),
    description: raw.description != null ? String(raw.description) : null,
    tags: Array.isArray(raw.tags) ? raw.tags.map(String) : [],
    printAvailable: Boolean(raw.printAvailable),
    printSizes: Array.isArray(raw.printSizes) ? raw.printSizes.map(String) as PrintSize[] : [],
    priceInPence: typeof raw.priceInPence === "number" ? raw.priceInPence : null,
    aspectRatio: typeof raw.aspectRatio === "number" ? raw.aspectRatio : 1.5,
    camera: raw.camera != null ? String(raw.camera) : null,
    sortOrder: typeof raw.sortOrder === "number" ? raw.sortOrder : null,
    imageUrl: `/photography/images/${encodeURIComponent(filename)}`,
  };
}

function sortPhotos(photos: Photo[]): Photo[] {
  return [...photos].sort((a, b) => {
    const aHasOrder = a.sortOrder !== null;
    const bHasOrder = b.sortOrder !== null;
    if (aHasOrder && bHasOrder) return (a.sortOrder as number) - (b.sortOrder as number);
    if (aHasOrder) return -1;
    if (bHasOrder) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

// ── Nextcloud fetching ────────────────────────────────────────────────────────

const WEBDAV_URL = process.env.NEXTCLOUD_WEBDAV_URL;
const NC_USER = process.env.NEXTCLOUD_USER;
const NC_PASS = process.env.NEXTCLOUD_APP_PASSWORD;
const PHOTOS_PATH = process.env.NEXTCLOUD_PHOTOS_PATH ?? "Photography/Web-ready";

function nextcloudHeaders(): HeadersInit {
  const credentials = Buffer.from(`${NC_USER}:${NC_PASS}`).toString("base64");
  return { Authorization: `Basic ${credentials}` };
}

async function fetchFromNextcloud<T>(filename: string): Promise<T | null> {
  const url = `${WEBDAV_URL}/${PHOTOS_PATH}/${filename}`;
  try {
    const res = await fetch(url, {
      headers: nextcloudHeaders(),
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.error(`Nextcloud fetch failed for ${filename}: ${res.status}`);
      return null;
    }
    return res.json() as Promise<T>;
  } catch (err) {
    console.error(`Nextcloud fetch error for ${filename}:`, err);
    return null;
  }
}

// ── Local dev fallback ────────────────────────────────────────────────────────

const LOCAL_DIR = path.join(process.cwd(), "content", "photography");

async function readLocalJson<T>(filename: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(path.join(LOCAL_DIR, filename), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function fetchJson<T>(filename: string): Promise<T | null> {
  if (WEBDAV_URL && NC_USER && NC_PASS) {
    return fetchFromNextcloud<T>(filename);
  }
  return readLocalJson<T>(filename);
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function getAllPhotos(): Promise<Photo[]> {
  const raw = await fetchJson<Record<string, unknown>[]>("photos.json");
  if (!raw) return [];
  return sortPhotos(raw.map(toPhoto));
}

export async function getTagCounts(): Promise<{ tag: string; count: number }[]> {
  const photos = await getAllPhotos();
  const counts: Record<string, number> = {};
  photos.forEach((p) => p.tags.forEach((t) => { counts[t] = (counts[t] ?? 0) + 1; }));
  return Object.entries(counts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
}

export async function getAllCollections(): Promise<Collection[]> {
  const raw = await fetchJson<Collection[]>("collections.json");
  return raw ?? [];
}

export async function getCollection(slug: string): Promise<{ collection: Collection; photos: Photo[] } | null> {
  const [allPhotos, collections] = await Promise.all([getAllPhotos(), getAllCollections()]);
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) return null;
  const photoMap = new Map(allPhotos.map((p) => [p.filename, p]));
  const photos = collection.photos
    .map((f) => photoMap.get(f))
    .filter((p): p is Photo => p !== undefined);
  return { collection, photos };
}
