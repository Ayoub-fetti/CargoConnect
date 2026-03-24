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
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
      <div className="mt-6 flex flex-col gap-3">
        {applications.length === 0 && <p className="text-sm text-gray-400">No applications yet.</p>}
        {applications.map((app) => {
          const driver = app.driverId;
          return (
            <div key={app._id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                    {driver?.fullName?.[0] ?? "D"}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{driver?.fullName}</p>
                    <p className="text-sm text-gray-500">{driver?.email}</p>
                    <div className="mt-1 flex gap-1">
                      {driver?.licenseTypes?.map((l: string) => (
                        <span key={l} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">{l}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor[app.status]}`}>
                    {app.status}
                  </span>
                  <Link
                    href={`/dashboard/company/drivers/${driver?._id}`}
                    className="rounded-md border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
                  >
                    View Profile
                  </Link>
                  {app.status === "PENDING" && (
                    <>
                      <button onClick={() => handle(app._id, "approve")} className="rounded-md bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700">
                        Approve
                      </button>
                      <button onClick={() => handle(app._id, "reject")} className="rounded-md bg-red-50 px-3 py-1 text-xs text-red-600 hover:bg-red-100">
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
              {app.message && (
                <p className="mt-3 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-600">"{app.message}"</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
