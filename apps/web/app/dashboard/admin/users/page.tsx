"use client";
import { useEffect, useState } from "react";
import { adminService } from "../../../../services/admin.service";

type User = { _id: string; name: string; email: string; role: string; isActive: boolean };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [role, setRole] = useState("");

  const load = () =>
    adminService.listUsers({ role: role || undefined }).then((res) => setUsers(res.data?.users ?? []));

  useEffect(() => { load(); }, [role]);

  const toggle = async (id: string) => {
    await adminService.toggleUserStatus(id);
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Users</h1>
      <div className="mt-4 flex gap-2">
        {["", "COMPANY", "DRIVER"].map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={`rounded-md px-3 py-1 text-sm font-medium border ${role === r ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}
          >
            {r || "All"}
          </button>
        ))}
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u._id}>
                <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3 text-gray-500">{u.role}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {u.role !== "ADMIN" &&
                    <button
                    onClick={() => toggle(u._id)}
                    className="rounded-md border border-gray-300 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50"
                    >
                    Toggle
                  </button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
