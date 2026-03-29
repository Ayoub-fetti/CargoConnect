"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../../../lib/axios";

type DriverProfile = {
  fullName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  isAvailable?: boolean;
  zone?: string[];
  licenseTypes?: string[];
};

type DriverDocument = {
  _id: string;
  type?: string;
  originalName?: string;
  path?: string;
};

function extractDocumentsPayload(data: unknown): DriverDocument[] {
  if (Array.isArray(data)) return data as DriverDocument[];

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;

    if (Array.isArray(record.documents)) {
      return record.documents as DriverDocument[];
    }

    if (Array.isArray(record.data)) {
      return record.data as DriverDocument[];
    }

    const firstArray = Object.values(record).find((value) =>
      Array.isArray(value),
    );
    if (Array.isArray(firstArray)) {
      return firstArray as DriverDocument[];
    }
  }

  return [];
}

export default function DriverProfilePage() {
  const params = useParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [driver, setDriver] = useState<DriverProfile | null>(null);
  const [documents, setDocuments] = useState<DriverDocument[]>([]);
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  const [documentsDebug, setDocumentsDebug] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    api.get(`/profiles/drivers/${id}`).then(({ data }) => setDriver(data));
    api
      .get(`/profiles/drivers/${id}/documents`)
      .then((response) => {
        const normalized = extractDocumentsPayload(response.data);

        setDocuments(normalized);
        setDocumentsError(null);

        setDocumentsDebug(
          JSON.stringify(
            {
              ok: true,
              requestUrl: `/profiles/drivers/${id}/documents`,
              status: response.status,
              count: normalized.length,
              rawType: Array.isArray(response.data)
                ? "array"
                : response.data === null
                  ? "null"
                  : typeof response.data,
              rawData: response.data,
            },
            null,
            2,
          ),
        );
      })
      .catch((error) => {
        setDocuments([]);
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load documents";
        setDocumentsError(String(message));

        setDocumentsDebug(
          JSON.stringify(
            {
              ok: false,
              requestUrl: `/profiles/drivers/${id}/documents`,
              status: error?.response?.status,
              message,
              rawErrorData: error?.response?.data,
            },
            null,
            2,
          ),
        );
      });
  }, [id]);

  if (!driver) return <p className="text-sm text-gray-400">Loading...</p>;

  return (
    <div className="min-h-screen bg-white p-8 space-y-8 max-w-4xl">
      {/* Header */}
      <div className="border-b border-gray-100 pb-8 flex items-end justify-between">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          {driver.avatar ? (
            <img
              src={driver.avatar}
              className="h-16 w-16 rounded-full object-cover"
              alt=""
            />
          ) : (
            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gray-100 text-black text-xl font-bold">
              {driver.fullName?.[0]}
            </div>
          )}

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-1">
              Conducteur
            </p>
            <h1 className="text-4xl font-black text-black tracking-tight">
              {driver.fullName}
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              {driver.email} · {driver.phone}
            </p>
          </div>
        </div>

        {/* Availability */}
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
          {driver.isAvailable ? "Disponible" : "Indisponible"}
        </span>
      </div>

      {/* Info */}
      <div className="rounded-2xl border border-gray-100 p-8 space-y-6">
        <div className="grid grid-cols-2 gap-6 text-sm">
          {/* Zones */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-1">
              Zones
            </p>
            <p className="font-bold text-black">
              {driver.zone?.join(", ") || "—"}
            </p>
          </div>

          {/* Licenses */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-1">
              Licences
            </p>
            <div className="flex gap-2 flex-wrap">
              {driver.licenseTypes?.map((l: string) => (
                <span
                  key={l}
                  className="text-[10px] font-bold uppercase tracking-widest text-gray-400"
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-2">
            Documents
          </p>
        </div>

        {documents.length === 0 && (
          <div className="py-16 text-center border border-gray-100 rounded-2xl">
            <p className="text-sm text-gray-300 font-medium">
              Aucun document disponible.
            </p>
            {documentsError ? (
              <p className="text-xs text-red-500 mt-3">
                Erreur: {documentsError}
              </p>
            ) : null}
          </div>
        )}

        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="group flex items-center justify-between rounded-2xl border border-gray-100 p-5 hover:border-black transition-colors duration-200"
            >
              <div>
                <p className="font-bold text-black text-sm">{doc.type}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {doc.originalName}
                </p>
              </div>

              <a
                href={doc.path}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:border-black hover:text-black transition-all duration-200"
              >
                Voir →
              </a>
            </div>
          ))}
        </div>

        <details className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
          <summary className="cursor-pointer text-xs font-semibold uppercase tracking-widest text-yellow-700">
            Debug documents response
          </summary>
          <pre className="mt-3 overflow-x-auto text-xs text-yellow-900 whitespace-pre-wrap">
            {documentsDebug || "No debug data yet"}
          </pre>
        </details>
      </div>
    </div>
  );
}
