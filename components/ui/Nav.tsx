"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const sections = [
  {
    label: "WORK",
    links: [
      { href: "/photography", label: "Photography & Prints" },
      { href: "/ecology",     label: "Ecology" },
      { href: "/it",          label: "IT Consulting" },
    ],
  },
  {
    label: "WRITING",
    links: [
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    label: "MORE",
    links: [
      { href: "/about", label: "About" },
    ],
  },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating MENU button — overlays the page */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="fixed top-6 right-8 z-50 text-xs font-medium uppercase tracking-widest text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
      >
        MENU
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Dark slide-in sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-earth-900 text-white transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col px-8 py-8">
          {/* Header row */}
          <div className="mb-12 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-widest text-white/40">
              MENU
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="text-white/50 transition-colors hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation sections */}
          <nav className="flex-1 space-y-10">
            {sections.map((section) => (
              <div key={section.label}>
                <p className="mb-4 text-xs font-medium uppercase tracking-widest text-white/30">
                  {section.label}
                </p>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="font-serif text-lg text-white/80 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Contact info anchored to bottom */}
          <div className="border-t border-white/10 pt-8">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-white/30">
              GET IN TOUCH
            </p>
            <a
              href="mailto:julian@julianruizburgos.net"
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              julian@julianruizburgos.net
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
