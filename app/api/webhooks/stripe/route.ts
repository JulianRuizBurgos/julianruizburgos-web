import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-03-25.dahlia",
  });
}

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const stripe = getStripe();

  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "payment_intent.succeeded") {
    return NextResponse.json({ received: true });
  }

  const pi = event.data.object as Stripe.PaymentIntent;

  try {
    await handlePaymentSucceeded(pi);
  } catch (err) {
    console.error("Error handling payment_intent.succeeded:", err);
    // Return 200 so Stripe doesn't retry (log the error for manual recovery)
    return NextResponse.json({ received: true, error: "Internal processing error" });
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentSucceeded(pi: Stripe.PaymentIntent) {
  const { initSchema, query } = await import("@/lib/db");
  await initSchema();

  // Check for duplicate (idempotency)
  const existing = await query(
    "SELECT id FROM orders WHERE stripe_payment_id = $1",
    [pi.id]
  );
  if (existing.length > 0) {
    console.log(`Order for PaymentIntent ${pi.id} already exists — skipping`);
    return;
  }

  // Parse cart from metadata
  let cartItems: Array<Record<string, string>> = [];
  try {
    cartItems = pi.metadata.cart ? JSON.parse(pi.metadata.cart) : [];
  } catch {
    console.warn("Could not parse cart from PaymentIntent metadata");
  }

  const { POSTCARD_PRICE_CENTS, PRICE_MATRIX_CENTS } = await import("@/lib/shop");

  const customerName = pi.metadata.customerName ?? pi.shipping?.name ?? "Unknown";
  const customerEmail = pi.metadata.customerEmail ?? pi.receipt_email ?? "";
  const shippingCents = pi.shipping ? (pi.amount - calculateSubtotal(cartItems, PRICE_MATRIX_CENTS, POSTCARD_PRICE_CENTS)) : 0;
  const subtotalCents = pi.amount - Math.max(0, shippingCents);

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
      pi.id,
      customerName,
      customerEmail,
      pi.shipping?.name ?? null,
      pi.shipping?.address?.line1 ?? null,
      pi.shipping?.address?.line2 ?? null,
      pi.shipping?.address?.city ?? null,
      pi.shipping?.address?.postal_code ?? null,
      pi.shipping?.address?.country ?? null,
      subtotalCents,
      Math.max(0, shippingCents),
      pi.amount,
    ]
  );

  const orderId = orderRows[0].id;

  // Insert order items + postcard details
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
    emailItems.push({ id: itemId, order_id: orderId, photo_filename: item.f, photo_title: item.n, product_type: isPostcard ? "postcard" : "print", size: item.s ?? null, paper_type: item.p ?? null, price_cents: priceCents, quantity: 1 });

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
      emailPostcardDetails.push({ id: pcRows[0].id, order_item_id: itemId, recipient_name: item.rn ?? "", address_line1: item.a1 ?? "", address_line2: item.a2 ?? null, city: item.c ?? "", postcode: item.pc ?? "", country: item.co ?? "", message_text: item.m ?? "", text_style: item.ts ?? "handwritten", sender_name: item.sn ?? "" });
    }
  }

  // Send emails
  const { sendOrderEmails } = await import("@/lib/email");
  await sendOrderEmails({
    orderId,
    customerName,
    customerEmail,
    items: emailItems as Parameters<typeof sendOrderEmails>[0]["items"],
    postcardDetails: emailPostcardDetails as Parameters<typeof sendOrderEmails>[0]["postcardDetails"],
    subtotalCents,
    shippingCents: Math.max(0, shippingCents),
    totalCents: pi.amount,
  });
}

function calculateSubtotal(
  cartItems: Array<Record<string, string>>,
  priceMatrix: Record<string, Record<string, number>>,
  postcardPrice: number
): number {
  return cartItems.reduce((sum, item) => {
    if (item.t === "postcard") return sum + postcardPrice;
    return sum + (priceMatrix[item.s]?.[item.p] ?? 0);
  }, 0);
}
