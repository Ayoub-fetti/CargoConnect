"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";

const links = [
  { href: "/dashboard/company", label: "Overview" },
  { href: "/dashboard/company/missions", label: "Missions" },
  { href: "/dashboard/company/billing", label: "Billing" },
  { href: "/dashboard/company/profile", label: "Profile" },
];


export default function CompanySidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-gray-200 bg-white px-4 py-6 sticky top-0">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Company</p>
        <p className="mt-1 truncate text-sm font-medium text-gray-700">{user?.email}</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              pathname === href || (href !== "/dashboard/company" && pathname.startsWith(href))
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
      <button
        onClick={logout}
        className="mt-4 rounded-md px-3 py-2 text-left text-sm font-medium text-red-500 hover:bg-red-50"
      >
        Logout
      </button>
    </aside>
  );
}
