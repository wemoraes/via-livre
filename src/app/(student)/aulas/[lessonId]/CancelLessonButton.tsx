"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";
import { cancelLesson } from "@/actions/lessons";

export default function CancelLessonButton({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleCancel() {
    startTransition(async () => {
      await cancelLesson(lessonId, reason || "Cancelado pelo aluno");
      router.refresh();
    });
  }

  if (!showConfirm) {
    return (
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 px-3 py-2"
      >
        <XCircle size={15} />
        Cancelar aula
      </button>
    );
  }

  return (
    <div className="flex-1 space-y-3">
      <textarea
        rows={2}
        placeholder="Motivo do cancelamento (opcional)"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isPending}
          className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-60"
        >
          {isPending ? "Cancelando…" : "Confirmar cancelamento"}
        </button>
        <button
          type="button"
          onClick={() => setShowConfirm(false)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
