import Link from "next/link";

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm text-center">
        <div className="text-5xl mb-8">📧</div>

        <h1 className="text-4xl font-black text-black leading-tight tracking-tight">
          Vérifiez
          <br />
          votre email.
        </h1>

        <p className="mt-6 text-sm text-gray-400 leading-relaxed">
          Un lien d'activation a été envoyé à{" "}
          <span className="font-bold text-black">{email ?? "votre email"}</span>
          . Cliquez sur le lien pour activer votre compte.
        </p>

        <p className="mt-4 text-xs text-gray-300">
          Vous ne le trouvez pas ? Vérifiez vos spams.
        </p>

        <div className="mt-12 h-px w-full bg-gray-100" />

        <Link
          href="/login"
          className="mt-8 inline-block text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-black transition-colors duration-200"
        >
          ← Retour à la connexion
        </Link>
      </div>
    </div>
  );
}
