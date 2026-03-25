import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-100 px-8 py-10">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-6">

        {/* Logo */}
        <span
          className="text-lg font-black tracking-tight text-black uppercase"
          style={{ letterSpacing: "0.05em" }}
        >
          CargoConnect
        </span>

        {/* Navigation */}
        <nav className="flex items-center gap-8 text-sm font-medium text-gray-500">
          <Link
            href="/"
            className="relative hover:text-black transition-colors duration-200 after:absolute after:bottom-[-2px] after:left-0 after:h-[1.5px] after:w-0 after:bg-black after:content-[''] after:transition-all after:duration-300 hover:after:w-full"
          >
            Accueil
          </Link>
          <Link
            href="/about"
            className="relative hover:text-black transition-colors duration-200 after:absolute after:bottom-[-2px] after:left-0 after:h-[1.5px] after:w-0 after:bg-black after:content-[''] after:transition-all after:duration-300 hover:after:w-full"
          >
            À propos
          </Link>
          <Link
            href="/contact"
            className="relative hover:text-black transition-colors duration-200 after:absolute after:bottom-[-2px] after:left-0 after:h-[1.5px] after:w-0 after:bg-black after:content-[''] after:transition-all after:duration-300 hover:after:w-full"
          >
            Contact
          </Link>
        </nav>

        {/* Copyright */}
        <p className="text-xs text-gray-400 font-medium">
          © {new Date().getFullYear()} CargoConnect. Tous droits réservés.
        </p>

      </div>
    </footer>
  );
}