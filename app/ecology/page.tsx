import Image from "next/image";
import ecologyHeaderBg from "@/public/images/ecology-page-header-background.jpg";

export default function Ecology() {
  return (
    <>
      {/* Dark header */}
      <section className="relative pt-20 pb-20 px-8 lg:px-16 border-b border-olive-200 overflow-hidden bg-olive-900">
        <Image src={ecologyHeaderBg} alt="" fill sizes="100vw" placeholder="blur" className="object-cover object-center" priority />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-4xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-olive-200">Ecology</p>
          <h1 className="font-serif text-5xl font-semibold leading-tight text-white md:text-6xl lg:text-7xl">
            Naturalist.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-olive-200 md:text-lg">
            Ecological consulting, field research, and professional publications.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-earth-600">Coming soon.</p>
      </div>
    </>
  );
}
