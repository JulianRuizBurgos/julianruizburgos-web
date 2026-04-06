import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * On-demand cache revalidation for photography data.
 * Call this after syncing photos.json / collections.json to Nextcloud
 * to force the site to pick up changes immediately instead of waiting
 * for the 5-minute cache window.
 *
 * Usage:
 *   curl -X POST "https://julianruizburgos.net/api/revalidate?secret=YOUR_ADMIN_SECRET"
 */
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidateTag("photos", "default");

  return NextResponse.json({ revalidated: true });
}
