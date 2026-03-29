"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `relative transition-colors duration-200
     ${pathname === path ? "text-black font-semibold" : "text-gray-500 hover:text-black"}
     after:absolute after:bottom-[-2px] after:left-0 after:h-[1.5px]
     after:bg-black after:content-[''] after:transition-all after:duration-300
     ${pathname === path ? "after:w-full" : "after:w-0 hover:after:w-full"}`;

  return (
    <header className="w-full bg-white px-8 py-5 border-b border-gray-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-black tracking-tight text-black uppercase"
          style={{ letterSpacing: "0.05em" }}
        >
          CargoConnect
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-10 text-sm font-medium">
          <Link href="/" className={linkClass("/")}>
            Accueil
          </Link>
          <Link href="/about" className={linkClass("/about")}>
            À propos
          </Link>
          <Link href="/contact" className={linkClass("/contact")}>
            Contact
          </Link>
        </nav>

        {/* CTA */}
        <Link
          href="/login"
          className="rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg hover:scale-105 active:scale-95"
        >
          Connexion
        </Link>
      </div>
    </header>
  );
}
