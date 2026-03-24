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
    { label: "Total Missions", value: missions.length },
    { label: "Open", value: missions.filter((m) => m.status === "OPEN").length },
    { label: "In Progress", value: missions.filter((m) => m.status === "IN_PROGRESS").length },
    { label: "Closed", value: missions.filter((m) => m.status === "CLOSED").length },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        Welcome, {profile?.companyName ?? "Company"}
      </h1>
      <p className="mt-1 text-sm text-gray-500">{profile?.location}</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(({ label, value }) => (
          <div key={label} className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-4">
        <Link
          href="/dashboard/company/missions"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Manage Missions
        </Link>
        <Link
          href="/dashboard/company/profile"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Edit Profile
        </Link>
      </div>
    </div>
  );
}
