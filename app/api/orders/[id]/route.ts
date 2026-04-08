import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

function isAdminAuthorised(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;

  const auth = req.headers.get("authorization") ?? "";
  // Bearer token
  if (auth.startsWith("Bearer ")) {
    return auth.slice(7) === secret;
  }
  // Basic auth (username:secret)
  if (auth.startsWith("Basic ")) {
    const decoded = Buffer.from(auth.slice(6), "base64").toString("utf-8");
    const colonIndex = decoded.indexOf(":");
    const pass = colonIndex !== -1 ? decoded.slice(colonIndex + 1) : "";
    return pass === secret;
  }
  return false;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthorised(req)) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { id } = await params;

  let body: { status?: string; trackingNumber?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const allowed = ["paid", "dispatched", "mailed", "cancelled"];
  if (body.status && !allowed.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const { query } = await import("@/lib/db");

    const sets: string[] = ["updated_at = now()"];
    const vals: unknown[] = [];

    if (body.status) {
      vals.push(body.status);
      sets.push(`status = $${vals.length}`);
    }
    if (body.trackingNumber !== undefined) {
      vals.push(body.trackingNumber || null);
      sets.push(`tracking_number = $${vals.length}`);
    }

    vals.push(id);
    const rows = await query<{ id: string }>(
      `UPDATE orders SET ${sets.join(", ")} WHERE id = $${vals.length} RETURNING id`,
      vals
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Send dispatch email if status changed to dispatched
    if (body.status === "dispatched") {
      const order = await query<{
        customer_email: string;
        customer_name: string;
        tracking_number: string | null;
        stripe_payment_id: string;
      }>(
        "SELECT customer_email, customer_name, tracking_number, stripe_payment_id FROM orders WHERE id = $1",
        [id]
      );
      if (order[0]) {
        const { sendDispatchEmail } = await import("@/lib/email");
        await sendDispatchEmail(
          order[0].customer_email,
          order[0].customer_name,
          order[0].stripe_payment_id.slice(-8).toUpperCase(),
          body.trackingNumber ?? order[0].tracking_number ?? undefined
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PATCH /api/orders/[id] error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
