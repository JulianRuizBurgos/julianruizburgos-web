"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { ShoppingBag, Check, Info } from "lucide-react";
import type { Photo } from "@/lib/photography";
import {
  PAPER_TYPES,
  PAPER_TYPE_LABELS,
  PAPER_TYPE_DESCRIPTIONS,
  POSTCARD_PRICE_CENTS,
  BLANK_POSTCARD_PRICE_CENTS,
  formatPrice,
  getPriceCents,
  getPanoramicLengthMm,
  getAvailableSizes,
  getImageAreaMm,
  PRINT_SIZE_DIMS_MM,
  getSizePackageCategory,
  SHIPPING_COSTS_CENTS,
  type PaperType,
  type PresentationStyle,
  type PrintCartItem,
  type PostcardCartItem,
  type BlankPostcardCartItem,
  type TextStyle,
  type ShippingZone,
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

// ── Blank postcard selector ───────────────────────────────────────────────────

function BlankPostcardSelector({
  onAdd,
  onCancel,
}: {
  onAdd: (quantity: number) => void;
  onCancel: () => void;
}) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
          Blank postcard
        </p>
        <button
          onClick={onCancel}
          className="text-xs text-stone-500 hover:text-white transition-colors"
        >
          ← Back
        </button>
      </div>

      <p className="text-xs text-stone-400 leading-relaxed">
        Printed at A6 (10×15 cm) and shipped to you. Write your own message — blank on the back.
      </p>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
          Quantity
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-8 w-8 items-center justify-center rounded border border-white/20 text-stone-400 hover:border-stone-400 hover:text-white transition-colors text-lg leading-none"
          >
            −
          </button>
          <span className="w-8 text-center font-semibold text-white">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(20, q + 1))}
            className="flex h-8 w-8 items-center justify-center rounded border border-white/20 text-stone-400 hover:border-stone-400 hover:text-white transition-colors text-lg leading-none"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 mt-1">
        <div>
          <p className="font-serif text-2xl text-white">
            {formatPrice(BLANK_POSTCARD_PRICE_CENTS * quantity)}
          </p>
          <p className="text-[11px] text-stone-500">
            {formatPrice(BLANK_POSTCARD_PRICE_CENTS)} each · excl. shipping
          </p>
        </div>
        <button
          onClick={() => onAdd(quantity)}
          className="flex items-center gap-2 rounded bg-[#1068b6] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0d56a0]"
        >
          <ShoppingBag size={15} />
          Add to cart
        </button>
      </div>
    </div>
  );
}

// ── Size label helper ─────────────────────────────────────────────────────────

function SizeLabel({
  size,
  style,
  aspectRatio,
}: {
  size: PrintSize;
  style: PresentationStyle;
  aspectRatio: number;
}) {
  if (size === "Panoramic") {
    const len = getPanoramicLengthMm(aspectRatio);
    return <span>Panoramic (432 × {len} mm)</span>;
  }
  if (style === "bordered") {
    const { shortMm, longMm } = getImageAreaMm(size);
    const [paperShort, paperLong] = PRINT_SIZE_DIMS_MM[size];
    return (
      <span>
        {size}
        <span className="ml-1 text-stone-500">· image {shortMm}×{longMm} mm</span>
        <span className="sr-only"> (paper {paperShort}×{paperLong} mm)</span>
      </span>
    );
  }
  return <span>{size}</span>;
}

// ── Shipping estimator ────────────────────────────────────────────────────────

const ZONE_LABELS: { zone: ShippingZone; label: string; hint: string }[] = [
  { zone: "NL",   label: "Netherlands",       hint: "" },
  { zone: "BE",   label: "Belgium",           hint: "" },
  { zone: "EUR1", label: "Germany, France, Spain, Italy…", hint: "Core EU" },
  { zone: "EUR2", label: "Other EU countries", hint: "Poland, Czech Republic, Hungary…" },
  { zone: "UK",   label: "United Kingdom",    hint: "" },
  { zone: "US",   label: "USA / Canada",      hint: "" },
  { zone: "ROW",  label: "Rest of World",     hint: "" },
];

function ShippingEstimator({ size }: { size: import("@/lib/photography").PrintSize | null }) {
  const [open, setOpen] = useState(false);

  const category = size ? getSizePackageCategory(size) : "small";

  return (
    <div className="mt-1">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-[11px] text-stone-500 underline underline-offset-2 hover:text-stone-300 transition-colors"
      >
        Estimate shipping costs
      </button>
      {open && (
        <div className="mt-2 rounded border border-white/10 bg-white/5 px-3 py-2.5 flex flex-col gap-1.5">
          {ZONE_LABELS.map(({ zone, label }) => {
            const cents = SHIPPING_COSTS_CENTS[zone][category];
            const isFree = zone === "NL";
            return (
              <div key={zone} className="flex items-center justify-between gap-3 text-[11px]">
                <span className="text-stone-400">{label}</span>
                <span className={isFree ? "text-stone-300 font-semibold" : "text-stone-400"}>
                  {isFree ? "Free" : formatPrice(cents)}
                </span>
              </div>
            );
          })}
          <p className="mt-1 text-[10px] text-stone-600 leading-relaxed">
            Rates via PostNL track &amp; trace · based on {size ?? "selected"} print size
          </p>
        </div>
      )}
    </div>
  );
}

// ── Print selector ─────────────────────────────────────────────────────────────

function PrintSelector({
  photo,
  onAdd,
  onPostcard,
  onMailedPostcard,
}: {
  photo: Photo;
  onAdd: (size: PrintSize, paper: PaperType, style: PresentationStyle) => void;
  onPostcard: () => void;
  onMailedPostcard: () => void;
}) {
  const [style, setStyle] = useState<PresentationStyle>("bordered");
  const [paper, setPaper] = useState<PaperType>("cotton");

  const availableSizes =
    photo.widthPx > 0 && photo.heightPx > 0
      ? getAvailableSizes(photo.widthPx, photo.heightPx, photo.aspectRatio, style)
      : [];

  const [size, setSize] = useState<PrintSize | null>(availableSizes[0] ?? null);

  // When style changes, reset size to first available in new list
  useEffect(() => {
    setSize(availableSizes[0] ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [style]);

  const price =
    size !== null
      ? getPriceCents(size, paper, photo.aspectRatio)
      : null;

  return (
    <div className="flex flex-col gap-5">
      {/* Guide link */}
      <a
        href="/about-printing"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors"
      >
        <Info size={13} />
        About print sizes, paper types &amp; presentation styles →
      </a>

      {availableSizes.length > 0 ? (
        <>
          {/* Presentation style — above sizes, affects available list */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
              Presentation
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(["bordered", "borderless"] as PresentationStyle[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`rounded border px-3 py-2 text-xs text-left transition-colors ${
                    style === s
                      ? "border-stone-400 bg-white/15 text-white"
                      : "border-white/20 text-stone-400 hover:border-stone-500 hover:text-stone-300"
                  }`}
                >
                  <span className="block font-medium">
                    {s === "bordered" ? "With white border" : "Borderless"}
                  </span>
                  <span className="block text-[10px] text-stone-500 mt-0.5">
                    {s === "bordered" ? "Recommended for framing" : "Full-bleed / edge to edge"}
                  </span>
                </button>
              ))}
            </div>
            {style === "bordered" && (
              <p className="text-[11px] text-stone-500 leading-relaxed">
                More sizes available — the border absorbs any ratio difference.
              </p>
            )}
          </div>

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
                  className={`rounded border px-3 py-1.5 text-xs transition-colors text-left ${
                    size === s
                      ? "border-stone-400 bg-white/15 text-white"
                      : "border-white/20 text-stone-400 hover:border-stone-500 hover:text-stone-300"
                  }`}
                >
                  <SizeLabel size={s} style={style} aspectRatio={photo.aspectRatio} />
                </button>
              ))}
            </div>
            {size === "Panoramic" && (
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Roll paper print, 432 mm wide × {getPanoramicLengthMm(photo.aspectRatio)} mm long. Bordered presentation only.
              </p>
            )}
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
                      paper === p ? "border-stone-400 bg-stone-400" : "border-stone-600"
                    }`}
                  >
                    {paper === p && <span className="h-1.5 w-1.5 rounded-full bg-stone-900" />}
                  </span>
                  <div>
                    <span className="text-xs font-medium text-white">{PAPER_TYPE_LABELS[p]}</span>
                    <span className="ml-2 text-xs text-stone-500">{PAPER_TYPE_DESCRIPTIONS[p]}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Price + CTA */}
          <div className="flex flex-col gap-3">
            {price !== null && (
              <div>
                <p className="font-serif text-2xl text-white">{formatPrice(price)}</p>
                <p className="text-[11px] text-stone-500">excl. VAT &amp; shipping</p>
                <ShippingEstimator size={size} />
                <p className="mt-2 text-[11px] text-stone-500 leading-relaxed">
                  Outside your budget?{" "}
                  <a
                    href="mailto:printshop@julianruizburgos.net"
                    className="underline underline-offset-2 hover:text-stone-300 transition-colors"
                  >
                    Get in touch
                  </a>
                  {" "}and let&apos;s see if we can arrange something.
                </p>
              </div>
            )}
            <button
              onClick={() => size && onAdd(size, paper, style)}
              disabled={!size}
              className="flex items-center justify-center gap-2 rounded bg-[#1068b6] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0d56a0] disabled:opacity-40"
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

      {/* Postcard CTAs — always shown */}
      <div className="border-t border-white/10 pt-3 flex flex-col gap-2">
        <button
          onClick={onPostcard}
          className="rounded border border-[#1068b6] px-4 py-2.5 text-sm font-semibold text-[#1068b6] transition-colors hover:bg-[#1068b6]/10"
        >
          Blank postcard (A6 · to keep) — {formatPrice(BLANK_POSTCARD_PRICE_CENTS)} each
        </button>
        <button
          onClick={onMailedPostcard}
          className="rounded border border-[#1068b6] px-4 py-2.5 text-sm font-semibold text-[#1068b6] transition-colors hover:bg-[#1068b6]/10"
        >
          Mail a postcard (A6 · to someone) — {formatPrice(POSTCARD_PRICE_CENTS)}
        </button>
      </div>
    </div>
  );
}

// ── Main lightbox ─────────────────────────────────────────────────────────────

type View = "info" | "shop" | "postcard" | "blank-postcard" | "added";

export default function PrintLightbox({
  photo,
  onClose,
}: {
  photo: Photo;
  onClose: () => void;
}) {
  const { addItem } = useCart();
  const [view, setView] = useState<View>("info");

  const handleAddPrint = useCallback(
    (size: PrintSize, paper: PaperType, style: PresentationStyle) => {
      const item: PrintCartItem = {
        type: "print",
        id: crypto.randomUUID(),
        photoFilename: photo.filename,
        photoTitle: photo.title,
        photoImageUrl: photo.imageUrl,
        size,
        paper,
        presentationStyle: style,
        ...(size === "Panoramic" ? { panoramicLengthMm: getPanoramicLengthMm(photo.aspectRatio) } : {}),
        priceCents: getPriceCents(size, paper, photo.aspectRatio),
      };
      addItem(item);
      setView("added");
      setTimeout(() => setView("info"), 2500);
    },
    [photo, addItem]
  );

  const handleAddPostcard = useCallback(
    (fields: PostcardFields) => {
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

  const handleAddBlankPostcard = useCallback(
    (quantity: number) => {
      const item: BlankPostcardCartItem = {
        type: "blank-postcard",
        id: crypto.randomUUID(),
        photoFilename: photo.filename,
        photoTitle: photo.title,
        photoImageUrl: photo.imageUrl,
        quantity,
        priceCents: BLANK_POSTCARD_PRICE_CENTS * quantity,
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
          <div className="relative flex h-[50vh] shrink-0 md:h-auto md:flex-1 items-center justify-center bg-black/20 p-4 md:p-10">
            <Image
              src={photo.imageUrl}
              alt={photo.title}
              width={1200}
              height={Math.round(1200 / photo.aspectRatio)}
              className="max-h-full md:max-h-[calc(100vh-4rem)] max-w-full object-contain"
              sizes="(max-width: 768px) 100vw, 1200px"
              quality={85}
              priority
            />
            <span className="pointer-events-none absolute bottom-2 right-3 text-[11px] text-white/40 select-none">
              © Julian Ruiz Burgos
            </span>
          </div>

          {/* ── Info + shop panel ───────────────────────────────────────── */}
          <div className="w-full md:w-96 md:shrink-0 flex flex-col bg-stone-900/80 backdrop-blur-sm text-white overflow-y-auto">
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
              ) : view === "blank-postcard" ? (
                <BlankPostcardSelector
                  onAdd={handleAddBlankPostcard}
                  onCancel={() => setView("info")}
                />
              ) : view === "shop" ? (
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => setView("info")}
                    className="self-start text-xs text-stone-500 hover:text-white transition-colors"
                  >
                    ← Back
                  </button>
                  <PrintSelector
                    photo={photo}
                    onAdd={handleAddPrint}
                    onPostcard={() => setView("blank-postcard")}
                    onMailedPostcard={() => setView("postcard")}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setView("shop")}
                    className="flex items-center justify-center gap-2 rounded bg-[#1068b6] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0d56a0]"
                  >
                    <ShoppingBag size={15} />
                    Order as print
                  </button>
                  <button
                    onClick={() => setView("blank-postcard")}
                    className="rounded border border-[#1068b6] px-4 py-2.5 text-sm font-semibold text-[#1068b6] transition-colors hover:bg-[#1068b6]/10"
                  >
                    Blank postcard (A6 · to keep) — {formatPrice(BLANK_POSTCARD_PRICE_CENTS)} each
                  </button>
                  <button
                    onClick={() => setView("postcard")}
                    className="rounded border border-[#1068b6] px-4 py-2.5 text-sm font-semibold text-[#1068b6] transition-colors hover:bg-[#1068b6]/10"
                  >
                    Mail a postcard (A6 · to someone) — {formatPrice(POSTCARD_PRICE_CENTS)}
                  </button>
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
