"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "../../../services/auth.service";

const steps = [
  {
    name: "companyName",
    label: "Entreprise",
    type: "text",
    placeholder: "Nom de votre entreprise",
    question: "Nom de votre entreprise ?",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "vous@exemple.com",
    question: "Votre adresse email ?",
  },
  {
    name: "password",
    label: "Mot de passe",
    type: "password",
    placeholder: "••••••••",
    question: "Choisissez un mot de passe.",
  },
  {
    name: "location",
    label: "Localisation",
    type: "text",
    placeholder: "Paris, France",
    question: "Où êtes-vous situé ?",
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"next" | "back">("next");
  const [animating, setAnimating] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    email: "",
    password: "",
    location: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const currentField = steps[current].name as keyof typeof form;
  const progress = ((current + 1) / steps.length) * 100;

  const goNext = () => {
    if (!form[currentField].trim()) {
      setError("Ce champ est requis.");
      return;
    }
    setError("");
    if (current === steps.length - 1) {
      handleSubmit();
      return;
    }
    setDirection("next");
    setAnimating(true);
    setTimeout(() => {
      setCurrent((p) => p + 1);
      setAnimating(false);
    }, 300);
  };

  const goBack = () => {
    if (current === 0) return;
    setError("");
    setDirection("back");
    setAnimating(true);
    setTimeout(() => {
      setCurrent((p) => p - 1);
      setAnimating(false);
    }, 300);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await authService.registerCompany({
        companyName: form.companyName,
        email: form.email,
        password: form.password,
        location: form.location,
      });
      setDone(true);
      setTimeout(() => router.push(`/check-email?email=${form.email}`), 1800);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Une Erreur est survenue",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") goNext();
  };

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-6xl mb-6" style={{ animation: "pop 0.4s ease" }}>
            ✓
          </div>
          <h2 className="text-3xl font-black text-black tracking-tight">
            Compte créé.
          </h2>
          <p className="mt-3 text-sm text-gray-400">Vérifiez votre email...</p>
        </div>
        <style>{`@keyframes pop { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }`}</style>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left branding */}
      <div className="hidden lg:flex w-1/2 bg-black flex-col justify-between p-14">
        <Link
          href="/"
          className="text-lg font-black uppercase text-white"
          style={{ letterSpacing: "0.08em" }}
        >
          CargoConnect
        </Link>
        <div>
          <p className="text-4xl font-black text-white leading-tight tracking-tight">
            Rejoignez
            <br />
            la plateforme.
          </p>
          <p className="mt-4 text-sm text-gray-500 leading-relaxed max-w-xs">
            Créez votre compte en quelques secondes et commencez à gérer vos
            missions dès aujourd'hui.
          </p>
        </div>
        <p className="text-xs text-gray-600">
          © {new Date().getFullYear()} CargoConnect
        </p>
      </div>

      {/* Right form */}
      <div className="flex w-full lg:w-1/2 flex-col px-10 py-14 sm:px-16">
        {/* Mobile logo */}
        <Link
          href="/"
          className="lg:hidden text-base font-black uppercase text-black mb-10"
          style={{ letterSpacing: "0.08em" }}
        >
          CargoConnect
        </Link>

        {/* Progress */}
        <div className="w-full max-w-sm mx-auto mb-12">
          <div className="flex justify-between mb-3">
            {steps.map((s, i) => (
              <span
                key={s.name}
                className="text-xs font-semibold uppercase tracking-widest transition-colors duration-300"
                style={{ color: i <= current ? "#000" : "#d1d5db" }}
              >
                {s.label}
              </span>
            ))}
          </div>
          <div className="h-px w-full bg-gray-100 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-black transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step */}
        <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">
          <div
            key={current}
            style={{
              animation: animating
                ? "none"
                : direction === "next"
                  ? "slideInRight 0.35s cubic-bezier(0.22,1,0.36,1)"
                  : "slideInLeft 0.35s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
              Étape {current + 1} sur {steps.length}
            </p>
            <h2 className="text-3xl font-black text-black tracking-tight leading-tight mb-10">
              {steps[current].question}
            </h2>

            <input
              autoFocus
              name={steps[current].name}
              type={steps[current].type}
              placeholder={steps[current].placeholder}
              value={form[currentField]}
              onChange={(e) =>
                setForm((f) => ({ ...f, [currentField]: e.target.value }))
              }
              onKeyDown={handleKey}
              className="w-full border-b-2 border-gray-200 pb-3 text-xl font-semibold text-black placeholder-gray-200 focus:outline-none focus:border-black transition-colors duration-200 bg-transparent"
            />

            {error && (
              <p className="mt-3 text-xs font-medium text-red-500">{error}</p>
            )}
          </div>

          {/* Navigation */}
          <div className="mt-12 flex items-center justify-between">
            <button
              onClick={goBack}
              disabled={current === 0}
              className="text-xs font-semibold uppercase tracking-widest text-gray-300 hover:text-black transition-colors duration-200 disabled:opacity-0"
            >
              ← Retour
            </button>
            <button
              onClick={goNext}
              disabled={loading}
              className="bg-black text-white text-sm font-bold px-8 py-3 hover:bg-gray-900 transition-all duration-200 disabled:opacity-40"
            >
              {loading
                ? "Création..."
                : current === steps.length - 1
                  ? "Créer mon compte →"
                  : "Suivant →"}
            </button>
          </div>
        </div>

        <p className="mt-10 text-xs text-gray-400 text-center">
          Déjà un compte ?{" "}
          <Link href="/login" className="font-bold text-black hover:underline">
            Se connecter
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes slideInRight { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideInLeft  { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes pop          { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }
      `}</style>
    </div>
  );
}
