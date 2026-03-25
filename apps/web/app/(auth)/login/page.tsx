"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../hooks/useAuth";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const role = await login(email, password);
      if (role === "ADMIN") router.push("/dashboard/admin");
      else if (role === "COMPANY") router.push("/dashboard/company");
      else router.push("/mobile-only");
    } catch {
      setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/man-truck.webp')",
          filter: "brightness(0.2)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6">

        <div className="rounded-2xl bg-white/95 backdrop-blur p-8 shadow-xl">

          <h1 className="text-3xl font-black text-black">
            Connexion
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Accédez à votre espace CargoConnect
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black transition"
                placeholder="you@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black transition"
                placeholder="••••••••"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">
                {error}
              </p>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full bg-black py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>

          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-black font-medium hover:underline">
              Créer un compte
            </Link>
          </p>

        </div>

      </div>
    </section>
  );
}