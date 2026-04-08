"use client";

import { useState } from "react";
import type { Order } from "@/lib/db";
import type { OrderItemWithPostcard } from "./page";
import { formatPrice } from "@/lib/shop";
import { updateOrderStatus } from "./actions";

type OrderWithItems = Order & { items: OrderItemWithPostcard[] };

const STATUS_LABELS: Record<string, string> = {
  paid:       "Paid",
  dispatched: "Dispatched",
  mailed:     "Mailed",
  cancelled:  "Cancelled",
};

const STATUS_COLOURS: Record<string, string> = {
  paid:       "bg-terracotta-100 text-terracotta-700",
  dispatched: "bg-stone-100 text-stone-700",
  mailed:     "bg-olive-100 text-olive-700",
  cancelled:  "bg-earth-100 text-earth-500",
};

function OrderRow({ order }: { order: OrderWithItems }) {
  const [status, setStatus] = useState(order.status);
  const [tracking, setTracking] = useState(order.tracking_number ?? "");
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(false);

  async function save(newStatus: string) {
    setSaving(true);
    try {
      await updateOrderStatus(order.id, newStatus, tracking);
      setStatus(newStatus);
    } finally {
      setSaving(false);
    }
  }

  const date = new Date(order.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="border-t border-earth-200 py-5">
      {/* Summary row */}
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-earth-900">{order.customer_name}</p>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLOURS[status] ?? "bg-earth-100 text-earth-600"}`}
            >
              {STATUS_LABELS[status] ?? status}
            </span>
          </div>
          <p className="text-sm text-earth-600">{order.customer_email}</p>
          <p className="mt-0.5 text-xs text-earth-400">{date}</p>
          <p className="mt-0.5 font-mono text-xs text-earth-400">
            ref: {order.stripe_payment_id.slice(-8).toUpperCase()}
          </p>
        </div>

        <div className="text-right shrink-0">
          <p className="font-serif text-lg text-earth-900">
            {formatPrice(order.total_cents)}
          </p>
          <p className="text-xs text-earth-600">
            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
          </p>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-1 text-xs text-[#1068b6] underline underline-offset-1 hover:opacity-80 transition-opacity"
          >
            {expanded ? "Hide" : "Details"}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="mt-4 flex flex-col gap-4">
          {/* Items */}
          <div className="rounded bg-earth-50 border border-earth-100 px-4 py-3 text-sm">
            {order.items.map((item) => (
              <div key={item.id} className="py-2 border-b border-earth-100 last:border-0">
                <div className="flex justify-between">
                  <span className="text-earth-700">
                    {item.photo_title}
                    {item.product_type === "print"
                      ? ` — ${item.size}, ${item.paper_type}`
                      : item.product_type === "blank-postcard"
                      ? ` — Blank postcard ×${item.quantity}`
                      : " — Postcard"}
                  </span>
                  <span className="text-earth-900 font-medium ml-4">
                    {formatPrice(item.price_cents)}
                  </span>
                </div>
                {item.product_type === "postcard" && item.postcard && (
                  <div className="mt-2 ml-2 border-l-2 border-terracotta-200 pl-3 text-xs text-earth-600 space-y-0.5">
                    <p><span className="font-semibold text-earth-700">To:</span> {item.postcard.recipient_name}</p>
                    <p>{item.postcard.address_line1}{item.postcard.address_line2 ? `, ${item.postcard.address_line2}` : ""}</p>
                    <p>{item.postcard.city}, {item.postcard.postcode}, {item.postcard.country}</p>
                    <p><span className="font-semibold text-earth-700">From:</span> {item.postcard.sender_name}</p>
                    <p><span className="font-semibold text-earth-700">Style:</span> {item.postcard.text_style}</p>
                    <p className="mt-1 italic text-earth-500">&ldquo;{item.postcard.message_text}&rdquo;</p>
                  </div>
                )}
              </div>
            ))}
            {order.shipping_cents > 0 && (
              <div className="flex justify-between py-1 text-earth-600">
                <span>Shipping</span>
                <span>{formatPrice(order.shipping_cents)}</span>
              </div>
            )}
          </div>

          {/* Shipping address */}
          {order.shipping_address1 && (
            <div className="text-sm text-earth-600">
              <p className="text-xs font-semibold uppercase tracking-wider text-earth-400 mb-1">
                Ship to
              </p>
              <p>{order.shipping_name}</p>
              <p>{order.shipping_address1}{order.shipping_address2 ? `, ${order.shipping_address2}` : ""}</p>
              <p>{order.shipping_city}, {order.shipping_postcode}</p>
              <p>{order.shipping_country}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Tracking field */}
            <input
              type="text"
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              placeholder="Tracking number (optional)"
              className="rounded border border-earth-200 bg-earth-50 px-3 py-1.5 text-sm text-earth-900 placeholder:text-earth-400 focus:border-[#1068b6] focus:outline-none w-52"
            />

            {status === "paid" && (
              <button
                onClick={() => save("dispatched")}
                disabled={saving}
                className="rounded bg-[#1068b6] px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Mark dispatched"}
              </button>
            )}
            {(status === "paid" && order.items.some((i) => i.product_type === "postcard")) && (
              <button
                onClick={() => save("mailed")}
                disabled={saving}
                className="rounded bg-olive-600 px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Mark mailed"}
              </button>
            )}
            {status !== "cancelled" && (
              <button
                onClick={() => save("cancelled")}
                disabled={saving}
                className="rounded border border-earth-300 px-4 py-1.5 text-xs text-earth-500 transition-colors hover:border-terracotta-400 hover:text-terracotta-600 disabled:opacity-50"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersClient({
  orders,
}: {
  orders: OrderWithItems[];
}) {
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      {/* Status filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {["all", "paid", "dispatched", "mailed", "cancelled"].map((s) => {
          const count =
            s === "all" ? orders.length : orders.filter((o) => o.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                filter === s
                  ? "border-earth-900 bg-earth-900 text-white"
                  : "border-earth-300 text-earth-600 hover:border-earth-600"
              }`}
            >
              {s === "all" ? "All" : STATUS_LABELS[s]} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders */}
      {filtered.length === 0 ? (
        <p className="text-earth-600 italic">No orders in this category.</p>
      ) : (
        filtered.map((order) => <OrderRow key={order.id} order={order} />)
      )}
    </div>
  );
}
