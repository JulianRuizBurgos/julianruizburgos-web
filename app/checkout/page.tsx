"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useCart } from "@/lib/cart";
import { formatPrice, shippingCents } from "@/lib/shop";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

// ── Stripe payment form ───────────────────────────────────────────────────────

function PaymentForm({
  clientSecret,
  totalCents,
}: {
  clientSecret: string;
  totalCents: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setPaying(true);
    setError(null);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed. Please try again.");
      setPaying(false);
    }
    // On success, Stripe redirects to return_url — no need to handle here
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <PaymentElement />

      {error && (
        <p className="rounded border border-terracotta-400/40 bg-terracotta-50 px-4 py-3 text-sm text-terracotta-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || paying}
        className="rounded bg-earth-900 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-earth-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {paying ? "Processing…" : `Pay ${formatPrice(totalCents)}`}
      </button>
    </form>
  );
}

// ── Shipping form ─────────────────────────────────────────────────────────────

interface ShippingFields {
  name: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  postcode: string;
  country: string;
}

const EMPTY_SHIPPING: ShippingFields = {
  name: "",
  email: "",
  address1: "",
  address2: "",
  city: "",
  postcode: "",
  country: "NL",
};

// ── Main checkout page ────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { items, totalCents, clearCart } = useCart();
  const router = useRouter();

  const [shipping, setShipping] = useState<ShippingFields>(EMPTY_SHIPPING);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const hasPrints = items.some((i) => i.type === "print");
  const shipping_cents = hasPrints ? shippingCents(shipping.country) : 0;
  const grandTotalCents = totalCents + shipping_cents;

  function set(key: keyof ShippingFields, value: string) {
    setShipping((prev) => ({ ...prev, [key]: value }));
  }

  const formValid =
    shipping.name.trim() &&
    shipping.email.trim() &&
    (!hasPrints ||
      (shipping.address1.trim() &&
        shipping.city.trim() &&
        shipping.postcode.trim() &&
        shipping.country.trim()));

  async function handleProceed(e: React.FormEvent) {
    e.preventDefault();
    if (!formValid || items.length === 0) return;
    setLoading(true);
    setApiError(null);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items,
        shipping: hasPrints ? shipping : null,
        shippingCents: shipping_cents,
        customerName: shipping.name,
        customerEmail: shipping.email,
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setApiError(body.error ?? "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    const { clientSecret: secret } = await res.json();
    setClientSecret(secret);
    setLoading(false);
  }

  if (items.length === 0) {
    return (
      <div className="bg-earth-50 min-h-screen pt-28 px-6">
        <div className="max-w-lg mx-auto py-20 text-center">
          <p className="font-serif text-3xl text-earth-900">Your cart is empty.</p>
          <Link
            href="/photography"
            className="mt-8 inline-block text-sm text-[#1068b6] underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            Browse Photography →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-earth-50 min-h-screen pt-28">
      <div className="max-w-2xl mx-auto px-6 pb-24">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-earth-600">
            Photography & Prints
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-earth-900">
            Checkout.
          </h1>
        </div>

        {/* Order summary */}
        <div className="mb-8 border-t-2 border-earth-300 pt-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-earth-600">
            Order summary
          </p>
          <div className="flex flex-col gap-1.5">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-earth-700">
                  {item.photoTitle}
                  {item.type === "print" ? ` — ${item.size}, ${item.paper}` : " — Postcard"}
                </span>
                <span className="text-earth-900 font-medium">
                  {formatPrice(item.priceCents)}
                </span>
              </div>
            ))}
          </div>
          {hasPrints && (
            <div className="mt-2 flex justify-between text-sm border-t border-earth-100 pt-2">
              <span className="text-earth-600">Shipping</span>
              <span className="text-earth-900">{formatPrice(shipping_cents)}</span>
            </div>
          )}
          <div className="mt-2 flex justify-between border-t border-earth-200 pt-3">
            <span className="font-semibold text-earth-900">Total</span>
            <span className="font-serif text-lg font-semibold text-earth-900">
              {formatPrice(grandTotalCents)}
            </span>
          </div>
        </div>

        {/* Step 1: Shipping / contact form */}
        {!clientSecret && (
          <form onSubmit={handleProceed} className="flex flex-col gap-5">
            <div className="border-t-2 border-earth-900 pt-5">
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-earth-600">
                Contact
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-earth-600 uppercase tracking-wider">
                    Full name
                  </label>
                  <input
                    required
                    value={shipping.name}
                    onChange={(e) => set("name", e.target.value)}
                    className="rounded border border-earth-200 bg-white px-3 py-2.5 text-sm text-earth-900 placeholder:text-earth-400 focus:border-[#1068b6] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-earth-600 uppercase tracking-wider">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    value={shipping.email}
                    onChange={(e) => set("email", e.target.value)}
                    className="rounded border border-earth-200 bg-white px-3 py-2.5 text-sm text-earth-900 placeholder:text-earth-400 focus:border-[#1068b6] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {hasPrints && (
              <div className="border-t border-earth-200 pt-4">
                <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-earth-600">
                  Shipping address
                </p>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-earth-600 uppercase tracking-wider">
                      Address
                    </label>
                    <input
                      required
                      value={shipping.address1}
                      onChange={(e) => set("address1", e.target.value)}
                      placeholder="Street and number"
                      className="rounded border border-earth-200 bg-white px-3 py-2.5 text-sm text-earth-900 placeholder:text-earth-400 focus:border-[#1068b6] focus:outline-none"
                    />
                    <input
                      value={shipping.address2}
                      onChange={(e) => set("address2", e.target.value)}
                      placeholder="Apartment, floor, etc. (optional)"
                      className="rounded border border-earth-200 bg-white px-3 py-2.5 text-sm text-earth-900 placeholder:text-earth-400 focus:border-[#1068b6] focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-earth-600 uppercase tracking-wider">
                        City
                      </label>
                      <input
                        required
                        value={shipping.city}
                        onChange={(e) => set("city", e.target.value)}
                        className="rounded border border-earth-200 bg-white px-3 py-2.5 text-sm text-earth-900 placeholder:text-earth-400 focus:border-[#1068b6] focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-earth-600 uppercase tracking-wider">
                        Postcode
                      </label>
                      <input
                        required
                        value={shipping.postcode}
                        onChange={(e) => set("postcode", e.target.value)}
                        className="rounded border border-earth-200 bg-white px-3 py-2.5 text-sm text-earth-900 placeholder:text-earth-400 focus:border-[#1068b6] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-earth-600 uppercase tracking-wider">
                      Country
                    </label>
                    <input
                      required
                      value={shipping.country}
                      onChange={(e) => set("country", e.target.value)}
                      placeholder="NL, DE, GB…"
                      className="rounded border border-earth-200 bg-white px-3 py-2.5 text-sm text-earth-900 placeholder:text-earth-400 focus:border-[#1068b6] focus:outline-none uppercase"
                    />
                    <p className="text-xs text-earth-400">
                      Use ISO 3166-1 alpha-2 code (e.g. NL, DE, GB, US)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {apiError && (
              <p className="rounded border border-terracotta-400/40 bg-terracotta-50 px-4 py-3 text-sm text-terracotta-600">
                {apiError}
              </p>
            )}

            <button
              type="submit"
              disabled={!formValid || loading}
              className="rounded bg-earth-900 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-earth-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Loading payment…" : "Continue to payment"}
            </button>

            <Link
              href="/cart"
              className="text-center text-sm text-earth-600 underline underline-offset-2 hover:text-earth-900 transition-colors"
            >
              ← Back to cart
            </Link>
          </form>
        )}

        {/* Step 2: Stripe payment element */}
        {clientSecret && (
          <div className="flex flex-col gap-6">
            <div className="border-t-2 border-earth-900 pt-5">
              <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-earth-600">
                Payment
              </p>
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "stripe",
                    variables: {
                      colorPrimary: "#241c16",
                      colorBackground: "#faf8f5",
                      borderRadius: "4px",
                      fontFamily: "Inter, system-ui, sans-serif",
                    },
                  },
                }}
              >
                <PaymentForm
                  clientSecret={clientSecret}
                  totalCents={grandTotalCents}
                />
              </Elements>
            </div>
            <button
              onClick={() => setClientSecret(null)}
              className="text-center text-sm text-earth-600 underline underline-offset-2 hover:text-earth-900 transition-colors"
            >
              ← Change contact / address
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
