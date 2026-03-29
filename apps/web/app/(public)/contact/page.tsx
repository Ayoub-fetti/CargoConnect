export default function Contact() {
  return (
    <section className="mx-auto max-w-xl px-6 py-32 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">
        Contact
      </p>

      <h1 className="text-5xl font-black text-black leading-tight tracking-tight">
        Parlons-nous.
      </h1>

      <p className="mt-4 text-sm text-gray-400">
        Une question ? On vous répond rapidement.
      </p>

      <form className="mt-12 flex flex-col gap-4 text-left">
        <input
          type="text"
          placeholder="Votre nom"
          className="rounded-full border border-gray-200 px-6 py-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors duration-200"
        />
        <input
          type="email"
          placeholder="Votre email"
          className="rounded-full border border-gray-200 px-6 py-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors duration-200"
        />
        <textarea
          rows={5}
          placeholder="Votre message"
          className="rounded-2xl border border-gray-200 px-6 py-4 text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors duration-200 resize-none"
        />
        <button
          type="submit"
          className="rounded-full bg-black px-8 py-3 text-sm font-bold text-white hover:bg-gray-800 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Envoyer
        </button>
      </form>
    </section>
  );
}
