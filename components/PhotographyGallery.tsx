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
        <Dialog.Overlay className="fixed inset-0 z-50 bg-earth-900/96 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 md:p-12 outline-none"
          aria-describedby="lightbox-desc"
        >
          <Dialog.Title className="sr-only">{photo.title}</Dialog.Title>
          <p id="lightbox-desc" className="sr-only">{photo.description ?? photo.title}</p>

          <Dialog.Close
            className="absolute top-5 right-6 text-stone-400 hover:text-white transition-colors text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </Dialog.Close>

          <div className="w-full max-h-[78vh] flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.imageUrl}
              alt={photo.title}
              className="max-h-[78vh] max-w-full object-contain"
            />
          </div>

          <div className="mt-7 w-full max-w-xl text-center">
            <p className="font-serif text-lg font-semibold text-white">{photo.title}</p>
            <p className="mt-1.5 text-sm text-stone-400">{photo.location} · {photo.displayDate}</p>
            {photo.camera && <p className="mt-1 text-xs text-stone-600">{photo.camera}</p>}
            {photo.description && (
              <p className="mt-3 text-sm leading-relaxed text-stone-200">{photo.description}</p>
            )}
            {photo.printAvailable && (
              <p className="mt-5 text-xs font-medium uppercase tracking-[0.2em] text-terracotta-400">
                Fine art print available — from £{((photo.priceInPence ?? 0) / 100).toFixed(0)}
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
      className="group relative w-full overflow-hidden bg-stone-100 aspect-4/3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-400"
      aria-label={`View ${photo.title}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.imageUrl}
        alt={photo.title}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        loading="lazy"
      />
      {/* Hover: subtle dark veil + caption */}
      <div className="absolute inset-0 bg-earth-900/0 transition-colors duration-500 group-hover:bg-earth-900/40" />
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-1 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        <p className="font-serif text-sm font-semibold text-white leading-snug drop-shadow">{photo.title}</p>
        <p className="mt-0.5 text-xs text-stone-200 drop-shadow">{photo.location}</p>
        {photo.printAvailable && (
          <p className="mt-1.5 text-xs font-medium uppercase tracking-[0.15em] text-terracotta-300 drop-shadow">
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
    <section className="border-t border-stone-200 bg-stone-50 px-6 py-16 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-baseline justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-stone-400">Photography</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-forest-900">Collections</h2>
          </div>
          <Link
            href="/photography/collections"
            className="text-xs font-medium uppercase tracking-[0.2em] text-stone-400 transition-colors hover:text-earth-800"
          >
            View all →
          </Link>
        </div>
        <div className="grid gap-px bg-stone-200 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((col) => (
            <Link
              key={col.slug}
              href={`/photography/collections/${col.slug}`}
              className="group relative aspect-[4/3] overflow-hidden bg-stone-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/photography/images/${encodeURIComponent(col.coverPhoto)}`}
                alt={col.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-earth-900/20 transition-colors duration-500 group-hover:bg-earth-900/50" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="font-serif text-2xl font-semibold text-white drop-shadow">{col.title}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-terracotta-300 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  Explore →
                </p>
              </div>
            </Link>
          ))}
        </div>
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
      <section className="bg-stone-50 pt-28 pb-10 px-6 lg:px-20 border-b border-stone-200">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-stone-400">Julian Ruiz Burgos</p>
            <h1 className="font-serif text-5xl font-semibold leading-tight text-forest-900 md:text-6xl">
              Photography.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-stone-600">
              Landscape and wildlife from Britain and beyond.
            </p>
          </div>

          {/* Tag filters — right-aligned on desktop */}
          <div className="flex flex-wrap gap-2 md:justify-end md:max-w-sm">
            <button
              onClick={() => setActiveTag(null)}
              className={`text-xs font-medium uppercase tracking-[0.15em] transition-colors px-1 pb-0.5 border-b ${
                activeTag === null
                  ? "border-forest-900 text-forest-900"
                  : "border-transparent text-stone-400 hover:text-stone-600"
              }`}
            >
              All
            </button>
            {tagCounts.map(({ tag }) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`text-xs font-medium uppercase tracking-[0.15em] transition-colors px-1 pb-0.5 border-b ${
                  activeTag === tag
                    ? "border-forest-900 text-forest-900"
                    : "border-transparent text-stone-400 hover:text-stone-600"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Grid ────────────────────────────────────────────────────────────── */}
      <section className="bg-stone-50 px-6 py-10 lg:px-20">
        <div className="mx-auto max-w-6xl">
          {visible.length === 0 ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <p className="font-serif text-2xl text-stone-300">No photographs for this filter.</p>
            </div>
          ) : (
            <div className="grid gap-px bg-stone-200 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((photo) => (
                <PhotoCard
                  key={photo.filename}
                  photo={photo}
                  onClick={() => setLightboxPhoto(photo)}
                />
              ))}
            </div>
          )}
        </div>
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
