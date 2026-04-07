import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-earth-200">
      <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-earth-600">
        <div className="flex flex-wrap items-center justify-between gap-y-3">
          <span>© {new Date().getFullYear()} Julian Ruiz Burgos</span>
          <nav className="flex flex-wrap gap-x-5 gap-y-1">
            <Link href="/about" className="transition-colors hover:text-earth-900">About</Link>
            <Link href="/contact" className="transition-colors hover:text-earth-900">Contact</Link>
            <Link href="/legal/privacy" className="transition-colors hover:text-earth-900">Privacy Policy</Link>
            <Link href="/legal/terms" className="transition-colors hover:text-earth-900">Terms &amp; Conditions</Link>
            <Link href="/legal/shipping" className="transition-colors hover:text-earth-900">Shipping</Link>
            <Link href="/legal/returns" className="transition-colors hover:text-earth-900">Returns</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
