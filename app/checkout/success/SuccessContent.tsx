"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";

export default function SuccessContent() {
  const { clearCart } = useCart();
  const cleared = useRef(false);
  const [ref, setRef] = useState<string | null>(null);

  useEffect(() => {
    if (!cleared.current) {
      clearCart();
      cleared.current = true;
    }
    // Read payment ID stored before redirect, then clean up
    const paymentId = sessionStorage.getItem("mollie_payment_id");
    if (paymentId) {
      setRef(paymentId.slice(-8).toUpperCase());
      sessionStorage.removeItem("mollie_payment_id");
    }
  }, [clearCart]);

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
          {ref && (
            <p className="mt-4 text-sm text-earth-600">
              Payment reference:{" "}
              <span className="font-mono font-semibold text-earth-900">{ref}</span>
            </p>
          )}
          <p className="mt-1 text-sm text-earth-600">
            Questions? Write to{" "}
            <a
              href="mailto:printshop@julianruizburgos.net"
              className="underline underline-offset-2 hover:text-earth-900 transition-colors"
            >
              printshop@julianruizburgos.net
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
