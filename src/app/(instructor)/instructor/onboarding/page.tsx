"use client";

import { useEffect, useState, useTransition, useCallback } from "react";
import Link from "next/link";
import { CheckCircle2, User, Car, FileText, ChevronRight } from "lucide-react";
import ComplianceChecklist from "@/components/features/compliance/ComplianceChecklist";
import { getOnboardingStatus } from "@/actions/instructor";

interface OnboardingData {
  documents: { type: string; status: string; reviewNote: string | null }[];
  approvedCount: number;
  profileComplete: boolean;
  hasVehicle: boolean;
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
    href: null, // inline checklist
    icon: FileText,
  },
];

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
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-6 h-6 border-2 border-[oklch(55%_0.17_145)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stepDone: Record<string, boolean> = {
    profile: data.profileComplete,
    vehicle: data.hasVehicle,
    documents: data.approvedCount === data.documents.length,
  };

  const allDone = Object.values(stepDone).every(Boolean);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl font-semibold text-gray-900">Bem-vindo à ViaLivre</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Complete os passos abaixo para ativar seu perfil e começar a receber alunos.
          </p>
        </div>

        {allDone && (
          <div className="mb-8 flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <CheckCircle2 size={20} className="text-green-600 shrink-0" />
            <p className="text-sm text-green-800 font-medium">
              Tudo pronto! Seu perfil está em análise. Você receberá um e-mail quando for aprovado.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {/* Profile step */}
          <StepCard
            step={STEPS[0]}
            done={stepDone.profile}
          />

          {/* Vehicle step */}
          <StepCard
            step={STEPS[1]}
            done={stepDone.vehicle}
          />

          {/* Documents step — inline */}
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="flex items-start gap-4 p-5">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                stepDone.documents ? "bg-green-50" : "bg-gray-50"
              }`}>
                {stepDone.documents
                  ? <CheckCircle2 size={20} className="text-green-600" />
                  : <FileText size={20} className="text-gray-400" />
                }
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{STEPS[2].label}</p>
                <p className="text-gray-500 text-xs mt-0.5">{STEPS[2].description}</p>
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
      className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 hover:border-gray-200 transition-colors"
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
        done ? "bg-green-50" : "bg-gray-50"
      }`}>
        {done
          ? <CheckCircle2 size={20} className="text-green-600" />
          : <Icon size={20} className="text-gray-400" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm">{step.label}</p>
        <p className="text-gray-500 text-xs mt-0.5">{step.description}</p>
      </div>
      {!done && <ChevronRight size={16} className="text-gray-400 shrink-0" />}
    </Link>
  );
}
