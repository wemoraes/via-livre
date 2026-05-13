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
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-gray-100 rounded-2xl p-8 text-center">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Link expirado</h1>
        <p className="text-sm text-gray-500 mb-6">
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
