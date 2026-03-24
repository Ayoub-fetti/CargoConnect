"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "../../../services/auth.service";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      await authService.registerCompany({
        companyName: form.get("companyName"),
        email: form.get("email"),
        password: form.get("password"),
        location: form.get("location"),
      });
      router.push(`/check-email?email=${form.get("email")}`);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
      <p className="mt-1 text-sm text-gray-500">Register your company</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {[
          { name: "companyName", label: "Company Name", type: "text" },
          { name: "email", label: "Email", type: "email" },
          { name: "password", label: "Password", type: "password" },
          { name: "location", label: "Location", type: "text" },
        ].map(({ name, label, type }) => (
          <div key={name}>
            <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
            <input
              name={name}
              type={type}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
