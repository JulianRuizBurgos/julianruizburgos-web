import Image from "next/image";
import Link from "next/link";

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
      {/* Hero banner */}
      <section className="relative h-[55vh] min-h-72 w-full overflow-hidden">
        <Image
          src="/images/main-page-backgound.jpg"
          alt="Landscape photograph"
          fill
          className="object-cover object-center"
          priority
        />
        {/* gradient overlay so text is legible */}
        <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/20 to-transparent" />

        {/* Text */}
        <div className="absolute bottom-0 left-0 px-8 pb-10 md:px-16 md:pb-14">
          <h1 className="align-middle font-serif text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
            Julian Ruiz Burgos
          </h1>
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-white/70">
            Ecologist · IT Consultant · Photographer
          </p>
        </div>
      </section>
      {/* Section cards */}
      <div className="mx-auto max-w-6xl px-6 py-12">
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
