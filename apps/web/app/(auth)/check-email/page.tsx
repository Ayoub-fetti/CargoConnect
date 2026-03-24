import Link from "next/link";

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm text-center">
      <div className="text-5xl">📧</div>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">
        Check your email
      </h1>
      <p className="mt-3 text-sm text-gray-500">
        We sent a verification link to{" "}
        <span className="font-medium text-gray-800">
          {email ?? "your email"}
        </span>
        . Click the link to activate your account.
      </p>
      <p className="mt-4 text-xs text-gray-400">
        Didn't receive it? Check your spam folder.
      </p>
      <Link
        href="/login"
        className="mt-6 block text-sm text-blue-600 hover:underline"
      >
        ← Back to login
      </Link>
    </div>
  );
}
