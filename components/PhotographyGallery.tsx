"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Photo } from "@/lib/photography";
import PrintLightbox from "@/components/PrintLightbox";

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
function MasonryPhoto({ photo, onPhotoClick }: { photo: Photo; onPhotoClick: (photo: Photo) => void }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <button
      onClick={() => onPhotoClick(photo)}
      className="group relative w-full block break-inside-avoid mb-[15px] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1068b6]"
      aria-label={`View ${photo.title}`}
      style={{ aspectRatio: photo.aspectRatio }}
    >
      <Image
        src={photo.imageUrl}
        alt={photo.title}
        fill
        sizes="(max-width: 768px) 50vw, 33vw"
        className={`object-cover transition-[transform,opacity] duration-700 group-hover:scale-[1.03] ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
      />
      <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/30" />
      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-1 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        <p className="font-serif text-sm font-semibold text-white leading-snug drop-shadow">{photo.title}</p>
      </div>
    </button>
  );
}

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
        <MasonryPhoto key={photo.filename} photo={photo} onPhotoClick={onPhotoClick} />
      ))}
    </div>
  );
}

// ── Collections carousel ─────────────────────────────────────────────────────
// ── Main component ────────────────────────────────────────────────────────────
export default function PhotographyGallery({
  photos,
  tagCounts,
}: {
  photos: Photo[];
  tagCounts: { tag: string; count: number }[];
}) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
      <section className="relative pt-20 pb-20 px-6 lg:px-20 overflow-hidden bg-stone-900"
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
        {/* ── See Collections button ──────────────────────────────────────── */}
        <div className="relative mt-10">
          <Link
            href="/photography/collections"
            className="inline-block border border-stone-600 px-5 py-2 text-xs font-medium uppercase tracking-[0.2em] text-stone-300 hover:border-stone-400 hover:text-white transition-colors"
          >
            See Collections →
          </Link>
        </div>
      </section>

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
        <PrintLightbox photo={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />
      )}
    </>
  );
}
