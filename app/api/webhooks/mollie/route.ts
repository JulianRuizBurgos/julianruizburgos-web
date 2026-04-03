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

  try {
    await handlePaymentSucceeded(payment);
  } catch (err) {
    console.error("Error handling Mollie payment:", err);
    // Return 200 so Mollie doesn't retry — log for manual recovery
    return NextResponse.json({ received: true, error: "Internal processing error" });
  }

  return NextResponse.json({ received: true });
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

  const { POSTCARD_PRICE_CENTS, PRICE_MATRIX_CENTS } = await import("@/lib/shop");

  const emailItems = [];
  const emailPostcardDetails = [];

  for (const item of cartItems) {
    const isPostcard = item.t === "postcard";
    const priceCents = isPostcard
      ? POSTCARD_PRICE_CENTS
      : (PRICE_MATRIX_CENTS[item.s as keyof typeof PRICE_MATRIX_CENTS]?.[
          item.p as keyof (typeof PRICE_MATRIX_CENTS)[keyof typeof PRICE_MATRIX_CENTS]
        ] ?? 0);

    const itemRows = await query<{ id: string }>(
      `INSERT INTO order_items
        (order_id, photo_filename, photo_title, product_type, size, paper_type, price_cents, quantity)
       VALUES ($1,$2,$3,$4,$5,$6,$7,1)
       RETURNING id`,
      [
        orderId,
        item.f,
        item.n,
        isPostcard ? "postcard" : "print",
        isPostcard ? null : item.s,
        isPostcard ? null : item.p,
        priceCents,
      ]
    );

    const itemId = itemRows[0].id;
    emailItems.push({
      id: itemId,
      order_id: orderId,
      photo_filename: item.f,
      photo_title: item.n,
      product_type: isPostcard ? "postcard" : "print",
      size: item.s ?? null,
      paper_type: item.p ?? null,
      price_cents: priceCents,
      quantity: 1,
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
    customerName,
    customerEmail,
    items: emailItems as Parameters<typeof sendOrderEmails>[0]["items"],
    postcardDetails: emailPostcardDetails as Parameters<typeof sendOrderEmails>[0]["postcardDetails"],
    subtotalCents,
    shippingCents,
    totalCents,
  });
}
