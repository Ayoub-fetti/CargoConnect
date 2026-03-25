"use client";
import { useEffect, useState } from "react";
import { useCompany } from "../../../../hooks/useCompany";
import { companyService } from "../../../../services/company.service";

export default function ProfilePage() {
  const { profile, fetchProfile } = useCompany();
  const [form, setForm] = useState({
    companyName: "",
    description: "",
    location: "",
    legalInfo: "",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setForm({
        companyName: profile.companyName ?? "",
        description: profile.description ?? "",
        location: profile.location ?? "",
        legalInfo: profile.legalInfo ?? "",
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await companyService.updateProfile(form);
      await fetchProfile();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    await companyService.uploadLogo(file);
    await fetchProfile();
    setUploading(false);
  };

  const fields = [
    {
      name: "companyName",
      label: "Nom de l'entreprise",
      placeholder: "CargoConnect SAS",
    },
    { name: "location", label: "Localisation", placeholder: "Paris, France" },
    {
      name: "legalInfo",
      label: "Informations légales",
      placeholder: "SIRET, TVA...",
    },
  ];

  return (
    <div className="min-h-screen bg-white p-8 space-y-10 max-w-4xl">
      {/* Header */}
      <div className="border-b border-gray-100 pb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-1">
          Entreprise
        </p>
        <h1 className="text-5xl font-black text-black tracking-tight">
          Profil
        </h1>
      </div>

      {/* Content */}
      <div className="max-w-xl space-y-10">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <div className="relative">
            {profile?.logo ? (
              <img
                src={`${process.env.NEXT_PUBLIC_UPLOADS_URL}/${profile.logo}`}
                className="h-20 w-20 rounded-full object-cover border border-gray-100"
                alt="logo"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-black text-gray-400">
                {form.companyName?.charAt(0).toUpperCase() || "?"}
              </div>
            )}

            {/* Loader overlay */}
            {uploading && (
              <div className="absolute inset-0 rounded-full bg-white/80 flex items-center justify-center">
                <div
                  className="h-4 w-4 rounded-full border-2 border-gray-200 border-t-black"
                  style={{ animation: "spin 0.8s linear infinite" }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="cursor-pointer inline-block rounded-full border border-gray-200 px-5 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:border-black hover:text-black transition-all duration-200">
              {uploading ? "Envoi..." : "Changer le logo"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
            </label>
            <p className="mt-1.5 text-xs text-gray-300">PNG, JPG — max 2 Mo</p>
          </div>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-100 p-8 space-y-6"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-300">
            Informations
          </p>

          {fields.map(({ name, label, placeholder }) => (
            <div key={name}>
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                {label}
              </label>
              <input
                value={form[name as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                placeholder={placeholder}
                className="w-full border-b-2 border-gray-100 pb-3 text-sm font-semibold text-black placeholder-gray-200 focus:outline-none focus:border-black transition-colors duration-200 bg-transparent"
              />
            </div>
          ))}

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Description
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Décrivez votre activité..."
              className="w-full border-b-2 border-gray-100 pb-3 text-sm font-semibold text-black placeholder-gray-200 focus:outline-none focus:border-black transition-colors duration-200 bg-transparent resize-none"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            {/* Success */}
            <div className="h-4">
              {success && (
                <p className="text-xs font-semibold text-black flex items-center gap-2">
                  ✓ Profil mis à jour
                </p>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-black px-8 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-gray-900 transition-all duration-200 disabled:opacity-40 hover:scale-105 active:scale-95"
            >
              {saving ? "Enregistrement..." : "Enregistrer →"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
      @keyframes spin { to { transform: rotate(360deg); } }
    `}</style>
    </div>
  );
}
