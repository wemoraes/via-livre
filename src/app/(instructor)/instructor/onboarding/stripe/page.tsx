"use client";

import { useTransition } from "react";
import { CreditCard, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { startStripeOnboarding } from "@/actions/stripe";

export default function StripeOnboardingPage() {
  const [isPending, startTransition] = useTransition();

  function handleStart() {
    startTransition(async () => {
      const result = await startStripeOnboarding();
      if (result.success) {
        window.location.href = result.data.url;
      }
    });
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center p-6"
      style={{ fontFamily: "var(--font-plus-jakarta-sans), system-ui, sans-serif" }}
    >
      <div aria-hidden className="vl-mesh" />

      <div className="glass-card rounded-2xl p-8 max-w-md w-full text-center">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "oklch(92% 0.07 145)" }}
        >
          <CreditCard size={24} style={{ color: "var(--vl-accent)" }} />
        </div>

        <h1 className="text-xl font-semibold mb-2" style={{ color: "var(--vl-text-1)" }}>
          Configurar recebimentos
        </h1>
        <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--vl-text-3)" }}>
          Para receber o pagamento das aulas, você precisa configurar sua conta bancária via Stripe.
          É rápido, seguro e gratuito.
        </p>

        <div className="rounded-xl p-4 text-left mb-6 space-y-2" style={{ background: "rgba(13,18,16,0.04)" }}>
          <p className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: "var(--vl-text-3)" }}>
            O que você vai precisar
          </p>
          <p className="text-sm" style={{ color: "var(--vl-text-2)" }}>• CPF ou CNPJ</p>
          <p className="text-sm" style={{ color: "var(--vl-text-2)" }}>• Dados bancários para depósito</p>
          <p className="text-sm" style={{ color: "var(--vl-text-2)" }}>• Foto de documento de identidade</p>
        </div>

        <Button onClick={handleStart} disabled={isPending} className="w-full">
          <ExternalLink size={15} className="mr-2" />
          {isPending ? "Redirecionando…" : "Configurar conta no Stripe"}
        </Button>

        <p className="text-xs mt-4" style={{ color: "var(--vl-text-3)" }}>
          A ViaLivre retém 15% como taxa de plataforma. Você recebe os outros 85%.
        </p>
      </div>
    </main>
  );
}
