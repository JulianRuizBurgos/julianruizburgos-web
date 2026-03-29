import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const sections = [
  {
    href: "/ecology",
    label: "Ecology",
    description:
      "Ecology consulting, field research, and academic publications. Conservation at the intersection of science and practice.",
    accent: "border-sage-400 hover:bg-sage-100",
    labelColor: "text-sage-600",
  },
  {
    href: "/photography",
    label: "Photography & Prints",
    description:
      "Landscape and wildlife photography from the UK and beyond. Fine art prints available to order.",
    accent: "border-amber-400 hover:bg-amber-50",
    labelColor: "text-amber-700",
  },
  {
    href: "/it",
    label: "IT Consulting",
    description:
      "Freelance software development and IT consulting. Infrastructure, automation, and bespoke solutions.",
    accent: "border-plum-400 hover:bg-plum-100",
    labelColor: "text-plum-600",
  },
  {
    href: "/blog",
    label: "Blog",
    description:
      "Writing on nature, technology, and the space between. No fixed theme — just things worth saying.",
    accent: "border-stone-400 hover:bg-stone-50",
    labelColor: "text-stone-600",
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
          quality={100}
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
          <p className="mt-5 text-xs font-medium uppercase tracking-[0.3em] text-white/80 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
            Ecologist&nbsp;&nbsp;·&nbsp;&nbsp;IT Consultant&nbsp;&nbsp;·&nbsp;&nbsp;Photographer
          </p>
        </div>

        {/* Down arrow */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <ChevronDown className="animate-bounce text-white/50" size={28} />
        </div>
      </section>

      {/* Section cards */}
      <div className="mx-auto max-w-6xl px-6 py-16">
        <section className="grid gap-6 sm:grid-cols-2">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className={`group rounded-lg border-l-4 bg-white p-8 shadow-sm transition-colors ${s.accent}`}
            >
              <h2 className={`font-serif text-xl font-semibold ${s.labelColor}`}>
                {s.label}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-earth-600">
                {s.description}
              </p>
              <span className="mt-4 inline-block text-xs font-medium text-earth-400 transition-colors group-hover:text-earth-700">
                Explore →
              </span>
            </Link>
          ))}
        </section>
      </div>
    </>
  );
}
