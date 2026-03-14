import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-earth-200">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm text-earth-500">
        <span>© {new Date().getFullYear()} Julian Ruiz Burgos</span>
        <Link
          href="/about"
          className="transition-colors hover:text-earth-900"
        >
          About
        </Link>
      </div>
    </footer>
  );
}
