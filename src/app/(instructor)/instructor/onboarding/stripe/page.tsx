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
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-gray-100 rounded-2xl p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-[oklch(95%_0.05_145)] flex items-center justify-center mx-auto mb-6">
          <CreditCard size={24} className="text-[oklch(55%_0.17_145)]" />
        </div>

        <h1 className="text-xl font-semibold text-gray-900 mb-2">Configurar recebimentos</h1>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Para receber o pagamento das aulas, você precisa configurar sua conta bancária via Stripe.
          É rápido, seguro e gratuito.
        </p>

        <div className="bg-gray-50 rounded-xl p-4 text-left mb-6 space-y-2">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">O que você vai precisar</p>
          <p className="text-sm text-gray-600">• CPF ou CNPJ</p>
          <p className="text-sm text-gray-600">• Dados bancários para depósito</p>
          <p className="text-sm text-gray-600">• Foto de documento de identidade</p>
        </div>

        <Button onClick={handleStart} disabled={isPending} className="w-full">
          <ExternalLink size={15} className="mr-2" />
          {isPending ? "Redirecionando…" : "Configurar conta no Stripe"}
        </Button>

        <p className="text-xs text-gray-400 mt-4">
          A ViaLivre retém 15% como taxa de plataforma. Você recebe os outros 85%.
        </p>
      </div>
    </main>
  );
}
