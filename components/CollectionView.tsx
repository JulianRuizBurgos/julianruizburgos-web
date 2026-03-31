"use client";

import { useState } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import type { Photo, Collection } from "@/lib/photography";

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

          <Dialog.Close
            className="absolute top-5 right-6 text-earth-400 hover:text-white transition-colors text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </Dialog.Close>

          <div className="relative w-full max-h-[75vh] flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.imageUrl}
              alt={photo.title}
              className="max-h-[75vh] max-w-full object-contain"
            />
          </div>

          <div className="mt-6 w-full max-w-2xl text-center">
            <p className="font-serif text-lg font-semibold text-white">{photo.title}</p>
            <p className="mt-1 text-sm text-earth-400">{photo.location} · {photo.displayDate}</p>
            {photo.camera && <p className="mt-1 text-xs text-earth-600">{photo.camera}</p>}
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

export default function CollectionView({
  collection,
  photos,
}: {
  collection: Collection;
  photos: Photo[];
}) {
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);

  return (
    <>
      <div className="bg-earth-900 min-h-screen">
        {/* Header */}
        <section className="pt-28 pb-16 px-6 lg:px-20">
          <Link
            href="/photography/collections"
            className="mb-10 inline-block text-xs font-medium uppercase tracking-[0.2em] text-earth-600 transition-colors hover:text-earth-300"
          >
            ← Collections
          </Link>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-amber-600">Collection</p>
          <h1 className="font-serif text-5xl font-semibold leading-tight text-white md:text-6xl">
            {collection.title}.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-earth-300">
            {collection.description}
          </p>
          <p className="mt-3 text-sm text-earth-600">
            {photos.length} {photos.length === 1 ? "photograph" : "photographs"}
          </p>
        </section>

        {/* Grid — ordered as defined in collections.json */}
        <section className="px-2 pb-20 md:px-3">
          <div className="columns-1 gap-2 sm:columns-2 lg:columns-3 md:gap-3">
            {photos.map((photo) => (
              <div key={photo.filename} className="mb-2 break-inside-avoid md:mb-3">
                <button
                  onClick={() => setLightboxPhoto(photo)}
                  className="group relative w-full overflow-hidden bg-earth-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-400"
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
              </div>
            ))}
          </div>
        </section>
      </div>

      {lightboxPhoto && (
        <Lightbox photo={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />
      )}
    </>
  );
}
