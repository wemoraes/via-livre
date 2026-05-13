import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Calendar } from "lucide-react";
import { LessonStatus } from "@prisma/client";
import InstructorConfirmButton from "./InstructorConfirmButton";

const STATUS_LABEL: Record<LessonStatus, string> = {
  PENDING: "Aguardando pagamento",
  CONFIRMED: "Confirmada",
  COMPLETED: "Concluída",
  CANCELLED: "Cancelada",
  DISPUTED: "Em disputa",
};

const STATUS_STYLE: Record<LessonStatus, { color: string; bg: string }> = {
  PENDING:   { color: "oklch(55% 0.12 85)",  bg: "oklch(96% 0.04 85)" },
  CONFIRMED: { color: "var(--vl-accent)",     bg: "oklch(92% 0.07 145)" },
  COMPLETED: { color: "oklch(45% 0.12 235)",  bg: "oklch(93% 0.04 235)" },
  CANCELLED: { color: "oklch(50% 0.15 25)",   bg: "oklch(95% 0.04 25)" },
  DISPUTED:  { color: "oklch(52% 0.14 50)",   bg: "oklch(95% 0.04 50)" },
};

export default async function InstructorAulasPage() {
  const session = await auth();
  if (!session?.user) redirect("/entrar");

  const profile = await prisma.instructorProfile.findUnique({ where: { userId: session.user.id } });
  if (!profile) redirect("/instructor/onboarding");

  const lessons = await prisma.lesson.findMany({
    where: { instructorId: profile.id },
    include: {
      student: { include: { user: { select: { name: true } } } },
    },
    orderBy: { scheduledAt: "desc" },
    take: 50,
  });

  const upcoming = lessons.filter(
    (l) => l.status === LessonStatus.CONFIRMED && l.scheduledAt > new Date(),
  );
  const past = lessons.filter(
    (l) => l.status !== LessonStatus.CONFIRMED || l.scheduledAt <= new Date(),
  );

  const fmt = new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" });

  return (
    <main
      className="min-h-screen py-10 px-4"
      style={{ fontFamily: "var(--font-plus-jakarta-sans), system-ui, sans-serif" }}
    >
      <div aria-hidden className="vl-mesh" />

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-8" style={{ color: "var(--vl-text-1)" }}>
          Minhas aulas
        </h1>

        {lessons.length === 0 ? (
          <div className="glass-card rounded-2xl py-16 text-center">
            <Calendar size={40} className="mx-auto mb-3" style={{ color: "var(--vl-text-3)", opacity: 0.5 }} />
            <p className="text-sm" style={{ color: "var(--vl-text-3)" }}>Nenhuma aula agendada ainda.</p>
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--vl-text-3)" }}>
                  Próximas aulas
                </h2>
                <ul className="space-y-3">
                  {upcoming.map((lesson) => (
                    <li key={lesson.id} className="glass-card rounded-2xl p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate" style={{ color: "var(--vl-text-1)" }}>
                            {lesson.student.user.name}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--vl-text-3)" }}>
                            {fmt.format(lesson.scheduledAt)}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--vl-text-3)" }}>{lesson.meetingPoint}</p>
                        </div>
                        {!lesson.instructorConfirmed ? (
                          <InstructorConfirmButton lessonId={lesson.id} />
                        ) : (
                          <span
                            className="text-xs px-2 py-1 rounded-full shrink-0 font-medium"
                            style={{ color: "var(--vl-accent)", background: "oklch(92% 0.07 145)" }}
                          >
                            Confirmada por você
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--vl-text-3)" }}>
                Histórico
              </h2>
              <ul className="space-y-3">
                {past.map((lesson) => (
                  <li key={lesson.id} className="glass-card rounded-2xl p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate" style={{ color: "var(--vl-text-1)" }}>
                          {lesson.student.user.name}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--vl-text-3)" }}>
                          {fmt.format(lesson.scheduledAt)}
                        </p>
                      </div>
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-medium shrink-0"
                        style={{
                          color: STATUS_STYLE[lesson.status].color,
                          background: STATUS_STYLE[lesson.status].bg,
                        }}
                      >
                        {STATUS_LABEL[lesson.status]}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}

        <Link
          href="/instructor/onboarding"
          className="block text-center text-xs mt-8 hover:underline"
          style={{ color: "var(--vl-text-3)" }}
        >
          Voltar ao onboarding
        </Link>
      </div>
    </main>
  );
}
