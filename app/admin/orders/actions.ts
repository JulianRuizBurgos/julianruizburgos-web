"use server";

import { query } from "@/lib/db";

export async function updateOrderStatus(
  id: string,
  status: string,
  trackingNumber: string
): Promise<void> {
  const allowed = ["paid", "dispatched", "mailed", "cancelled"];
  if (!allowed.includes(status)) throw new Error("Invalid status");

  const sets = ["updated_at = now()", "status = $1"];
  const vals: unknown[] = [status];

  if (trackingNumber) {
    vals.push(trackingNumber);
    sets.push(`tracking_number = $${vals.length}`);
  }

  vals.push(id);
  const rows = await query<{ id: string }>(
    `UPDATE orders SET ${sets.join(", ")} WHERE id = $${vals.length} RETURNING id`,
    vals
  );

  if (rows.length === 0) throw new Error("Order not found");

  if (status === "dispatched") {
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
        trackingNumber || order[0].tracking_number || undefined
      );
    }
  }
}
