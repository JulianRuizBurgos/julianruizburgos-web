import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Order, OrderItem, PostcardDetail } from "@/lib/db";
import AdminOrdersClient from "./AdminOrdersClient";

// ── Server-side auth check (HTTP Basic) ───────────────────────────────────────

async function checkAuth(): Promise<boolean> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;

  const hdrs = await headers();
  const auth = hdrs.get("authorization") ?? "";
  if (!auth.startsWith("Basic ")) return false;

  const decoded = Buffer.from(auth.slice(6), "base64").toString("utf-8");
  const [, pass] = decoded.split(":");
  return pass === secret;
}

// ── Data fetching ─────────────────────────────────────────────────────────────

export type OrderItemWithPostcard = OrderItem & { postcard?: PostcardDetail };

async function fetchOrders(): Promise<(Order & { items: OrderItemWithPostcard[] })[]> {
  try {
    const { initSchema, query } = await import("@/lib/db");
    await initSchema();

    const orders = await query<Order>(
      "SELECT * FROM orders ORDER BY created_at DESC LIMIT 200"
    );

    const items = await query<OrderItem>(
      `SELECT * FROM order_items WHERE order_id = ANY($1)`,
      [orders.map((o) => o.id)]
    );

    const postcardItemIds = items
      .filter((i) => i.product_type === "postcard")
      .map((i) => i.id);

    const postcardDetails =
      postcardItemIds.length > 0
        ? await query<PostcardDetail>(
            `SELECT * FROM postcard_details WHERE order_item_id = ANY($1)`,
            [postcardItemIds]
          )
        : [];

    const postcardByItem = new Map<string, PostcardDetail>();
    for (const pd of postcardDetails) {
      postcardByItem.set(pd.order_item_id, pd);
    }

    const itemsByOrder = new Map<string, OrderItemWithPostcard[]>();
    for (const item of items) {
      const list = itemsByOrder.get(item.order_id) ?? [];
      list.push({ ...item, postcard: postcardByItem.get(item.id) });
      itemsByOrder.set(item.order_id, list);
    }

    return orders.map((o) => ({ ...o, items: itemsByOrder.get(o.id) ?? [] }));
  } catch (err) {
    console.error("Admin orders fetch error:", err);
    return [];
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AdminOrdersPage() {
  const authed = await checkAuth();
  if (!authed) {
    // Prompt Basic Auth by returning a 401 — Next.js can't set WWW-Authenticate headers
    // from a page, so we redirect to a login prompt. The middleware handles it properly.
    redirect("/admin/login");
  }

  const orders = await fetchOrders();

  return (
    <div className="bg-earth-50 min-h-screen pt-28">
      <div className="max-w-5xl mx-auto px-6 pb-24">
        {/* Header */}
        <div className="mb-8 border-t-2 border-earth-900 pt-6">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-earth-600">
            Admin
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-earth-900">
            Orders.
          </h1>
          <p className="mt-1 text-sm text-earth-600">
            {orders.length} order{orders.length !== 1 ? "s" : ""}
          </p>
        </div>

        {orders.length === 0 ? (
          <p className="text-earth-600 italic">No orders yet.</p>
        ) : (
          <AdminOrdersClient orders={orders} />
        )}
      </div>
    </div>
  );
}
