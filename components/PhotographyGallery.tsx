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
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#071e36]/95 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 md:p-16 outline-none"
          aria-describedby="lightbox-desc"
        >
          <Dialog.Title className="sr-only">{photo.title}</Dialog.Title>
          <p id="lightbox-desc" className="sr-only">{photo.description ?? photo.title}</p>

          <Dialog.Close
            className="absolute top-5 right-6 text-stone-500 hover:text-white transition-colors text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </Dialog.Close>

          <div className="w-full max-h-[80vh] flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.imageUrl}
              alt={photo.title}
              className="max-h-[80vh] max-w-full object-contain"
            />
          </div>

          <div className="mt-6 w-full max-w-lg text-center">
            <p className="font-serif text-base font-semibold text-white">{photo.title}</p>
            <p className="mt-1 text-xs text-stone-500">{photo.location} · {photo.displayDate}</p>
            {photo.camera && <p className="mt-0.5 text-xs text-stone-600">{photo.camera}</p>}
            {photo.description && (
              <p className="mt-3 text-sm leading-relaxed text-stone-300">{photo.description}</p>
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

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({
  collections,
  tagCounts,
  activeTag,
  onTagChange,
}: {
  collections: Collection[];
  tagCounts: { tag: string; count: number }[];
  activeTag: string | null;
  onTagChange: (tag: string | null) => void;
}) {
  return (
    <aside className="w-48 shrink-0 flex flex-col pt-28 pb-10 px-6 sticky top-0 h-screen overflow-y-auto">
      {/* Name */}
      <div className="mb-10">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-stone-400 mb-1">Photography</p>
        <p className="font-serif text-xl font-semibold text-forest-900 leading-snug">
          Julian<br />Ruiz Burgos
        </p>
      </div>

      {/* All photos */}
      <button
        onClick={() => onTagChange(null)}
        className={`text-left text-sm mb-1 transition-colors ${
          activeTag === null
            ? "text-[#1068b6] font-semibold"
            : "text-stone-400 hover:text-stone-700"
        }`}
      >
        All photos
      </button>

      {/* Collections */}
      {collections.length > 0 && (
        <div className="mt-6 mb-6">
          <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-stone-300 mb-2">Collections</p>
          <ul className="space-y-1">
            {collections.map((col) => (
              <li key={col.slug}>
                <Link
                  href={`/photography/collections/${col.slug}`}
                  className="text-sm text-stone-400 hover:text-forest-900 transition-colors"
                >
                  {col.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tags */}
      <div className="mt-auto">
        <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-stone-300 mb-2">Filter</p>
        <ul className="space-y-1">
          {tagCounts.map(({ tag }) => (
            <li key={tag}>
              <button
                onClick={() => onTagChange(activeTag === tag ? null : tag)}
                className={`text-sm transition-colors ${
                  activeTag === tag
                    ? "text-[#1068b6] font-medium"
                    : "text-stone-400 hover:text-stone-700"
                }`}
              >
                {tag}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

// ── Masonry grid ──────────────────────────────────────────────────────────────
function MasonryGrid({
  photos,
  onPhotoClick,
}: {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
}) {
  if (photos.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-serif text-2xl text-stone-300">No photographs for this filter.</p>
      </div>
    );
  }

  return (
    <div className="columns-2 md:columns-3 gap-[15px]">
      {photos.map((photo) => (
        <button
          key={photo.filename}
          onClick={() => onPhotoClick(photo)}
          className="group relative w-full block break-inside-avoid mb-[15px] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1068b6]"
          aria-label={`View ${photo.title}`}
          style={{ aspectRatio: photo.aspectRatio }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.imageUrl}
            alt={photo.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/30" />
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-1 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <p className="font-serif text-sm font-semibold text-white leading-snug drop-shadow">{photo.title}</p>
            {photo.printAvailable && (
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-terracotta-300 drop-shadow">
                Print available
              </p>
            )}
          </div>
        </button>
      ))}
    </div>
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
      <div className="flex min-h-screen bg-stone-50">
        {/* ── Sidebar (hidden on mobile) ───────────────────────────────────── */}
        <div className="hidden md:block border-r border-stone-200">
          <Sidebar
            collections={collections}
            tagCounts={tagCounts}
            activeTag={activeTag}
            onTagChange={setActiveTag}
          />
        </div>

        {/* ── Main content ─────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Mobile header */}
          <div className="md:hidden pt-24 pb-6 px-4 border-b border-stone-200">
            <p className="font-serif text-3xl font-semibold text-forest-900">Photography.</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
              <button
                onClick={() => setActiveTag(null)}
                className={`text-xs transition-colors ${activeTag === null ? "text-[#1068b6] font-semibold" : "text-stone-400"}`}
              >
                All
              </button>
              {tagCounts.map(({ tag }) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className={`text-xs transition-colors ${activeTag === tag ? "text-[#1068b6] font-medium" : "text-stone-400"}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="p-5 pt-[calc(7rem+20px)] md:pt-5">
            <MasonryGrid photos={visible} onPhotoClick={setLightboxPhoto} />
          </div>
        </div>
      </div>

      {lightboxPhoto && (
        <Lightbox photo={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />
      )}
    </>
  );
}
