"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";

const links = [
  { href: "/dashboard/company", label: "Vue générale" },
  { href: "/dashboard/company/missions", label: "Missions" },
  { href: "/dashboard/company/billing", label: "Facturation" },
  { href: "/dashboard/company/profile", label: "Profil" },
];

export default function CompanySidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-gray-100 bg-white px-4 py-8 sticky top-0 justify-between">
      {/* Top */}
      <div>
        <Link
          href="/"
          className="mb-8 block text-sm font-black uppercase text-black"
          style={{ letterSpacing: "0.08em" }}
        >
          CargoConnect
        </Link>

        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-300">
            Entreprise
          </p>
          <p className="mt-1.5 truncate text-xs font-medium text-gray-400">
            {user?.email}
          </p>
        </div>

        <nav className="flex flex-col gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors duration-150 ${
                pathname === href ||
                (href !== "/dashboard/company" && pathname.startsWith(href))
                  ? "bg-black text-white"
                  : "text-gray-400 hover:text-black hover:bg-gray-50"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom — logout */}
      <button
        onClick={handleLogout}
        className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-gray-400 hover:text-black hover:bg-gray-50 transition-colors duration-150"
      >
        Déconnexion →
      </button>
    </aside>
  );
}
