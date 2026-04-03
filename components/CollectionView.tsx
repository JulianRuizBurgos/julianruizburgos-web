"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Photo, Collection } from "@/lib/photography";
import PrintLightbox from "@/components/PrintLightbox";

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
        <PrintLightbox photo={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />
      )}
    </>
  );
}
