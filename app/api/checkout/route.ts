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
    customerName: string;
    customerEmail: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { items, shipping, customerName, customerEmail } = body;

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const {
    getPriceCents,
    POSTCARD_PRICE_CENTS,
    BLANK_POSTCARD_PRICE_CENTS,
    getShippingCents,
    getOrderPackageCategory,
  } = await import("@/lib/shop");

  // Recompute subtotal server-side — never trust client prices
  let subtotal = 0;
  for (const item of items) {
    if (item.type === "print") {
      const aspectRatio = item.panoramicLengthMm
        ? item.panoramicLengthMm / 432
        : undefined;
      subtotal += getPriceCents(item.size, item.paper, aspectRatio);
    } else if (item.type === "blank-postcard") {
      subtotal += BLANK_POSTCARD_PRICE_CENTS * item.quantity;
    } else {
      subtotal += POSTCARD_PRICE_CENTS;
    }
  }

  // Compute shipping server-side — never trust client
  // Prints: always free for NL, zone-based PostNL rate elsewhere
  // Blank postcards: free for NL when total quantity >= 6, otherwise zone-based
  // Mailed postcards: free for NL recipients, €2.00 per international recipient (stamp cost)
  const printSizes = items
    .filter((i) => i.type === "print")
    .map((i) => (i as Extract<CartItem, { type: "print" }>).size);
  const blankPostcardQty = items
    .filter((i) => i.type === "blank-postcard")
    .reduce((sum, i) => sum + (i as Extract<CartItem, { type: "blank-postcard" }>).quantity, 0);
  const hasPhysicalItems = printSizes.length > 0 || blankPostcardQty > 0;
  const country = shipping?.country ?? "NL";
  const isNL = country.toUpperCase() === "NL";
  const packageCategory = printSizes.length > 0 ? getOrderPackageCategory(printSizes) : "small";
  const nlFreeShipping = isNL && (printSizes.length > 0 || blankPostcardQty >= 6);
  const physicalShippingCents = (!hasPhysicalItems || nlFreeShipping) ? 0 : getShippingCents(country, packageCategory);
  const postcardMailingCents = items
    .filter((i) => i.type === "postcard")
    .reduce((sum, i) => {
      const pc = i as Extract<CartItem, { type: "postcard" }>;
      return sum + (pc.country.toUpperCase() === "NL" ? 0 : 200);
    }, 0);
  const shippingCents = physicalShippingCents + postcardMailingCents;

  const total = subtotal + shippingCents;
  const amountValue = (total / 100).toFixed(2);

  const itemCount = items.length;
  const description = `julianruizburgos.net — ${itemCount} item${itemCount !== 1 ? "s" : ""}`;

  const cartJson = JSON.stringify(
    items.map((i) => ({
      t: i.type,
      f: i.photoFilename,
      n: i.photoTitle,
      ...(i.type === "print"
        ? {
            s: i.size,
            p: i.paper,
            ps: i.presentationStyle,
            ...(i.panoramicLengthMm ? { pl: i.panoramicLengthMm } : {}),
          }
        : i.type === "blank-postcard"
        ? { q: i.quantity }
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
    redirectUrl: `${baseUrl}/checkout/success`,
    webhookUrl: `${baseUrl}/api/webhooks/mollie`,
    metadata: {
      customerName,
      customerEmail,
      cart: cartJson,
      shippingCents: String(shippingCents),
      packageCategory: hasPhysicalItems ? packageCategory : "",
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

  return NextResponse.json({ checkoutUrl, paymentId: payment.id });
}
