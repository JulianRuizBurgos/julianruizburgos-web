"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ShoppingBag, House, Menu } from "lucide-react";
import { useCart } from "@/lib/cart";

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

function sidebarBg(pathname: string): string {
  if (pathname.startsWith("/photography")) return "bg-stone-900/60 backdrop-blur-md";
  if (pathname.startsWith("/it"))          return "bg-navy-700/60 backdrop-blur-md";
  if (pathname.startsWith("/ecology"))     return "bg-olive-700/60 backdrop-blur-md";
  if (pathname.startsWith("/blog"))        return "bg-earth-800/60 backdrop-blur-md";
  return "bg-earth-900/60 backdrop-blur-md";
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <>
      {/* Home link — fixed top left */}
      <Link
        href="/"
        aria-label="Home"
        className="fixed top-5 left-8 z-50 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
      >
        <House size={18} strokeWidth={1.8} />
      </Link>

      {/* Cart icon — fixed, left of MENU */}
      <Link
        href="/cart"
        aria-label={`Cart (${itemCount} items)`}
        className="fixed top-5 right-20 z-50 flex items-center gap-1.5 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
      >
        <ShoppingBag size={16} strokeWidth={1.8} />
        {itemCount > 0 && (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1068b6] text-[10px] font-bold text-white">
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        )}
      </Link>

      {/* Floating MENU button — overlays the page */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="fixed top-5 right-8 z-50 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
      >
        <Menu size={18} strokeWidth={1.8} />
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
        className={`fixed inset-y-0 right-0 z-50 w-80 text-white transition-transform duration-300 ease-in-out ${sidebarBg(pathname)} ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col px-8 py-8">
          {/* Header row */}
          <div className="mb-12 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-widest text-white/60">
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
                <p className="mb-4 text-xs font-medium uppercase tracking-widest text-white/60">
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
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-white/80">
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
