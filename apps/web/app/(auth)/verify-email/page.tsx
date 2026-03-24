"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "../../../services/auth.service";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }
    authService
      .verifyEmail({ token })
      .then(() => {
        setStatus("success");
        setTimeout(() => router.push("/login"), 3000);
      })
      .catch(() => setStatus("error"));
  }, [token, router]);

  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm text-center">
      {status === "loading" && (
        <>
          <div className="text-5xl">⏳</div>
          <p className="mt-4 text-gray-600">Verifying your email...</p>
        </>
      )}
      {status === "success" && (
        <>
          <div className="text-5xl">✅</div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Email verified!
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Redirecting you to login...
          </p>
        </>
      )}
      {status === "error" && (
        <>
          <div className="text-5xl">❌</div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Verification failed
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            The link is invalid or has expired.
          </p>
          <Link
            href="/login"
            className="mt-6 block text-sm text-blue-600 hover:underline"
          >
            ← Back to login
          </Link>
        </>
      )}
    </div>
  );
}
