"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import type { Photo, Collection } from "@/lib/photography";

function Lightbox({ photo, onClose }: { photo: Photo; onClose: () => void }) {
  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 backdrop-blur-sm" style={{ backgroundColor: "rgba(52, 67, 76, 0.44)" }} />
        <Dialog.Content
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 md:p-16 outline-none"
          aria-describedby="lightbox-desc"
        >
          <Dialog.Title className="sr-only">{photo.title}</Dialog.Title>
          <p id="lightbox-desc" className="sr-only">{photo.description ?? photo.title}</p>

          <Dialog.Close
            className="absolute bottom-8 left-1/2 -translate-x-1/2 md:bottom-auto md:top-5 md:left-auto md:right-6 md:translate-x-0 text-white/60 hover:text-white transition-colors text-8xl leading-none"
            aria-label="Close"
          >
            ×
          </Dialog.Close>

          <div className="relative w-full max-h-[80vh] flex items-center justify-center">
            <Image
              src={photo.imageUrl}
              alt={photo.title}
              width={1200}
              height={Math.round(1200 / photo.aspectRatio)}
              className="max-h-[80vh] max-w-full object-contain"
              quality={85}
              priority
            />
            <span className="pointer-events-none absolute bottom-2 right-3 text-[11px] text-white/40 select-none">
              © Julian Ruiz Burgos
            </span>
          </div>

          <div className="mt-7 w-full max-w-xl text-center">
            <p className="font-serif text-lg font-semibold text-white">{photo.title}</p>
            <p className="mt-1.5 text-sm text-white">{photo.location} · {photo.displayDate}</p>
            {photo.camera && <p className="mt-1 text-xs text-white">{photo.camera}</p>}
            {photo.description && (
              <p className="mt-3 text-sm leading-relaxed text-white">{photo.description}</p>
            )}
            
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({
  tagCounts,
  activeTag,
  onTagChange,
}: {
  tagCounts: { tag: string; count: number }[];
  activeTag: string | null;
  onTagChange: (tag: string | null) => void;
}) {
  return (
    <aside className="w-48 shrink-0 flex flex-col pt-28 pb-10 px-6 sticky top-0 h-screen overflow-y-auto">
      <div className="mt-0">
              {/* Tags */}
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
      <p className="text-[14px] font-extrabold uppercase tracking-[0.25em] text-stone-500 mb-2">Filter</p>
      <ul className="space-y-1">
        {tagCounts.map(({ tag }) => (
          <li key={tag}>
            <button
              onClick={() => onTagChange(activeTag === tag ? null : tag)}
              className={`text-sm transition-colors ${
                activeTag === tag
                  ? "text-[#1068b6] font-medium"
                  : "text-stone-900 hover:text-stone-500"
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
            
          </div>
        </button>
      ))}
    </div>
  );
}

// ── Collections carousel ─────────────────────────────────────────────────────
function CollectionsCarousel({
  collections,
  photoMap,
}: {
  collections: Collection[];
  photoMap: Map<string, Photo>;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopAuto = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  const startAuto = () => {
    stopAuto();
    timerRef.current = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollLeft += 1;
      // Seamless loop: when we reach the second copy, jump back to the first
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft -= el.scrollWidth / 2;
      }
    }, 45);
  };

  useEffect(() => {
    startAuto();
    return stopAuto;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nudge = (dir: 1 | -1) => {
    stopAuto();
    const el = scrollRef.current;
    if (!el) return;
    // Nudging left near the start: teleport to the middle first so there's room to scroll back
    if (dir === -1 && el.scrollLeft < 280) {
      el.scrollLeft += el.scrollWidth / 2;
    }
    el.scrollBy({ left: dir * 280, behavior: "smooth" });
    setTimeout(() => {
      // After smooth scroll, correct if we've crossed the halfway point
      if (el.scrollLeft >= el.scrollWidth / 2) el.scrollLeft -= el.scrollWidth / 2;
      startAuto();
    }, 1000);
  };

  return (
    <section className="bg-stone-50 py-8">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-stone-800">Collections</p>
          <Link
            href="/photography/collections"
            className="text-sm font-semibold text-stone-400 hover:text-stone-600 transition-colors"
          >
            See all →
          </Link>
        </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => nudge(-1)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone-300 text-stone-500 hover:border-stone-600 hover:text-stone-800 transition-colors"
          aria-label="Scroll left"
        >
          <span className="text-4xl leading-none">←</span>
        </button>

        <div
          ref={scrollRef}
          className="flex flex-1 gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onMouseEnter={stopAuto}
          onMouseLeave={startAuto}
        >
        {[...collections, ...collections].map((col, i) => {
          const cover = photoMap.get(col.coverPhoto);
          return (
            <Link
              key={`${col.slug}-${i}`}
              href={`/photography/collections/${col.slug}`}
              className="group relative w-60 shrink-0 aspect-4/3 rounded-2xl overflow-hidden bg-stone-200"
            >
              {cover && (
                <Image
                  src={cover.imageUrl}
                  alt={col.title}
                  fill
                  sizes="240px"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              )}
              <div className="absolute inset-0 bg-black/30 transition-colors duration-500 group-hover:bg-black/50" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="font-serif text-base font-semibold text-white leading-snug drop-shadow">{col.title}</p>
                <p className="mt-0.5 text-sm font-semibold text-white leading-snug drop-shadow">{col.photos.length} {col.photos.length === 1 ? "photograph" : "photographs"}</p>
              </div>
            </Link>
          );
        })}
        
        </div>

        <button
          onClick={() => nudge(1)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone-300 text-stone-500 hover:border-stone-600 hover:text-stone-800 transition-colors"
          aria-label="Scroll right"
        >
          <span className="text-4xl leading-none">→</span>
        </button>
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
  const [searchQuery, setSearchQuery] = useState("");

  const photoMap = new Map(photos.map((p) => [p.filename, p]));

  const searchLower = searchQuery.toLowerCase().trim();
  const visible = photos.filter((p) => {
    const matchesTag = !activeTag || p.tags.includes(activeTag);
    if (!searchLower) return matchesTag;
    const matchesSearch =
      p.title.toLowerCase().includes(searchLower) ||
      p.location.toLowerCase().includes(searchLower) ||
      (p.description?.toLowerCase().includes(searchLower) ?? false) ||
      p.tags.some((t) => t.toLowerCase().includes(searchLower)) ||
      (p.camera?.toLowerCase().includes(searchLower) ?? false) ||
      p.displayDate.toLowerCase().includes(searchLower);
    return matchesTag && matchesSearch;
  });

  return (
    <>
      {/* ── Dark header ──────────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-20 px-6 lg:px-20 overflow-hidden"
        style={{ backgroundImage: "url(/images/photography-page-header-background.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-4xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-stone-400">Photography</p>
          <h1 className="font-serif text-5xl font-semibold leading-tight text-white md:text-6xl lg:text-7xl">
            Portfolio.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-stone-300 md:text-lg">
            A cornucopia of photographs, dominated by landscapes and wildlife.
          </p>
        </div>
      </section>

      {/* ── Mobile: See Collections button ──────────────────────────────── */}
      <div className="md:hidden bg-stone-900 px-6 pb-6">
        <Link
          href="/photography/collections"
          className="inline-block border border-stone-600 px-5 py-2 text-xs font-medium uppercase tracking-[0.2em] text-stone-300 hover:border-stone-400 hover:text-white transition-colors"
        >
          See Collections →
        </Link>
      </div>

      {/* ── Collections carousel ─────────────────────────────────────────── */}
      {collections.length > 0 && (
        <CollectionsCarousel collections={collections} photoMap={photoMap} />
      )}

      {/* ── Search ───────────────────────────────────────────────────────── */}
      <div className="bg-stone-50 px-6 lg:px-20 py-6 flex flex-col items-center">
        <div className="relative w-full max-w-md">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx={11} cy={11} r={8} />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, location, tags…"
            className="w-full rounded-sm border border-stone-200 bg-white py-2 pl-9 pr-8 text-sm text-stone-700 placeholder:text-stone-400 focus:border-[#1068b6] focus:outline-none focus:ring-1 focus:ring-[#1068b6]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-lg leading-none"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="mt-1.5 text-xs text-stone-500 text-center">
            {visible.length} {visible.length === 1 ? "photograph" : "photographs"} found
          </p>
        )}
      </div>

      {/* ── Two-panel layout ─────────────────────────────────────────────── */}
      <div className="flex min-h-screen bg-stone-50">
        {/* Sidebar (hidden on mobile) */}
        <div className="hidden md:block border-r border-stone-200">
          <Sidebar
            tagCounts={tagCounts}
            activeTag={activeTag}
            onTagChange={setActiveTag}
          />
        </div>

        <div className="flex-1 min-w-0">
          {/* Mobile tag filters */}
          <div className="md:hidden py-4 px-4 border-b border-stone-200">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
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

          <div className="p-5">
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
