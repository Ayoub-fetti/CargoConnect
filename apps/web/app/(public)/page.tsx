import Link from "next/link";

export default function Home() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 text-center">
      <h1 className="text-5xl font-bold text-gray-900">
        Connect Cargo, <span className="text-blue-600">Seamlessly</span>
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-lg text-gray-500">
        CargoConnect links companies with drivers for efficient freight management.
      </p>
      <div className="mt-10 flex justify-center gap-4">
        <Link
          href="/register"
          className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Get Started
        </Link>
        <Link
          href="/about"
          className="rounded-md border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50"
        >
          Learn More
        </Link>
      </div>
    </section>
  );
}
