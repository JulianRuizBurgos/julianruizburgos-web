import { Resend } from "resend";
import type { OrderItem, PostcardDetail } from "@/lib/db";
import { formatPrice } from "@/lib/shop";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_ADDRESS = "Julian Ruiz Burgos <orders@julianruizburgos.net>";
const JULIAN_EMAIL = "printshop@julianruizburgos.net";

function itemDescription(item: OrderItem, postcard?: PostcardDetail): string {
  if (item.product_type === "postcard" && postcard) {
    const style = postcard.text_style === "handwritten" ? "handwritten" : "printed";
    return `${item.photo_title} — Postcard to ${postcard.recipient_name} (${style})`;
  }
  return `${item.photo_title} — ${item.size}, ${item.paper_type}`;
}

interface SendEmailsParams {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  postcardDetails: PostcardDetail[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
}

export async function sendOrderEmails(params: SendEmailsParams): Promise<void> {
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping order emails");
    return;
  }

  const {
    orderId,
    customerName,
    customerEmail,
    items,
    postcardDetails,
    subtotalCents,
    shippingCents,
    totalCents,
  } = params;

  const postcardMap = new Map(postcardDetails.map((p) => [p.order_item_id, p]));

  const itemLines = items
    .map((item) => {
      const pc = item.product_type === "postcard" ? postcardMap.get(item.id) : undefined;
      return `  • ${itemDescription(item, pc)}  ${formatPrice(item.price_cents)}`;
    })
    .join("\n");

  // ── Customer confirmation ──────────────────────────────────────────────────
  const customerBody = `
Hi ${customerName},

Thank you for your order! Here's your confirmation.

Order reference: ${orderId.slice(0, 8).toUpperCase()}

${itemLines}
${shippingCents > 0 ? `  Shipping: ${formatPrice(shippingCents)}\n` : ""}
Total: ${formatPrice(totalCents)}

Julian will prepare and ship your order personally. You'll receive a follow-up email when it's on its way.

If you have any questions, reply to this email or write to ${JULIAN_EMAIL}.

Thank you,
Julian
`.trim();

  // ── Julian notification ───────────────────────────────────────────────────
  const postcardItemDetails = items
    .filter((i) => i.product_type === "postcard")
    .map((item) => {
      const pc = postcardMap.get(item.id);
      if (!pc) return "";
      return [
        `  Photo: ${item.photo_title}`,
        `  Recipient: ${pc.recipient_name}`,
        `  Address: ${pc.address_line1}${pc.address_line2 ? ", " + pc.address_line2 : ""}, ${pc.city}, ${pc.postcode}, ${pc.country}`,
        `  Message: "${pc.message_text}"`,
        `  Style: ${pc.text_style}`,
        `  From: ${pc.sender_name}`,
      ].join("\n");
    })
    .filter(Boolean)
    .join("\n\n");

  const julianBody = `
New order received!

Order ID: ${orderId}
Customer: ${customerName} <${customerEmail}>
Total: ${formatPrice(totalCents)}

Items:
${itemLines}
${shippingCents > 0 ? `Shipping: ${formatPrice(shippingCents)}\n` : ""}
${
  postcardItemDetails
    ? `\nPostcard details:\n${postcardItemDetails}`
    : ""
}

Manage orders: https://julianruizburgos.net/admin/orders
`.trim();

  await Promise.allSettled([
    resend.emails.send({
      from: FROM_ADDRESS,
      to: customerEmail,
      subject: `Order confirmed — ref. ${orderId.slice(0, 8).toUpperCase()}`,
      text: customerBody,
    }),
    resend.emails.send({
      from: FROM_ADDRESS,
      to: JULIAN_EMAIL,
      subject: `New order from ${customerName} — ${formatPrice(totalCents)}`,
      text: julianBody,
    }),
  ]);
}

export async function sendDispatchEmail(
  customerEmail: string,
  customerName: string,
  orderId: string,
  trackingNumber?: string
): Promise<void> {
  if (!resend) return;

  const body = `
Hi ${customerName},

Your order (ref. ${orderId.slice(0, 8).toUpperCase()}) has been dispatched!
${trackingNumber ? `\nTracking number: ${trackingNumber}\n` : ""}
It should arrive within a few days. Thank you for supporting my work.

Julian
`.trim();

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: customerEmail,
    subject: `Your order is on its way — ref. ${orderId.slice(0, 8).toUpperCase()}`,
    text: body,
  });
}
