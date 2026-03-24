"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { missionService } from "../../../../../services/mission.service";
import Link from "next/link";

const STATUS_OPTIONS = ["OPEN", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

const statusColor: Record<string, string> = {
  OPEN: "bg-green-100 text-green-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  CANCELLED: "bg-red-100 text-red-600",
};

export default function MissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [mission, setMission] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await missionService.getOne(id);
    setMission(data);
    setForm({
      title: data.title,
      description: data.description,
      origin: data.origin,
      destination: data.destination,
      cargoType: data.cargoType,
      weight: data.weight,
      price: data.price,
      departureDate: data.departureDate?.slice(0, 10),
      estimatedDuration: data.estimatedDuration ?? "",
      requiredLicenses: data.requiredLicenses?.join(", ") ?? "",
      status: data.status,
    });
  };

  useEffect(() => { load(); }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await missionService.update(id, {
        ...form,
        weight: Number(form.weight),
        price: Number(form.price),
        requiredLicenses: form.requiredLicenses
          ? form.requiredLicenses.split(",").map((s: string) => s.trim()).filter(Boolean)
          : [],
      });
      setEditing(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this mission?")) return;
    await missionService.delete(id);
    router.push("/dashboard/company/missions");
  };

  if (!mission) return <p className="text-sm text-gray-400">Loading...</p>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{mission.title}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setEditing(!editing)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            {editing ? "Cancel" : "Edit"}
          </button>
          <button
            onClick={handleDelete}
            className="rounded-md bg-red-50 px-3 py-1.5 text-sm text-red-600 hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>

      {!editing ? (
        <div className="mt-4 space-y-3 rounded-xl border border-gray-100 bg-white p-6">
          {[
            ["Origin", mission.origin],
            ["Destination", mission.destination],
            ["Cargo Type", mission.cargoType],
            ["Weight", `${mission.weight} kg`],
            ["Price", `${mission.price} MAD`],
            ["Departure", mission.departureDate?.slice(0, 10)],
            ["Estimated Duration", mission.estimatedDuration || "—"],
            ["Required Licenses", mission.requiredLicenses?.join(", ") || "—"],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-gray-500">{label}</span>
              <span className="font-medium text-gray-900">{value}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Status</span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor[mission.status]}`}>
              {mission.status}
            </span>
          </div>
          <p className="mt-2 border-t border-gray-100 pt-3 text-sm text-gray-600">{mission.description}</p>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="mt-4 grid grid-cols-2 gap-4 rounded-xl border border-gray-200 bg-white p-6">
          {[
            { name: "title", label: "Title", col: 2 },
            { name: "origin", label: "Origin" },
            { name: "destination", label: "Destination" },
            { name: "cargoType", label: "Cargo Type" },
            { name: "weight", label: "Weight (kg)", type: "number" },
            { name: "price", label: "Price (MAD)", type: "number" },
            { name: "departureDate", label: "Departure Date", type: "date" },
            { name: "estimatedDuration", label: "Estimated Duration" },
            { name: "requiredLicenses", label: "Required Licenses (comma separated)", col: 2 },
          ].map(({ name, label, type = "text", col }) => (
            <div key={name} className={col === 2 ? "col-span-2" : ""}>
              <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
              <input
                type={type}
                value={form[name] ?? ""}
                onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <div className="col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={3}
              value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="col-span-2 flex justify-end">
            <button type="submit" disabled={saving} className="rounded-md bg-blue-600 px-6 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6">
        <Link
          href={`/dashboard/company/missions/${id}/applications`}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700"
        >
          View Applications
        </Link>
      </div>
    </div>
  );
}
