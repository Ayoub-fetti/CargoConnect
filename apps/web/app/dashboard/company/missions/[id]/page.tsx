"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { missionService } from "../../../../../services/mission.service";
import { toastAlert, toastConfirm } from "../../../../../lib/toast";
import Link from "next/link";

const STATUS_OPTIONS = ["OPEN", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

const _statusColor: Record<string, string> = {
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

  useEffect(() => {
    load();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await missionService.update(id, {
        ...form,
        weight: Number(form.weight),
        price: Number(form.price),
        requiredLicenses: form.requiredLicenses
          ? form.requiredLicenses
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
          : [],
      });
      setEditing(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = await toastConfirm({
      title: "Delete this mission?",
      description: "This action cannot be undone.",
      confirmLabel: "Delete",
      cancelLabel: "Keep",
    });

    if (!confirmed) {
      toastAlert("Deletion cancelled");
      return;
    }

    try {
      await missionService.delete(id);
      toast.success("Mission deleted");
      router.push("/dashboard/company/missions");
    } catch {
      toast.error("Failed to delete mission");
    }
  };

  if (!mission) return <p className="text-sm text-gray-400">Loading...</p>;

  return (
    <div className="min-h-screen bg-white p-8 space-y-8 max-w-4xl">
      {/* Header */}
      <div className="border-b border-gray-100 pb-8 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-1">
            Mission
          </p>
          <h1 className="text-5xl font-black text-black tracking-tight">
            {mission.title}
          </h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setEditing(!editing)}
            className={`rounded-full text-xs font-bold uppercase tracking-widest px-5 py-2.5 transition-all duration-200 hover:scale-105 ${
              editing
                ? "border border-gray-200 text-gray-400 hover:border-black hover:text-black"
                : "bg-black text-white hover:bg-gray-900"
            }`}
          >
            {editing ? "Annuler" : "Modifier"}
          </button>

          <button
            onClick={handleDelete}
            className="rounded-full border border-gray-200 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:border-black hover:text-black transition-all duration-200"
          >
            Supprimer
          </button>
        </div>
      </div>

      {/* VIEW MODE */}
      {!editing ? (
        <div className="rounded-2xl border border-gray-100 p-8 space-y-6">
          {/* Info grid */}
          <div className="grid grid-cols-2 gap-6 text-sm">
            {[
              ["Origine", mission.origin],
              ["Destination", mission.destination],
              ["Cargaison", mission.cargoType],
              ["Poids", `${mission.weight} kg`],
              ["Prix", `${mission.price} MAD`],
              ["Départ", mission.departureDate?.slice(0, 10)],
              ["Durée", mission.estimatedDuration || "—"],
              ["Licences", mission.requiredLicenses?.join(", ") || "—"],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-1">
                  {label}
                </p>
                <p className="font-bold text-black">{value}</p>
              </div>
            ))}

            {/* Status */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-1">
                Statut
              </p>
              <span className="text-sm font-bold text-black">
                {mission.status}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-gray-100 pt-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-2">
              Description
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {mission.description}
            </p>
          </div>
        </div>
      ) : (
        /* EDIT MODE */
        <form
          onSubmit={handleUpdate}
          className="rounded-2xl border border-gray-100 p-8 grid grid-cols-2 gap-6"
          style={{ animation: "slideDown 0.3s cubic-bezier(0.22,1,0.36,1)" }}
        >
          <p className="col-span-2 text-xs font-semibold uppercase tracking-widest text-gray-300 mb-2">
            Modifier la mission
          </p>

          {[
            { name: "title", label: "Titre", col: 2 },
            { name: "origin", label: "Origine" },
            { name: "destination", label: "Destination" },
            { name: "cargoType", label: "Type de cargaison" },
            { name: "weight", label: "Poids (kg)", type: "number" },
            { name: "price", label: "Prix (MAD)", type: "number" },
            { name: "departureDate", label: "Date de départ", type: "date" },
            { name: "estimatedDuration", label: "Durée estimée" },
            {
              name: "requiredLicenses",
              label: "Licences (séparées par virgule)",
              col: 2,
            },
          ].map(({ name, label, type = "text", col }) => (
            <div key={name} className={col === 2 ? "col-span-2" : ""}>
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                {label}
              </label>
              <input
                type={type}
                value={form[name] ?? ""}
                onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                className="w-full border-b-2 border-gray-100 pb-2 text-sm font-semibold text-black focus:outline-none focus:border-black transition-colors duration-200 bg-transparent"
              />
            </div>
          ))}

          {/* Status */}
          <div className="col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Statut
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full border-b-2 border-gray-100 pb-2 text-sm font-semibold text-black focus:outline-none focus:border-black bg-transparent"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description ?? ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full border-b-2 border-gray-100 pb-2 text-sm font-semibold text-black focus:outline-none focus:border-black bg-transparent resize-none"
            />
          </div>

          <div className="col-span-2 flex justify-end border-t border-gray-100 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-black px-8 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-gray-900 transition-all duration-200 disabled:opacity-40 hover:scale-105"
            >
              {saving ? "Enregistrement..." : "Sauvegarder →"}
            </button>
          </div>
        </form>
      )}

      {/* Applications button */}
      <div className="flex justify-end">
        <Link
          href={`/dashboard/company/missions/${id}/applications`}
          className="rounded-full border border-gray-200 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:border-black hover:text-black transition-all duration-200"
        >
          Voir les candidatures →
        </Link>
      </div>

      <style>{`
      @keyframes slideDown {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}</style>
    </div>
  );
}
