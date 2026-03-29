import Link from "next/link";
import { ChevronDown } from "lucide-react";

const sections = [
  {
    href: "/ecology",
    label: "Ecology",
    description:
      "Ecology consulting, field research, and academic publications. Conservation at the intersection of science and practice.",
    rule: "border-sage-500",
    labelColor: "text-sage-700",
  },
  {
    href: "/photography",
    label: "Photography & Prints",
    description:
      "Landscape and wildlife photography from the UK and beyond. Fine art prints available to order.",
    rule: "border-amber-500",
    labelColor: "text-amber-800",
  },
  {
    href: "/it",
    label: "IT Consulting",
    description:
      "Freelance software development and IT consulting. Infrastructure, automation, and bespoke solutions.",
    rule: "border-plum-500",
    labelColor: "text-plum-700",
  },
  {
    href: "/blog",
    label: "Blog",
    description:
      "Writing on nature, technology, and the space between. No fixed theme — just things worth saying.",
    rule: "border-earth-400",
    labelColor: "text-earth-700",
  },
];

export default function Home() {
  return (
    <>
      {/* Full-screen hero */}
      <section className="relative h-screen w-full overflow-hidden">
        <video
          src="/videos/website-mainpage-background-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover object-center"
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
      <div className="mx-auto max-w-6xl px-6 py-20">
        <section className="grid gap-x-16 gap-y-12 sm:grid-cols-2">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className={`group border-t-2 pt-8 pb-4 transition-opacity hover:opacity-80 ${s.rule}`}
            >
              <h2 className={`font-serif text-2xl font-semibold ${s.labelColor}`}>
                {s.label}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-earth-600">
                {s.description}
              </p>
              <span className="mt-6 inline-block text-xs font-medium uppercase tracking-widest text-earth-400 transition-colors group-hover:text-terracotta-500">
                Explore →
              </span>
            </Link>
          ))}
        </section>
      </div>
    </>
  );
}
