import { getAllCollections, getAllPhotos } from "@/lib/photography";
import Link from "next/link";

export default async function CollectionsPage() {
  const [collections, allPhotos] = await Promise.all([getAllCollections(), getAllPhotos()]);
  const photoMap = new Map(allPhotos.map((p) => [p.filename, p]));

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Header */}
      <section
        className="relative pt-28 pb-16 px-8 lg:px-16 border-b border-stone-200 overflow-hidden"
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
          <p className="mt-4 max-w-lg text-base leading-relaxed text-white/80">
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
                className="group relative aspect-4/3 overflow-hidden bg-stone-200"
              >
                {cover && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cover.imageUrl}
                    alt={col.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-black/30 transition-colors duration-500 group-hover:bg-black/50" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="font-serif text-2xl font-semibold text-white drop-shadow">{col.title}</p>
                  <p className="mt-1 text-sm text-stone-200 leading-relaxed drop-shadow">{col.description}</p>
                  <p className="mt-2 text-xs text-stone-300 drop-shadow">{count} {count === 1 ? "photograph" : "photographs"}</p>
                  <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-[#1068b6] opacity-0 transition-opacity duration-500 group-hover:opacity-100">
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
