"use client";
import { useEffect, useState } from "react";
import { adminService } from "../../../../services/admin.service";

type Invoice = { id: string; amount: number; currency: string; status: string; date: string; pdf: string | null };
type BillRow = { company: { companyName: string; email: string } | null; plan: string; status: string; invoices: Invoice[] };

export default function AdminBillsPage() {
  const [rows, setRows] = useState<BillRow[]>([]);

  useEffect(() => {
    adminService.listBills().then((res) => setRows(res.data ?? []));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Bills</h1>
      <div className="mt-6 space-y-6">
        {rows.map((row, i) => (
          <div key={i} className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{row.company?.companyName ?? "—"}</p>
                <p className="text-xs text-gray-400">{row.company?.email}</p>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="rounded-full bg-blue-50 text-blue-600 px-2 py-0.5">{row.plan}</span>
                <span className={`rounded-full px-2 py-0.5 ${row.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{row.status}</span>
              </div>
            </div>
            {row.invoices.length > 0 ? (
              <table className="w-full text-sm">
                <thead className="text-left text-xs font-semibold uppercase text-gray-400">
                  <tr>
                    <th className="px-4 py-2">Amount</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {row.invoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className="px-4 py-2 text-gray-700">{inv.amount} {inv.currency.toUpperCase()}</td>
                      <td className="px-4 py-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${inv.status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-500">{new Date(inv.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2 text-right">
                        {inv.pdf && <a href={inv.pdf} target="_blank" className="text-blue-600 hover:underline text-xs">PDF</a>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="px-4 py-3 text-sm text-gray-400">No invoices yet.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
