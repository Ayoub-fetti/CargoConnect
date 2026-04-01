"use client";
import { useEffect, useState } from "react";
import { adminService } from "../../../../services/admin.service";

type User = {
  _id: string;
  fullName?: string;
  companyName?: string;
  name?: string;
  email: string;
  role: string;
  isActive: boolean;
};

const getDisplayName = (u: User): string => {
  if (u.role === "DRIVER") return u.fullName ?? "—";
  if (u.role === "COMPANY") return u.companyName ?? "—";
  return u.fullName ?? u.companyName ?? "—";
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [role, setRole] = useState("");
  const [toggling, setToggling] = useState<string | null>(null);

  const load = () =>
    adminService
      .listUsers({ role: role || undefined })
      .then((res) => setUsers(res.data?.users ?? []));

  useEffect(() => {
    load();
  }, [role]);

  const toggle = async (id: string) => {
    setToggling(id);
    await adminService.toggleUserStatus(id);
    await load();
    setToggling(null);
  };

  return (
    <div className="min-h-screen bg-white p-8 space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between border-b border-gray-100 pb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-1">
            Administration
          </p>
          <h1 className="text-5xl font-black text-black tracking-tight">
            Utilisateurs
          </h1>
        </div>
        <p className="text-xs font-black text-black">
          {users.length}{" "}
          <span className="font-medium text-gray-400">résultats</span>
        </p>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Nom", "Email", "Rôle", "Statut", ""].map((h) => (
                <th
                  key={h}
                  className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-gray-300"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-16 text-center text-sm text-gray-300 font-medium"
                >
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
            {users.map((u) => {
              const displayName = getDisplayName(u);
              return (
                <tr
                  key={u._id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors duration-150 group"
                >
                  {/* Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-black text-gray-600 group-hover:bg-black group-hover:text-white transition-colors duration-200">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-black">
                        {displayName}
                      </span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-gray-400 text-xs">{u.email}</td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      {u.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${u.isActive ? "bg-black" : "bg-gray-300"}`}
                      />
                      <span
                        className={`text-xs font-semibold ${u.isActive ? "text-black" : "text-gray-300"}`}
                      >
                        {u.isActive ? "Actif" : "Inactif"}
                      </span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4 text-right">
                    {u.role !== "ADMIN" && (
                      <button
                        onClick={() => toggle(u._id)}
                        disabled={toggling === u._id}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-all duration-200 disabled:opacity-40 ${
                          u.isActive
                            ? "border-gray-200 text-gray-400 hover:border-black hover:text-black"
                            : "bg-black text-white border-black hover:bg-gray-800"
                        }`}
                      >
                        {toggling === u._id
                          ? "..."
                          : u.isActive
                            ? "Désactiver"
                            : "Activer"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
