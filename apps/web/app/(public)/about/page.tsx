import Image from "next/image";

export default function About() {
  return (
    <section className="bg-white">
      {/* HERO */}
      <div className="mx-auto max-w-4xl px-6 py-28 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">
          À propos
        </p>

        <h1 className="text-5xl sm:text-6xl font-black text-black leading-tight tracking-tight">
          La logistique,
          <br />
          réinventée.
        </h1>

        <p className="mt-8 text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
          CargoConnect simplifie la connexion entre entreprises et chauffeurs
          pour une gestion du fret plus rapide, plus fiable et totalement
          transparente.
        </p>
      </div>

      {/* IMAGE HERO */}
      <div className="relative w-full h-[400px]">
        <Image
          src="/truck-road.jpg"
          alt="Transport logistique"
          fill
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* MISSION */}
      <div className="mx-auto max-w-5xl px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl font-bold text-black">Notre mission</h2>
          <p className="mt-6 text-gray-500 leading-relaxed">
            Nous voulons éliminer la complexité du transport de marchandises.
            Fini les appels interminables, les incertitudes et le manque de
            visibilité. Avec CargoConnect, tout est centralisé, simple et
            efficace.
          </p>
        </div>

        <div className="relative h-[300px] rounded-2xl overflow-hidden">
          <Image
            src="/logistics-dashboard.jpg"
            alt="Dashboard logistique"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="bg-gray-50 py-24">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-3xl font-bold text-black">Comment ça marche ?</h2>

          <div className="mt-16 grid md:grid-cols-3 gap-10 text-left">
            {[
              {
                title: "1. Publiez votre besoin",
                desc: "Les entreprises publient leurs missions de transport en quelques clics.",
              },
              {
                title: "2. Match intelligent",
                desc: "Les chauffeurs disponibles reçoivent les opportunités adaptées.",
              },
              {
                title: "3. Suivi & livraison",
                desc: "Suivez la mission en temps réel jusqu'à la livraison finale.",
              },
            ].map((item) => (
              <div key={item.title}>
                <p className="font-bold text-black">{item.title}</p>
                <p className="mt-2 text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES GRID */}
      <div className="mx-auto max-w-5xl px-6 py-24">
        <h2 className="text-3xl font-bold text-black text-center">
          Pourquoi choisir CargoConnect ?
        </h2>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              title: "Suivi en temps réel",
              desc: "Vos missions visibles à chaque instant.",
            },
            {
              title: "Chauffeurs vérifiés",
              desc: "Un réseau fiable et certifié.",
            },
            {
              title: "Tableau de bord",
              desc: "Gestion centralisée et analytics.",
            },
            {
              title: "Documents sécurisés",
              desc: "Stockage protégé et accessible.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="border rounded-2xl p-6 hover:shadow-lg transition"
            >
              <p className="font-bold text-black">{item.title}</p>
              <p className="mt-2 text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-black text-white text-center py-20 px-6">
        <h2 className="text-3xl font-bold">
          Prêt à transformer votre logistique ?
        </h2>

        <p className="mt-4 text-white/70">
          Rejoignez CargoConnect dès aujourd'hui.
        </p>

        <div className="mt-8 flex justify-center gap-4 flex-col sm:flex-row">
          <a
            href="/register"
            className="bg-white text-black px-6 py-3 rounded-full font-semibold"
          >
            Commencer
          </a>

          <a
            href="/mobile-only"
            className="border border-white/40 px-6 py-3 rounded-full font-semibold"
          >
            Télécharger l'app
          </a>
        </div>
      </div>
    </section>
  );
}
