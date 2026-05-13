"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { confirmLessonCompletion } from "@/actions/lessons";

export default function ConfirmLessonButton({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      await confirmLessonCompletion(lessonId);
      router.refresh();
    });
  }

  return (
    <Button onClick={handleConfirm} disabled={isPending} className="flex-1">
      <CheckCircle2 size={15} className="mr-1.5" />
      {isPending ? "Confirmando…" : "Confirmar aula realizada"}
    </Button>
  );
}
