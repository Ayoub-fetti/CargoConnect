"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { missionService } from "../../../../../../services/mission.service";
import Link from "next/link";

export default function ApplicationsPage() {
  const { id } = useParams<{ id: string }>();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await missionService.getMissionApplications(id);
    setApplications(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const handle = async (appId: string, action: "approve" | "reject") => {
    if (action === "approve") await missionService.approveApplication(appId);
    else await missionService.rejectApplication(appId);
    load();
  };

  const statusColor: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    ACCEPTED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-600",
  };

  if (loading) return <p className="text-sm text-gray-400">Loading...</p>;

return (
  <div className="min-h-screen bg-white p-8 space-y-8 max-w-4xl">

    {/* Header */}
    <div className="border-b border-gray-100 pb-8 flex items-end justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-1">
          Mission
        </p>
        <h1 className="text-5xl font-black text-black tracking-tight">
          Candidatures
        </h1>
      </div>

      <Link
        href={`/dashboard/company/missions/${id}`}
        className="rounded-full border border-gray-200 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:border-black hover:text-black transition-all duration-200"
      >
        ← Retour
      </Link>
    </div>

    {/* Loading */}
    {loading ? (
      <div className="flex items-center gap-3 text-sm text-gray-400">
        <div
          className="h-4 w-4 rounded-full border-2 border-gray-200 border-t-black"
          style={{ animation: "spin 0.8s linear infinite" }}
        />
        Chargement...
      </div>
    ) : (
      <div className="space-y-3">

        {applications.length === 0 && (
          <div className="py-20 text-center border border-gray-100 rounded-2xl">
            <p className="text-sm text-gray-300 font-medium">
              Aucune candidature pour le moment.
            </p>
          </div>
        )}

        {applications.map((app) => {
          const driver = app.driverId;

          return (
            <div
              key={app._id}
              className="group flex items-center justify-between rounded-2xl border border-gray-100 p-5 hover:border-black transition-colors duration-200"
            >
              {/* Left */}
              <div className="flex items-center gap-5">

                {/* Avatar */}
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 text-black font-bold text-sm">
                  {driver?.fullName?.[0] ?? "D"}
                </div>

                <div>
                  <p className="font-bold text-black text-sm">
                    {driver?.fullName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {driver?.email}
                  </p>

                  {/* Licenses */}
                  <div className="flex gap-2 mt-1">
                    {driver?.licenseTypes?.map((l: string) => (
                      <span
                        key={l}
                        className="text-[10px] font-bold uppercase tracking-widest text-gray-400"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-4">

                {/* Status */}
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  {app.status}
                </span>

                {/* Actions */}
                <Link
                  href={`/dashboard/company/drivers/${driver?._id}`}
                  className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:border-black hover:text-black transition-all duration-200"
                >
                  Profil →
                </Link>

                {app.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => handle(app._id, "approve")}
                      className="rounded-full bg-black px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-gray-900 transition-all duration-200"
                    >
                      Accepter
                    </button>

                    <button
                      onClick={() => handle(app._id, "reject")}
                      className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:border-black hover:text-black transition-all duration-200"
                    >
                      Refuser
                    </button>
                  </>
                )}
              </div>

              {/* Message */}
              {app.message && (
                <div className="absolute left-0 top-full mt-2 w-full rounded-xl border border-gray-100 bg-white p-4 text-sm text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm">
                  “{app.message}”
                </div>
              )}
            </div>
          );
        })}
      </div>
    )}

    <style>{`
      @keyframes spin { to { transform: rotate(360deg); } }
    `}</style>
  </div>
);
}
