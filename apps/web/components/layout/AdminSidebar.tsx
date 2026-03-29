"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";

const links = [
  { href: "/dashboard/admin", label: "Dashboard" },
  { href: "/dashboard/admin/users", label: "Utilisateurs" },
  { href: "/dashboard/admin/bills", label: "Factures" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="flex h-full w-56 flex-col border-r border-gray-100 bg-white px-4 py-8 justify-between">
      {/* Top */}
      <div>
        <Link
          href="/"
          className="mb-8 block text-sm font-black uppercase text-black"
          style={{ letterSpacing: "0.08em" }}
        >
          CargoConnect
        </Link>

        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-300">
          Admin
        </p>

        <nav className="flex flex-col gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors duration-150 ${
                pathname === href
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
