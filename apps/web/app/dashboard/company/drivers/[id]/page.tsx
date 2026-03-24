"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../../../lib/axios";

export default function DriverProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [driver, setDriver] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    api.get(`/profiles/drivers/${id}`).then(({ data }) => setDriver(data));
    api
      .get(`/profiles/drivers/${id}/documents`)
      .then(({ data }) => setDocuments(data));
  }, [id]);

  if (!driver) return <p className="text-sm text-gray-400">Loading...</p>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4">
        {driver.avatar ? (
          <img
            src={`${process.env.NEXT_PUBLIC_UPLOADS_URL}/${driver.avatar}`}
            className="h-16 w-16 rounded-full object-cover"
            alt=""
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
            {driver.fullName?.[0]}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {driver.fullName}
          </h1>
          <p className="text-sm text-gray-500">
            {driver.email} · {driver.phone}
          </p>
          <span
            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${driver.isAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
          >
            {driver.isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-gray-100 bg-white p-5 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Zones</span>
          <span className="font-medium text-gray-900">
            {driver.zone?.join(", ") || "—"}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">License Types</span>
          <div className="flex gap-1">
            {driver.licenseTypes?.map((l: string) => (
              <span
                key={l}
                className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
        <div className="mt-3 flex flex-col gap-2">
          {documents.length === 0 && (
            <p className="text-sm text-gray-400">No documents uploaded.</p>
          )}
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{doc.type}</p>
                <p className="text-xs text-gray-400">{doc.originalName}</p>
              </div>
              <a
                href={`${process.env.NEXT_PUBLIC_UPLOADS_URL}/${doc.path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
              >
                View
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
