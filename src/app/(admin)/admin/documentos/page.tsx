"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { CheckCircle2, XCircle, Eye, Clock } from "lucide-react";
import { getPendingDocuments, reviewDocument } from "@/actions/admin";
import { getDocumentSignedReadUrl } from "@/actions/documents";

const DOC_LABEL: Record<string, string> = {
  CNH_EAR: "CNH com EAR",
  SENATRAN_CREDENTIAL: "Credenciamento SENATRAN",
  CRIMINAL_CERTIFICATE: "Certidão Negativa Criminal",
  TAX_CERTIFICATE: "Certidão de Débitos Públicos",
  CRLV: "CRLV",
};

type DocItem = {
  id: string;
  type: string;
  status: string;
  storageKey: string | null;
  instructorName: string;
  instructorId: string;
  submittedAt: string;
};

export default function AdminDocumentosPage() {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [reviewNote, setReviewNote] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const load = useCallback(() => {
    startTransition(async () => {
      const result = await getPendingDocuments();
      if (result.success) setDocs(result.data);
    });
  }, []);

  useEffect(() => { load(); }, [load]);

  function handleReview(docId: string, action: "APPROVED" | "REJECTED") {
    startTransition(async () => {
      await reviewDocument(docId, action, reviewNote[docId]);
      load();
    });
  }

  async function handleViewDoc(storageKey: string) {
    const res = await getDocumentSignedReadUrl(storageKey);
    if (res.success) window.open(res.data.url, "_blank");
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Revisão de documentos</h1>
        <p className="text-sm text-gray-500 mb-8">
          {docs.length} documento{docs.length !== 1 ? "s" : ""} aguardando revisão
        </p>

        {docs.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Clock size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">Nenhum documento pendente.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {docs.map((doc) => (
              <div key={doc.id} className="bg-white border border-gray-100 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{DOC_LABEL[doc.type] ?? doc.type}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{doc.instructorName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Enviado em {new Intl.DateTimeFormat("pt-BR").format(new Date(doc.submittedAt))}
                    </p>
                  </div>

                  {doc.storageKey && (
                    <button
                      type="button"
                      onClick={() => handleViewDoc(doc.storageKey!)}
                      className="flex items-center gap-1.5 text-sm text-[oklch(55%_0.17_145)] hover:underline shrink-0"
                    >
                      <Eye size={14} />
                      Ver documento
                    </button>
                  )}
                </div>

                <div className="mt-4">
                  <textarea
                    rows={2}
                    placeholder="Nota de revisão (obrigatória para rejeição)"
                    value={reviewNote[doc.id] ?? ""}
                    onChange={(e) => setReviewNote((prev) => ({ ...prev, [doc.id]: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[oklch(55%_0.17_145)]"
                  />
                </div>

                <div className="flex gap-3 mt-3">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleReview(doc.id, "APPROVED")}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60"
                  >
                    <CheckCircle2 size={14} />
                    Aprovar
                  </button>
                  <button
                    type="button"
                    disabled={isPending || !reviewNote[doc.id]?.trim()}
                    onClick={() => handleReview(doc.id, "REJECTED")}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-60"
                  >
                    <XCircle size={14} />
                    Rejeitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
