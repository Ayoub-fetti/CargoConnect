"use client";
import { useEffect, useState } from "react";
import { adminService } from "../../../../services/admin.service";

type Invoice = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  date: string;
  pdf: string | null;
};
type BillRow = {
  company: { companyName: string; email: string } | null;
  plan: string;
  status: string;
  invoices: Invoice[];
};

export default function AdminBillsPage() {
  const [rows, setRows] = useState<BillRow[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    adminService.listBills().then((res) => setRows(res.data ?? []));
  }, []);

  const totalRevenue = rows
    .flatMap((r) => r.invoices)
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalInvoices = rows.flatMap((r) => r.invoices).length;
  const activeCount = rows.filter((r) => r.status === "active").length;

  return (
    <div className="min-h-screen bg-white p-8 space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between border-b border-gray-100 pb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-1">
            Administration
          </p>
          <h1 className="text-5xl font-black text-black tracking-tight">
            Facturation
          </h1>
        </div>
        <p className="text-xs font-black text-black">
          {rows.length}{" "}
          <span className="font-medium text-gray-400">abonnements</span>
        </p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-px bg-gray-100 rounded-2xl overflow-hidden">
        {[
          {
            label: "Revenus encaissés",
            value: `${totalRevenue.toLocaleString("fr-FR")} €`,
          },
          { label: "Factures totales", value: totalInvoices },
          { label: "Abonnements actifs", value: activeCount },
        ].map((item) => (
          <div key={item.label} className="bg-white px-8 py-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-300">
              {item.label}
            </p>
            <p className="mt-3 text-4xl font-black text-black leading-none">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Rows */}
      <div className="space-y-3">
        {rows.length === 0 && (
          <div className="py-20 text-center text-sm text-gray-300 font-medium border border-gray-100 rounded-2xl">
            Aucune facturation disponible.
          </div>
        )}

        {rows.map((row, i) => {
          const isOpen = expanded === i;
          const paidTotal = row.invoices
            .filter((inv) => inv.status === "paid")
            .reduce((s, inv) => s + inv.amount, 0);

          return (
            <div
              key={i}
              className={`rounded-2xl border transition-colors duration-200 overflow-hidden ${isOpen ? "border-black" : "border-gray-100 hover:border-gray-300"}`}
            >
              {/* Company header — clickable */}
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-black transition-colors duration-200 ${isOpen ? "bg-black text-white" : "bg-gray-100 text-gray-600 group-hover:bg-black group-hover:text-white"}`}
                  >
                    {row.company?.companyName?.charAt(0).toUpperCase() ?? "?"}
                  </div>
                  <div>
                    <p className="font-bold text-black text-sm">
                      {row.company?.companyName ?? "—"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {row.company?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Plan */}
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    {row.plan}
                  </span>

                  {/* Status */}
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${row.status === "active" ? "bg-black" : "bg-gray-300"}`}
                    />
                    <span
                      className={`text-xs font-semibold ${row.status === "active" ? "text-black" : "text-gray-300"}`}
                    >
                      {row.status === "active" ? "Actif" : row.status}
                    </span>
                  </div>

                  {/* Revenue */}
                  <span className="text-sm font-black text-black">
                    {paidTotal.toLocaleString("fr-FR")} €
                  </span>

                  {/* Chevron */}
                  <span
                    className={`text-gray-400 text-xs transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  >
                    ▼
                  </span>
                </div>
              </button>

              {/* Invoices table — expandable */}
              {isOpen && (
                <div className="border-t border-gray-100">
                  {row.invoices.length === 0 ? (
                    <p className="px-6 py-8 text-sm text-gray-300 text-center font-medium">
                      Aucune facture pour le moment.
                    </p>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-50">
                          {["Montant", "Statut", "Date", ""].map((h) => (
                            <th
                              key={h}
                              className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-gray-300"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {row.invoices.map((inv) => (
                          <tr
                            key={inv.id}
                            className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors duration-100"
                          >
                            <td className="px-6 py-4 font-black text-black">
                              {inv.amount.toLocaleString("fr-FR")}{" "}
                              {inv.currency.toUpperCase()}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1.5">
                                <div
                                  className={`h-1.5 w-1.5 rounded-full ${inv.status === "paid" ? "bg-black" : "bg-gray-300"}`}
                                />
                                <span
                                  className={`text-xs font-semibold ${inv.status === "paid" ? "text-black" : "text-gray-400"}`}
                                >
                                  {inv.status === "paid" ? "Payée" : inv.status}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-400">
                              {new Date(inv.date).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </td>
                            <td className="px-6 py-4 text-right">
                              {inv.pdf && (
                                <a
                                  href={inv.pdf}
                                  target="_blank"
                                  className="inline-block px-4 py-1.5 rounded-full border border-gray-200 text-xs font-bold text-gray-400 hover:border-black hover:text-black transition-all duration-200"
                                >
                                  PDF ↗
                                </a>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
