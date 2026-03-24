"use client";
import { useEffect, useState } from "react";
import { useMissions } from "../../../../hooks/useMissions";
import { missionService } from "../../../../services/mission.service";
import Link from "next/link";
import { MissionStatus } from "../../../../../../packages/types/enums";

const EMPTY = { title: "", description: "", origin: "", destination: "", cargoType: "", weight: 0, price: 0, departureDate: "", requiredLicenses: "" };

export default function MissionsPage() {
  const { missions, loading, fetchMissions } = useMissions();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchMissions(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await missionService.create({
        ...form,
        weight: Number(form.weight),
        price: Number(form.price),
        requiredLicenses: form.requiredLicenses ? form.requiredLicenses.split(",").map((s) => s.trim()) : [],
      });
      setShowForm(false);
      setForm(EMPTY);
      fetchMissions();
    } finally {
      setSaving(false);
    }
  };

  const statusColor: Record<string, string> = {
    OPEN: "bg-green-100 text-green-700",
    IN_PROGRESS: "bg-yellow-100 text-yellow-700",
    CLOSED: "bg-gray-100 text-gray-500",
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Missions</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "+ New Mission"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mt-6 rounded-xl border border-gray-200 bg-white p-6 grid grid-cols-2 gap-4">
          {[
            { name: "title", label: "Title", col: 2 },
            { name: "origin", label: "Origin" },
            { name: "destination", label: "Destination" },
            { name: "cargoType", label: "Cargo Type" },
            { name: "weight", label: "Weight (kg)", type: "number" },
            { name: "price", label: "Price (MAD)", type: "number" },
            { name: "departureDate", label: "Departure Date", type: "date" },
            { name: "requiredLicenses", label: "Required Licenses (comma separated)" },
          ].map(({ name, label, type = "text", col }) => (
            <div key={name} className={col === 2 ? "col-span-2" : ""}>
              <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
              <input
                type={type}
                value={form[name as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                required={name !== "requiredLicenses"}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <div className="col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="col-span-2 flex justify-end">
            <button type="submit" disabled={saving} className="rounded-md bg-blue-600 px-6 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50">
              {saving ? "Creating..." : "Create Mission"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="mt-8 text-sm text-gray-400">Loading...</p>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {missions.length === 0 && <p className="text-sm text-gray-400">No missions yet.</p>}
          {missions.map((m) => (
            <div key={m._id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div>
                <p className="font-medium text-gray-900">{m.title}</p>
                <p className="text-sm text-gray-500">{m.departureLocation} → {m.arrivalLocation}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor[m.status] ?? ""}`}>
                  {m.status}
                </span>
                <Link href={`/dashboard/company/missions/${m._id}`} className="text-sm text-blue-600 hover:underline">
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
