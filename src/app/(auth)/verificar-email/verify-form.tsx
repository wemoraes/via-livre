"use client";

import { useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { verifyEmail } from "@/actions/auth";

export default function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const [errorMessage, setErrorMessage] = useState("");
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Link inválido.");
      return;
    }
    startTransition(async () => {
      const result = await verifyEmail(token);
      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(result.error);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (status === "pending") {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4"
          style={{ borderColor: "var(--vl-accent) transparent var(--vl-accent) var(--vl-accent)" }}
        />
        <p className="text-sm" style={{ color: "var(--vl-text-3)" }}>Verificando seu email…</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <CheckCircle2 size={40} className="mx-auto mb-4" style={{ color: "var(--vl-accent)" }} />
        <h1 className="text-xl font-semibold mb-2" style={{ color: "var(--vl-text-1)" }}>
          Email confirmado!
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--vl-text-3)" }}>
          Sua conta está ativa. Faça login para continuar.
        </p>
        <Link
          href="/entrar"
          className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
          style={{ background: "var(--vl-accent)", color: "#fff" }}
        >
          Fazer login
        </Link>
      </div>
    );
  }

  const isExpired = errorMessage.toLowerCase().includes("expirado");

  return (
    <div className="glass-card rounded-2xl p-8 text-center">
      <XCircle size={40} className="mx-auto mb-4 text-red-500" />
      <h1 className="text-xl font-semibold mb-2" style={{ color: "var(--vl-text-1)" }}>
        {isExpired ? "Link expirado" : "Link inválido"}
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--vl-text-3)" }}>
        {errorMessage}
      </p>
      {isExpired && (
        <p className="text-sm" style={{ color: "var(--vl-text-3)" }}>
          Faça login e solicite um novo link de verificação.
        </p>
      )}
      <Link
        href="/entrar"
        className="inline-block mt-4 text-sm hover:underline"
        style={{ color: "var(--vl-accent)" }}
      >
        Ir para o login
      </Link>
    </div>
  );
}
