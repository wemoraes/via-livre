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
    <main
      className="min-h-screen py-10 px-4"
      style={{ fontFamily: "var(--font-plus-jakarta-sans), system-ui, sans-serif" }}
    >
      <div aria-hidden className="vl-mesh" />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-1" style={{ color: "var(--vl-text-1)" }}>
          Revisão de documentos
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--vl-text-3)" }}>
          {docs.length} documento{docs.length !== 1 ? "s" : ""} aguardando revisão
        </p>

        {docs.length === 0 ? (
          <div className="glass-card rounded-2xl py-16 text-center">
            <Clock size={40} className="mx-auto mb-3" style={{ color: "var(--vl-text-3)", opacity: 0.5 }} />
            <p className="text-sm" style={{ color: "var(--vl-text-3)" }}>Nenhum documento pendente.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {docs.map((doc) => (
              <div key={doc.id} className="glass-card rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-sm" style={{ color: "var(--vl-text-1)" }}>
                      {DOC_LABEL[doc.type] ?? doc.type}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--vl-text-2)" }}>{doc.instructorName}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--vl-text-3)" }}>
                      Enviado em {new Intl.DateTimeFormat("pt-BR").format(new Date(doc.submittedAt))}
                    </p>
                  </div>

                  {doc.storageKey && (
                    <button
                      type="button"
                      onClick={() => handleViewDoc(doc.storageKey!)}
                      className="flex items-center gap-1.5 text-sm hover:underline shrink-0"
                      style={{ color: "var(--vl-accent)" }}
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
                    className="vl-input resize-none"
                  />
                </div>

                <div className="flex gap-3 mt-3">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleReview(doc.id, "APPROVED")}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg text-white transition-opacity hover:opacity-80 disabled:opacity-60"
                    style={{ background: "oklch(52% 0.17 145)" }}
                  >
                    <CheckCircle2 size={14} />
                    Aprovar
                  </button>
                  <button
                    type="button"
                    disabled={isPending || !reviewNote[doc.id]?.trim()}
                    onClick={() => handleReview(doc.id, "REJECTED")}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:opacity-80 disabled:opacity-60"
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
