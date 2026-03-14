import Link from "next/link";

const sections = [
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
    href: "/ecology",
    label: "Ecology",
    description:
      "Ecology consulting, field research, and academic publications. Conservation at the intersection of science and practice.",
    accent: "border-sage-400 hover:bg-sage-100",
    labelColor: "text-sage-600",
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
    <div className="mx-auto max-w-6xl px-6">
      {/* Hero */}
      <section className="py-24 md:py-32">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-earth-400">
          Photographer · Ecologist · IT Consultant
        </p>
        <h1 className="font-serif text-5xl font-semibold leading-tight tracking-tight text-earth-900 md:text-6xl lg:text-7xl">
          Julian Ruiz Burgos
        </h1>
        <div className="mt-6 h-px w-16 bg-earth-300" />
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-earth-600">
          Based in the UK. I photograph wild landscapes, consult on ecological
          projects, and build software. This is where all of that lives.
        </p>
      </section>

      {/* Section cards */}
      <section className="grid gap-6 pb-24 sm:grid-cols-2">
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
  );
}
