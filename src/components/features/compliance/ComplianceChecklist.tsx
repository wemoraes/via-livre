"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Clock, AlertCircle, XCircle, Circle, HelpCircle } from "lucide-react";
import DocumentUploadZone from "./DocumentUploadZone";
import { DocumentType } from "@prisma/client";

interface DocumentItem {
  type: string;
  status: string;
  reviewNote: string | null;
}

interface Props {
  documents: DocumentItem[];
  approvedCount: number;
  onUploadComplete: () => void;
}

const DOC_META: Record<string, { label: string; description: string }> = {
  CNH_EAR: {
    label: "CNH com EAR",
    description: "Carteira Nacional de Habilitação com autorização para Exercício Remunerado (EAR). Emitida pelo DETRAN do seu estado.",
  },
  SENATRAN_CREDENTIAL: {
    label: "Credenciamento SENATRAN",
    description: "Certificado de credenciamento como instrutor autônomo emitido pelo SENATRAN/DENATRAN.",
  },
  CRIMINAL_CERTIFICATE: {
    label: "Certidão Negativa Criminal",
    description: "Certidão de antecedentes criminais emitida há no máximo 90 dias. Disponível gratuitamente no site do Tribunal de Justiça do seu estado.",
  },
  TAX_CERTIFICATE: {
    label: "Certidão de Débitos Públicos",
    description: "Certidão Negativa de Débitos junto à Receita Federal e Procuradoria da Fazenda Nacional.",
  },
  CRLV: {
    label: "CRLV com vistoria DETRAN",
    description: "Certificado de Registro e Licenciamento do Veículo, com vistoria DETRAN vigente.",
  },
};

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "APPROVED":    return <CheckCircle2 size={20} className="text-[oklch(55%_0.17_145)]" aria-label="Aprovado" />;
    case "SUBMITTED":   return <Clock size={20} className="text-yellow-500" aria-label="Enviado" />;
    case "UNDER_REVIEW":return <Clock size={20} className="text-blue-500" aria-label="Em revisão" />;
    case "REJECTED":    return <XCircle size={20} className="text-red-500" aria-label="Rejeitado" />;
    default:            return <Circle size={20} className="text-gray-300" aria-label="Pendente" />;
  }
}

const STATUS_LABEL: Record<string, string> = {
  APPROVED: "Aprovado",
  SUBMITTED: "Enviado",
  UNDER_REVIEW: "Em revisão",
  REJECTED: "Rejeitado",
  PENDING: "Pendente",
};

const STATUS_COLOR: Record<string, string> = {
  APPROVED: "text-green-700 bg-green-50",
  SUBMITTED: "text-yellow-700 bg-yellow-50",
  UNDER_REVIEW: "text-blue-700 bg-blue-50",
  REJECTED: "text-red-700 bg-red-50",
  PENDING: "text-gray-500 bg-gray-50",
};

export default function ComplianceChecklist({ documents, approvedCount, onUploadComplete }: Props) {
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState<string | null>(null);
  const total = documents.length;

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{approvedCount} de {total} documentos aprovados</span>
          <span className="font-medium">{Math.round((approvedCount / total) * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden" role="progressbar" aria-valuenow={approvedCount} aria-valuemin={0} aria-valuemax={total}>
          <div
            className="h-full bg-[oklch(55%_0.17_145)] rounded-full transition-all duration-500"
            style={{ width: `${(approvedCount / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Document list */}
      <ul className="space-y-3">
        {documents.map((doc) => {
          const meta = DOC_META[doc.type];
          const canUpload = doc.status === "PENDING" || doc.status === "REJECTED";

          return (
            <li key={doc.type} className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <StatusIcon status={doc.status} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-900 text-sm">{meta?.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[doc.status] ?? STATUS_COLOR.PENDING}`}>
                      {STATUS_LABEL[doc.status] ?? doc.status}
                    </span>
                    <button
                      type="button"
                      aria-label={`Ajuda sobre ${meta?.label}`}
                      onClick={() => setHelpOpen(helpOpen === doc.type ? null : doc.type)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <HelpCircle size={14} />
                    </button>
                  </div>

                  {helpOpen === doc.type && (
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">{meta?.description}</p>
                  )}

                  {doc.status === "REJECTED" && doc.reviewNote && (
                    <p className="text-xs text-red-600 mt-1">
                      <AlertCircle size={12} className="inline mr-1" />
                      {doc.reviewNote}
                    </p>
                  )}
                </div>

                {canUpload && (
                  <button
                    type="button"
                    onClick={() => setUploadingType(uploadingType === doc.type ? null : doc.type)}
                    className="text-sm font-medium text-[oklch(55%_0.17_145)] hover:underline shrink-0"
                  >
                    {uploadingType === doc.type ? "Cancelar" : "Enviar"}
                  </button>
                )}
              </div>

              {uploadingType === doc.type && (
                <div className="mt-4">
                  <DocumentUploadZone
                    documentType={doc.type as DocumentType}
                    onSuccess={() => {
                      setUploadingType(null);
                      onUploadComplete();
                    }}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
