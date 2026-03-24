import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white px-6 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <span className="text-sm font-bold text-blue-600">CargoConnect</span>
        <nav className="flex gap-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <Link href="/about" className="hover:text-blue-600">About</Link>
          <Link href="/contact" className="hover:text-blue-600">Contact</Link>
        </nav>
        <p className="text-xs text-gray-400">© {new Date().getFullYear()} CargoConnect</p>
      </div>
    </footer>
  );
}
