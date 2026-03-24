"use client";
import { useEffect, useState } from "react";
import { companyService } from "../../../../services/company.service";

const PLANS = [
  {
    key: "monthly",
    label: "Monthly",
    price: "20 €",
    period: "/month",
    description: "Billed monthly, cancel anytime.",
  },
  {
    key: "quarterly",
    label: "Quarterly",
    price: "50 €",
    period: "/3 months",
    description: "Save 16% vs monthly.",
  },
  {
    key: "yearly",
    label: "Yearly",
    price: "200 €",
    period: "/year",
    description: "Best value, save 33%.",
  },
];

const statusColor: Record<string, string> = {
  trial: "bg-blue-100 text-blue-700",
  active: "bg-green-100 text-green-700",
  expired: "bg-red-100 text-red-600",
  past_due: "bg-yellow-100 text-yellow-700",
  canceled: "bg-gray-100 text-gray-500",
};

export default function BillingPage() {
  const [sub, setSub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const loadStatus = () => {
    companyService.getSubscriptionStatus().then(({ data }) => {
      setSub(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleCheckout = async (plan: string) => {
    setCheckoutLoading(plan);
    try {
      const { data } = await companyService.createCheckout({ plan });
      window.location.href = data.url;
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Cancel your subscription at end of billing period?")) return;
    setCancelling(true);
    try {
      await companyService.cancelSubscription();
      loadStatus();
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <p className="text-sm text-gray-400">Loading...</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">Billing</h1>

      {/* Current status */}
      <div className="mt-6 rounded-xl border border-gray-100 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Current Plan</p>
            <p className="mt-1 text-lg font-semibold text-gray-900 capitalize">
              {sub?.plan ?? "Free Trial"}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusColor[sub?.status] ?? ""}`}
          >
            {sub?.status}
          </span>
        </div>

        {sub?.status === "trial" && sub?.trialEnd && (
          <div className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
            🎉 Free trial active — expires on{" "}
            <span className="font-medium">
              {new Date(sub.trialEnd).toLocaleDateString()}
            </span>
          </div>
        )}

        {sub?.status === "expired" && (
          <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            ⚠️ Your trial has expired. Choose a plan below to continue creating
            missions.
          </div>
        )}

        {sub?.status === "active" && (
          <div className="mt-4 space-y-3">
            {sub?.currentPeriodEnd && (
              <div
                className={`rounded-lg px-4 py-3 text-sm ${sub.cancelAtPeriodEnd ? "bg-yellow-50 text-yellow-700" : "bg-green-50 text-green-700"}`}
              >
                {sub.cancelAtPeriodEnd
                  ? "⚠️ Subscription cancels on "
                  : "✅ Next billing date: "}
                <span className="font-medium">
                  {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                </span>
              </div>
            )}
            {!sub.cancelAtPeriodEnd && (
              <>
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="rounded-md border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  {cancelling ? "Cancelling..." : "Cancel Subscription"}
                </button>
                <p className="text-xs text-gray-400">
                  Your subscription will remain active until the end of the
                  current billing period.
                </p>
              </>
            )}
          </div>
        )}

        {sub?.status === "canceled" && (
          <div className="mt-4 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
            ℹ️ Your subscription has been cancelled. Choose a plan below to
            resubscribe.
          </div>
        )}

        {sub?.status === "past_due" && (
          <div className="mt-4 rounded-lg bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
            ⚠️ Payment failed. Please update your payment method via the plan
            below.
          </div>
        )}
      </div>

      {/* Plans — show when not active */}
      {sub?.status !== "active" && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">Choose a Plan</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.key}
                className={`flex flex-col justify-between rounded-xl border p-5 ${
                  plan.key === "yearly"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div>
                  <p className="font-semibold text-gray-900">{plan.label}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {plan.price}
                    <span className="text-sm font-normal text-gray-500">
                      {plan.period}
                    </span>
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    {plan.description}
                  </p>
                </div>
                <button
                  onClick={() => handleCheckout(plan.key)}
                  disabled={checkoutLoading === plan.key}
                  className={`mt-4 rounded-md py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
                    plan.key === "yearly"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {checkoutLoading === plan.key
                    ? "Redirecting..."
                    : `Get ${plan.label}`}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
