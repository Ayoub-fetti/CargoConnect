export default function Contact() {
  return (
    <section className="mx-auto max-w-xl px-6 py-24">
      <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
      <p className="mt-4 text-gray-500">Have questions? Reach out to us.</p>
      <form className="mt-8 flex flex-col gap-4">
        <input
          type="text"
          placeholder="Your name"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          placeholder="Your email"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          rows={5}
          placeholder="Your message"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-6 py-2 text-sm text-white hover:bg-blue-700"
        >
          Send Message
        </button>
      </form>
    </section>
  );
}
