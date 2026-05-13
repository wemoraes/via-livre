"use client";

import { useState, useRef } from "react";
import { Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { DocumentType } from "@prisma/client";
import { getSignedDocumentUploadUrl, saveDocumentMetadata } from "@/actions/documents";

interface Props {
  documentType: DocumentType;
  onSuccess: () => void;
}

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

const MIME_TO_EXT: Record<string, "pdf" | "jpg" | "jpeg" | "png"> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "png",
};

export default function DocumentUploadZone({ documentType, onSuccess }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function upload(file: File) {
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

    const saveResult = await saveDocumentMetadata({ documentType, storagePath: path });
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
    upload(files[0]);
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg px-4 py-3">
        <CheckCircle2 size={16} />
        Documento enviado com sucesso!
      </div>
    );
  }

  return (
    <div>
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
        className={`
          border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
          ${dragging ? "border-[oklch(55%_0.17_145)] bg-green-50" : "border-gray-200 hover:border-gray-300"}
          ${status === "uploading" ? "pointer-events-none opacity-60" : ""}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,image/jpeg,image/png"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {status === "uploading" ? (
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <Loader2 size={24} className="animate-spin" />
            <span className="text-sm">Enviando…</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <Upload size={24} />
            <span className="text-sm font-medium">Arraste ou clique para selecionar</span>
            <span className="text-xs text-gray-400">PDF, JPG ou PNG — máx. 10 MB</span>
          </div>
        )}
      </div>

      {status === "error" && (
        <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
          <AlertCircle size={12} />
          {errorMsg}
        </p>
      )}
    </div>
  );
}
