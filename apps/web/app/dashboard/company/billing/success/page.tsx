"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BillingSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => router.push("/dashboard/company/billing"), 5000);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-xl bg-white p-10 text-center shadow-sm">
        <div className="text-6xl">🎉</div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Payment Successful!</h1>
        <p className="mt-2 text-sm text-gray-500">
          Your subscription is now active. Redirecting to billing...
        </p>
        <Link
          href="/dashboard/company/billing"
          className="mt-6 block text-sm text-blue-600 hover:underline"
        >
          Go to Billing →
        </Link>
      </div>
    </div>
  );
}
