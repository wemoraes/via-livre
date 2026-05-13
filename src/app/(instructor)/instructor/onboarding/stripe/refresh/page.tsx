"use client";

import { useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { startStripeOnboarding } from "@/actions/stripe";

export default function StripeRefreshPage() {
  const [isPending, startTransition] = useTransition();

  function handleRetry() {
    startTransition(async () => {
      const result = await startStripeOnboarding();
      if (result.success) window.location.href = result.data.url;
    });
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center p-6"
      style={{ fontFamily: "var(--font-plus-jakarta-sans), system-ui, sans-serif" }}
    >
      <div aria-hidden className="vl-mesh" />

      <div className="glass-card rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-xl font-semibold mb-2" style={{ color: "var(--vl-text-1)" }}>
          Link expirado
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--vl-text-3)" }}>
          O link de configuração do Stripe expirou. Gere um novo para continuar.
        </p>
        <Button onClick={handleRetry} disabled={isPending} className="w-full">
          <RefreshCw size={15} className="mr-2" />
          {isPending ? "Gerando…" : "Gerar novo link"}
        </Button>
      </div>
    </main>
  );
}
