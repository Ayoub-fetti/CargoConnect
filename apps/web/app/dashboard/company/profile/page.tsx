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
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await companyService.uploadLogo(file);
    await fetchProfile();
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900">Company Profile</h1>

      <div className="mt-4 flex items-center gap-4">
        {profile?.logo && (
          <img
            src={`${process.env.NEXT_PUBLIC_UPLOADS_URL}/${profile.logo}`}
            className="h-16 w-16 rounded-full object-cover"
            alt="logo"
          />
        )}
        <label className="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
          Upload Logo
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoUpload}
          />
        </label>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {[
          { name: "companyName", label: "Company Name" },
          { name: "location", label: "Location" },
          { name: "legalInfo", label: "Legal Info" },
        ].map(({ name, label }) => (
          <div key={name}>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {label}
            </label>
            <input
              value={form[name as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [name]: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {success && (
          <p className="text-sm text-green-600">
            Profile updated successfully.
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
