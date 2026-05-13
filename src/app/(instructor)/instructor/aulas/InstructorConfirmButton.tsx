"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { confirmLessonCompletion } from "@/actions/lessons";

export default function InstructorConfirmButton({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(async () => {
        await confirmLessonCompletion(lessonId);
        router.refresh();
      })}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60 shrink-0"
    >
      <CheckCircle2 size={12} />
      {isPending ? "…" : "Confirmar conclusão"}
    </button>
  );
}
