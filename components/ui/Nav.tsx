import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "/photography", label: "Photography", hover: "hover:text-amber-600" },
  { href: "/it",          label: "IT",           hover: "hover:text-plum-500" },
  { href: "/ecology",     label: "Ecology",      hover: "hover:text-sage-600" },
  { href: "/blog",        label: "Blog",         hover: "hover:text-stone-500" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-earth-200 bg-earth-50/90 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <Image
            src="/ruiz_burgos_ecology_and_software_logo_rgb.svg"
            alt="Ruiz Burgos Ecology & Software logo"
            width={36}
            height={36}
            priority
          />
          <span className="font-serif text-lg font-semibold tracking-tight text-earth-900">
            Julian Ruiz Burgos
          </span>
        </Link>

        <ul className="flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-sm font-medium text-earth-600 transition-colors ${link.hover}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
