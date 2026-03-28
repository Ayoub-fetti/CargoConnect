"use client";
import Link from "next/link";

export default function BillingCancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 text-center shadow-md border border-gray-100">
        <div className="text-6xl">😕</div>
        <h1 className="mt-4 text-2xl font-black text-gray-900">
          Paiement annulé
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Aucun paiement n’a été effectué. Vous pouvez réessayer quand vous le
          souhaitez.
        </p>
        <Link
          href="/dashboard/company/billing"
          className="mt-6 inline-block rounded-full bg-black px-6 py-2 text-sm font-bold text-white hover:bg-gray-900 transition-all duration-200"
        >
          Retour à la facturation →
        </Link>
      </div>
    </div>
  );
}
