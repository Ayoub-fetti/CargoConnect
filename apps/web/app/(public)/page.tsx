import Link from "next/link";

export default function Home() {
  return (
    <section className="relative flex min-h-[100vh] items-center justify-center overflow-hidden">

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/man-truck.webp')",
          filter: "brightness(0.25)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 px-6 text-center max-w-2xl w-full mx-auto">

        <h1 className="text-6xl sm:text-7xl font-black text-white leading-tight tracking-tight">
          Le fret,<br />sans friction.
        </h1>

        <p className="mt-6 text-white/80 text-lg">
          Vous êtes chauffeur ou entreprise ? Choisissez votre expérience.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">

          {/* Company */}
          <Link
            href="/register"
            className="w-full sm:w-auto rounded-full bg-white px-8 py-3  font-bold text-black hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Je suis une entreprise
          </Link>

          {/* Driver */}
          <Link
            href="/mobile-only"
            className="w-full sm:w-auto rounded-full border border-white/40 px-8 py-3  font-bold text-white hover:border-white transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Je suis chauffeur
          </Link>

        </div>

      </div>
    </section>
  );
}