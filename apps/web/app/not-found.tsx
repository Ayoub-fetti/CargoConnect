import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-8xl font-bold text-blue-600">404</h1>
      <p className="mt-4 text-xl text-gray-700">Page not found</p>
      <p className="mt-2 text-gray-400">
        The page you're looking for doesn't exist.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
      >
        Back to Home
      </Link>
    </section>
  );
}
