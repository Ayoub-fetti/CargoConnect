import Link from "next/link";

export default function MobileOnlyPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 text-center">
      <div className="rounded-2xl bg-white p-10 shadow-sm max-w-sm w-full">
        <div className="text-6xl">📱</div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Use the Mobile App</h1>
        <p className="mt-3 text-gray-500 text-sm">
          The driver portal is only available on the CargoConnect mobile app.
          Please download the app to continue.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <a
            href="#"
            className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
          >
            Download on App Store
          </a>
          <a
            href="#"
            className="rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Get it on Google Play
          </a>
        </div>
        <Link href="/login" className="mt-6 block text-sm text-blue-600 hover:underline">
          ← Back to login
        </Link>
      </div>
    </div>
  );
}
