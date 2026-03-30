"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { companyService } from "../../../../services/company.service";
import { toastAlert, toastConfirm } from "../../../../lib/toast";

const PLANS = [
  {
    key: "monthly",
    label: "Mensuel",
    price: "20 €",
    period: "/mois",
    description: "Facturation mensuelle, sans engagement.",
  },
  {
    key: "quarterly",
    label: "Trimestriel",
    price: "50 €",
    period: "/3 mois",
    description: "Économisez 16%.",
  },
  {
    key: "yearly",
    label: "Annuel",
    price: "200 €",
    period: "/an",
    description: "Meilleur choix, économisez 33%.",
  },
];

const statusLabel: Record<string, string> = {
  trial: "Essai",
  active: "Actif",
  expired: "Expiré",
  past_due: "Paiement en attente",
  canceled: "Annulé",
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
    const confirmed = await toastConfirm({
      title: "Annuler votre abonnement à la fin de la période ?",
      description: "L'abonnement restera actif jusqu'a la fin de la periode.",
      confirmLabel: "Confirmer",
      cancelLabel: "Garder",
    });

    if (!confirmed) {
      toastAlert("Annulation interrompue");
      return;
    }

    setCancelling(true);
    try {
      await companyService.cancelSubscription();
      toast.success("Abonnement programme pour annulation");
      loadStatus();
    } catch {
      toast.error("Impossible d'annuler l'abonnement");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-sm text-gray-400 p-8">
        <div
          className="h-4 w-4 rounded-full border-2 border-gray-200 border-t-black"
          style={{ animation: "spin 0.8s linear infinite" }}
        />
        Chargement...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8 space-y-10 max-w-4xl">
      {/* Header */}
      <div className="border-b border-gray-100 pb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-1">
          Entreprise
        </p>
        <h1 className="text-5xl font-black text-black tracking-tight">
          Facturation
        </h1>
      </div>

      {/* Status */}
      <div className="rounded-2xl border border-gray-100 p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-300">
              Plan actuel
            </p>
            <p className="mt-2 text-xl font-black text-black capitalize">
              {sub?.plan ?? "Essai gratuit"}
            </p>
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
            {statusLabel[sub?.status] ?? sub?.status}
          </span>
        </div>

        {/* Messages */}
        {sub?.status === "trial" && sub?.trialEnd && (
          <p className="text-sm text-gray-600">
            Essai actif jusqu’au{" "}
            <span className="font-bold text-black">
              {new Date(sub.trialEnd).toLocaleDateString()}
            </span>
          </p>
        )}

        {sub?.status === "expired" && (
          <p className="text-sm text-gray-600">
            Votre essai est terminé. Choisissez une offre pour continuer.
          </p>
        )}

        {sub?.status === "active" && sub?.currentPeriodEnd && (
          <p className="text-sm text-gray-600">
            {sub.cancelAtPeriodEnd
              ? "Fin prévue le "
              : "Prochaine facturation le "}
            <span className="font-bold text-black">
              {new Date(sub.currentPeriodEnd).toLocaleDateString()}
            </span>
          </p>
        )}

        {sub?.status === "active" && !sub.cancelAtPeriodEnd && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="rounded-full border border-gray-200 px-5 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:border-black hover:text-black transition-all duration-200"
          >
            {cancelling ? "Annulation..." : "Annuler l’abonnement"}
          </button>
        )}
      </div>

      {/* Plans */}
      {sub?.status !== "active" && (
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-1">
              Abonnement
            </p>
            <h2 className="text-2xl font-black text-black">
              Choisir une offre
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map((plan) => (
              <div
                key={plan.key}
                className={`flex flex-col justify-between rounded-2xl border p-6 transition-all duration-200 hover:border-black ${
                  sub?.plan === plan.key ? "border-black" : "border-gray-100"
                }`}
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-300">
                    {plan.label}
                  </p>

                  <p className="mt-3 text-3xl font-black text-black">
                    {plan.price}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">{plan.period}</p>

                  <p className="text-xs text-gray-400 mt-3">
                    {plan.description}
                  </p>

                  {/* Badge plan actuel */}
                  {sub?.plan === plan.key && (
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Actuel
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleCheckout(plan.key)}
                  disabled={checkoutLoading === plan.key}
                  className={`mt-6 rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-200 ${
                    sub?.plan === plan.key
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "border border-gray-200 text-gray-400 hover:border-black hover:text-black"
                  }`}
                >
                  {checkoutLoading === plan.key
                    ? "Redirection..."
                    : "Choisir →"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
