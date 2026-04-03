import { NextRequest, NextResponse } from "next/server";
import { createMollieClient } from "@mollie/api-client";
import type { CartItem } from "@/lib/shop";

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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) {
    return NextResponse.json({ error: "Base URL not configured" }, { status: 503 });
  }

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

  // Mollie requires amount as a string with 2 decimal places
  const amountValue = (total / 100).toFixed(2);

  const itemCount = items.length;
  const description = `julianruizburgos.net — ${itemCount} item${itemCount !== 1 ? "s" : ""}`;

  // Serialise cart into metadata (Mollie metadata is a plain object, no size limits per key)
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

  const mollie = getMollie();

  const payment = await mollie.payments.create({
    amount: { currency: "EUR", value: amountValue },
    description,
    // {id} is a Mollie template variable — replaced with the payment ID on redirect
    redirectUrl: `${baseUrl}/checkout/success?ref={id}`,
    webhookUrl: `${baseUrl}/api/webhooks/mollie`,
    metadata: {
      customerName,
      customerEmail,
      cart: cartJson,
      shippingCents: String(shippingCents ?? 0),
      ...(shipping
        ? {
            shippingName: shipping.name,
            shippingAddress1: shipping.address1,
            shippingAddress2: shipping.address2 || "",
            shippingCity: shipping.city,
            shippingPostcode: shipping.postcode,
            shippingCountry: shipping.country,
          }
        : {}),
    },
  });

  const checkoutUrl = payment._links.checkout?.href;
  if (!checkoutUrl) {
    return NextResponse.json({ error: "Could not create payment" }, { status: 500 });
  }

  return NextResponse.json({ checkoutUrl });
}
