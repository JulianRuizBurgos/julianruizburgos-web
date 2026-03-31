import { NextRequest, NextResponse } from "next/server";
import path from "path";

const MIME: Record<string, string> = {
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png":  "image/png",
  ".webp": "image/webp",
};

const WEBDAV_URL = process.env.NEXTCLOUD_WEBDAV_URL;
const NC_USER = process.env.NEXTCLOUD_USER;
const NC_PASS = process.env.NEXTCLOUD_APP_PASSWORD;
const PHOTOS_PATH = process.env.NEXTCLOUD_PHOTOS_PATH ?? "Photography/Web-ready";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // Prevent path traversal — only allow a plain filename, no slashes or dots-up
  const safe = path.basename(filename);
  const ext = path.extname(safe).toLowerCase();
  const contentType = MIME[ext];
  if (!contentType) return new NextResponse(null, { status: 404 });

  // ── Nextcloud ───────────────────────────────────────────────────────────────
  if (WEBDAV_URL && NC_USER && NC_PASS) {
    const url = `${WEBDAV_URL}/${PHOTOS_PATH}/${safe}`;
    const credentials = Buffer.from(`${NC_USER}:${NC_PASS}`).toString("base64");
    const res = await fetch(url, { headers: { Authorization: `Basic ${credentials}` } });
    if (!res.ok) return new NextResponse(null, { status: res.status });
    return new NextResponse(res.body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  // ── Local dev fallback: serve placeholder from public/photography/dev/ ──────
  const { default: fs } = await import("fs/promises");
  const localPath = path.join(process.cwd(), "public", "photography", "dev", safe);
  try {
    const data = await fs.readFile(localPath);
    return new NextResponse(data, {
      headers: { "Content-Type": contentType, "Cache-Control": "no-store" },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
