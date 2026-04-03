import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /admin/* except /admin/login
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const secret = process.env.ADMIN_SECRET;

    // If no secret configured, block entirely
    if (!secret) {
      return new NextResponse("Admin access not configured", { status: 503 });
    }

    const auth = req.headers.get("authorization") ?? "";
    let authorised = false;

    if (auth.startsWith("Basic ")) {
      const decoded = Buffer.from(auth.slice(6), "base64").toString("utf-8");
      const colonIndex = decoded.indexOf(":");
      const pass = colonIndex !== -1 ? decoded.slice(colonIndex + 1) : "";
      authorised = pass === secret;
    }

    if (!authorised) {
      return new NextResponse("Authorisation required", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Admin", charset="UTF-8"',
        },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
