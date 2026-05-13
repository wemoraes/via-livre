"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trophy, X } from "lucide-react";
import { submitExamResult } from "@/actions/lessons";

export default function ExamResultForm({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(result: "PASSED" | "FAILED") {
    startTransition(async () => {
      await submitExamResult(lessonId, result);
      setSubmitted(true);
      router.refresh();
    });
  }

  if (submitted) {
    return (
      <p className="text-sm text-blue-700 bg-blue-50 rounded-lg px-3 py-2">
        Resultado registrado!
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700">Você fez o exame de direção?</p>
      <div className="flex gap-3">
        <button
          type="button"
          disabled={isPending}
          onClick={() => handleSubmit("PASSED")}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60"
        >
          <Trophy size={14} />
          Aprovado!
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => handleSubmit("FAILED")}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-red-50 text-red-700 border border-red-100 rounded-lg hover:bg-red-100 disabled:opacity-60"
        >
          <X size={14} />
          Reprovado
        </button>
      </div>
    </div>
  );
}
