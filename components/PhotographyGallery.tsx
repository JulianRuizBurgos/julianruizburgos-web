"use client";

import { useState } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import type { Photo, Collection } from "@/lib/photography";

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ photo, onClose }: { photo: Photo; onClose: () => void }) {
  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-earth-900/95 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 md:p-10 outline-none"
          aria-describedby="lightbox-desc"
        >
          <Dialog.Title className="sr-only">{photo.title}</Dialog.Title>
          <p id="lightbox-desc" className="sr-only">{photo.description ?? photo.title}</p>

          {/* Close */}
          <Dialog.Close
            className="absolute top-5 right-6 text-earth-400 hover:text-white transition-colors text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </Dialog.Close>

          {/* Image */}
          <div className="relative w-full max-h-[75vh] flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.imageUrl}
              alt={photo.title}
              className="max-h-[75vh] max-w-full object-contain"
            />
          </div>

          {/* Caption */}
          <div className="mt-6 w-full max-w-2xl text-center">
            <p className="font-serif text-lg font-semibold text-white">{photo.title}</p>
            <p className="mt-1 text-sm text-earth-400">{photo.location} · {photo.displayDate}</p>
            {photo.camera && (
              <p className="mt-1 text-xs text-earth-600">{photo.camera}</p>
            )}
            {photo.description && (
              <p className="mt-3 text-sm leading-relaxed text-earth-300">{photo.description}</p>
            )}
            {photo.printAvailable && (
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-terracotta-400">
                Print available — from £{((photo.priceInPence ?? 0) / 100).toFixed(0)}
              </p>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ── Photo card ────────────────────────────────────────────────────────────────
function PhotoCard({ photo, onClick }: { photo: Photo; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative w-full overflow-hidden bg-earth-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-400"
      style={{ aspectRatio: photo.aspectRatio }}
      aria-label={`View ${photo.title}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.imageUrl}
        alt={photo.title}
        className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-[1.03]"
        loading="lazy"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-earth-900/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        <p className="font-serif text-sm font-semibold text-white leading-snug">{photo.title}</p>
        <p className="mt-0.5 text-xs text-earth-300">{photo.location}</p>
        {photo.printAvailable && (
          <p className="mt-1.5 text-xs font-medium uppercase tracking-[0.15em] text-terracotta-400">
            Print available
          </p>
        )}
      </div>
    </button>
  );
}

// ── Collections strip ─────────────────────────────────────────────────────────
function CollectionsStrip({ collections }: { collections: Collection[] }) {
  if (collections.length === 0) return null;
  return (
    <section className="border-t border-earth-800 bg-earth-900 px-6 py-12 lg:px-20">
      <div className="mb-8 flex items-baseline justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-earth-400">Collections</p>
        <Link
          href="/photography/collections"
          className="text-xs font-medium uppercase tracking-[0.2em] text-earth-600 transition-colors hover:text-earth-300"
        >
          View all →
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((col) => (
          <Link
            key={col.slug}
            href={`/photography/collections/${col.slug}`}
            className="group relative aspect-video overflow-hidden bg-earth-800"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/photography/images/${encodeURIComponent(col.coverPhoto)}`}
              alt={col.title}
              className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-[1.03]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 transition-colors duration-500 group-hover:bg-black/20" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="font-serif text-xl font-semibold text-white leading-snug">{col.title}</p>
              <p className="mt-1 text-xs text-earth-300">{col.description}</p>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-terracotta-400 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                Explore →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function PhotographyGallery({
  photos,
  tagCounts,
  collections,
}: {
  photos: Photo[];
  tagCounts: { tag: string; count: number }[];
  collections: Collection[];
}) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);

  const visible = activeTag
    ? photos.filter((p) => p.tags.includes(activeTag))
    : photos;

  return (
    <>
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <section className="bg-earth-900 pt-28 pb-16 px-6 lg:px-20">
        <div className="max-w-4xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-amber-600">Photography</p>
          <h1 className="font-serif text-5xl font-semibold leading-tight text-white md:text-6xl lg:text-7xl">
            Portfolio.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-earth-300 md:text-lg">
            Landscape and wildlife photography from Britain and beyond. All images available as fine art prints.
          </p>

          {/* Tag filters */}
          <div className="mt-10 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag(null)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                activeTag === null
                  ? "border-amber-500 bg-amber-500/10 text-amber-400"
                  : "border-earth-700 text-earth-600 hover:border-earth-500 hover:text-earth-400"
              }`}
            >
              All
            </button>
            {tagCounts.map(({ tag, count }) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  activeTag === tag
                    ? "border-amber-500 bg-amber-500/10 text-amber-400"
                    : "border-earth-700 text-earth-600 hover:border-earth-500 hover:text-earth-400"
                }`}
              >
                {tag}
                <span className="ml-1.5 text-earth-700">({count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Grid ────────────────────────────────────────────────────────────── */}
      <section className="bg-earth-950 px-2 py-2 md:px-3 md:py-3">
        {visible.length === 0 ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <p className="font-serif text-2xl text-earth-700">No photographs for this filter.</p>
          </div>
        ) : (
          <div className="columns-1 gap-2 sm:columns-2 lg:columns-3 md:gap-3">
            {visible.map((photo) => (
              <div key={photo.filename} className="mb-2 break-inside-avoid md:mb-3">
                <PhotoCard photo={photo} onClick={() => setLightboxPhoto(photo)} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Collections ─────────────────────────────────────────────────────── */}
      <CollectionsStrip collections={collections} />

      {/* ── Lightbox ────────────────────────────────────────────────────────── */}
      {lightboxPhoto && (
        <Lightbox photo={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />
      )}
    </>
  );
}
