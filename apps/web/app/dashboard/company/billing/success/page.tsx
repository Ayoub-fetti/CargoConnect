"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BillingSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(
      () => router.push("/dashboard/company/billing"),
      5000,
    );
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 text-center shadow-md border border-gray-100">
        <div className="text-6xl">🎉</div>
        <h1 className="mt-4 text-2xl font-black text-gray-900">
          Paiement réussi !
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Votre abonnement est maintenant actif. Vous allez être redirigé vers
          la page de facturation...
        </p>
        <Link
          href="/dashboard/company/billing"
          className="mt-6 inline-block rounded-full bg-black px-6 py-2 text-sm font-bold text-white hover:bg-gray-900 transition-all duration-200"
        >
          Aller à la facturation →
        </Link>
        <p className="mt-2 text-xs text-gray-400">
          Vous serez automatiquement redirigé dans 5 secondes.
        </p>
      </div>
    </div>
  );
}
