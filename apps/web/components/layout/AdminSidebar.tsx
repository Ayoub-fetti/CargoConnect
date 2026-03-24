"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard/admin", label: "Dashboard" },
  { href: "/dashboard/admin/companies", label: "Companies" },
  { href: "/dashboard/admin/drivers", label: "Drivers" },
  { href: "/dashboard/admin/missions", label: "Missions" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex h-full w-56 flex-col border-r border-gray-200 bg-white px-4 py-6">
      <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-gray-400">Admin</p>
      <nav className="flex flex-col gap-1">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              pathname === href
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
