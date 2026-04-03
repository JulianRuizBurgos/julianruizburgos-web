"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useRef, useEffect, useState } from "react";

const sections = [
  {
    href: "/photography",
    label: "Photography & Prints",
    verticalLabel: "Photography",
    image: "/images/main-page-photography-section-card.jpg",
    accentBg: "bg-amber-500",
  },
  {
    href: "/ecology",
    label: "Ecology",
    verticalLabel: "Ecology",
    image: "/images/main-page-ecology-section-card.jpg",
    accentBg: "bg-olive-500",
  },
  {
    href: "/it",
    label: "IT Consulting",
    verticalLabel: "IT",
    image: "/images/main-page-it-section-card.png",
    accentBg: "bg-navy-500",
  },
  {
    href: "/blog",
    label: "Blog",
    verticalLabel: "Blog",
    image: "/images/main-page-blog-section-card.jpg",
    accentBg: "bg-earth-400",
  },
];

// ─── SectionCard ──────────────────────────────────────────────────────────────
// On desktop (pointer: fine) active state is driven by mouse enter/leave.
// On touch (hover: none) active state is driven by IntersectionObserver:
// the card activates when ≥55% of it is visible in the viewport.

function SectionCard(s: (typeof sections)[number]) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isTouch = window.matchMedia("(hover: none)").matches;
    if (!isTouch) return; // desktop uses CSS hover via mouse events below

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.intersectionRatio >= 0.55),
      { threshold: [0, 0.55, 1] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Link
      ref={ref}
      href={s.href}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className="relative overflow-hidden h-[55vh] sm:h-[65vh] lg:h-[80vh] bg-earth-900 block"
    >
      {/* Background image */}
      <Image
        src={s.image}
        alt={s.label}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className={`object-cover transition-[filter,transform] duration-700 ease-in-out ${
          active ? "grayscale-0 animate-kenburns" : "grayscale"
        }`}
      />

      {/* Dark overlay */}
      <div
        className={`absolute inset-0 transition-colors duration-700 ${
          active ? "bg-black/25" : "bg-black/65"
        }`}
      />

      {/* Vertical stacked label */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`flex flex-col items-center font-serif text-4xl lg:text-5xl xl:text-6xl font-semibold uppercase select-none transition-colors duration-500 leading-none gap-0.5 ${
            active ? "text-white" : "text-white/40"
          }`}
        >
          {s.verticalLabel.split("").map((char, i) => (
            <span key={i}>{char}</span>
          ))}
        </div>
      </div>

      {/* Explore → */}
      <div
        className={`absolute inset-x-0 bottom-6 flex justify-center transition-all duration-500 delay-100 ${
          active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-terracotta-300">
          Explore →
        </span>
      </div>

      {/* Accent line */}
      <div
        className={`absolute inset-x-0 bottom-0 h-px ${s.accentBg} origin-left transition-transform duration-500 ${
          active ? "scale-x-100" : "scale-x-0"
        }`}
      />
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
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
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-black/50 to-transparent" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h1 className="font-serif text-5xl font-semibold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] md:text-6xl lg:text-7xl">
            Julian Ruiz Burgos
          </h1>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.3em] text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
            Ecologist&nbsp;&nbsp;·&nbsp;&nbsp;IT Consultant&nbsp;&nbsp;·&nbsp;&nbsp;Photographer
          </p>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <ChevronDown className="animate-bounce text-white/50" size={28} />
        </div>
      </section>

      {/* Gradient gap between hero and cards */}
      <div className="h-24 bg-linear-to-b from-black/50 to-earth-50" />

      {/* Section cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 bg-earth-200">
        {sections.map((s) => (
          <SectionCard key={s.href} {...s} />
        ))}
      </section>
    </>
  );
}
