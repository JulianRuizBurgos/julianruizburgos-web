import { NextRequest, NextResponse } from "next/server";
import { createMollieClient, type Payment } from "@mollie/api-client";

function getMollie() {
  if (!process.env.MOLLIE_API_KEY) {
    throw new Error("MOLLIE_API_KEY is not set");
  }
  return createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });
}

export async function POST(req: NextRequest) {
  if (!process.env.MOLLIE_API_KEY) {
    return NextResponse.json({ error: "Payment not configured" }, { status: 503 });
  }

  // Mollie sends application/x-www-form-urlencoded with a single "id" field
  const text = await req.text();
  const params = new URLSearchParams(text);
  const paymentId = params.get("id");

  if (!paymentId) {
    return NextResponse.json({ error: "Missing payment id" }, { status: 400 });
  }

  const mollie = getMollie();

  // Fetch payment from Mollie to verify status (Mollie has no webhook signature)
  let payment;
  try {
    payment = await mollie.payments.get(paymentId);
  } catch (err) {
    console.error("Failed to fetch Mollie payment:", err);
    return NextResponse.json({ error: "Could not verify payment" }, { status: 500 });
  }

  if (payment.status !== "paid") {
    // Not paid yet — return 200 so Mollie doesn't retry
    return NextResponse.json({ received: true });
  }

  // Check if a refund has been issued on this payment
  const refundedValue = parseFloat((payment.amountRefunded as { value: string } | undefined)?.value ?? "0");

  try {
    if (refundedValue > 0) {
      await handleRefund(payment, refundedValue);
    } else {
      await handlePaymentSucceeded(payment);
    }
  } catch (err) {
    console.error("Error handling Mollie webhook:", err);
    // Return 200 so Mollie doesn't retry — log for manual recovery
    return NextResponse.json({ received: true, error: "Internal processing error" });
  }

  return NextResponse.json({ received: true });
}

async function handleRefund(payment: Payment, refundedValue: number) {
  const { initSchema, query } = await import("@/lib/db");
  await initSchema();

  const refundedCents = Math.round(refundedValue * 100);

  // Look up the order
  const rows = await query<{ id: string; status: string; customer_name: string; customer_email: string }>(
    "SELECT id, status, customer_name, customer_email FROM orders WHERE stripe_payment_id = $1",
    [payment.id]
  );
  if (rows.length === 0) {
    console.warn(`Refund webhook for unknown payment ${payment.id} — no order found`);
    return;
  }

  const order = rows[0];
  if (order.status === "refunded") {
    console.log(`Order ${order.id} already marked refunded — skipping`);
    return;
  }

  await query(
    "UPDATE orders SET status = 'refunded', updated_at = now() WHERE id = $1",
    [order.id]
  );

  const paymentRef = payment.id.slice(-8).toUpperCase();
  const { sendRefundEmail } = await import("@/lib/email");
  await sendRefundEmail(order.customer_email, order.customer_name, paymentRef, refundedCents);
}

async function handlePaymentSucceeded(payment: Payment) {
  const { initSchema, query } = await import("@/lib/db");
  await initSchema();

  // Idempotency check
  const existing = await query(
    "SELECT id FROM orders WHERE stripe_payment_id = $1",
    [payment.id]
  );
  if (existing.length > 0) {
    console.log(`Order for Mollie payment ${payment.id} already exists — skipping`);
    return;
  }

  const meta = (payment.metadata ?? {}) as Record<string, string>;
  const customerName = meta.customerName ?? "Unknown";
  const customerEmail = meta.customerEmail ?? "";
  const shippingCents = parseInt(meta.shippingCents ?? "0", 10);
  const totalCents = Math.round(parseFloat(payment.amount.value) * 100);
  const subtotalCents = totalCents - shippingCents;

  let cartItems: Array<Record<string, string>> = [];
  try {
    cartItems = meta.cart ? JSON.parse(meta.cart) : [];
  } catch {
    console.warn("Could not parse cart from Mollie payment metadata");
  }

  const hasShipping = Boolean(meta.shippingName);

  // Insert order
  const orderRows = await query<{ id: string }>(
    `INSERT INTO orders
      (stripe_payment_id, customer_name, customer_email,
       shipping_name, shipping_address1, shipping_address2,
       shipping_city, shipping_postcode, shipping_country,
       subtotal_cents, shipping_cents, total_cents, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'paid')
     RETURNING id`,
    [
      payment.id,
      customerName,
      customerEmail,
      hasShipping ? meta.shippingName : null,
      hasShipping ? meta.shippingAddress1 : null,
      hasShipping && meta.shippingAddress2 ? meta.shippingAddress2 : null,
      hasShipping ? meta.shippingCity : null,
      hasShipping ? meta.shippingPostcode : null,
      hasShipping ? meta.shippingCountry : null,
      subtotalCents,
      shippingCents,
      totalCents,
    ]
  );

  const orderId = orderRows[0].id;

  const { POSTCARD_PRICE_CENTS, BLANK_POSTCARD_PRICE_CENTS, getPriceCents } = await import("@/lib/shop");

  const emailItems = [];
  const emailPostcardDetails = [];

  for (const item of cartItems) {
    const isPostcard = item.t === "postcard";
    const isBlankPostcard = item.t === "blank-postcard";
    const quantity = isBlankPostcard ? parseInt(item.q ?? "1", 10) : 1;
    let priceCents: number;
    if (isPostcard) {
      priceCents = POSTCARD_PRICE_CENTS;
    } else if (isBlankPostcard) {
      priceCents = BLANK_POSTCARD_PRICE_CENTS;
    } else {
      const aspectRatio = item.pl ? parseInt(item.pl, 10) / 432 : undefined;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      priceCents = getPriceCents(item.s as any, item.p as any, aspectRatio);
    }

    const productType = isPostcard ? "postcard" : isBlankPostcard ? "blank-postcard" : "print";

    const itemRows = await query<{ id: string }>(
      `INSERT INTO order_items
        (order_id, photo_filename, photo_title, product_type, size, paper_type,
         presentation_style, panoramic_length_mm, price_cents, quantity)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING id`,
      [
        orderId,
        item.f,
        item.n,
        productType,
        isPostcard || isBlankPostcard ? null : item.s,
        isPostcard || isBlankPostcard ? null : item.p,
        isPostcard || isBlankPostcard ? null : (item.ps ?? "bordered"),
        isPostcard || isBlankPostcard ? null : (item.pl ? parseInt(item.pl, 10) : null),
        priceCents,
        quantity,
      ]
    );

    const itemId = itemRows[0].id;
    emailItems.push({
      id: itemId,
      order_id: orderId,
      photo_filename: item.f,
      photo_title: item.n,
      product_type: productType,
      size: item.s ?? null,
      paper_type: item.p ?? null,
      presentation_style: isPostcard || isBlankPostcard ? null : (item.ps ?? "bordered"),
      panoramic_length_mm: item.pl ? parseInt(item.pl, 10) : null,
      price_cents: priceCents,
      quantity,
    });

    if (isPostcard) {
      const pcRows = await query<{ id: string }>(
        `INSERT INTO postcard_details
          (order_item_id, recipient_name, address_line1, address_line2,
           city, postcode, country, message_text, text_style, sender_name)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         RETURNING id`,
        [
          itemId,
          item.rn ?? "",
          item.a1 ?? "",
          item.a2 ?? null,
          item.c ?? "",
          item.pc ?? "",
          item.co ?? "",
          item.m ?? "",
          item.ts ?? "handwritten",
          item.sn ?? "",
        ]
      );
      emailPostcardDetails.push({
        id: pcRows[0].id,
        order_item_id: itemId,
        recipient_name: item.rn ?? "",
        address_line1: item.a1 ?? "",
        address_line2: item.a2 ?? null,
        city: item.c ?? "",
        postcode: item.pc ?? "",
        country: item.co ?? "",
        message_text: item.m ?? "",
        text_style: item.ts ?? "handwritten",
        sender_name: item.sn ?? "",
      });
    }
  }

  const { sendOrderEmails } = await import("@/lib/email");
  await sendOrderEmails({
    orderId,
    paymentRef: payment.id.slice(-8).toUpperCase(),
    customerName,
    customerEmail,
    items: emailItems as Parameters<typeof sendOrderEmails>[0]["items"],
    postcardDetails: emailPostcardDetails as Parameters<typeof sendOrderEmails>[0]["postcardDetails"],
    subtotalCents,
    shippingCents,
    totalCents,
  });
}
