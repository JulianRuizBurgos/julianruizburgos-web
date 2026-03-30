import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const sections = [
  {
    href: "/photography",
    label: "Photography & Prints",
    verticalLabel: "Photography",
    // TODO: replace with chosen photo — e.g. /images/section-photography.jpg
    image: "/images/main-page-photography-section-card.jpg",
    accentBg: "bg-amber-500",
  },
  {
    href: "/ecology",
    label: "Ecology",
    verticalLabel: "Ecology",
    // TODO: replace with chosen photo — e.g. /images/section-ecology.jpg
    image: "/images/main-page-ecology-section-card.jpg",
    accentBg: "bg-sage-500",
  },
  {
    href: "/it",
    label: "IT Consulting",
    verticalLabel: "IT",
    // TODO: replace with chosen photo — e.g. /images/section-it.jpg
    image: "/images/main-page-it-section-card.png",
    accentBg: "bg-plum-500",
  },
  {
    href: "/blog",
    label: "Blog",
    verticalLabel: "Blog",
    // TODO: replace with chosen photo — e.g. /images/section-blog.jpg
    image: "/images/main-page-blog-section-card.jpg",
    accentBg: "bg-earth-400",
  },
];

export default function Home() {
  return (
    <>
      {/* Full-screen hero */}
      <section className="relative h-screen w-full overflow-hidden">
        <Image
          src="/images/main-page-backgound-crop-ultrawide.jpg"
          alt="Landscape photograph"
          fill
          sizes="100vw"
          quality={90}
          className="object-cover object-center animate-kenburns"
          priority
        />
        {/* Uniform dark overlay — ensures text is readable against bright sky/snow */}
        <div className="absolute inset-0 bg-black/30" />
        {/* Top gradient — keeps MENU button legible */}
        <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/30 to-transparent" />
        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-black/50 to-transparent" />

        {/* Centred name + disciplines */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h1 className="font-serif text-5xl font-semibold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] md:text-6xl lg:text-7xl">
            Julian Ruiz Burgos
          </h1>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.3em] text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
            Ecologist&nbsp;&nbsp;·&nbsp;&nbsp;IT Consultant&nbsp;&nbsp;·&nbsp;&nbsp;Photographer
          </p>
        </div>

        {/* Down arrow */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <ChevronDown className="animate-bounce text-white/50" size={28} />
        </div>
      </section>

      {/* Section cards — full-width portrait grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-earth-200">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group relative overflow-hidden h-[55vh] sm:h-[65vh] lg:h-[80vh] bg-earth-900"
          >
            {/* Background image — Ken Burns starts on hover, transitions back on unhover */}
            <Image
              src={s.image}
              alt={s.label}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover grayscale group-hover:grayscale-0 transition-[filter,transform] duration-700 ease-in-out group-hover:animate-kenburns"
            />

            {/* Dark overlay — lifts on hover */}
            <div className="absolute inset-0 bg-black/65 group-hover:bg-black/25 transition-colors duration-700" />

            {/* Vertical section label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="[writing-mode:vertical-lr] font-serif text-5xl lg:text-6xl xl:text-7xl font-semibold uppercase tracking-[0.12em] select-none text-white/40 group-hover:text-white transition-colors duration-500">
                {s.verticalLabel}
              </span>
            </div>

            {/* Explore → fades up on hover */}
            <div className="absolute inset-x-0 bottom-6 flex justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
              <span className="text-xs font-medium uppercase tracking-[0.3em] text-terracotta-300">
                Explore →
              </span>
            </div>

            {/* Section accent line — grows from left on hover */}
            <div className={`absolute inset-x-0 bottom-0 h-px ${s.accentBg} origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
          </Link>
        ))}
      </section>
    </>
  );
}
