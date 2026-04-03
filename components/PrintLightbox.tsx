"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { ShoppingBag, Check } from "lucide-react";
import type { Photo } from "@/lib/photography";
import {
  PAPER_TYPES,
  PAPER_TYPE_DESCRIPTIONS,
  POSTCARD_PRICE_CENTS,
  formatPrice,
  getPriceCents,
  getAvailablePrintSizes,
  type PaperType,
  type PrintCartItem,
  type PostcardCartItem,
  type TextStyle,
} from "@/lib/shop";
import type { PrintSize } from "@/lib/photography";
import { useCart } from "@/lib/cart";

// ── Postcard form ─────────────────────────────────────────────────────────────

interface PostcardFields {
  recipientName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;
  country: string;
  messageText: string;
  textStyle: TextStyle;
  senderName: string;
}

const EMPTY_POSTCARD: PostcardFields = {
  recipientName: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  postcode: "",
  country: "",
  messageText: "",
  textStyle: "handwritten",
  senderName: "",
};

function PostcardForm({
  photo,
  onAdd,
  onCancel,
}: {
  photo: Photo;
  onAdd: (fields: PostcardFields) => void;
  onCancel: () => void;
}) {
  const [fields, setFields] = useState<PostcardFields>(EMPTY_POSTCARD);

  const set = useCallback(
    (key: keyof PostcardFields, value: string) =>
      setFields((prev) => ({ ...prev, [key]: value })),
    []
  );

  const valid =
    fields.recipientName.trim() &&
    fields.addressLine1.trim() &&
    fields.city.trim() &&
    fields.postcode.trim() &&
    fields.country.trim() &&
    fields.messageText.trim() &&
    fields.senderName.trim();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
          Postcard details
        </p>
        <button
          onClick={onCancel}
          className="text-xs text-stone-500 hover:text-white transition-colors"
        >
          ← Back
        </button>
      </div>

      <p className="text-xs text-stone-400 leading-relaxed">
        Printed at A6 (10×15 cm). Julian addresses and mails it himself. The
        destination address <em>is</em> the mailing address.
      </p>

      {/* Recipient */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-stone-400 uppercase tracking-wider">
          Recipient name
        </label>
        <input
          value={fields.recipientName}
          onChange={(e) => set("recipientName", e.target.value)}
          placeholder="Jane Smith"
          className="bg-white/10 border border-white/20 rounded px-3 py-2 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-stone-400"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-stone-400 uppercase tracking-wider">
          Address
        </label>
        <input
          value={fields.addressLine1}
          onChange={(e) => set("addressLine1", e.target.value)}
          placeholder="Street and number"
          className="bg-white/10 border border-white/20 rounded px-3 py-2 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-stone-400"
        />
        <input
          value={fields.addressLine2}
          onChange={(e) => set("addressLine2", e.target.value)}
          placeholder="Apartment, floor, etc. (optional)"
          className="bg-white/10 border border-white/20 rounded px-3 py-2 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-stone-400"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            value={fields.city}
            onChange={(e) => set("city", e.target.value)}
            placeholder="City"
            className="bg-white/10 border border-white/20 rounded px-3 py-2 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-stone-400"
          />
          <input
            value={fields.postcode}
            onChange={(e) => set("postcode", e.target.value)}
            placeholder="Postcode"
            className="bg-white/10 border border-white/20 rounded px-3 py-2 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-stone-400"
          />
        </div>
        <input
          value={fields.country}
          onChange={(e) => set("country", e.target.value)}
          placeholder="Country"
          className="bg-white/10 border border-white/20 rounded px-3 py-2 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-stone-400"
        />
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-stone-400 uppercase tracking-wider">
          Message
        </label>
        <textarea
          value={fields.messageText}
          onChange={(e) => set("messageText", e.target.value)}
          placeholder="Your message for the back of the card…"
          rows={3}
          className="bg-white/10 border border-white/20 rounded px-3 py-2 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-stone-400 resize-none"
        />
      </div>

      {/* Text style */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-stone-400 uppercase tracking-wider">
          Text style
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(["handwritten", "printed"] as TextStyle[]).map((style) => (
            <button
              key={style}
              onClick={() => set("textStyle", style)}
              className={`rounded border px-3 py-2 text-xs transition-colors ${
                fields.textStyle === style
                  ? "border-stone-400 bg-white/15 text-white"
                  : "border-white/20 text-stone-400 hover:border-stone-500 hover:text-stone-300"
              }`}
            >
              {style === "handwritten" ? "Handwritten by Julian" : "Printed text"}
            </button>
          ))}
        </div>
      </div>

      {/* Sender name */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-stone-400 uppercase tracking-wider">
          From (your name)
        </label>
        <input
          value={fields.senderName}
          onChange={(e) => set("senderName", e.target.value)}
          placeholder="Your name"
          className="bg-white/10 border border-white/20 rounded px-3 py-2 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-stone-400"
        />
      </div>

      <button
        onClick={() => valid && onAdd(fields)}
        disabled={!valid}
        className="mt-1 flex items-center justify-center gap-2 rounded bg-[#1068b6] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0d56a0] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ShoppingBag size={15} />
        Add to cart — {formatPrice(POSTCARD_PRICE_CENTS)}
      </button>
    </div>
  );
}

// ── Print selector ─────────────────────────────────────────────────────────────

function PrintSelector({
  photo,
  availableSizes,
  onAdd,
  onPostcard,
}: {
  photo: Photo;
  availableSizes: PrintSize[];
  onAdd: (size: PrintSize, paper: PaperType) => void;
  onPostcard: () => void;
}) {
  const [size, setSize] = useState<PrintSize | null>(
    availableSizes[0] ?? null
  );
  const [paper, setPaper] = useState<PaperType>("Matte");

  const price = size ? getPriceCents(size, paper) : null;

  return (
    <div className="flex flex-col gap-4">
      {availableSizes.length > 0 ? (
        <>
          {/* Size */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
              Print size
            </p>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`rounded border px-3 py-1.5 text-xs transition-colors ${
                    size === s
                      ? "border-stone-400 bg-white/15 text-white"
                      : "border-white/20 text-stone-400 hover:border-stone-500 hover:text-stone-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Paper */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
              Paper
            </p>
            <div className="flex flex-col gap-1.5">
              {PAPER_TYPES.map((p) => (
                <button
                  key={p}
                  onClick={() => setPaper(p)}
                  className={`flex items-start gap-2 rounded border px-3 py-2 text-left transition-colors ${
                    paper === p
                      ? "border-stone-400 bg-white/15"
                      : "border-white/20 hover:border-stone-500"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border ${
                      paper === p
                        ? "border-stone-400 bg-stone-400"
                        : "border-stone-600"
                    }`}
                  >
                    {paper === p && <span className="h-1.5 w-1.5 rounded-full bg-stone-900" />}
                  </span>
                  <div>
                    <span className="text-xs font-medium text-white">{p}</span>
                    <span className="ml-2 text-xs text-stone-500">
                      {PAPER_TYPE_DESCRIPTIONS[p]}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between gap-3">
            {price !== null && (
              <p className="font-serif text-2xl text-white">
                {formatPrice(price)}
              </p>
            )}
            <button
              onClick={() => size && onAdd(size, paper)}
              disabled={!size}
              className="flex items-center gap-2 rounded bg-[#1068b6] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0d56a0] disabled:opacity-40"
            >
              <ShoppingBag size={15} />
              Add to cart
            </button>
          </div>
        </>
      ) : (
        <p className="text-sm text-stone-400 italic">
          This photograph is available as a postcard only (resolution is
          optimised for the A6 format).
        </p>
      )}

      {/* Postcard CTA — always shown */}
      <div className="border-t border-white/10 pt-3">
        <button
          onClick={onPostcard}
          className="text-sm text-stone-400 underline underline-offset-2 hover:text-white transition-colors"
        >
          Order as postcard (A6 · 10×15 cm) — {formatPrice(POSTCARD_PRICE_CENTS)}
        </button>
      </div>
    </div>
  );
}

// ── Main lightbox ─────────────────────────────────────────────────────────────

type View = "info" | "postcard" | "added";

export default function PrintLightbox({
  photo,
  onClose,
}: {
  photo: Photo;
  onClose: () => void;
}) {
  const { addItem } = useCart();
  const [view, setView] = useState<View>("info");

  const availableSizes = photo.widthPx > 0 && photo.heightPx > 0
    ? getAvailablePrintSizes(photo.widthPx, photo.heightPx)
    : [];

  const handleAddPrint = useCallback(
    (size: PrintSize, paper: PaperType) => {
      const item: PrintCartItem = {
        type: "print",
        id: crypto.randomUUID(),
        photoFilename: photo.filename,
        photoTitle: photo.title,
        photoImageUrl: photo.imageUrl,
        size,
        paper,
        priceCents: getPriceCents(size, paper),
      };
      addItem(item);
      setView("added");
      setTimeout(() => setView("info"), 2500);
    },
    [photo, addItem]
  );

  const handleAddPostcard = useCallback(
    (fields: {
      recipientName: string;
      addressLine1: string;
      addressLine2: string;
      city: string;
      postcode: string;
      country: string;
      messageText: string;
      textStyle: TextStyle;
      senderName: string;
    }) => {
      const item: PostcardCartItem = {
        type: "postcard",
        id: crypto.randomUUID(),
        photoFilename: photo.filename,
        photoTitle: photo.title,
        photoImageUrl: photo.imageUrl,
        ...fields,
        priceCents: POSTCARD_PRICE_CENTS,
      };
      addItem(item);
      setView("added");
      setTimeout(() => setView("info"), 2500);
    },
    [photo, addItem]
  );

  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50 backdrop-blur-sm"
          style={{ backgroundColor: "rgba(15, 30, 45, 0.88)" }}
        />
        <Dialog.Content
          className="fixed inset-0 z-50 flex flex-col md:flex-row outline-none overflow-y-auto md:overflow-hidden"
          aria-describedby="lightbox-desc"
        >
          <Dialog.Title className="sr-only">{photo.title}</Dialog.Title>
          <p id="lightbox-desc" className="sr-only">
            {photo.description ?? photo.title}
          </p>

          {/* ── Image panel ────────────────────────────────────────────── */}
          <div className="relative flex min-h-[55vw] flex-1 items-center justify-center bg-black/20 p-4 md:p-10 md:min-h-0">
            <Image
              src={photo.imageUrl}
              alt={photo.title}
              width={1200}
              height={Math.round(1200 / photo.aspectRatio)}
              className="max-h-[55vh] md:max-h-[calc(100vh-4rem)] max-w-full object-contain"
              quality={85}
              priority
            />
            <span className="pointer-events-none absolute bottom-2 right-3 text-[11px] text-white/40 select-none">
              © Julian Ruiz Burgos
            </span>
          </div>

          {/* ── Info + shop panel ───────────────────────────────────────── */}
          <div className="w-full md:w-80 md:shrink-0 flex flex-col bg-stone-900 text-white overflow-y-auto">
            {/* Close button */}
            <div className="flex justify-end p-4 md:p-5">
              <Dialog.Close
                className="text-stone-400 hover:text-white transition-colors text-3xl leading-none"
                aria-label="Close"
              >
                ×
              </Dialog.Close>
            </div>

            <div className="flex flex-col gap-5 px-5 pb-8">
              {/* Photo info */}
              <div>
                <p className="font-serif text-xl font-semibold leading-snug text-white">
                  {photo.title}
                </p>
                <p className="mt-1 text-sm text-stone-400">
                  {photo.location} · {photo.displayDate}
                </p>
                {photo.camera && (
                  <p className="mt-0.5 text-xs text-stone-500">{photo.camera}</p>
                )}
                {photo.description && (
                  <p className="mt-3 text-sm leading-relaxed text-stone-300">
                    {photo.description}
                  </p>
                )}
              </div>

              <div className="border-t border-white/10" />

              {/* Shop panel */}
              {view === "added" ? (
                <div className="flex flex-col items-center gap-3 py-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1068b6]/20">
                    <Check size={24} className="text-[#1068b6]" />
                  </div>
                  <p className="font-serif text-lg text-white">Added to cart</p>
                  <a
                    href="/cart"
                    className="text-sm text-stone-400 underline underline-offset-2 hover:text-white transition-colors"
                  >
                    View cart →
                  </a>
                </div>
              ) : view === "postcard" ? (
                <PostcardForm
                  photo={photo}
                  onAdd={handleAddPostcard}
                  onCancel={() => setView("info")}
                />
              ) : (
                <PrintSelector
                  photo={photo}
                  availableSizes={availableSizes}
                  onAdd={handleAddPrint}
                  onPostcard={() => setView("postcard")}
                />
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
