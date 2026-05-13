import Link from "next/link";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { DocumentType } from "@prisma/client";
import type { ExpiringDocumentItem } from "../_data/dashboard";

const DOC_LABEL: Record<DocumentType, string> = {
  CNH_EAR: "CNH com EAR",
  SENATRAN_CREDENTIAL: "Credenciamento SENATRAN",
  CRIMINAL_CERTIFICATE: "Certidão Negativa Criminal",
  TAX_CERTIFICATE: "Certidão de Débitos Públicos",
  CRLV: "CRLV",
};

const dateFmt = new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" });

interface Props {
  documents: ExpiringDocumentItem[];
}

export default function DocumentExpiryAlert({ documents }: Props) {
  if (documents.length === 0) return null;

  return (
    <section
      className="glass-card rounded-2xl p-5 mb-6"
      style={{ boxShadow: "0 0 0 2px oklch(55% 0.12 85 / 0.30)" }}
    >
      <header className="flex items-center gap-2 mb-3">
        <span
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg"
          style={{ background: "oklch(96% 0.04 85)", color: "oklch(55% 0.12 85)" }}
        >
          <AlertTriangle size={15} />
        </span>
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "var(--vl-text-1)" }}>
            Documento{documents.length !== 1 ? "s" : ""} próximo{documents.length !== 1 ? "s" : ""} do vencimento
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--vl-text-3)" }}>
            Renove para não ter o perfil suspenso automaticamente.
          </p>
        </div>
      </header>

      <ul className="space-y-2 mb-3">
        {documents.map((doc) => (
          <li key={doc.id} className="flex items-center justify-between gap-3 text-sm">
            <span style={{ color: "var(--vl-text-2)" }}>{DOC_LABEL[doc.type] ?? doc.type}</span>
            <span
              className="font-medium"
              style={{
                color:
                  doc.daysUntilExpiry <= 30
                    ? "oklch(50% 0.15 25)"
                    : doc.daysUntilExpiry <= 60
                    ? "oklch(55% 0.12 85)"
                    : "var(--vl-text-3)",
              }}
            >
              {doc.daysUntilExpiry === 0
                ? "Vence hoje"
                : `Vence em ${doc.daysUntilExpiry} dia${doc.daysUntilExpiry !== 1 ? "s" : ""} (${dateFmt.format(doc.expiresAt)})`}
            </span>
          </li>
        ))}
      </ul>

      <Link
        href="/instructor/onboarding"
        className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
        style={{ color: "var(--vl-accent)" }}
      >
        Renovar documento
        <ChevronRight size={14} />
      </Link>
    </section>
  );
}
