import { getAllCollections, getAllPhotos } from "@/lib/photography";
import Link from "next/link";
import Image from "next/image";

export default async function CollectionsPage() {
  const [collections, allPhotos] = await Promise.all([getAllCollections(), getAllPhotos()]);
  const photoMap = new Map(allPhotos.map((p) => [p.filename, p]));

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Header */}
      <section
        className="relative pt-20 pb-20 px-8 lg:px-16 border-b border-stone-200 overflow-hidden"
        style={{ backgroundImage: `url(/photography/images/${encodeURIComponent("gotas en cristal.jpg")})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10">
          <Link
            href="/photography"
            className="mb-8 inline-block text-xs font-medium uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white"
          >
            ← Photography
          </Link>
          <h1 className="font-serif text-5xl font-semibold leading-tight text-white md:text-6xl">
            Collections.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed font-semibold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            Curated groups of photographs — by place, project, or theme.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="p-8 lg:p-16">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {collections.map((col) => {
            const cover = photoMap.get(col.coverPhoto);
            const count = col.photos.length;
            return (
              <Link
                key={col.slug}
                href={`/photography/collections/${col.slug}`}
                className="group relative aspect-3/4 overflow-hidden rounded-xl bg-stone-200"
              >
                {/* Cover image */}
                {cover && (
                  <Image
                    src={cover.imageUrl}
                    alt={col.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30 transition-colors duration-500 group-hover:bg-black/50" />

                {/* Badges — top left */}
                {col.badges && col.badges.length > 0 && (
                  <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                    {col.badges.map((badge) => (
                      <span
                        key={badge}
                        className="rounded bg-stone-700/80 px-1.5 py-1 text-[12px] font-semibold uppercase tracking-widest text-white backdrop-blur-sm"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bottom panel */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="font-serif text-2xl font-semibold text-white drop-shadow leading-snug">
                    {col.title}
                  </p>
                  <div className="mt-3 border-t border-white/30" />
                  <p className="mt-3 text-sm font-semibold leading-relaxed text-white drop-shadow">
                    {col.description}
                  </p>
                  <p className="mt-1.5 text-xs font-semibold text-white">
                    {count} {count === 1 ? "photograph" : "photographs"}
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
