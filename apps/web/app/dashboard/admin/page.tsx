"use client";
import { useEffect, useState } from "react";
import { adminService } from "../../../services/admin.service";

type Stats = {
  users: { totalDrivers: number; totalCompanies: number; activeDrivers: number; activeCompanies: number };
  missions: { total: number; byStatus: Record<string, number> };
  applications: { total: number };
  subscriptions: { total: number; active: number };
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    adminService.getStats().then((res) => setStats(res.data));
  }, []);

  if (!stats) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <div className="h-4 w-4 rounded-full border-2 border-gray-200 border-t-black"
            style={{ animation: "spin 0.8s linear infinite" }} />
          Chargement...
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const activeRate = stats.users.activeDrivers + stats.users.activeCompanies > 0
    ? Math.round(((stats.users.activeDrivers + stats.users.activeCompanies) /
        (stats.users.totalDrivers + stats.users.totalCompanies)) * 100)
    : 0;

  const subRate = stats.subscriptions.total > 0
    ? Math.round((stats.subscriptions.active / stats.subscriptions.total) * 100)
    : 0;

  const missionStatuses = Object.entries(stats.missions.byStatus);

  return (
    <div className="min-h-screen bg-white p-8 space-y-8">

      {/* Header */}
      <div className="flex items-end justify-between border-b border-gray-100 pb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-1">
            Administration
          </p>
          <h1 className="text-5xl font-black text-black tracking-tight">Dashboard</h1>
        </div>
        <p className="text-xs text-gray-300 font-medium">
          {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Hero row — big numbers */}
      <div className="grid grid-cols-3 gap-px bg-gray-100 rounded-2xl overflow-hidden">
        {[
          { value: stats.users.totalDrivers + stats.users.totalCompanies, label: "Utilisateurs total", sub: `${stats.users.activeDrivers + stats.users.activeCompanies} actifs` },
          { value: stats.missions.total, label: "Missions créées", sub: `${missionStatuses.length} statuts` },
          { value: stats.applications.total, label: "Candidatures", sub: `${stats.subscriptions.active} abonnements actifs` },
        ].map((item) => (
          <div key={item.label} className="bg-white p-8 group hover:bg-black transition-colors duration-300">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-300 group-hover:text-gray-500 transition-colors">
              {item.label}
            </p>
            <p className="mt-4 text-7xl font-black text-black group-hover:text-white transition-colors duration-300 leading-none">
              {item.value}
            </p>
            <p className="mt-3 text-xs text-gray-400 group-hover:text-gray-400 transition-colors">
              {item.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-3 gap-6">

        {/* Active rate gauge */}
        <div className="col-span-1 border border-gray-100 rounded-2xl p-6 flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-300">
            Taux d'activité
          </p>
          <div className="my-6 flex items-center justify-center">
            <div className="relative h-32 w-32">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="50" fill="none" stroke="#000" strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - activeRate / 100)}`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-black">{activeRate}%</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>{stats.users.activeDrivers} chauffeurs actifs</span>
            <span>{stats.users.activeCompanies} entreprises actives</span>
          </div>
        </div>

        {/* Missions by status */}
        <div className="col-span-2 border border-gray-100 rounded-2xl p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-6">
            Missions par statut
          </p>
          <div className="space-y-4">
            {missionStatuses.map(([status, count]) => {
              const pct = stats.missions.total > 0
                ? Math.round((count / stats.missions.total) * 100)
                : 0;
              return (
                <div key={status}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs font-semibold text-gray-600 capitalize">
                      {status.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs font-black text-black">{count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black rounded-full"
                      style={{ width: `${pct}%`, transition: "width 1s ease" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-4 gap-6">

        {/* Subscriptions */}
        <div className="col-span-2 bg-black rounded-2xl p-6 flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            Abonnements
          </p>
          <div className="flex items-end justify-between mt-6">
            <div>
              <p className="text-6xl font-black text-white leading-none">{stats.subscriptions.active}</p>
              <p className="mt-2 text-xs text-gray-500">actifs sur {stats.subscriptions.total}</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black text-white">{subRate}%</p>
              <p className="mt-1 text-xs text-gray-500">taux d'activation</p>
            </div>
          </div>
          <div className="mt-6 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: `${subRate}%`, transition: "width 1s ease" }} />
          </div>
        </div>

        {/* User breakdown */}
        {[
          { label: "Chauffeurs",  total: stats.users.totalDrivers,    active: stats.users.activeDrivers },
          { label: "Entreprises", total: stats.users.totalCompanies,  active: stats.users.activeCompanies },
        ].map((item) => (
          <div key={item.label} className="border border-gray-100 rounded-2xl p-6 flex flex-col justify-between hover:border-black transition-colors duration-200">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-300">
              {item.label}
            </p>
            <p className="mt-4 text-5xl font-black text-black leading-none">{item.total}</p>
            <div className="mt-4">
              <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black rounded-full"
                  style={{
                    width: item.total > 0 ? `${Math.round((item.active / item.total) * 100)}%` : "0%",
                    transition: "width 1s ease"
                  }}
                />
              </div>
              <p className="mt-2 text-xs text-gray-400">{item.active} actifs</p>
            </div>
          </div>
        ))}

      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}