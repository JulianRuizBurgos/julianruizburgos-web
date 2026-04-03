import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import type { CartItem } from "@/lib/shop";

function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-03-25.dahlia",
  });
}

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }

  const stripe = getStripe();

  let body: {
    items: CartItem[];
    shipping: {
      name: string;
      email: string;
      address1: string;
      address2: string;
      city: string;
      postcode: string;
      country: string;
    } | null;
    shippingCents: number;
    customerName: string;
    customerEmail: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { items, shipping, shippingCents, customerName, customerEmail } = body;

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  // Recompute totals server-side (never trust client-provided prices)
  const { PRICE_MATRIX_CENTS, POSTCARD_PRICE_CENTS } = await import("@/lib/shop");
  let subtotal = 0;
  for (const item of items) {
    if (item.type === "print") {
      subtotal += PRICE_MATRIX_CENTS[item.size][item.paper];
    } else {
      subtotal += POSTCARD_PRICE_CENTS;
    }
  }
  const total = subtotal + (shippingCents ?? 0);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: "eur",
    automatic_payment_methods: { enabled: true },
    receipt_email: customerEmail,
    metadata: {
      customerName,
      customerEmail,
      itemCount: String(items.length),
      hasShipping: shipping ? "true" : "false",
    },
    shipping: shipping
      ? {
          name: shipping.name,
          address: {
            line1: shipping.address1,
            line2: shipping.address2 || undefined,
            city: shipping.city,
            postal_code: shipping.postcode,
            country: shipping.country,
          },
        }
      : undefined,
    // Store full cart as metadata so the webhook can save it
    // Stripe metadata values must be <500 chars each; split if needed
    // For production use a session store (Redis/DB); for now JSON-truncate safely
  });

  // Attach cart as a separate update (metadata has 40-key limit, 500-char per value)
  // We store the serialised cart in the PaymentIntent's metadata via a follow-up
  // (if it fits); the webhook falls back to line-by-line metadata if absent.
  try {
    const cartJson = JSON.stringify(
      items.map((i) => ({
        t: i.type,
        f: i.photoFilename,
        n: i.photoTitle,
        ...(i.type === "print"
          ? { s: i.size, p: i.paper }
          : {
              rn: i.recipientName,
              a1: i.addressLine1,
              a2: i.addressLine2,
              c: i.city,
              pc: i.postcode,
              co: i.country,
              m: i.messageText,
              ts: i.textStyle,
              sn: i.senderName,
            }),
      }))
    );

    if (cartJson.length <= 500) {
      await stripe.paymentIntents.update(paymentIntent.id, {
        metadata: { ...paymentIntent.metadata, cart: cartJson },
      });
    }
  } catch {
    // Non-fatal: webhook will handle gracefully
  }

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
