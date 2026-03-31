import { getAllCollections, getAllPhotos } from "@/lib/photography";
import Link from "next/link";

export default async function CollectionsPage() {
  const [collections, allPhotos] = await Promise.all([getAllCollections(), getAllPhotos()]);
  const photoMap = new Map(allPhotos.map((p) => [p.filename, p]));

  return (
    <div className="bg-earth-900 min-h-screen">
      {/* Header */}
      <section className="pt-28 pb-16 px-6 lg:px-20">
        <Link
          href="/photography"
          className="mb-10 inline-block text-xs font-medium uppercase tracking-[0.2em] text-earth-600 transition-colors hover:text-earth-300"
        >
          ← Photography
        </Link>
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-amber-600">Photography</p>
        <h1 className="font-serif text-5xl font-semibold leading-tight text-white md:text-6xl">
          Collections.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-earth-300">
          Curated groups of photographs — by place, project, or theme.
        </p>
      </section>

      {/* Grid */}
      <section className="px-6 pb-20 lg:px-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((col) => {
            const cover = photoMap.get(col.coverPhoto);
            const count = col.photos.length;
            return (
              <Link
                key={col.slug}
                href={`/photography/collections/${col.slug}`}
                className="group relative aspect-video overflow-hidden bg-earth-800"
              >
                {cover && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cover.imageUrl}
                    alt={col.title}
                    className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-black/50 transition-colors duration-500 group-hover:bg-black/25" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="font-serif text-2xl font-semibold text-white">{col.title}</p>
                  <p className="mt-1 text-sm text-earth-300 leading-relaxed">{col.description}</p>
                  <p className="mt-2 text-xs text-earth-500">{count} {count === 1 ? "photograph" : "photographs"}</p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-terracotta-400 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    Explore →
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
