"use client";
import { useEffect, useState } from "react";
import { adminService } from "../../../services/admin.service";

type Stats = {
  users: { totalDrivers: number; totalCompanies: number; activeDrivers: number; activeCompanies: number };
  missions: { total: number; byStatus: Record<string, number> };
  applications: { total: number };
  subscriptions: { total: number; active: number };
};

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
    <p className="text-sm text-gray-500 capitalize">{label.replace(/_/g, " ")}</p>
    <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    adminService.getStats().then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p className="text-sm text-gray-400">Loading stats...</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

      <section>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Users</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Object.entries(stats.users).map(([k, v]) => <StatCard key={k} label={k} value={v} />)}
        </div>
      </section>

      <section>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Missions</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="total" value={stats.missions.total} />
          {Object.entries(stats.missions.byStatus).map(([k, v]) => <StatCard key={k} label={k} value={v} />)}
        </div>
      </section>

      <section>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Applications & Subscriptions</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="applications" value={stats.applications.total} />
          <StatCard label="total subscriptions" value={stats.subscriptions.total} />
          <StatCard label="active subscriptions" value={stats.subscriptions.active} />
        </div>
      </section>
    </div>
  );
}
