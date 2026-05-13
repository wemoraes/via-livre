"use client";

import { useState, useRef } from "react";
import { Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { DocumentType } from "@prisma/client";
import { getSignedDocumentUploadUrl, saveDocumentMetadata } from "@/actions/documents";

interface Props {
  documentType: DocumentType;
  onSuccess: () => void;
}

const MAX_SIZE = 10 * 1024 * 1024;

const MIME_TO_EXT: Record<string, "pdf" | "jpg" | "jpeg" | "png"> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "png",
};

const DOC_EXPIRY_LABEL: Partial<Record<DocumentType, string>> = {
  CNH_EAR: "Validade da CNH",
  SENATRAN_CREDENTIAL: "Validade do credenciamento",
  CRIMINAL_CERTIFICATE: "Data de emissão da certidão",
  TAX_CERTIFICATE: "Data de emissão da certidão",
  CRLV: "Validade do CRLV",
};

function todayString() {
  return new Date().toISOString().split("T")[0];
}

export default function DocumentUploadZone({ documentType, onSuccess }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const expiryLabel = DOC_EXPIRY_LABEL[documentType];
  const needsExpiry = Boolean(expiryLabel);

  async function upload(file: File, expiry: string) {
    setErrorMsg("");

    const ext = MIME_TO_EXT[file.type];
    if (!ext) {
      setErrorMsg("Formato inválido. Use PDF, JPG ou PNG.");
      setStatus("error");
      return;
    }
    if (file.size > MAX_SIZE) {
      setErrorMsg("Arquivo muito grande. Máximo 10 MB.");
      setStatus("error");
      return;
    }

    setStatus("uploading");

    const urlResult = await getSignedDocumentUploadUrl({ documentType, ext });
    if (!urlResult.success) {
      setErrorMsg(urlResult.error);
      setStatus("error");
      return;
    }

    const { signedUrl, path } = urlResult.data;

    const uploadRes = await fetch(signedUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!uploadRes.ok) {
      setErrorMsg("Falha no envio. Tente novamente.");
      setStatus("error");
      return;
    }

    const saveResult = await saveDocumentMetadata({
      documentType,
      storagePath: path,
      expiresAt: expiry || undefined,
    });
    if (!saveResult.success) {
      setErrorMsg(saveResult.error);
      setStatus("error");
      return;
    }

    setStatus("success");
    setTimeout(onSuccess, 800);
  }

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (needsExpiry && !expiresAt) {
      setPendingFile(file);
      return;
    }
    upload(file, expiresAt);
  }

  function handleConfirmUpload() {
    if (!pendingFile || !expiresAt) return;
    upload(pendingFile, expiresAt);
    setPendingFile(null);
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 text-sm rounded-lg px-4 py-3" style={{ color: "var(--vl-accent)", background: "oklch(92% 0.07 145)" }}>
        <CheckCircle2 size={16} />
        Documento enviado com sucesso!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Expiry date input */}
      {needsExpiry && (
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: "var(--vl-text-2)" }}>
            {expiryLabel} <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={expiresAt}
            min={documentType === "CRIMINAL_CERTIFICATE" || documentType === "TAX_CERTIFICATE" ? undefined : todayString()}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="vl-input text-sm"
          />
          <p className="text-xs mt-1" style={{ color: "var(--vl-text-3)" }}>
            {documentType === "CRIMINAL_CERTIFICATE" || documentType === "TAX_CERTIFICATE"
              ? "Informe a data de emissão (válida por 90 dias)."
              : "Informe a data de vencimento impressa no documento."}
          </p>
        </div>
      )}

      {/* Pending file confirmation */}
      {pendingFile && needsExpiry && !expiresAt && (
        <p className="text-xs text-yellow-700 bg-yellow-50 rounded-lg px-3 py-2">
          Informe a data acima antes de enviar o arquivo selecionado.
        </p>
      )}

      {pendingFile && needsExpiry && expiresAt && (
        <div className="flex items-center gap-3 bg-white/60 rounded-lg px-3 py-2 border border-white/80">
          <span className="text-xs flex-1 truncate" style={{ color: "var(--vl-text-2)" }}>{pendingFile.name}</span>
          <button
            type="button"
            onClick={handleConfirmUpload}
            className="text-xs font-medium px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: "var(--vl-accent)", color: "#fff" }}
          >
            Enviar
          </button>
        </div>
      )}

      {/* Drop zone */}
      {!pendingFile && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Área de upload de documento"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors"
          style={{
            borderColor: dragging ? "var(--vl-accent)" : "rgba(13,18,16,0.15)",
            background: dragging ? "oklch(92% 0.07 145)" : "transparent",
            pointerEvents: status === "uploading" ? "none" : "auto",
            opacity: status === "uploading" ? 0.6 : 1,
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,image/jpeg,image/png"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          {status === "uploading" ? (
            <div className="flex flex-col items-center gap-2" style={{ color: "var(--vl-text-3)" }}>
              <Loader2 size={24} className="animate-spin" />
              <span className="text-sm">Enviando…</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2" style={{ color: "var(--vl-text-3)" }}>
              <Upload size={24} />
              <span className="text-sm font-medium" style={{ color: "var(--vl-text-2)" }}>Arraste ou clique para selecionar</span>
              <span className="text-xs">PDF, JPG ou PNG — máx. 10 MB</span>
            </div>
          )}
        </div>
      )}

      {status === "error" && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle size={12} />
          {errorMsg}
        </p>
      )}
    </div>
  );
}
