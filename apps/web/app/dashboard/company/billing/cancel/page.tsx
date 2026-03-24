import Link from "next/link";

export default function BillingCancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-xl bg-white p-10 text-center shadow-sm">
        <div className="text-6xl">😕</div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Payment Cancelled</h1>
        <p className="mt-2 text-sm text-gray-500">
          No charges were made. You can try again whenever you're ready.
        </p>
        <Link
          href="/dashboard/company/billing"
          className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-2 text-sm text-white hover:bg-blue-700"
        >
          Back to Billing
        </Link>
      </div>
    </div>
  );
}
