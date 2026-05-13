import { InstructorStatus, LessonStatus } from "@prisma/client";

export interface StatusStyle {
  color: string;
  bg: string;
}

export const LESSON_STATUS_LABEL: Record<LessonStatus, string> = {
  PENDING: "Aguardando pagamento",
  CONFIRMED: "Confirmada",
  COMPLETED: "Concluída",
  CANCELLED: "Cancelada",
  DISPUTED: "Em disputa",
};

export const LESSON_STATUS_STYLE: Record<LessonStatus, StatusStyle> = {
  PENDING:   { color: "oklch(55% 0.12 85)",  bg: "oklch(96% 0.04 85)" },
  CONFIRMED: { color: "var(--vl-accent)",    bg: "oklch(92% 0.07 145)" },
  COMPLETED: { color: "oklch(45% 0.12 235)", bg: "oklch(93% 0.04 235)" },
  CANCELLED: { color: "oklch(50% 0.15 25)",  bg: "oklch(95% 0.04 25)" },
  DISPUTED:  { color: "oklch(52% 0.14 50)",  bg: "oklch(95% 0.04 50)" },
};

export const INSTRUCTOR_STATUS_LABEL: Record<InstructorStatus, string> = {
  PENDING: "Pendente",
  UNDER_REVIEW: "Em revisão",
  ACTIVE: "Ativo",
  SUSPENDED: "Suspenso",
  INACTIVE: "Inativo",
};

export const INSTRUCTOR_STATUS_STYLE: Record<InstructorStatus, StatusStyle> = {
  PENDING:      { color: "oklch(55% 0.12 85)",  bg: "oklch(96% 0.04 85)" },
  UNDER_REVIEW: { color: "oklch(45% 0.12 235)", bg: "oklch(93% 0.04 235)" },
  ACTIVE:       { color: "var(--vl-accent)",    bg: "oklch(92% 0.07 145)" },
  SUSPENDED:    { color: "oklch(50% 0.15 25)",  bg: "oklch(95% 0.04 25)" },
  INACTIVE:     { color: "oklch(45% 0.03 0)",   bg: "oklch(95% 0.01 0)" },
};
