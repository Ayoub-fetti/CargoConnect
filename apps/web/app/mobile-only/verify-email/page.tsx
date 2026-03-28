"use client";

import Link from "next/link";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";

export default function VerifyDriverEmailPage() {
  return (
    <Suspense fallback={<VerifyDriverEmailFallback />}>
      <VerifyDriverEmailContent />
    </Suspense>
  );
}

function VerifyDriverEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const nativeLink = useMemo(() => {
    if (!token) return "mobile://verify-email";
    return `mobile:///verify-email?token=${encodeURIComponent(token)}`;
  }, [token]);

  const expoGoLink = useMemo(() => {
    if (typeof window === "undefined") return "";
    const host = window.location.hostname;
    if (!host) return "";
    if (!token) return `exp://${host}:8081/--/verify-email`;
    return `exp://${host}:8081/--/verify-email?token=${encodeURIComponent(token)}`;
  }, [token]);

  const openApp = () => {
    // First try Expo Go link (common in development via QR), then fallback to app scheme.
    if (expoGoLink) {
      window.location.href = expoGoLink;
      setTimeout(() => {
        window.location.href = nativeLink;
      }, 800);
      return;
    }

    window.location.href = nativeLink;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 text-center">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 p-8 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight text-black">
          Open CargoConnect App
        </h1>
        <p className="mt-4 text-sm text-gray-500">
          Tap the button to verify your email inside the mobile app.
        </p>

        <button
          type="button"
          onClick={openApp}
          className="mt-8 inline-block rounded-lg bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
        >
          Open App And Verify
        </button>

        <p className="mt-4 text-xs text-gray-400">
          If nothing happens, make sure Expo Go is open and Metro is running,
          then tap again.
        </p>

        <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-3 text-left text-xs text-gray-600">
          <p className="font-semibold text-gray-700">Manual links</p>
          <p className="mt-2 break-all">
            Expo Go: {expoGoLink || "Unavailable"}
          </p>
          <p className="mt-1 break-all">App scheme: {nativeLink}</p>
        </div>

        <div className="mt-8 h-px w-full bg-gray-100" />
        <Link
          href="/login"
          className="mt-6 inline-block text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-black"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}

function VerifyDriverEmailFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 text-center">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 p-8 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight text-black">
          Open CargoConnect App
        </h1>
        <p className="mt-4 text-sm text-gray-500">Preparing verification link...</p>
      </div>
    </div>
  );
}
