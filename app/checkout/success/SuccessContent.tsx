"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart";

export default function SuccessContent() {
  const params = useSearchParams();
  const { clearCart } = useCart();
  const [cleared, setCleared] = useState(false);

  const paymentIntent = params.get("payment_intent");
  const status = params.get("redirect_status");

  useEffect(() => {
    if (status === "succeeded" && !cleared) {
      clearCart();
      setCleared(true);
    }
  }, [status, cleared, clearCart]);

  if (status !== "succeeded") {
    return (
      <div className="bg-earth-50 min-h-screen pt-28 px-6">
        <div className="max-w-lg mx-auto py-20 text-center">
          <p className="font-serif text-3xl text-earth-900">Payment unsuccessful.</p>
          <p className="mt-3 text-earth-600">
            Your payment could not be processed. No charge was made.
          </p>
          <Link
            href="/checkout"
            className="mt-8 inline-block text-sm text-[#1068b6] underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            Return to checkout →
          </Link>
        </div>
      </div>
    );
  }

  const ref = paymentIntent?.slice(-8).toUpperCase() ?? "—";

  return (
    <div className="bg-earth-50 min-h-screen pt-28 px-6">
      <div className="max-w-lg mx-auto py-20">
        <div className="border-t-2 border-earth-900 pt-8">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-earth-600">
            Order confirmed
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-earth-900 leading-tight">
            Thank you.
          </h1>
          <p className="mt-5 text-earth-700 leading-relaxed">
            Your order has been received. You&apos;ll get a confirmation email shortly,
            and another when your prints are dispatched.
          </p>
          <p className="mt-4 text-sm text-earth-600">
            Order reference:{" "}
            <span className="font-mono font-semibold text-earth-900">{ref}</span>
          </p>
          <p className="mt-1 text-sm text-earth-600">
            Questions? Write to{" "}
            <a
              href="mailto:julian@julianruizburgos.net"
              className="underline underline-offset-2 hover:text-earth-900 transition-colors"
            >
              julian@julianruizburgos.net
            </a>
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/photography"
            className="rounded bg-earth-900 px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-earth-800"
          >
            Continue browsing
          </Link>
          <Link
            href="/"
            className="px-6 py-3 text-center text-sm text-earth-600 underline underline-offset-2 hover:text-earth-900 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
