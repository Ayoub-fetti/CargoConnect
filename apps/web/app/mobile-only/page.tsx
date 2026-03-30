import Link from "next/link";

export default function MobileOnlyPage() {
  const apkUrl = process.env.NEXT_PUBLIC_DRIVER_APK_URL || "";
  const qrTarget = process.env.NEXT_PUBLIC_DRIVER_EXPO_QR_URL || apkUrl;
  const qrImageUrl = qrTarget
    ? `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(qrTarget)}`
    : "";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-10 text-center">
      <div className="max-w-md w-full rounded-2xl border border-gray-100 p-7 shadow-sm">
        <div className="text-5xl mb-6">📱</div>
        <h1 className="text-4xl font-black text-black leading-tight tracking-tight">
          Installation
          <br />
          de l'app chauffeur
        </h1>
        <p className="mt-4 text-sm text-gray-500 leading-relaxed">
          Scannez le QR code Expo pour installer l'APK CargoConnect, puis
          autorisez l'installation depuis source externe sur Android.
        </p>

        <div className="mt-7 rounded-xl border border-gray-100 bg-gray-50 p-4">
          {qrImageUrl ? (
            <img
              src={qrImageUrl}
              alt="QR code installation CargoConnect"
              className="mx-auto h-56 w-56 rounded-lg bg-white p-2"
            />
          ) : (
            <p className="text-xs text-gray-500 leading-relaxed">
              QR indisponible. Configurez NEXT_PUBLIC_DRIVER_EXPO_QR_URL (ou
              NEXT_PUBLIC_DRIVER_APK_URL) dans apps/web/.env.
            </p>
          )}

          <ol className="mt-4 space-y-2 text-left text-xs text-gray-600">
            <li>1. Ouvrez l'appareil photo Android et scannez le QR code.</li>
            <li>2. Téléchargez l'APK CargoConnect depuis le lien Expo.</li>
            <li>
              3. Activez "Installer des applis inconnues" pour votre navigateur.
            </li>
            <li>4. Lancez l'APK puis connectez-vous en tant que chauffeur.</li>
          </ol>
        </div>
        <div className="grid">
          {apkUrl && (
            <a
              href={apkUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block rounded-full bg-black px-6 py-3 text-sm font-bold text-white hover:bg-gray-800 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Ouvrir le lien APK
            </a>
          )}

          <Link
            href="/"
            className="mt-8 inline-block text-xs font-semibold text-gray-400 uppercase tracking-widest hover:text-black transition-colors duration-200"
          >
            ← Retour à la page d'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
