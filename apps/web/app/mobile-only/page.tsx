import Link from "next/link";

export default function MobileOnlyPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <div className="max-w-sm w-full">
        <div className="text-5xl mb-8">📱</div>
        <h1 className="text-4xl font-black text-black leading-tight tracking-tight">
          Application
          <br />
          requise.
        </h1>
        <p className="mt-5 text-sm text-gray-400 leading-relaxed">
          L'espace chauffeur est uniquement disponible sur l'application mobile
          CargoConnect.
        </p>
        <div className="mt-10 flex flex-col gap-3">
          <a
            href="#"
            className="rounded-full bg-black px-6 py-3 text-sm font-bold text-white hover:bg-gray-800 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Télécharger sur l'App Store
          </a>
          <a
            href="#"
            className="rounded-full border border-gray-200 px-6 py-3 text-sm font-bold text-black hover:border-black transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Disponible sur Google Play
          </a>
        </div>
        <Link
          href="/login"
          className="mt-10 inline-block text-xs font-semibold text-gray-400 uppercase tracking-widest hover:text-black transition-colors duration-200"
        >
          ← Retour à la connexion
        </Link>
      </div>
    </div>
  );
}
