"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "../../../services/auth.service";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }
    authService
      .verifyEmail({ token })
      .then(() => {
        setStatus("success");
        setTimeout(() => router.push("/login"), 3000);
      })
      .catch(() => setStatus("error"));
  }, [token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm text-center">
        {status === "loading" && (
          <>
            <div className="flex justify-center mb-8">
              <div
                className="h-10 w-10 rounded-full border-2 border-gray-200 border-t-black"
                style={{ animation: "spin 0.8s linear infinite" }}
              />
            </div>
            <h2 className="text-2xl font-black text-black tracking-tight">
              Vérification en cours...
            </h2>
            <p className="mt-3 text-sm text-gray-400">
              Merci de patienter quelques instants.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div
              className="text-5xl mb-8"
              style={{ animation: "pop 0.4s ease" }}
            >
              ✓
            </div>
            <h1 className="text-4xl font-black text-black leading-tight tracking-tight">
              Email vérifié.
            </h1>
            <p className="mt-4 text-sm text-gray-400">
              Redirection vers la connexion...
            </p>
            <div className="mt-8 h-px w-full bg-gray-100 relative overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-black"
                style={{ animation: "progress 3s linear forwards" }}
              />
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div
              className="text-5xl mb-8"
              style={{ animation: "pop 0.4s ease" }}
            >
              ✗
            </div>
            <h1 className="text-4xl font-black text-black leading-tight tracking-tight">
              Lien invalide.
            </h1>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              Ce lien est expiré ou incorrect. <br />
              Veuillez recommencer l'inscription.
            </p>
            <div className="mt-12 h-px w-full bg-gray-100" />
            <Link
              href="/login"
              className="mt-8 inline-block text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-black transition-colors duration-200"
            >
              ← Retour à la connexion
            </Link>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin     { to { transform: rotate(360deg); } }
        @keyframes pop      { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }
        @keyframes progress { from{width:0%} to{width:100%} }
      `}</style>
    </div>
  );
}
