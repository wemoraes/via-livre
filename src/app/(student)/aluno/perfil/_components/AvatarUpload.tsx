"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { getSignedStudentAvatarUploadUrl, persistStudentAvatar } from "@/actions/student";

interface Props {
  initialAvatarUrl: string | null;
  initialName: string;
}

const ACCEPTED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

function extFromMime(mime: string): "jpg" | "jpeg" | "png" | "webp" | null {
  if (mime === "image/jpeg" || mime === "image/jpg") return "jpeg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return null;
}

export default function AvatarUpload({ initialAvatarUrl, initialName }: Props) {
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const initial = (initialName || "A").charAt(0).toUpperCase();

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (!ACCEPTED.includes(file.type)) {
      setError("Formato não suportado. Use JPG, PNG ou WebP.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Arquivo maior que 5MB.");
      return;
    }
    const ext = extFromMime(file.type);
    if (!ext) {
      setError("Formato não suportado.");
      return;
    }

    setUploading(true);
    try {
      const urlResp = await getSignedStudentAvatarUploadUrl({ ext });
      if (!urlResp.success) {
        setError(urlResp.error);
        return;
      }
      const putResp = await fetch(urlResp.data.signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putResp.ok) {
        setError("Falha no upload");
        return;
      }
      const persistResp = await persistStudentAvatar(urlResp.data.path);
      if (!persistResp.success) {
        setError(persistResp.error);
        return;
      }
      setAvatarUrl(persistResp.data.avatarUrl);
    } catch {
      setError("Erro inesperado no upload");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="Avatar"
            width={80}
            height={80}
            className="rounded-full object-cover w-20 h-20"
            unoptimized
          />
        ) : (
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-semibold"
            style={{ background: "oklch(92% 0.07 145)", color: "var(--vl-accent)" }}
          >
            {initial}
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
            <Loader2 size={20} className="animate-spin text-white" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <label
          htmlFor="avatar-input"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border cursor-pointer transition-colors hover:bg-white/50"
          style={{ borderColor: "rgba(13,18,16,0.12)", color: "var(--vl-text-2)" }}
        >
          <Camera size={14} />
          {avatarUrl ? "Trocar foto" : "Adicionar foto"}
        </label>
        <input
          ref={inputRef}
          id="avatar-input"
          type="file"
          accept={ACCEPTED.join(",")}
          onChange={handleFile}
          disabled={uploading}
          className="sr-only"
        />
        <p className="text-xs mt-1.5" style={{ color: "var(--vl-text-3)" }}>
          JPG, PNG ou WebP até 5MB
        </p>
        {error && (
          <p className="text-xs mt-1.5" style={{ color: "oklch(50% 0.15 25)" }}>{error}</p>
        )}
      </div>
    </div>
  );
}
