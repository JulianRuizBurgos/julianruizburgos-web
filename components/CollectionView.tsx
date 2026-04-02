"use client";

import { useState } from "react";
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
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 md:p-12 outline-none"
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

          <div className="relative w-full max-h-[78vh] flex items-center justify-center">
            <Image
              src={photo.imageUrl}
              alt={photo.title}
              width={1200}
              height={Math.round(1200 / photo.aspectRatio)}
              className="max-h-[78vh] max-w-full object-contain"
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
      <div className="bg-stone-50 min-h-screen">
        {/* Header */}
        <section className="pt-20 pb-20 px-6 lg:px-20 border-b border-stone-600">
          <div className="mx-auto max-w-8xl">
            <Link
              href="/photography/collections"
              className="mb-8 inline-block text-xs font-medium uppercase tracking-[0.2em] text-stone-600 transition-colors hover:text-earth-800"
            >
              ← Collections
            </Link>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-stone-600">Collection</p>
            <h1 className="font-serif text-5xl font-semibold leading-tight text-earth-900 md:text-6xl">
              {collection.title}.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-700">
              {collection.description}
            </p>
            <p className="mt-2 text-sm text-stone-600">
              {photos.length} {photos.length === 1 ? "photograph" : "photographs"}
            </p>
          </div>
        </section>

        {/* Grid — ordered as defined in collections.json */}
        <section className="px-6 py-10 lg:px-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-4 bg-stone-50 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((photo) => (
                <button
                  key={photo.filename}
                  onClick={() => setLightboxPhoto(photo)}
                  className="group relative w-full overflow-hidden bg-stone-100 aspect-4/3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-400"
                  aria-label={`View ${photo.title}`}
                >
                  <Image
                    src={photo.imageUrl}
                    alt={photo.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-earth-900/0 transition-colors duration-500 group-hover:bg-earth-900/40" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-1 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="font-serif text-m font-semibold text-white leading-snug drop-shadow">{photo.title}</p>
                    <p className="mt-0.5 text-sm text-white drop-shadow">{photo.location}</p>
                    
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      {lightboxPhoto && (
        <Lightbox photo={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />
      )}
    </>
  );
}
