"use client";

import { useEffect, useState, useTransition, useCallback } from "react";
import Link from "next/link";
import { CheckCircle2, User, Car, FileText, CreditCard, CalendarDays, ChevronRight, Clock } from "lucide-react";
import ComplianceChecklist from "@/components/features/compliance/ComplianceChecklist";
import { getOnboardingStatus } from "@/actions/instructor";

interface OnboardingData {
  documents: { type: string; status: string; reviewNote: string | null }[];
  approvedCount: number;
  profileComplete: boolean;
  hasVehicle: boolean;
  stripeOnboardingDone: boolean;
  hasAvailability: boolean;
  submittedAt: Date | null;
}

const STEPS = [
  {
    id: "profile",
    label: "Complete seu perfil",
    description: "Adicione bio, cidade e preço por aula",
    href: "/instructor/perfil",
    icon: User,
  },
  {
    id: "vehicle",
    label: "Cadastre seu veículo",
    description: "Informações do carro de aula",
    href: "/instructor/veiculo",
    icon: Car,
  },
  {
    id: "documents",
    label: "Envie seus documentos",
    description: "CNH EAR, credenciamento SENATRAN e mais",
    href: null,
    icon: FileText,
  },
  {
    id: "stripe",
    label: "Configure seus recebimentos",
    description: "Conta bancária via Stripe — rápido e seguro",
    href: "/instructor/onboarding/stripe",
    icon: CreditCard,
  },
  {
    id: "agenda",
    label: "Configure sua disponibilidade",
    description: "Defina seus horários disponíveis",
    href: "/instructor/disponibilidade",
    icon: CalendarDays,
  },
];

function formatDate(date: Date | null | string): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const dow = result.getDay();
    if (dow !== 0 && dow !== 6) added++;
  }
  return result;
}

export default function OnboardingPage() {
  const [data, setData] = useState<OnboardingData | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const load = useCallback(() => {
    startTransition(async () => {
      const result = await getOnboardingStatus();
      if (result.success) setData(result.data);
      else setError(result.error);
    });
  }, []);

  useEffect(() => { load(); }, [load]);

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6" style={{ fontFamily: "var(--font-plus-jakarta-sans), system-ui, sans-serif" }}>
        <div aria-hidden className="vl-mesh" />
        <p className="text-red-600 text-sm">{error}</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div aria-hidden className="vl-mesh" />
        <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--vl-accent) transparent var(--vl-accent) var(--vl-accent)" }} />
      </main>
    );
  }

  const docsSubmitted = data.documents.some((d) => d.status !== "PENDING");
  const allDocsApproved = data.approvedCount === data.documents.length && data.documents.length > 0;

  const stepDone: Record<string, boolean> = {
    profile: data.profileComplete,
    vehicle: data.hasVehicle,
    documents: allDocsApproved,
    stripe: data.stripeOnboardingDone,
    agenda: data.hasAvailability,
  };

  const completedCount = Object.values(stepDone).filter(Boolean).length;
  const allDone = completedCount === STEPS.length;
  const progress = Math.round((completedCount / STEPS.length) * 100);

  const eta = data.submittedAt ? addBusinessDays(new Date(data.submittedAt), 2) : null;

  return (
    <main
      className="min-h-screen py-12 px-4"
      style={{ fontFamily: "var(--font-plus-jakarta-sans), system-ui, sans-serif" }}
    >
      <div aria-hidden className="vl-mesh" />

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <span className="text-xl font-black tracking-tight" style={{ color: "var(--vl-text-1)" }}>
            Via<span style={{ color: "var(--vl-accent)" }}>.</span>Livre
          </span>
          <h1 className="text-2xl font-semibold mt-4" style={{ color: "var(--vl-text-1)" }}>
            Ative seu perfil
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--vl-text-3)" }}>
            Complete os passos abaixo para começar a receber alunos.
          </p>

          {/* Progress bar */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium" style={{ color: "var(--vl-text-3)" }}>
                {completedCount} de {STEPS.length} etapas concluídas
              </span>
              <span className="text-xs font-semibold" style={{ color: "var(--vl-accent)" }}>{progress}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(13,18,16,0.08)" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: "var(--vl-accent)" }}
              />
            </div>
          </div>
        </div>

        {/* All done banner */}
        {allDone && (
          <div className="glass-card rounded-2xl px-5 py-4 mb-6 flex items-center gap-3">
            <CheckCircle2 size={20} style={{ color: "oklch(52% 0.17 145)" }} className="shrink-0" />
            <p className="text-sm font-medium" style={{ color: "var(--vl-text-1)" }}>
              Tudo pronto! Seu perfil está em análise. Você receberá um e-mail quando for aprovado.
            </p>
          </div>
        )}

        {/* SLA notice when docs submitted and not yet all approved */}
        {docsSubmitted && !allDocsApproved && data.submittedAt && (
          <div className="glass-card rounded-2xl px-5 py-4 mb-6 flex items-start gap-3">
            <Clock size={18} style={{ color: "var(--vl-accent)" }} className="shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--vl-text-1)" }}>
                Documentos em análise
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--vl-text-3)" }}>
                Enviados em {formatDate(data.submittedAt)}
                {eta && ` · Previsão de resposta: ${formatDate(eta)}`}
                {" · "}Análise em até 48h úteis.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {/* Steps 1–2: Profile & Vehicle */}
          <StepCard step={STEPS[0]} done={stepDone.profile} />
          <StepCard step={STEPS[1]} done={stepDone.vehicle} />

          {/* Step 3: Documents — inline checklist */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="flex items-start gap-4 p-5">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: stepDone.documents ? "oklch(92% 0.07 145)" : "rgba(13,18,16,0.05)" }}
              >
                {stepDone.documents
                  ? <CheckCircle2 size={20} style={{ color: "var(--vl-accent)" }} />
                  : <FileText size={20} style={{ color: "var(--vl-text-3)" }} />
                }
              </div>
              <div>
                <p className="font-medium text-sm" style={{ color: "var(--vl-text-1)" }}>{STEPS[2].label}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--vl-text-3)" }}>{STEPS[2].description}</p>
              </div>
            </div>
            <div className="px-5 pb-5">
              <ComplianceChecklist
                documents={data.documents}
                approvedCount={data.approvedCount}
                onUploadComplete={load}
              />
            </div>
          </div>

          {/* Step 4: Stripe */}
          <StepCard step={STEPS[3]} done={stepDone.stripe} />

          {/* Step 5: Agenda */}
          <StepCard step={STEPS[4]} done={stepDone.agenda} />
        </div>
      </div>
    </main>
  );
}

function StepCard({
  step,
  done,
}: {
  step: (typeof STEPS)[number];
  done: boolean;
}) {
  const Icon = step.icon;

  return (
    <Link
      href={step.href ?? "#"}
      className="glass-card rounded-2xl flex items-center gap-4 p-5 transition-all hover:shadow-lg"
      style={{ textDecoration: "none" }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        style={{ background: done ? "oklch(92% 0.07 145)" : "rgba(13,18,16,0.05)" }}
      >
        {done
          ? <CheckCircle2 size={20} style={{ color: "var(--vl-accent)" }} />
          : <Icon size={20} style={{ color: "var(--vl-text-3)" }} />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm" style={{ color: "var(--vl-text-1)" }}>{step.label}</p>
        <p className="text-xs mt-0.5" style={{ color: "var(--vl-text-3)" }}>{step.description}</p>
      </div>
      {!done && <ChevronRight size={16} style={{ color: "var(--vl-text-3)" }} className="shrink-0" />}
    </Link>
  );
}
