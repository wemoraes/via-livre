"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { InstructorStatus } from "@prisma/client";
import { updateInstructorStatus } from "@/actions/admin";

interface Props {
  instructorId: string;
  currentStatus: InstructorStatus;
}

export default function SuspendButton({ instructorId, currentStatus }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isSuspended = currentStatus === InstructorStatus.SUSPENDED;

  function handleToggle() {
    startTransition(async () => {
      await updateInstructorStatus(instructorId, isSuspended ? "ACTIVATE" : "SUSPEND");
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleToggle}
      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-60 ${
        isSuspended
          ? "bg-green-50 text-green-700 hover:bg-green-100"
          : "bg-red-50 text-red-700 hover:bg-red-100"
      }`}
    >
      {isPending ? "…" : isSuspended ? "Reativar" : "Suspender"}
    </button>
  );
}
