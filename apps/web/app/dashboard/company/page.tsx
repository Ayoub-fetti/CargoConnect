"use client";
import { useEffect } from "react";
import { useCompany } from "../../../hooks/useCompany";
import { useMissions } from "../../../hooks/useMissions";
import Link from "next/link";

export default function CompanyDashboard() {
  const { profile, fetchProfile } = useCompany();
  const { missions, fetchMissions } = useMissions();

  useEffect(() => {
    fetchProfile();
    fetchMissions();
  }, []);

  const stats = [
    { label: "Total",       value: missions.length,                                          sub: "missions créées" },
    { label: "Ouvertes",    value: missions.filter((m) => m.status === "OPEN").length,        sub: "en attente de chauffeur" },
    { label: "En cours",    value: missions.filter((m) => m.status === "IN_PROGRESS").length, sub: "actuellement actives" },
    { label: "Terminées",   value: missions.filter((m) => m.status === "CLOSED").length,      sub: "missions clôturées" },
  ];

  return (
    <div className="min-h-screen bg-white p-8 space-y-10">

      {/* Header */}
      <div className="border-b border-gray-100 pb-8 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-1">
            Tableau de bord
          </p>
          <h1 className="text-5xl font-black text-black tracking-tight">
            {profile?.companyName ?? "Entreprise"}
          </h1>
          {profile?.location && (
            <p className="mt-2 text-sm text-gray-400 font-medium">{profile.location}</p>
          )}
        </div>

        <div className="flex gap-3">
          <Link
            href="/dashboard/company/profile"
            className="rounded-full border border-gray-200 px-5 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:border-black hover:text-black transition-all duration-200"
          >
            Modifier le profil
          </Link>
          <Link
            href="/dashboard/company/missions"
            className="rounded-full bg-black px-5 py-2 text-xs font-bold uppercase tracking-widest text-white hover:bg-gray-900 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Gérer les missions →
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-px bg-gray-100 rounded-2xl overflow-hidden sm:grid-cols-4">
        {stats.map(({ label, value, sub }) => (
          <div key={label} className="bg-white p-8 group hover:bg-black transition-colors duration-300">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-300 group-hover:text-gray-500 transition-colors">
              {label}
            </p>
            <p className="mt-4 text-6xl font-black text-black group-hover:text-white transition-colors duration-300 leading-none">
              {value}
            </p>
            <p className="mt-3 text-xs text-gray-400 group-hover:text-gray-500 transition-colors">
              {sub}
            </p>
          </div>
        ))}
      </div>

      {/* Recent activity placeholder */}
      <div className="border border-gray-100 rounded-2xl p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-6">
          Activité récente
        </p>
        {missions.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-gray-300 font-medium">Aucune mission pour le moment.</p>
            <Link
              href="/dashboard/company/missions"
              className="mt-4 inline-block rounded-full bg-black px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-gray-900 transition-all duration-200"
            >
              Créer une mission →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {missions.slice(0, 5).map((m: any) => (
              <div key={m._id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-4">
                  <div className={`h-1.5 w-1.5 rounded-full ${
                    m.status === "OPEN"        ? "bg-black" :
                    m.status === "IN_PROGRESS" ? "bg-gray-400" : "bg-gray-200"
                  }`} />
                  <span className="text-sm font-semibold text-black">{m.title ?? "Mission sans titre"}</span>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-300">
                  {m.status === "OPEN" ? "Ouverte" : m.status === "IN_PROGRESS" ? "En cours" : "Terminée"}
                </span>
              </div>
            ))}
            {missions.length > 5 && (
              <Link
                href="/dashboard/company/missions"
                className="block pt-4 text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-black transition-colors duration-200"
              >
                Voir toutes les missions →
              </Link>
            )}
          </div>
        )}
      </div>

    </div>
  );
}