"use client";
import { useEffect, useState } from "react";
import { useMissions } from "../../../../hooks/useMissions";
import { missionService } from "../../../../services/mission.service";
import Link from "next/link";

const EMPTY = {
  title: "",
  description: "",
  origin: "",
  destination: "",
  cargoType: "",
  weight: 0,
  price: 0,
  departureDate: "",
  requiredLicenses: "",
};

const statusLabel: Record<string, string> = {
  OPEN: "Ouverte",
  IN_PROGRESS: "En cours",
  CLOSED: "Terminée",
};

export default function MissionsPage() {
  const { missions, loading, fetchMissions } = useMissions();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMissions();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await missionService.create({
        ...form,
        weight: Number(form.weight),
        price: Number(form.price),
        requiredLicenses: form.requiredLicenses
          ? form.requiredLicenses.split(",").map((s) => s.trim())
          : [],
      });
      setShowForm(false);
      setForm(EMPTY);
      fetchMissions();
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { name: "title", label: "Titre", type: "text", col: 2 },
    { name: "origin", label: "Origine", type: "text" },
    { name: "destination", label: "Destination", type: "text" },
    { name: "cargoType", label: "Type de cargaison", type: "text" },
    { name: "weight", label: "Poids (kg)", type: "number" },
    { name: "price", label: "Prix (MAD)", type: "number" },
    { name: "departureDate", label: "Date de départ", type: "date" },
    {
      name: "requiredLicenses",
      label: "Licences requises (séparées par virgule)",
      type: "text",
    },
  ];

  return (
    <div className="min-h-screen bg-white p-8 space-y-8">
      {/* Header */}
      <div className="border-b border-gray-100 pb-8 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-1">
            Entreprise
          </p>
          <h1 className="text-5xl font-black text-black tracking-tight">
            Missions
          </h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`rounded-full text-xs font-bold uppercase tracking-widest px-5 py-2.5 transition-all duration-200 hover:scale-105 active:scale-95 ${
            showForm
              ? "border border-gray-200 text-gray-400 hover:border-black hover:text-black"
              : "bg-black text-white hover:bg-gray-900"
          }`}
        >
          {showForm ? "Annuler" : "+ Nouvelle mission"}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-2xl border border-gray-100 p-8 grid grid-cols-2 gap-6"
          style={{ animation: "slideDown 0.3s cubic-bezier(0.22,1,0.36,1)" }}
        >
          <p className="col-span-2 text-xs font-semibold uppercase tracking-widest text-gray-300 mb-2">
            Nouvelle mission
          </p>

          {fields.map(({ name, label, type, col }) => (
            <div key={name} className={col === 2 ? "col-span-2" : ""}>
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                {label}
              </label>
              <input
                type={type}
                value={form[name as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                required={name !== "requiredLicenses"}
                className="w-full border-b-2 border-gray-100 pb-2 text-sm font-semibold text-black placeholder-gray-200 focus:outline-none focus:border-black transition-colors duration-200 bg-transparent"
              />
            </div>
          ))}

          <div className="col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
              className="w-full border-b-2 border-gray-100 pb-2 text-sm font-semibold text-black placeholder-gray-200 focus:outline-none focus:border-black transition-colors duration-200 bg-transparent resize-none"
            />
          </div>

          <div className="col-span-2 flex justify-end border-t border-gray-100 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-black px-8 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-gray-900 transition-all duration-200 disabled:opacity-40 hover:scale-105 active:scale-95"
            >
              {saving ? "Création..." : "Créer la mission →"}
            </button>
          </div>
        </form>
      )}

      {/* Mission list */}
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
          {missions.length === 0 && (
            <div className="py-20 text-center border border-gray-100 rounded-2xl">
              <p className="text-sm text-gray-300 font-medium">
                Aucune mission pour le moment.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 inline-block rounded-full bg-black px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-gray-900 transition-all duration-200"
              >
                Créer une mission →
              </button>
            </div>
          )}

          {missions.map((m) => {
            const missionId = m.id ?? (m as { _id?: string })._id;

            return (
            <div
              key={missionId}
              className="group flex items-center justify-between rounded-2xl border border-gray-100 p-5 hover:border-black transition-colors duration-200"
            >
              <div className="flex items-center gap-5">
                {/* Status dot */}
                <div
                  className={`h-2 w-2 rounded-full flex-shrink-0 ${
                    m.status === "OPEN"
                      ? "bg-black"
                      : m.status === "IN_PROGRESS"
                        ? "bg-gray-400"
                        : "bg-gray-200"
                  }`}
                />

                <div>
                  <p className="font-bold text-black text-sm">{m.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {m.departureLocation} → {m.arrivalLocation}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  {statusLabel[m.status] ?? m.status}
                </span>
                <Link
                  href={`/dashboard/company/missions/${missionId}`}
                  className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:border-black hover:text-black transition-all duration-200 group-hover:border-gray-300"
                >
                  Voir →
                </Link>
              </div>
            </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes spin     { to { transform: rotate(360deg); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
