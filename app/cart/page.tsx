"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/shop";
import type { CartItem } from "@/lib/shop";

function LineItem({ item, onRemove }: { item: CartItem; onRemove: () => void }) {
  const isPostcard = item.type === "postcard";

  return (
    <div className="flex items-start gap-4 py-5 border-t border-earth-200">
      {/* Thumbnail */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-stone-100">
        <Image
          src={item.photoImageUrl}
          alt={item.photoTitle}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="font-serif text-base font-semibold text-earth-900 leading-snug">
          {item.photoTitle}
        </p>
        {isPostcard ? (
          <>
            <p className="mt-0.5 text-sm text-earth-600">
              Postcard · to {item.recipientName}
            </p>
            <p className="text-xs text-earth-600 capitalize">
              {item.textStyle === "handwritten" ? "Handwritten by Julian" : "Printed text"}
            </p>
          </>
        ) : (
          <p className="mt-0.5 text-sm text-earth-600">
            {item.size} · {item.paper}
          </p>
        )}
      </div>

      {/* Price + remove */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <p className="font-serif text-base text-earth-900">
          {formatPrice(item.priceCents)}
        </p>
        <button
          onClick={onRemove}
          aria-label={`Remove ${item.photoTitle}`}
          className="text-earth-400 hover:text-terracotta-500 transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { items, removeItem, totalCents } = useCart();

  if (items.length === 0) {
    return (
      <div className="bg-earth-50 min-h-screen pt-28 px-6">
        <div className="max-w-lg mx-auto py-20 text-center">
          <p className="font-serif text-3xl text-earth-900">Your cart is empty.</p>
          <p className="mt-3 text-earth-600">
            Browse the gallery and click on any photograph to order a print or postcard.
          </p>
          <Link
            href="/photography"
            className="mt-8 inline-block border-t-2 border-[#1068b6] pt-3 text-sm font-semibold uppercase tracking-widest text-[#1068b6] hover:opacity-80 transition-opacity"
          >
            Browse Photography →
          </Link>
        </div>
      </div>
    );
  }

  const hasPrints = items.some((i) => i.type === "print");

  return (
    <div className="bg-earth-50 min-h-screen pt-28">
      <div className="max-w-2xl mx-auto px-6 pb-24">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-earth-600">
            Photography & Prints
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-earth-900">
            Your cart.
          </h1>
        </div>

        {/* Line items */}
        <div>
          {items.map((item) => (
            <LineItem
              key={item.id}
              item={item}
              onRemove={() => removeItem(item.id)}
            />
          ))}
        </div>

        {/* Subtotal */}
        <div className="mt-6 border-t-2 border-earth-900 pt-5 flex items-baseline justify-between">
          <p className="text-sm uppercase tracking-widest text-earth-600">Subtotal</p>
          <p className="font-serif text-2xl font-semibold text-earth-900">
            {formatPrice(totalCents)}
          </p>
        </div>

        {hasPrints && (
          <p className="mt-2 text-xs text-earth-600">
            Shipping calculated at checkout based on delivery country.
          </p>
        )}
        {!hasPrints && (
          <p className="mt-2 text-xs text-earth-600">
            Postcards ship worldwide at no extra charge.
          </p>
        )}

        {/* CTA */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Link
            href="/checkout"
            className="flex-1 rounded bg-earth-900 px-6 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-earth-800"
          >
            Proceed to checkout
          </Link>
          <Link
            href="/photography"
            className="text-center text-sm text-earth-600 underline underline-offset-2 hover:text-earth-900 transition-colors"
          >
            Continue browsing
          </Link>
        </div>
      </div>
    </div>
  );
}
