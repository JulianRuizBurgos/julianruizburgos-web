import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const MIME: Record<string, string> = {
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif":  "image/gif",
  ".webp": "image/webp",
  ".svg":  "image/svg+xml",
  ".pdf":  "application/pdf",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string; file: string[] }> }
) {
  const { slug, file } = await params;

  // Prevent path traversal
  const safeParts = [slug, ...file].map((p) => path.basename(p));
  const filePath = path.join(process.cwd(), "content", "blog", ...safeParts);

  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] ?? "application/octet-stream";
    return new NextResponse(data, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
